"use server";

import { cookies } from "next/headers";
import { refresh } from "next/cache";
import { isCurrency } from "@/data/settings";
import type { Locale } from "@/i18n/dictionaries";
import * as repo from "./repository";

export type FormErrors = Record<string, string>;

export type SettingsActionResult =
  | { ok: true }
  | { ok: false; errors: FormErrors };

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
  const businessName = str(formData.get("businessName"));
  const phone = str(formData.get("phone"));
  const currency = str(formData.get("currency"));

  const errors: FormErrors = {};
  if (businessName.length < 2) errors.businessName = "required";
  if (phone && !PHONE_RE.test(phone)) errors.phone = "invalid";
  if (!isCurrency(currency)) errors.currency = "invalid";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  try {
    repo.updateBusiness({ businessName, phone, currency });
  } catch {
    return { ok: false, errors: { businessName: "invalid" } };
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
