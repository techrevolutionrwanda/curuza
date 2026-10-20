import "server-only";

import { SEED_SETTINGS, type Settings } from "@/data/settings";

export type { Settings };

/**
 * In-memory store for the shop settings.
 *
 * Mirrors the stock repository: the server owns the data and the client
 * only ever receives a snapshot. It resets when the server restarts,
 * which is fine until the settings are backed by the API.
 */
const state: Settings = { ...SEED_SETTINGS };

export function getSettings(): Settings {
  return { ...state };
}

/**
 * Update the business profile of the shop.
 */
export function updateBusiness(input: {
  businessName: string;
  phone: string;
  currency: string;
}): Settings {
  state.businessName = input.businessName;
  state.phone = input.phone;
  state.currency = input.currency;
  return getSettings();
}
