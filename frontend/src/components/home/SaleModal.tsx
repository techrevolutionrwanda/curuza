"use client";

import { useEffect, useState } from "react";
import { QtyStepper } from "./QtyStepper";
import { PaymentToggle } from "./PaymentToggle";

const ITEMS = [
  { name: "Isukari 1kg", price: "1,800 RWF", i: 0 },
  { name: "Amazi 1.5L", price: "700 RWF", i: 1 },
];

const PRICE = [1800, 700];

interface SaleModalProps {
  open: boolean;
  onClose: () => void;
}

export function SaleModal({ open, onClose }: SaleModalProps) {
  const [qty, setQty] = useState([2, 1]);
  const [pay, setPay] = useState("cash");

  const total = qty[0] * PRICE[0] + qty[1] * PRICE[1];

  // Close the sale modal on Escape while it is open.
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[50] p-[16px] grid place-items-center bg-[#10201b]/50"
      role="scrim"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-[26px] w-full max-w-[520px] p-[26px] shadow-[0_30px_80px_rgba(0,0,0,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-[22px] font-bold tracking-[-0.02em] text-ink">
          Igurisha rishya
        </h2>
        <div className="text-ink-2 text-[14px] mb-[16px]">
          New sale · hitamo ibicuruzwa n'uburyo bwo kwishyura
        </div>
        {ITEMS.map((item) => (
          <div
            key={item.i}
            className="flex items-center gap-3 border border-line rounded-[14px] p-[10px_14px] mb-[10px]"
          >
            <div className="flex-1">
              <b className="block text-ink">{item.name}</b>
              <span className="block text-[13px] text-ink-2 font-nums">
                {item.price}
              </span>
            </div>
            <QtyStepper
              value={qty[item.i]}
              onChange={(next) => {
                const updated = [...qty];
                updated[item.i] = next;
                setQty(updated);
              }}
            />
          </div>
        ))}
        <PaymentToggle value={pay} onChange={setPay} />
        <div className="flex justify-between items-baseline mb-[18px] mt-[12px]">
          <span className="text-ink-2">Yose hamwe · Total</span>
          <b className="text-[30px] font-bold text-ink font-nums">
            {total.toLocaleString("en-US")} RWF
          </b>
        </div>
        <div className="flex gap-[10px]">
          <button
            type="button"
            onClick={onClose}
            className="h-[48px] px-[20px] rounded-[14px] font-bold border border-line border-[1.5px] bg-surface text-ink"
          >
            Hagarika
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-[48px] px-[20px] rounded-[14px] font-bold bg-primary text-white"
          >
            Bika igurisha
          </button>
        </div>
      </div>
    </div>
  );
}
