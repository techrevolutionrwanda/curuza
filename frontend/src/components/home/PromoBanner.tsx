"use client";

import { useI18n } from "@/i18n/locale-provider";

interface PromoBannerProps {
  onReba: () => void;
}

export function PromoBanner({ onReba }: PromoBannerProps) {
  const { t } = useI18n();

  return (
    <div className="home-promo flex gap-[14px] items-center bg-accent-soft border border-[#F1D88E] rounded-lg p-[16px_20px] mb-[20px]">
      <span className="text-[10px] font-extrabold tracking-[0.06em] bg-accent text-[#3A2A00] px-[9px] py-[3px] rounded-full">
        {t.home.promo.tag}
      </span>
      <div>
        <b className="block mt-[4px] text-ink font-bold">
          {t.home.promo.title}
        </b>
        <span className="text-[13px] text-ink-2">
          {t.home.promo.subtitle}
        </span>
      </div>
      <button
        type="button"
        className="home-promo-btn ml-auto h-[38px] px-[14px] rounded-[11px] font-bold text-[13px] bg-primary-soft text-primary-dark inline-flex items-center justify-center"
        onClick={onReba}
      >
        {t.home.promo.cta}
      </button>
    </div>
  );
}
