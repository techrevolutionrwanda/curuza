import "server-only";

import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session";
import type { Locale } from "@/i18n/dictionaries";
import type { Settings } from "@/data/settings";

type ShopSettings = Pick<Settings, "currency" | "locale" | "smsReminders" | "cloudBackup" | "lastBackupAt">;
type ShopSettingsUpdate = Partial<Pick<ShopSettings, "currency" | "locale" | "smsReminders" | "cloudBackup">>;

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

async function requestSettings(update?: ShopSettingsUpdate): Promise<ShopSettings> {
  const sessionCookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionCookie) throw new Error("Your session has expired. Please log in again.");

  const response = await fetch(`${API_BASE_URL}/api/settings`, {
    method: update ? "PATCH" : "GET",
    cache: "no-store",
    headers: {
      Cookie: `${SESSION_COOKIE}=${sessionCookie}`,
      ...(update ? { "Content-Type": "application/json" } : {}),
    },
    ...(update ? { body: JSON.stringify(update) } : {}),
  });
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof result === "object" && result !== null && "message" in result && typeof result.message === "string"
        ? result.message
        : "Unable to load or save shop settings.";
    throw new Error(message);
  }

  if (typeof result !== "object" || result === null || !("shop" in result)) {
    throw new Error("The server returned invalid shop settings.");
  }
  const shop = result.shop;
  if (
    typeof shop !== "object" || shop === null ||
    !("currency" in shop) || typeof shop.currency !== "string" ||
    !("smsReminders" in shop) || typeof shop.smsReminders !== "boolean" ||
    !("cloudBackup" in shop) || typeof shop.cloudBackup !== "boolean" ||
    !("lastBackupAt" in shop) || (typeof shop.lastBackupAt !== "string" && shop.lastBackupAt !== null) ||
    !("locale" in result) || (result.locale !== "rw" && result.locale !== "en")
  ) {
    throw new Error("The server returned invalid shop settings.");
  }

  return {
    currency: shop.currency,
    locale: result.locale as Locale,
    smsReminders: shop.smsReminders,
    cloudBackup: shop.cloudBackup,
    lastBackupAt: shop.lastBackupAt,
  };
}

export function getShopSettings(): Promise<ShopSettings> {
  return requestSettings();
}

export function updateShopSettings(update: ShopSettingsUpdate): Promise<ShopSettings> {
  return requestSettings(update);
}