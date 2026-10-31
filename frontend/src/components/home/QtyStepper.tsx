"use client";

interface QtyStepperProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export function QtyStepper({ value, onChange, max = Number.MAX_SAFE_INTEGER }: QtyStepperProps) {
  return (
    <div className="flex items-center gap-[10px]">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="h-[40px] w-[40px] rounded-[12px] bg-primary-soft text-primary-dark text-[20px] font-extrabold"
      >
        −
      </button>
      <b className="min-w-[22px] text-center text-ink font-extrabold font-nums">
        {value}
      </b>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className="h-[40px] w-[40px] rounded-[12px] bg-primary-soft text-primary-dark text-[20px] font-extrabold"
      >
        +
      </button>
    </div>
  );
}
