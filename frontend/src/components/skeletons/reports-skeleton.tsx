import { Skeleton, SkeletonPage } from "./skeleton";

const SUMMARY_ROWS = [0, 1, 2];
const CATEGORY_ROWS = [0, 1, 2, 3, 4];
const CHART_BARS = [38, 62, 50, 84, 58, 32, 74, 46];
const CHART_WIDTHS = [72, 48, 64, 40, 56, 36, 60, 44];

/**
 * Loading shape of the reports page: the head with period and export
 * actions, then the profit/summary cards and the top categories list.
 */
export function ReportsSkeleton() {
  return (
    <SkeletonPage className="reports-page w-full">
      <div className="mb-[26px] flex flex-wrap items-center justify-between gap-4 max-sm:items-start">
        <div>
          <Skeleton className="h-[36px] w-[190px]" />
          <Skeleton className="mt-2 h-[16px] w-[290px]" />
        </div>
        <div className="flex flex-wrap items-center gap-2.5 max-sm:w-full">
          <Skeleton className="h-[46px] w-[250px]" />
          <Skeleton className="h-[46px] w-[112px]" />
          <Skeleton className="h-[46px] w-[92px] bg-primary-soft" />
        </div>
      </div>

      <div className="mb-[18px] grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] lg:gap-[18px]">
        {/* Profit card */}
        <div className="rounded-card border border-line bg-surface p-[22px] shadow-card max-[520px]:p-[18px]">
          <div className="mb-[10px] flex flex-wrap items-center justify-between gap-2.5">
            <Skeleton className="h-[18px] w-[120px]" />
            <Skeleton className="h-[32px] w-[170px] rounded-pill" />
          </div>
          <Skeleton className="mt-2 h-[34px] w-[190px]" />
          <Skeleton className="mt-1 h-[13px] w-[120px]" />

          <div className="mt-[18px] flex items-end gap-[14px] pt-[10px]">
            {CHART_BARS.map((height, index) => (
              <div
                key={index}
                className="flex h-[160px] flex-1 flex-col items-center justify-end gap-2"
              >
                <div
                  style={{ height: `${height}%` }}
                  className="w-full max-w-[44px] rounded-[9px_9px_4px_4px] bg-line"
                />
                <Skeleton
                  className="h-[10px]"
                  style={{ width: `${CHART_WIDTHS[index]}px` }}
                />
              </div>
            ))}
          </div>

          <div className="mt-[14px] flex flex-wrap gap-4 border-t border-line pt-[14px]">
            <Skeleton className="h-[12px] w-[110px]" />
            <Skeleton className="h-[12px] w-[90px]" />
          </div>
        </div>

        {/* Summary card */}
        <div className="rounded-card bg-surface p-[22px] shadow-card max-[520px]:p-[18px]">
          <Skeleton className="mb-2 h-[18px] w-[130px]" />
          {SUMMARY_ROWS.map((row) => (
            <div
              key={row}
              className="flex items-center justify-between gap-4 border-b border-line py-[14px] last:border-b-0"
            >
              <Skeleton className="h-4 w-[110px]" />
              <Skeleton className="h-4 w-[96px]" />
            </div>
          ))}
          <Skeleton className="mt-[14px] h-[58px] w-full rounded-[14px] bg-info-soft" />
        </div>
      </div>

      {/* Top categories */}
      <div className="rounded-card bg-surface p-[22px] shadow-card max-[520px]:p-[18px]">
        <Skeleton className="h-[19px] w-[180px]" />
        <Skeleton className="mt-[6px] h-[13px] w-[280px]" />
        <div className="mt-2">
          {CATEGORY_ROWS.map((row) => (
            <div
              key={row}
              className="flex items-center justify-between gap-[18px] border-b border-line py-4 last:border-b-0 max-[520px]:gap-2.5 max-[520px]:py-3.5"
            >
              <Skeleton className="h-4 w-[92px] max-[520px]:w-[70px]" />
              <div className="h-[10px] flex-1 overflow-hidden rounded-pill bg-[#EDF1EF]">
                <div
                  className="h-full rounded-pill bg-line"
                  style={{ width: `${88 - row * 14}%` }}
                />
              </div>
              <Skeleton className="h-4 w-[70px]" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonPage>
  );
}
