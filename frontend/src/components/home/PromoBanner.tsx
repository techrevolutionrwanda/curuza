"use client";

interface PromoBannerProps {
  onReba: () => void;
}

export function PromoBanner({ onReba }: PromoBannerProps) {
  return (
    <div className="home-promo flex gap-[14px] items-center bg-accent-soft border border-[#F1D88E] rounded-lg p-[16px_20px] mb-[20px]">
      <span className="text-[10px] font-extrabold tracking-[0.06em] bg-accent text-[#3A2A00] px-[9px] py-[3px] rounded-full">
        IGICIRO
      </span>
      <div>
        <b className="block mt-[4px] text-ink font-bold">
          Isukari -8% kuri Kg 50
        </b>
        <span className="text-[13px] text-ink-2">
          Ikoreshwa kugeza ku wa gatanu · Supplier offer
        </span>
      </div>
      <button
        type="button"
        className="home-promo-btn ml-auto h-[38px] px-[14px] rounded-[11px] font-bold text-[13px] bg-primary-soft text-primary-dark inline-flex items-center justify-center"
        onClick={onReba}
      >
        Reba
      </button>
    </div>
  );
}
