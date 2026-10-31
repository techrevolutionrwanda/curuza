import type { ShopRecord } from "../../models/shop.model.js";
import type { SendWindow } from "./time.js";

/**
 * Older shops were created before the SMS settings existed, so every value
 * falls back to the shop-model default instead of assuming it is present.
 */
export function sendWindowFor(shop: Pick<ShopRecord, "smsSendHour" | "smsQuietStart" | "smsQuietEnd" | "smsSendOnSunday">): SendWindow {
  return {
    sendHour: shop.smsSendHour ?? 9,
    quietStart: shop.smsQuietStart ?? 7,
    quietEnd: shop.smsQuietEnd ?? 21,
    sendOnSunday: shop.smsSendOnSunday ?? false,
  };
}

export function cooldownHoursFor(shop: Pick<ShopRecord, "smsCooldownHours">): number {
  return shop.smsCooldownHours ?? 24;
}

export function maxPerDebtFor(shop: Pick<ShopRecord, "smsMaxPerDebt">): number {
  return shop.smsMaxPerDebt ?? 4;
}

export function dailyLimitFor(shop: Pick<ShopRecord, "smsDailyLimit">): number {
  return shop.smsDailyLimit ?? 200;
}
