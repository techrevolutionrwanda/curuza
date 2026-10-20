"use client";

import { useTransition } from "react";
import { setLocaleAction } from "@/app/settings/_lib/actions";
import { LOCALES, LOCALE_LABEL } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/locale-provider";

/**
 * Switches the dashboard between Kinyarwanda and English.
 *
 * The switch is instant: the language changes in the browser right away
 * and the choice is saved on the server in the background.
 *
 * Uses the `.seg` control of templates/smart-ledger-web.html.
 */
export function LanguageSwitch() {
  const { locale, setLocale } = useI18n();
  const [pending, startTransition] = useTransition();

  function pick(next: (typeof LOCALES)[number]) {
    if (next === locale) return;
    setLocale(next);
    startTransition(() => {
      setLocaleAction(next);
    });
  }

  return (
    <div
      className="inline-flex gap-1 rounded-[14px] bg-[#e7edea] p-1"
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => pick(code)}
          disabled={pending}
          aria-pressed={locale === code}
          className={`h-[38px] rounded-[11px] px-4 text-[13px] font-bold transition disabled:opacity-60 ${
            locale === code
              ? "bg-surface text-primary-dark shadow-card"
              : "text-ink-2 hover:text-ink"
          }`}
        >
          {LOCALE_LABEL[code]}
        </button>
      ))}
    </div>
  );
}
