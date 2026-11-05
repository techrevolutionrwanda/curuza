import type { Locale } from "@/i18n/dictionaries";
import { apiBaseUrl } from "@/lib/api-base";

export type ReminderBlockedReason =
  | "disabled"
  | "opted_out"
  | "cooldown"
  | "invalid_phone"
  | "nothing_owed"
  | "duplicate";

export type GatewayInfo = {
  dryRun: boolean;
  configured: boolean;
  senderId: string | null;
};

export type ReminderPreview = {
  customerId: string;
  customerName: string;
  phone: string;
  amount: number;
  locale: Locale;
  body: string;
  fullBody: string;
  totalLength: number;
  maxLength: number;
  segments: number;
  cost: number;
  overBudget: boolean;
  canSend: boolean;
  blockedReason: Exclude<ReminderBlockedReason, "duplicate"> | null;
  cooldownUntil: string | null;
  scheduledFor: string;
};

export class SmsApiError extends Error {
  reason?: ReminderBlockedReason;
  cooldownUntil?: string | null;

  constructor(message: string, reason?: ReminderBlockedReason, cooldownUntil?: string | null) {
    super(message);
    this.name = "SmsApiError";
    this.reason = reason;
    this.cooldownUntil = cooldownUntil;
  }
}

type ApiResponse = {
  message?: string;
  reason?: ReminderBlockedReason;
  cooldownUntil?: string | null;
};

async function request<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${apiBaseUrl()}/api/sms${path}`, {
    method: body === undefined ? "GET" : "POST",
    credentials: "include",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const result = (await response.json().catch(() => null)) as (T & ApiResponse) | null;
  if (!response.ok) {
    const fallback =
      response.status === 401
        ? "Your session has expired. Please log in again."
        : "Unable to send the SMS reminder.";
    throw new SmsApiError(
      result?.message || fallback,
      result?.reason,
      result?.cooldownUntil,
    );
  }
  if (!result) throw new SmsApiError("The server returned an invalid response.");
  return result;
}

export function previewReminder(input: {
  saleIds: string[];
  locale?: Locale;
}): Promise<{ preview: ReminderPreview; gateway: GatewayInfo }> {
  return request("/reminders/preview", input);
}

export function sendReminder(input: {
  saleIds: string[];
  locale?: Locale;
}): Promise<{
  message: { id: string; status: string; scheduledFor: string; to: string; amount: number };
  gateway: GatewayInfo;
}> {
  return request("/reminders", input);
}

export function sendAllReminders(): Promise<{
  queued: number;
  skipped: number;
  reasons: Record<string, number>;
  gateway: GatewayInfo;
}> {
  return request("/reminders/all", {});
}
