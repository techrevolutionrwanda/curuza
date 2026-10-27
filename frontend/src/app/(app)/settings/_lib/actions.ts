"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { isCurrency, type ToggleState } from "@/data/settings";
import type { Locale } from "@/i18n/dictionaries";
import { updateAccountProfile } from "./account";
import * as repo from "./repository";

export type FormErrors = Record<string, string>;

export type SettingsActionResult =
  | { ok: true }
  | { ok: false; errors: FormErrors; message?: string };

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Digits, spaces and the usual phone punctuation. */
const PHONE_RE = /^\+?[0-9][0-9\s()-]{5,19}$/;

/**
 * Save the business profile: shop name, contact phone and currency.
 */
export async function updateBusinessAction(
  _prev: SettingsActionResult,
  formData: FormData,
): Promise<SettingsActionResult> {
  const username = str(formData.get("username"));
  const email = str(formData.get("email"));
  const businessName = str(formData.get("businessName"));
  const phone = str(formData.get("phone"));
  const currency = str(formData.get("currency"));

  const errors: FormErrors = {};
  if (username.length < 2) errors.username = "required";
  if (
    email &&
    (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  ) {
    errors.email = "invalid";
  }
  if (businessName.length < 2) errors.businessName = "required";
  if (phone && !PHONE_RE.test(phone)) errors.phone = "invalid";
  if (!isCurrency(currency)) errors.currency = "invalid";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  try {
    const profile = await updateAccountProfile({
      username,
      email,
      businessName,
      phone,
    });
    repo.updateBusiness({ ...profile, currency });
  } catch (cause) {
    return {
      ok: false,
      errors: {},
      message:
        cause instanceof Error
          ? cause.message
          : "Unable to save your account profile.",
    };
  }

  refresh();
  return { ok: true };
}

/**
 * Save the dashboard language.
 *
 * The cookie lets the browser remember the choice on the next visit.
 */
export async function setLocaleAction(locale: Locale): Promise<SettingsActionResult> {
  repo.setLocale(locale);

  const store = await cookies();
  store.set("locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  refresh();
  return { ok: true };
}

/**
 * Turn the SMS reminders for debtors on or off.
 */
export async function setSmsRemindersAction(
  _prev: ToggleState,
  formData: FormData,
): Promise<ToggleState> {
  const enabled = formData.get("enabled") === "true";
  repo.setSmsReminders(enabled);
  refresh();
  return { enabled };
}

/**
 * Turn the cloud backup on or off.
 */
export async function setCloudBackupAction(
  _prev: ToggleState,
  formData: FormData,
): Promise<ToggleState> {
  const enabled = formData.get("enabled") === "true";
  repo.setCloudBackup(enabled);
  refresh();
  return { enabled };
}
