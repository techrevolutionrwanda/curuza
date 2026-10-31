import mongoose, { type HydratedDocument } from "mongoose";
import type { Request, Response } from "express";
import Shop, { type ShopRecord } from "../models/shop.model.js";
import User from "../models/user.model.js";
import SmsMessage from "../models/sms-message.model.js";
import { listDebtors, resolveDebtor, SmsRequestError } from "../services/sms/debtors.js";
import { isDuplicateKeyError, cooldownUntil, queueReminder, reminderKey } from "../services/sms/queue.js";
import {
  cooldownHoursFor,
  sendWindowFor,
} from "../services/sms/settings.js";
import {
  normalizeSmsLocale,
  outgoingMessage,
  renderSms,
  type SmsLocale,
  type SmsTemplateKey,
} from "../services/sms/templates.js";
import { localPhone, normalizeRwandaPhone } from "../services/sms/phone.js";
import { kigaliDateKey, kigaliHour, nextAllowedMoment } from "../services/sms/time.js";
import { smsConfigured, smsDryRun } from "../services/sms/providers/smsconnect.js";

type ShopDocument = HydratedDocument<ShopRecord>;

async function shopForRequest(req: Request, res: Response): Promise<ShopDocument | null> {
  const userId = req.session?.userId;
  if (!userId || !mongoose.isValidObjectId(userId)) {
    res.status(401).json({ message: "You are not logged in." });
    return null;
  }
  const user = await User.findById(userId).select("shop");
  if (!user?.shop) {
    res.status(401).json({ message: "You must have a shop to send SMS." });
    return null;
  }
  const shop = await Shop.findById(user.shop);
  if (!shop) {
    res.status(404).json({ message: "Shop settings were not found." });
    return null;
  }
  return shop;
}

function iso(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

type BlockedReason = "disabled" | "opted_out" | "cooldown" | "invalid_phone" | "nothing_owed";

type Prepared = {
  shop: ShopDocument;
  customer: Awaited<ReturnType<typeof resolveDebtor>>["customer"];
  saleIds: mongoose.Types.ObjectId[];
  amount: number;
  locale: SmsLocale;
  body: string;
  totalLength: number;
  maxLength: number;
  segments: number;
  cost: number;
  overBudget: boolean;
  phone: string;
  blockedReason: BlockedReason | null;
  cooldownUntil: Date | null;
  scheduledFor: Date;
};

async function prepare(
  shop: ShopDocument,
  input: { saleIds?: unknown; customerId?: unknown; locale?: unknown },
): Promise<Prepared> {
  const locale = input.locale ? normalizeSmsLocale(input.locale) : undefined;
  let debtor: Awaited<ReturnType<typeof resolveDebtor>>;

  if (Array.isArray(input.saleIds) && input.saleIds.length > 0) {
    debtor = await resolveDebtor(
      shop._id.toString(),
      input.saleIds.filter((id): id is string => typeof id === "string"),
    );
  } else if (typeof input.customerId === "string" && mongoose.isValidObjectId(input.customerId)) {
    const all = await listDebtors(shop._id.toString());
    const found = all.find((item) => item.customer._id.toString() === input.customerId);
    if (!found) throw new SmsRequestError("Customer not found.", 404);
    debtor = found;
  } else {
    throw new SmsRequestError("Choose a debtor or a sale to remind.");
  }

  const chosenLocale = locale ?? (debtor.customer.locale as SmsLocale) ?? "rw";
  const phone = normalizeRwandaPhone(debtor.customer.phone);
  const owner = await User.findById(shop.owner).select("phone");
  const shopPhone = owner?.phone
    ? localPhone(normalizeRwandaPhone(owner.phone) ?? owner.phone)
    : "";

  const rendered = renderSms("manual", chosenLocale, {
    customer: debtor.customer.name || debtor.customer.phone,
    shop: shop.name,
    amount: debtor.amount,
    currency: shop.currency ?? "RWF",
    phone: shopPhone,
  });

  const cooldown = cooldownUntil(debtor.customer, cooldownHoursFor(shop));
  let blockedReason: BlockedReason | null = null;
  if (!shop.smsReminders) blockedReason = "disabled";
  else if (debtor.customer.smsOptOut) blockedReason = "opted_out";
  else if (!phone) blockedReason = "invalid_phone";
  else if (debtor.amount <= 0) blockedReason = "nothing_owed";
  else if (cooldown) blockedReason = "cooldown";

  return {
    shop,
    customer: debtor.customer,
    saleIds: debtor.sales.map((sale) => sale._id),
    amount: debtor.amount,
    locale: chosenLocale,
    body: rendered.body,
    totalLength: rendered.totalLength,
    maxLength: rendered.maxLength,
    segments: rendered.segments,
    cost: rendered.cost,
    overBudget: rendered.overBudget,
    phone: phone ?? debtor.customer.phone,
    blockedReason,
    cooldownUntil: cooldown,
    scheduledFor: nextAllowedMoment(new Date(), sendWindowFor(shop)),
  };
}

function serializePrepared(prepared: Prepared) {
  return {
    customerId: prepared.customer._id.toString(),
    customerName: prepared.customer.name || localPhone(prepared.phone),
    phone: localPhone(prepared.phone),
    amount: prepared.amount,
    locale: prepared.locale,
    body: prepared.body,
    fullBody: outgoingMessage(prepared.body),
    totalLength: prepared.totalLength,
    maxLength: prepared.maxLength,
    segments: prepared.segments,
    cost: prepared.cost,
    overBudget: prepared.overBudget,
    canSend: prepared.blockedReason === null,
    blockedReason: prepared.blockedReason,
    cooldownUntil: iso(prepared.cooldownUntil),
    scheduledFor: prepared.scheduledFor.toISOString(),
  };
}

function gatewayInfo() {
  return {
    dryRun: smsDryRun(),
    configured: smsConfigured(),
    senderId: process.env.SMS_CONNECT_SENDER_ID ?? null,
  };
}

export async function previewReminder(req: Request, res: Response): Promise<void> {
  const shop = await shopForRequest(req, res);
  if (!shop) return;

  try {
    const prepared = await prepare(shop, req.body ?? {});
    res.json({ preview: serializePrepared(prepared), gateway: gatewayInfo() });
  } catch (cause) {
    if (cause instanceof SmsRequestError) {
      res.status(cause.status).json({ message: cause.message });
      return;
    }
    console.error("[sms:preview]", cause);
    res.status(500).json({ message: "Unable to prepare the reminder." });
  }
}

export async function sendReminder(req: Request, res: Response): Promise<void> {
  const shop = await shopForRequest(req, res);
  if (!shop) return;

  try {
    const prepared = await prepare(shop, req.body ?? {});
    if (prepared.blockedReason) {
      const messages: Record<BlockedReason, string> = {
        disabled: "Turn on SMS reminders in settings first.",
        opted_out: "This customer asked not to receive SMS.",
        cooldown: "A reminder was already sent recently. Try again later.",
        invalid_phone: "The customer's phone is not a valid Rwandan mobile number.",
        nothing_owed: "This customer has no outstanding balance.",
      };
      res.status(409).json({
        message: messages[prepared.blockedReason],
        reason: prepared.blockedReason,
        cooldownUntil: iso(prepared.cooldownUntil),
      });
      return;
    }

    const bucket = `${kigaliDateKey()}-${kigaliHour()}`;
    const key = reminderKey(
      shop._id.toString(),
      prepared.customer._id.toString(),
      "manual",
      bucket,
      prepared.locale,
    );

    const message = await queueReminder({
      shop: shop._id.toString(),
      customer: prepared.customer,
      saleIds: prepared.saleIds,
      templateKey: "manual",
      locale: prepared.locale,
      scheduledFor: prepared.scheduledFor,
      idempotencyKey: key,
      createdBy: req.session?.userId ?? null,
    });

    res.status(202).json({
      message: {
        id: message._id.toString(),
        status: message.status,
        scheduledFor: message.scheduledFor.toISOString(),
        to: localPhone(message.to),
        amount: prepared.amount,
      },
      gateway: gatewayInfo(),
    });
  } catch (cause) {
    if (isDuplicateKeyError(cause)) {
      res.status(409).json({
        message: "A reminder for this customer is already queued.",
        reason: "duplicate",
      });
      return;
    }
    if (cause instanceof SmsRequestError) {
      res.status(cause.status).json({ message: cause.message });
      return;
    }
    console.error("[sms:send]", cause);
    res.status(500).json({ message: "Unable to queue the reminder." });
  }
}

export async function sendAllReminders(req: Request, res: Response): Promise<void> {
  const shop = await shopForRequest(req, res);
  if (!shop) return;

  if (!shop.smsReminders) {
    res.status(409).json({ message: "Turn on SMS reminders in settings first." });
    return;
  }

  const debtors = await listDebtors(shop._id.toString());
  const window = sendWindowFor(shop);
  const bucket = `${kigaliDateKey()}-${kigaliHour()}`;
  const reasons: Record<string, number> = {};
  let queued = 0;

  for (const debtor of debtors) {
    const skip = (reason: string) => {
      reasons[reason] = (reasons[reason] ?? 0) + 1;
    };

    if (debtor.customer.smsOptOut) {
      skip("opted_out");
      continue;
    }
    if (!normalizeRwandaPhone(debtor.customer.phone)) {
      skip("invalid_phone");
      continue;
    }
    if (debtor.amount <= 0) {
      skip("nothing_owed");
      continue;
    }
    if (cooldownUntil(debtor.customer, cooldownHoursFor(shop))) {
      skip("cooldown");
      continue;
    }
    if (queued >= 200) {
      skip("batch_limit");
      continue;
    }

    const key = reminderKey(
      shop._id.toString(),
      debtor.customer._id.toString(),
      "manual",
      bucket,
      debtor.customer.locale ?? "rw",
    );
    try {
      await queueReminder({
        shop: shop._id.toString(),
        customer: debtor.customer,
        saleIds: debtor.sales.map((sale) => sale._id),
        templateKey: "manual",
        locale: (debtor.customer.locale as SmsLocale) ?? "rw",
        scheduledFor: nextAllowedMoment(new Date(), window),
        idempotencyKey: key,
        createdBy: req.session?.userId ?? null,
      });
      queued += 1;
    } catch (cause) {
      if (isDuplicateKeyError(cause)) {
        skip("duplicate");
        continue;
      }
      console.error("[sms:send-all]", cause);
      skip("error");
    }
  }

  res.status(202).json({ queued, skipped: Object.values(reasons).reduce((a, b) => a + b, 0), reasons, gateway: gatewayInfo() });
}

export async function listMessages(req: Request, res: Response): Promise<void> {
  const shop = await shopForRequest(req, res);
  if (!shop) return;

  const filter: Record<string, unknown> = { shop: shop._id };
  const customerId = typeof req.query.customerId === "string" ? req.query.customerId : "";
  const saleId = typeof req.query.saleId === "string" ? req.query.saleId : "";

  if (customerId) {
    if (!mongoose.isValidObjectId(customerId)) {
      res.status(400).json({ message: "Invalid customer id." });
      return;
    }
    filter.customer = customerId;
  }
  if (saleId) {
    if (!mongoose.isValidObjectId(saleId)) {
      res.status(400).json({ message: "Invalid sale id." });
      return;
    }
    filter.saleIds = saleId;
  }

  const messages = await SmsMessage.find(filter).sort({ createdAt: -1 }).limit(50).lean();
  res.json({
    messages: messages.map((message) => ({
      id: message._id.toString(),
      to: localPhone(message.to),
      body: message.body,
      status: message.status,
      templateKey: message.templateKey as SmsTemplateKey,
      createdAt: message.createdAt.toISOString(),
      sentAt: iso(message.sentAt),
      deliveredAt: iso(message.deliveredAt),
      lastError: message.lastError ?? null,
      cost: message.cost ?? null,
    })),
  });
}
