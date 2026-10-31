import { randomUUID } from "node:crypto";
import { maskPhone } from "../phone.js";

/**
 * SMS Connect Rwanda adapter.
 *
 * Public docs verified against the live host:
 *   base    https://smsconnect.tech/api/v1
 *   auth    Authorization: Bearer <key>  +  X-API-SECRET: <secret>
 *   send    POST /sms/send
 *   status  GET  /sms/{id}/status
 *
 * `/sms/bulk`, `/sms/schedule`, `/sms/cost` and `/user` are documented but
 * return 404, so this adapter only relies on the routes that exist.
 */

const DEFAULT_BASE_URL = "https://smsconnect.tech/api/v1";

export type ProviderSendResult = {
  providerMessageId: string;
  status: "sent" | "pending";
  cost: number;
  balance: number | null;
};

export type ProviderStatus = "pending" | "sending" | "sent" | "delivered" | "failed";

export class SmsGatewayError extends Error {
  status: number;
  retryable: boolean;

  constructor(message: string, status = 0, retryable = false) {
    super(message);
    this.name = "SmsGatewayError";
    this.status = status;
    this.retryable = retryable;
  }
}

function baseUrl(): string {
  return (process.env.SMS_CONNECT_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
}

export function smsConfigured(): boolean {
  return Boolean(process.env.SMS_CONNECT_API_KEY && process.env.SMS_CONNECT_API_SECRET);
}

/**
 * Dry-run is the default until credentials exist, so the whole reminder flow
 * can be built and demonstrated without spending wallet credit.
 */
export function smsDryRun(): boolean {
  return process.env.SMS_DRY_MODE === "true" || !smsConfigured();
}

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.SMS_CONNECT_API_KEY ?? ""}`,
    "X-API-SECRET": process.env.SMS_CONNECT_API_SECRET ?? "",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

type GatewayBody = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  data?: Record<string, unknown>;
};

function errorMessage(body: GatewayBody | null, fallback: string): string {
  if (body?.errors) {
    const first = Object.values(body.errors)[0];
    if (first?.[0]) return first[0];
  }
  return body?.message || fallback;
}

function retryableStatus(status: number): boolean {
  return status === 0 || status === 408 || status === 429 || status >= 500;
}

export async function sendSms(to: string, body: string): Promise<ProviderSendResult> {
  if (smsDryRun()) {
    console.info("[sms:dry-run] to=%s chars=%d", maskPhone(to), body.length);
    return {
      providerMessageId: `dry-${randomUUID()}`,
      status: "sent",
      cost: 0,
      balance: null,
    };
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl()}/sms/send`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        recipient: to,
        message: body,
        sender_id: process.env.SMS_CONNECT_SENDER_ID || undefined,
        // Customer numbers are not saved contacts in the gateway.
        recipient_type: "manual",
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (cause) {
    throw new SmsGatewayError(
      cause instanceof Error ? `SMS gateway unreachable: ${cause.message}` : "SMS gateway unreachable.",
      0,
      true,
    );
  }

  const payload = (await response.json().catch(() => null)) as GatewayBody | null;
  if (!response.ok || payload?.success === false) {
    throw new SmsGatewayError(
      errorMessage(payload, `SMS gateway error (${response.status}).`),
      response.status,
      retryableStatus(response.status),
    );
  }

  const data = payload?.data ?? {};
  return {
    providerMessageId: String(data.message_id ?? ""),
    status: data.status === "pending" ? "pending" : "sent",
    cost: Number(data.cost ?? 10),
    balance: typeof data.balance === "number" ? data.balance : null,
  };
}

export async function fetchSmsStatus(
  providerMessageId: string,
): Promise<ProviderStatus> {
  if (smsDryRun()) return "delivered";

  let response: Response;
  try {
    response = await fetch(
      `${baseUrl()}/sms/${encodeURIComponent(providerMessageId)}/status`,
      { headers: headers(), signal: AbortSignal.timeout(10_000) },
    );
  } catch (cause) {
    throw new SmsGatewayError(
      cause instanceof Error ? cause.message : "SMS status check failed.",
      0,
      true,
    );
  }

  const payload = (await response.json().catch(() => null)) as GatewayBody | null;
  if (!response.ok || payload?.success === false) {
    throw new SmsGatewayError(
      errorMessage(payload, `SMS status check failed (${response.status}).`),
      response.status,
      retryableStatus(response.status),
    );
  }

  const status = String(payload?.data?.status ?? "sent");
  if (status === "delivered" || status === "failed") return status;
  if (status === "pending" || status === "sending" || status === "sent") return status;
  return "sent";
}
