/**
 * Debt reminder copy.
 *
 * SMS Connect appends its branding to every message and keeps the whole thing
 * within 160 characters. We therefore budget the content against the suffix so
 * the gateway never truncates an amount, a date or the shop phone number.
 */

export const SMS_LOCALES = ["rw", "en"] as const;
export type SmsLocale = (typeof SMS_LOCALES)[number];

export type SmsTemplateKey =
  | "manual"
  | "due_soon"
  | "due_today"
  | "overdue"
  | "payment_received";

export const BRAND_SUFFIX = "\n\nPowered by SMSConnect: https://smsconnect.tech";
export const MAX_SMS_LENGTH = 160;
export const MAX_TOTAL_LENGTH = MAX_SMS_LENGTH;
export const MAX_CONTENT_LENGTH = MAX_TOTAL_LENGTH - BRAND_SUFFIX.length;

/** Read lazily: dotenv has not run yet when this module is first imported. */
export function smsUnitCost(): number {
  const value = Number(process.env.SMS_UNIT_COST_RWF ?? 10);
  return Number.isFinite(value) && value >= 0 ? value : 10;
}

type TemplateVars = {
  customer: string;
  shop: string;
  amount: string;
  currency: string;
  phone: string;
  app: string;
  date?: string;
  daysOverdue?: string;
};

const REMINDER_TEMPLATE_RW =
  "Muraho {customer}, ideni {amount} RWF {shop}. Hamagara {phone}. Murakoze! Powered by {app}.";
const REMINDER_TEMPLATE_EN =
  "Hello {customer}, you owe {amount} RWF at {shop}. Pay/call {phone}. Thanks! Powered by {app}.";

const TEMPLATES: Record<SmsLocale, Record<SmsTemplateKey, string>> = {
  rw: {
    manual: REMINDER_TEMPLATE_RW,
    due_soon: REMINDER_TEMPLATE_RW,
    due_today: REMINDER_TEMPLATE_RW,
    overdue: REMINDER_TEMPLATE_RW,
    payment_received: "Muraho {customer}, twakiriye {amount} {currency} kuri {shop}. Murakoze.",
  },
  en: {
    manual: REMINDER_TEMPLATE_EN,
    due_soon: REMINDER_TEMPLATE_EN,
    due_today: REMINDER_TEMPLATE_EN,
    overdue: REMINDER_TEMPLATE_EN,
    payment_received: "Hello {customer}, we received {amount} {currency} at {shop}. Thank you.",
  },
};

function clamp(value: string, max: number): string {
  const clean = value.trim().replace(/\s+/g, " ");
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

/** `2026-10-28` -> `28/10/2026`, short enough for a single SMS. */
export function formatSmsDate(dateKey: string): string {
  const [year, month, day] = dateKey.split("-");
  if (!year || !month || !day) return dateKey;
  return `${day}/${month}/${year}`;
}

export function interpolateSms(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}

export type RenderedSms = {
  body: string;
  /** Content + gateway branding, what the handset will receive. */
  totalLength: number;
  maxLength: number;
  segments: number;
  cost: number;
  overBudget: boolean;
};

export function renderSms(
  key: SmsTemplateKey,
  locale: SmsLocale,
  vars: {
    customer: string;
    shop: string;
    amount: number;
    currency: string;
    phone: string;
    app?: string;
    date?: string;
    daysOverdue?: number;
  },
): RenderedSms {
  const template = TEMPLATES[locale][key];
  const values: TemplateVars = {
    customer: clamp(vars.customer || (locale === "rw" ? "Mukiriya" : "Customer"), 14),
    shop: clamp(vars.shop, 16),
    amount: vars.amount.toLocaleString("en-US"),
    currency: vars.currency,
    phone: vars.phone,
    app: clamp(vars.app ?? process.env.APP_NAME ?? "Curuza", 12),
    date: vars.date ? formatSmsDate(vars.date) : "",
    daysOverdue: String(vars.daysOverdue ?? 0),
  };
  const body = interpolateSms(template, values);
  const totalLength = body.length + BRAND_SUFFIX.length;
  const segments = Math.max(1, Math.ceil(totalLength / MAX_SMS_LENGTH));

  return {
    body,
    totalLength,
    maxLength: MAX_TOTAL_LENGTH,
    segments,
    cost: segments * smsUnitCost(),
    overBudget: totalLength > MAX_TOTAL_LENGTH,
  };
}

/** The exact text stored and sent, including the gateway suffix. */
export function outgoingMessage(body: string): string {
  return `${body}${BRAND_SUFFIX}`;
}

export function normalizeSmsLocale(value: unknown, fallback: SmsLocale = "rw"): SmsLocale {
  return value === "en" || value === "rw" ? value : fallback;
}
