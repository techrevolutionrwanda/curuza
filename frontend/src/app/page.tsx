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
    </>
  )
}
