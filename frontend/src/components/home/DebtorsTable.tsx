"use client";

import Link from "next/dist/client/link";
import { useI18n } from "@/i18n/locale-provider";

const debtors = [
  { initial: "JM", name: "Jean Marie", date: "18 Ukw 2026", repaid: "30%", owed: "45,000" },
  { initial: "CU", name: "Chantal Uwase", date: "02 Ukw 2026", repaid: "75%", owed: "12,500" },
];

export function DebtorsTable() {
  const { t } = useI18n();

  return (
    <div className="bg-surface rounded-lg p-[22px] shadow-md">
      <div className="flex justify-between items-center mb-[16px] gap-[10px] flex-wrap">
        <div>
          <h3 className="text-[16px] font-bold mb-[2px] text-ink">
            {t.home.debtors.title}
          </h3>
          <div className="text-ink-2 text-[13px]">{t.home.debtors.subtitle}</div>
        </div>
        <Link
          href="/debtors"
          className="h-[38px] px-[14px] rounded-[11px] font-bold text-[13px] bg-primary-soft text-primary-dark inline-flex items-center justify-center"
        >
          {t.home.debtors.cta}
        </Link>
      </div>

      {/* Desktop table */}
      <div className="overflow-x-auto mx-[-8px] hidden md:block">
        <table className="w-full border-collapse min-w-[560px]">
          <thead>
            <tr>
              <th className="text-[12px] uppercase tracking-[0.06em] text-ink-2 text-left px-[12px] py-[10px] border-b border-line font-bold">
                {t.home.debtors.columns.customer}
              </th>
              <th className="text-[12px] uppercase tracking-[0.06em] text-ink-2 text-left px-[12px] py-[10px] border-b border-line font-bold">
                {t.home.debtors.columns.repaid}
              </th>
              <th className="text-[12px] uppercase tracking-[0.06em] text-ink-2 text-right px-[12px] py-[10px] border-b border-line font-bold">
                {t.home.debtors.columns.owed}
              </th>
              <th className="text-[12px] uppercase tracking-[0.06em] text-ink-2 text-left px-[12px] py-[10px] border-b border-line font-bold"></th>
            </tr>
          </thead>
          <tbody>
            {debtors.map((d, i) => (
              <tr key={i} className="hover:bg-[#fafcfb]">
                <td
                  className={`px-[12px] py-[14px] align-middle ${
                    i === debtors.length - 1 ? "border-b-0" : "border-b border-line"
                  }`}
                >
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
                <td
                  className={`px-[12px] py-[14px] align-middle ${
                    i === debtors.length - 1 ? "border-b-0" : "border-b border-line"
                  }`}
                >
                  <div className="h-[8px] bg-line rounded-full overflow-hidden min-w-[100px]">
                    <i className="block h-full bg-danger" style={{ width: d.repaid }} aria-hidden="true" />
                  </div>
                </td>
                <td
                  className={`text-right px-[12px] py-[14px] align-middle ${
                    i === debtors.length - 1 ? "border-b-0" : "border-b border-line"
                  }`}
                >
                  <b className="text-danger font-nums tracking-[-0.01em]">{d.owed}</b>
                </td>
                <td
                  className={`text-right px-[12px] py-[14px] align-middle ${
                    i === debtors.length - 1 ? "border-b-0" : "border-b border-line"
                  }`}
                >
                  <button className="h-[38px] px-[14px] rounded-[11px] font-bold text-[13px] bg-primary-soft text-primary-dark inline-flex items-center justify-center">
                    {t.home.debtors.sms}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden">
        {debtors.map((d, i) => (
          <div
            key={i}
            className={`border border-line rounded-lg p-[16px] mb-[12px] bg-surface hover:bg-[#fafcfb] transition-colors`}
          >
            <div className="flex items-center gap-3 mb-[12px]">
              <div className="h-[42px] w-[42px] rounded-[14px] bg-primary-soft text-primary-dark grid place-items-center font-extrabold shrink-0">
                {d.initial}
              </div>
              <div className="flex-1">
                <b className="block text-ink">{d.name}</b>
                <span className="text-[12px] text-ink-2">{d.date}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mb-[12px]">
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.06em] text-ink-2 font-bold mb-[2px]">
                  {t.home.debtors.columns.repaid}
                </div>
                <div className="h-[8px] bg-line rounded-full overflow-hidden">
                  <i className="block h-full bg-danger" style={{ width: d.repaid }} aria-hidden="true" />
                </div>
              </div>
              <b className="text-danger font-nums tracking-[-0.01em] text-right">{d.owed}</b>
            </div>
            <button className="w-full h-[38px] rounded-[11px] font-bold text-[13px] bg-primary-soft text-primary-dark inline-flex items-center justify-center">
              {t.home.debtors.sms}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
