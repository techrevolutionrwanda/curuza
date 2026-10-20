"use client";

import { useI18n } from "@/i18n/locale-provider";

export function Topbar() {
  const { t } = useI18n();

  return (
    <header className="topbar sticky top-0 z-10 flex items-center gap-3.5 border-b border-line bg-bg/90 px-8 py-4 backdrop-blur">
      {/* Search */}
      <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[14px] border-[1.5px] border-line bg-surface px-[14px] min-h-12 focus-within:border-primary max-w-[460px]">
        <svg
          className="h-5 w-5 shrink-0 text-ink-3"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <input
          className="min-h-[46px] min-w-0 flex-1 border-0 bg-transparent outline-none"
          placeholder={t.topbar.search}
          aria-label={t.topbar.search}
        />
      </label>

      {/* Sync toggle */}
      <button
        type="button"
        className="flex items-center gap-[7px] rounded-full bg-primary-soft px-[14px] py-[9px] text-[13px] font-semibold text-primary-dark"
      >
        <span className="h-[8px] w-[8px] rounded-full bg-success" />
        <span>{t.topbar.sync}</span>
      </button>

      {/* New sale.
          The sale dialog itself is built by another developer, so this button
          intentionally has no click handler yet. */}
      <button
        type="button"
        aria-label={t.topbar.newSale}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-accent px-5 font-bold text-[#3A2A00] transition hover:brightness-95"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span className="topbar-gold-text">{t.topbar.newSale}</span>
      </button>

      {/* User. The name of the owner is data, not text to translate. */}
      <div className="flex items-center gap-2.5">
        <div className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[14px] bg-primary-soft font-extrabold text-primary-dark">
          MU
        </div>
        <div className="topbar-user-text">
          <b className="block text-sm font-semibold text-ink">Mukamana</b>
          <small className="block text-xs text-ink-2">{t.topbar.owner}</small>
        </div>
      </div>
    </header>
  );
}
