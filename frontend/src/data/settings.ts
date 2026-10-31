import type { Locale } from "@/i18n/dictionaries";

/**
 * Everything the shop owner can configure from the settings page.
 * Kept out of the server-only repository so both the server components
 * and the client controls can share the same shape.
 */
export type Settings = {
  /** Account owner's name. */
  username: string;
  /** Account email address. */
  email: string;
  /** Izina ry'ubucuruzi · Business name. */
  businessName: string;
  /** Contact phone of the shop. */
  phone: string;
  /** Currency code used for every amount in the app. */
  currency: string;
  /** UI language of the dashboard. */
  locale: Locale;
  /** Send SMS reminders to debtors who have not paid. */
  smsReminders: boolean;
  /** Back the shop data up to the cloud. */
  cloudBackup: boolean;
  /** ISO timestamp of the last successful backup, null when never run. */
  lastBackupAt: string | null;
};

/** Currencies the shop can trade in. */
export const CURRENCIES = [
  { code: "RWF", label: "Franc rwanda" },
  { code: "USD", label: "US dollar" },
  { code: "EUR", label: "Euro" },
  { code: "KES", label: "Shillingi ya Kenya" },
] as const;
export const DEFAULT_CURRENCY = "RWF";

/**
 * State of an on/off setting.
 *
 * The action that flips the switch returns the new value, so the control
 * shows the result of the save without waiting for a re-render.
 */
export type ToggleState = {
  enabled: boolean;
};

/** Signature of a server action that flips an on/off setting. */
export type ToggleAction = (
  prev: ToggleState,
  formData: FormData,
) => Promise<ToggleState>;

export function isCurrency(code: string): boolean {
  return CURRENCIES.some((c) => c.code === code);
}
