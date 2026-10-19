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
    </>
  )
}
