import { Skeleton, SkeletonPage } from "./skeleton";

const KPIS = [0, 1, 2, 3];
const RESTOCK_ROWS = [0, 1, 2, 3, 4];
const DEBTOR_ROWS = [0, 1, 2, 3];
const CHART_BARS = [42, 68, 55, 88, 63, 36, 78];

/**
 * Loading shape of the home dashboard: head, the four KPI cards, the chart
 * and restock columns, then the debtors table.
 */
export function HomeSkeleton() {
  return (
    <SkeletonPage className="w-full">
      {/* Page head */}
      <div className="mb-[22px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <Skeleton className="h-[30px] w-[260px]" />
          <Skeleton className="mt-2 h-[18px] w-[300px]" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-12 w-[150px]" />
          <Skeleton className="h-12 w-[230px]" />
        </div>
      </div>

      {/* KPI cards */}
      <div className="home-kpis mb-[20px] grid grid-cols-4 gap-[16px]">
        {KPIS.map((kpi) => (
          <div
            key={kpi}
            className={`rounded-lg p-[20px] shadow-md ${
              kpi === 0 ? "bg-primary-soft" : "bg-surface"
            }`}
          >
            <div className="flex items-center gap-2">
              <Skeleton className="h-[30px] w-[30px] rounded-sm" />
              <Skeleton className="h-[13px] w-[78px]" />
            </div>
            <Skeleton className="mt-[12px] h-[30px] w-[130px]" />
            <Skeleton className="mt-[10px] h-[12px] w-[95px]" />
          </div>
        ))}
      </div>

      {/* Chart + restock */}
      <div className="home-cols mb-[16px] grid grid-cols-[2fr_1fr] gap-[16px]">
        <div className="rounded-lg bg-surface p-[22px] shadow-md">
          <div className="mb-[16px] flex flex-wrap items-center justify-between gap-[10px]">
            <div>
              <Skeleton className="h-[16px] w-[170px]" />
              <Skeleton className="mt-[6px] h-[13px] w-[220px]" />
            </div>
            <Skeleton className="h-[22px] w-[110px] rounded-pill" />
          </div>
          <div className="flex items-end gap-[14px] pt-[10px]">
            {CHART_BARS.map((height, index) => (
              <div
                key={index}
                className="flex h-[220px] flex-1 flex-col items-center justify-end gap-2"
              >
                <div
                  style={{ height: `${height}%` }}
                  className="w-full max-w-[56px] rounded-[10px_10px_4px_4px] bg-line"
                />
                <Skeleton className="h-[10px] w-[26px]" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-surface p-[22px] shadow-md">
          <div className="mb-[16px] flex flex-wrap items-center justify-between gap-[10px]">
            <div>
              <Skeleton className="h-[16px] w-[130px]" />
              <Skeleton className="mt-[6px] h-[13px] w-[165px]" />
            </div>
            <Skeleton className="h-[38px] w-[88px] rounded-[11px]" />
          </div>
          {RESTOCK_ROWS.map((row) => (
            <div
              key={row}
              className="flex items-center justify-between border-b border-line py-[13px] last:border-b-0"
            >
              <Skeleton className="h-4 w-[110px]" />
              <Skeleton className="h-[22px] w-[72px] rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Debtors table */}
      <div className="rounded-lg bg-surface p-[22px] shadow-md">
        <div className="mb-[16px] flex flex-wrap items-center justify-between gap-[10px]">
          <div>
            <Skeleton className="h-[16px] w-[150px]" />
            <Skeleton className="mt-[6px] h-[13px] w-[210px]" />
          </div>
          <Skeleton className="h-[38px] w-[96px] rounded-[11px]" />
        </div>

        <div className="hidden grid-cols-[1.5fr_1fr_auto] items-center gap-4 border-b border-line px-[12px] py-[10px] md:grid">
          <Skeleton className="h-[11px] w-[70px]" />
          <Skeleton className="h-[11px] w-[60px]" />
          <Skeleton className="ml-auto h-[11px] w-[48px]" />
        </div>

        {DEBTOR_ROWS.map((row) => (
          <div
            key={row}
            className="grid grid-cols-[1.5fr_1fr_auto] items-center gap-4 border-b border-line px-[12px] py-[14px] last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-[42px] w-[42px] rounded-[14px]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-[11px] w-[70px]" />
              </div>
            </div>
            <Skeleton className="h-[8px] w-full max-w-[160px] rounded-full" />
            <Skeleton className="ml-auto h-4 w-[84px]" />
          </div>
        ))}
      </div>
    </SkeletonPage>
  );
}
