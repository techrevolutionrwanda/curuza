import mongoose from "mongoose";
import type { Request, Response } from "express";
import Shop, { type ShopCurrency, type ShopRecord } from "../models/shop.model.js";
import User from "../models/user.model.js";

const CURRENCIES: ShopCurrency[] = ["RWF", "USD", "EUR", "KES"];
const LOCALES = ["rw", "en"] as const;

async function currentRecords(req: Request, res: Response) {
  const userId = req.session?.userId;
  if (!userId || !mongoose.isValidObjectId(userId)) {
    res.status(401).json({ message: "You are not logged in." });
    return null;
  }

  const user = await User.findById(userId).select("shop locale");
  if (!user?.shop) {
    res.status(401).json({ message: "You must have a shop to access settings." });
    return null;
  }

  const shop = await Shop.findById(user.shop);
  if (!shop) {
    res.status(404).json({ message: "Shop settings were not found." });
    return null;
  }

  return { user, shop };
}

function serializeSettings(
  shop: Pick<ShopRecord, "currency" | "smsReminders" | "cloudBackup" | "lastBackupAt">,
  locale: string,
) {
  return {
    locale,
    shop: {
      currency: shop.currency,
      smsReminders: shop.smsReminders,
      cloudBackup: shop.cloudBackup,
      lastBackupAt: shop.lastBackupAt?.toISOString() ?? null,
    },
  };
}

export async function getSettings(req: Request, res: Response): Promise<void> {
  const records = await currentRecords(req, res);
  if (!records) return;
  res.json(serializeSettings(records.shop, records.user.locale));
}

export async function updateSettings(req: Request, res: Response): Promise<void> {
  const records = await currentRecords(req, res);
  if (!records) return;

  const shopUpdate: {
    currency?: ShopCurrency;
    smsReminders?: boolean;
    cloudBackup?: boolean;
  } = {};

  if ("currency" in req.body) {
    if (!CURRENCIES.includes(req.body.currency)) {
      res.status(400).json({ message: "Choose a supported currency." });
      return;
    }
    shopUpdate.currency = req.body.currency;
  }
  if ("smsReminders" in req.body) {
    if (typeof req.body.smsReminders !== "boolean") {
      res.status(400).json({ message: "SMS reminder setting must be true or false." });
      return;
    }
    shopUpdate.smsReminders = req.body.smsReminders;
  }
  if ("cloudBackup" in req.body) {
    if (typeof req.body.cloudBackup !== "boolean") {
      res.status(400).json({ message: "Cloud backup setting must be true or false." });
      return;
    }
    shopUpdate.cloudBackup = req.body.cloudBackup;
  }

  if ("locale" in req.body) {
    if (!LOCALES.includes(req.body.locale)) {
      res.status(400).json({ message: "Choose a supported language." });
      return;
    }
    records.user.locale = req.body.locale;
    await records.user.save();
  }

  if (Object.keys(shopUpdate).length > 0) {
    await Shop.findByIdAndUpdate(records.shop._id, shopUpdate, {
      new: true,
      runValidators: true,
    });
  }

  const shop = await Shop.findById(records.shop._id);
  if (!shop) {
    res.status(404).json({ message: "Shop settings were not found." });
    return;
  }
  res.json(serializeSettings(shop, records.user.locale));
}