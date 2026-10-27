export function SettingsSkeleton() {
  return (
    <div className="w-full">
      <div className="mb-[22px]">
        <div className="h-[34px] w-[220px] animate-pulse rounded-panel bg-line" />
        <div className="mt-2 h-[22px] w-[280px] animate-pulse rounded-panel bg-line" />
      </div>
      <div className="max-w-[640px] rounded-card bg-surface p-[22px] shadow-card">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between border-b border-line py-[13px] last:border-b-0"
          >
            <div className="h-[20px] w-[160px] animate-pulse rounded-panel bg-line" />
            <div className="h-[24px] w-[110px] animate-pulse rounded-pill bg-line" />
          </div>
        ))}
      </div>
    </div>
  );
}
