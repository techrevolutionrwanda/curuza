"use client";

import { useEffect, useState } from "react";
import { SegmentControl } from "@/components/home/SegmentControl";
import { PromoBanner } from "@/components/home/PromoBanner";
import { KpiRow } from "@/components/home/KpiRow";

const debtors = [
  { initial: "JM", name: "Jean Marie", date: "18 Ukw 2026", repaid: "30%", owed: "45,000" },
  { initial: "CU", name: "Chantal Uwase", date: "02 Ukw 2026", repaid: "75%", owed: "12,500" },
];

const price = [1800, 700];

export default function Home() {
  const [segment, setSegment] = useState(0);
  const [open, setOpen] = useState(false);
  const [pay, setPay] = useState("cash");
  const [qty, setQty] = useState([2, 1]);

  const total = qty[0] * price[0] + qty[1] * price[1];

  // Close the sale modal on Escape while it is open.
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-end gap-4 mb-[22px] flex-wrap">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-ink">
            Muraho, Mukamana 👋
          </h1>
          <p className="mt-[4px] text-base text-ink-2">
            Uko ubucuruzi bwawe buhagaze uyu munsi · Your business today
          </p>
        </div>
        <SegmentControl value={segment} onChange={setSegment} />
      </div>

      <PromoBanner onReba={() => setOpen(true)} />

      <KpiRow />

      {/* Weekly chart + restocking list */}
      <div className="home-cols grid grid-cols-[2fr_1fr] gap-[16px] mb-[16px]">
        <div className="bg-surface rounded-lg p-[22px] shadow-md">
          <div className="flex justify-between items-center mb-[16px] gap-[10px] flex-wrap">
            <div>
              <h3 className="text-[16px] font-bold mb-[2px] text-ink">
                Ibyagurishijwe mu cyumweru
              </h3>
              <div className="text-ink-2 text-[13px]">Sales this week · RWF</div>
            </div>
            <span className="inline-block text-[12px] font-extrabold px-[11px] py-[2px] rounded-full bg-primary-soft text-primary-dark whitespace-nowrap">
              +12%
            </span>
          </div>
          <div className="flex items-end gap-[14px] h-[220px] pt-[10px]">
            {[
              { label: "Mbe", h: "40%" },
              { label: "Kab", h: "55%" },
              { label: "Gat", h: "35%" },
              { label: "Gnd", h: "70%" },
              { label: "Gat", h: "50%" },
              { label: "Ruh", h: "92%", top: true },
              { label: "Cyu", h: "65%" },
            ].map((b, i) => (
              <div
                key={i}
                className="flex-1 h-full flex flex-col justify-end items-center gap-[8px] text-[12px] text-ink-2 group"
              >
                <i
                  className={`w-full max-w-[56px] rounded-[10px_10px_4px_4px] transition-colors group-hover:bg-primary ${
                    b.top ? "bg-primary" : "bg-primary-soft"
                  }`}
                  style={{ height: b.h }}
                  aria-hidden="true"
                />
                {b.label}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-surface rounded-lg p-[22px] shadow-md">
          <div className="flex justify-between items-center mb-[16px] gap-[10px] flex-wrap">
            <div>
              <h3 className="text-[16px] font-bold mb-[2px] text-ink">
                Biri hafi gushira
              </h3>
              <div className="text-ink-2 text-[13px]">Needs restocking</div>
            </div>
            <button className="h-[38px] px-[14px] rounded-[11px] font-bold text-[13px] bg-primary-soft text-primary-dark inline-flex items-center justify-center">
              Byose
            </button>
          </div>
          <div className="flex justify-between pt-[13px] pb-[13px] border-b border-line">
            <span className="text-ink-2">Amazi 1.5L</span>
            <span className="inline-block text-[12px] font-extrabold px-[11px] py-[2px] rounded-full bg-warning-soft text-warning whitespace-nowrap">
              6 bisigaye
            </span>
          </div>
          <div className="flex justify-between pt-[13px] pb-[13px] border-b border-line">
            <span className="text-ink-2">Fanta 300ml</span>
            <span className="inline-block text-[12px] font-extrabold px-[11px] py-[2px] rounded-full bg-warning-soft text-warning whitespace-nowrap">
              9 bisigaye
            </span>
          </div>
          <div className="flex justify-between pt-[13px] pb-[13px] border-b border-line">
            <span className="text-ink-2">Ifu y'ibigori 2kg</span>
            <span className="inline-block text-[12px] font-extrabold px-[11px] py-[2px] rounded-full bg-danger-soft text-danger whitespace-nowrap">
              Byashize
            </span>
          </div>
          <div className="flex justify-between pt-[13px] pb-[13px]">
            <span className="text-ink-2">Amavuta 1L</span>
            <span className="inline-block text-[12px] font-extrabold px-[11px] py-[2px] rounded-full bg-warning-soft text-warning whitespace-nowrap">
              4 bisigaye
            </span>
          </div>
        </div>
      </div>

      {/* Recent debtors */}
      <div className="bg-surface rounded-lg p-[22px] shadow-md">
        <div className="flex justify-between items-center mb-[16px] gap-[10px] flex-wrap">
          <div>
            <h3 className="text-[16px] font-bold mb-[2px] text-ink">Amadeni ya vuba</h3>
            <div className="text-ink-2 text-[13px]">Recent debtors</div>
          </div>
          <button className="h-[38px] px-[14px] rounded-[11px] font-bold text-[13px] bg-primary-soft text-primary-dark inline-flex items-center justify-center">
            Reba byose
          </button>
        </div>
        <div className="overflow-x-auto mx-[-8px]">
          <table className="w-full border-collapse min-w-[560px]">
            <thead>
              <tr>
                <th className="text-[12px] uppercase tracking-[0.06em] text-ink-2 text-left px-[12px] py-[10px] border-b border-line font-bold">
                  Umukiriya
                </th>
                <th className="text-[12px] uppercase tracking-[0.06em] text-ink-2 text-left px-[12px] py-[10px] border-b border-line font-bold">
                  Yishyuwe
                </th>
                <th className="text-[12px] uppercase tracking-[0.06em] text-ink-2 text-right px-[12px] py-[10px] border-b border-line font-bold">
                  Asigaye
                </th>
                <th className="text-[12px] uppercase tracking-[0.06em] text-ink-2 text-left px-[12px] py-[10px] border-b border-line font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {debtors.map((d, i) => (
                <tr key={i} className="hover:bg-[#fafcfb]">
                  <td className={`px-[12px] py-[14px] align-middle ${i === debtors.length - 1 ? "border-b-0" : "border-b border-line"}`}>
                    <div className="flex items-center gap-3">
                      <div className="h-[42px] w-[42px] rounded-[14px] bg-primary-soft text-primary-dark grid place-items-center font-extrabold shrink-0">
                        {d.initial}
                      </div>
                      <div>
                        <b className="block text-ink">{d.name}</b>
                        <span className="text-[12px] text-ink-2">{d.date}</span>
                      </div>
                    </div>
                  </td>
                  <td className={`px-[12px] py-[14px] align-middle ${i === debtors.length - 1 ? "border-b-0" : "border-b border-line"}`}>
                    <div className="h-[8px] bg-line rounded-full overflow-hidden min-w-[100px]">
                      <i className="h-full bg-danger" style={{ width: d.repaid }} aria-hidden="true" />
                    </div>
                  </td>
                  <td className={`text-right px-[12px] py-[14px] align-middle ${i === debtors.length - 1 ? "border-b-0" : "border-b border-line"}`}>
                    <b className="text-danger font-nums tracking-[-0.01em]">{d.owed}</b>
                  </td>
                  <td className={`text-right px-[12px] py-[14px] align-middle ${i === debtors.length - 1 ? "border-b-0" : "border-b border-line"}`}>
                    <button className="h-[38px] px-[14px] rounded-[11px] font-bold text-[13px] bg-primary-soft text-primary-dark inline-flex items-center justify-center">
                      SMS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale modal */}
      <div
        className={`fixed inset-0 z-[50] p-[16px] ${open ? "grid" : "hidden"} place-items-center bg-[#10201b]/50`}
        role="scrim"
        onClick={close}
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
          {[
            { name: "Isukari 1kg", price: "1,800 RWF", i: 0 },
            { name: "Amazi 1.5L", price: "700 RWF", i: 1 },
          ].map((item) => (
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
              <div className="flex items-center gap-[10px]">
                <button
                  type="button"
                  onClick={() => {
                    const next = [...qty];
                    next[item.i] = Math.max(0, next[item.i] - 1);
                    setQty(next);
                  }}
                  className="h-[40px] w-[40px] rounded-[12px] bg-primary-soft text-primary-dark text-[20px] font-extrabold"
                >
                  −
                </button>
                <b className="min-w-[22px] text-center text-ink font-extrabold font-nums">
                  {qty[item.i]}
                </b>
                <button
                  type="button"
                  onClick={() => {
                    const next = [...qty];
                    next[item.i] = next[item.i] + 1;
                    setQty(next);
                  }}
                  className="h-[40px] w-[40px] rounded-[12px] bg-primary-soft text-primary-dark text-[20px] font-extrabold"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <div className="grid grid-cols-3 gap-[8px] mb-[14px] mt-[14px]">
            {[
              { key: "cash", label: "Amafaranga", sub: "Cash" },
              { key: "partial", label: "Igice", sub: "Partial" },
              { key: "credit", label: "Ideni", sub: "Credit" },
            ].map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPay(p.key)}
                className={`min-h-[58px] rounded-[14px] border border-line border-[1.5px] font-bold text-[14px] flex flex-col items-center justify-center gap-[2px] ${
                  pay === p.key
                    ? "border-primary bg-primary-soft text-primary-dark"
                    : "text-ink"
                }`}
              >
                {p.label}
                <span className="text-[12px] text-ink-2 font-normal">{p.sub}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-between items-baseline mb-[18px] mt-[12px]">
            <span className="text-ink-2">Yose hamwe · Total</span>
            <b className="text-[30px] font-bold text-ink font-nums">
              {total.toLocaleString("en-US")} RWF
            </b>
          </div>
          <div className="flex gap-[10px]">
            <button
              type="button"
              onClick={close}
              className="h-[48px] px-[20px] rounded-[14px] font-bold border border-line border-[1.5px] bg-surface text-ink"
            >
              Hagarika
            </button>
            <button
              type="button"
              onClick={close}
              className="flex-1 h-[48px] px-[20px] rounded-[14px] font-bold bg-primary text-white"
            >
              Bika igurisha
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
