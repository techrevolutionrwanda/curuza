"use client";

import { useActionState, useEffect, useState } from "react";
import {
  updateBusinessAction,
  type SettingsActionResult,
} from "@/app/settings/_lib/actions";
import { CURRENCIES, type Settings } from "@/data/settings";
import { useI18n } from "@/i18n/locale-provider";
import { SettingRow } from "./setting-row";

const inputCls =
  "min-h-[40px] w-full rounded-panel border border-line bg-surface px-3.5 text-sm outline-none transition focus:border-primary";

const btn =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-panel px-5 font-bold transition";

/**
 * The business profile: shop name, phone and currency.
 *
 * Saves through the `updateBusinessAction` server action so the settings
 * live on the server and survive a reload.
 */
export function BusinessForm({
  settings,
  onSaved,
}: {
  settings: Settings;
  onSaved: () => void;
}) {
  const { t } = useI18n();
  const [state, formAction, pending] = useActionState<SettingsActionResult, FormData>(
    updateBusinessAction,
    { ok: false, errors: {} },
  );

  const [businessName, setBusinessName] = useState(settings.businessName);
  const [phone, setPhone] = useState(settings.phone);
  const [currency, setCurrency] = useState(settings.currency);

  useEffect(() => {
    if (state.ok) onSaved();
  }, [state, onSaved]);

  const error = (field: string): string | null => {
    if (state.ok) return null;
    const code = state.errors[field];
    if (!code) return null;
    return t.form.errors[code as keyof typeof t.form.errors] ?? code;
  };

  const dirty =
    businessName !== settings.businessName ||
    phone !== settings.phone ||
    currency !== settings.currency;

  return (
    <form action={formAction} noValidate className="divide-y divide-line">
      <SettingRow label={t.settings.form.name}>
        <input
          name="businessName"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder={t.settings.form.namePlaceholder}
          aria-invalid={!!error("businessName")}
          className={`${inputCls} w-[240px]`}
        />
        {error("businessName") && (
          <span className="text-xs text-danger">{error("businessName")}</span>
        )}
      </SettingRow>

      <SettingRow label={t.settings.form.phone}>
        <input
          name="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={t.settings.form.phonePlaceholder}
          aria-invalid={!!error("phone")}
          className={`${inputCls} num w-[240px]`}
        />
        {error("phone") && (
          <span className="text-xs text-danger">{error("phone")}</span>
        )}
      </SettingRow>

      <SettingRow label={t.settings.form.currency}>
        <select
          name="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          aria-invalid={!!error("currency")}
          className={`${inputCls} w-[240px]`}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} · {c.label}
            </option>
          ))}
        </select>
        {error("currency") && (
          <span className="text-xs text-danger">{error("currency")}</span>
        )}
      </SettingRow>

      <div className="flex justify-end pt-[14px]">
        <button
          type="submit"
          disabled={pending || !dirty}
          className={`${btn} bg-primary text-white hover:bg-primary-dark disabled:opacity-50`}
        >
          {pending ? t.settings.form.saving : t.settings.form.save}
        </button>
      </div>
    </form>
  );
}
