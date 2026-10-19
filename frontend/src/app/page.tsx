export default function Home() {
  return (
    <>
      <div className="flex justify-between items-end gap-4 mb-[22px] flex-wrap">
        <div>
          <h1 className="text-[28px] font-bold tracking-[-0.02em] leading-[1.15] text-ink">
            Muraho, Mukamana 👋
          </h1>
          <p className="mt-[4px] text-base text-ink-2">
            Uko ubucuruzi bwawe buhagaze uyu munsi · Your business today
          </p>
        </div>
        <div className="inline-flex bg-[#e7edea] rounded-[14px] p-1 gap-1">
          <button className="h-[38px] px-4 rounded-[11px] font-bold text-[13px] bg-surface text-primary-dark shadow-md">
            Uyu munsi
          </button>
          <button className="h-[38px] px-4 rounded-[11px] font-bold text-[13px] text-ink-2">
            Icyumweru
          </button>
          <button className="h-[38px] px-4 rounded-[11px] font-bold text-[13px] text-ink-2">
            Ukwezi
          </button>
        </div>
      </div>

      <div className="flex gap-[14px] items-center bg-accent-soft border border-[#F1D88E] rounded-lg p-[16px_20px] mb-[20px]">
        <span className="text-[10px] font-extrabold tracking-[0.06em] bg-accent text-[#3A2A00] px-[9px] py-[3px] rounded-full">
          IGICIRO
        </span>
        <div>
          <b className="block mt-[4px] text-ink font-bold">Isukari -8% kuri Kg 50</b>
          <span className="text-[13px] text-ink-2">
            Ikoreshwa kugeza ku wa gatanu · Supplier offer
          </span>
        </div>
        <button className="ml-auto h-[38px] px-[14px] rounded-[11px] font-bold text-[13px] bg-primary-soft text-primary-dark inline-flex items-center justify-center">
          Reba
        </button>
      </div>

      <div className="grid grid-cols-4 gap-[16px] mb-[20px]">
        <div className="bg-surface rounded-lg p-[20px] shadow-md bg-gradient-to-br from-primary to-primary-dark text-white">
          <div className="flex items-center gap-2 text-[13px] text-white/85">
            <div className="grid h-[30px] w-[30px] rounded-sm place-items-center bg-white/18 text-white">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 17l6-6 4 4 8-8" />
              </svg>
            </div>
            Ibyagurishijwe · Sales
          </div>
          <div className="text-[28px] font-extrabold mt-[10px] mb-[4px] tracking-[-0.02em]">
            86,500 <small className="text-[13px] text-white/85 font-semibold">RWF</small>
          </div>
          <div className="text-[12px] font-bold text-[#B8F0D6]">▲ 12% ugereranyije n'ejo</div>
        </div>
        <div className="bg-surface rounded-lg p-[20px] shadow-md">
          <div className="flex items-center gap-2 text-[13px] text-ink-2">
            <div className="grid h-[30px] w-[30px] rounded-sm place-items-center bg-primary-soft text-primary">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="6" width="18" height="12" rx="2" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            </div>
            Yakiriwe · Cash in
          </div>
          <div className="text-[28px] font-extrabold mt-[10px] mb-[4px] tracking-[-0.02em]">
            61,500 <small className="text-[13px] text-ink-2 font-semibold">RWF</small>
          </div>
          <div className="text-[12px] font-bold text-success">▲ 7%</div>
        </div>
        <div className="bg-surface rounded-lg p-[20px] shadow-md">
          <div className="flex items-center gap-2 text-[13px] text-ink-2">
            <div className="grid h-[30px] w-[30px] rounded-sm place-items-center bg-danger-soft text-danger">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>
            Amadeni · Owed to you
          </div>
          <div className="text-[28px] font-extrabold mt-[10px] mb-[4px] tracking-[-0.02em]">
            184,000 <small className="text-[13px] text-ink-2 font-semibold">RWF</small>
          </div>
          <div className="text-[12px] font-bold text-danger">12 abakiriya</div>
        </div>
        <div className="bg-surface rounded-lg p-[20px] shadow-md">
          <div className="flex items-center gap-2 text-[13px] text-ink-2">
            <div className="grid h-[30px] w-[30px] rounded-sm place-items-center bg-accent-soft text-warning">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
              </svg>
            </div>
            Stock nke · Low stock
          </div>
          <div className="text-[28px] font-extrabold mt-[10px] mb-[4px] tracking-[-0.02em]">
            4 <small className="text-[13px] text-ink-2 font-semibold">ibicuruzwa</small>
          </div>
          <div className="text-[12px] font-bold text-danger">1 byashize</div>
        </div>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-[16px] mb-[16px]">
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
    </>
  )
}

const debtors = [
  { initial: "JM", name: "Jean Marie", date: "18 Ukw 2026", repaid: "30%", owed: "45,000" },
  { initial: "CU", name: "Chantal Uwase", date: "02 Ukw 2026", repaid: "75%", owed: "12,500" },
];
