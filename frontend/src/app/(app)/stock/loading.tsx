const rows = [0, 1, 2, 3, 4, 5];

export default function StockLoading() {
  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 pb-24 pt-5 sm:px-8 sm:pb-[60px] sm:pt-7">
      <div className="mb-[22px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="h-[34px] w-[220px] animate-pulse rounded-panel bg-line" />
          <div className="mt-2 h-[22px] w-[280px] animate-pulse rounded-panel bg-line" />
        </div>
        <div className="flex gap-2.5">
          <div className="h-12 w-[176px] animate-pulse rounded-panel bg-line" />
          <div className="h-12 w-[158px] animate-pulse rounded-panel bg-line" />
        </div>
      </div>

      <div className="rounded-card bg-surface p-5 shadow-card sm:p-[22px]">
        <div className="mb-4 flex gap-2">
          <div className="h-[38px] w-[92px] animate-pulse rounded-pill bg-line" />
          <div className="h-[38px] w-[92px] animate-pulse rounded-pill bg-line" />
          <div className="h-[38px] w-[92px] animate-pulse rounded-pill bg-line" />
          <div className="h-[38px] w-[92px] animate-pulse rounded-pill bg-line" />
        </div>
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r} className="h-[54px] w-full animate-pulse rounded-panel bg-line" />
          ))}
        </div>
      </div>
    </main>
  );
}
