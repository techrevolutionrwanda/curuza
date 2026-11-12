import { Skeleton, SkeletonPage } from "./skeleton";

const ROWS = [0, 1, 2, 3, 4, 5];
const CHIPS = ["w-[70px]", "w-[92px]", "w-[84px]", "w-[64px]"];

/** Loading shape of the stock page: head, category chips, search and table. */
export function StockSkeleton() {
  return (
    <SkeletonPage className="mx-auto w-full max-w-[1280px] px-4 pb-24 pt-5 sm:px-8 sm:pb-[60px] sm:pt-7">
      <div className="mb-[22px] flex flex-wrap items-end justify-between gap-4">
        <div>
          <Skeleton className="h-[30px] w-[180px]" />
          <Skeleton className="mt-1 h-[18px] w-[280px]" />
        </div>
        <div className="flex gap-2.5">
          <Skeleton className="h-12 w-[176px]" />
          <Skeleton className="h-12 w-[158px]" />
        </div>
      </div>

      <div className="rounded-card bg-surface p-5 shadow-card sm:p-[22px]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {CHIPS.map((width) => (
              <Skeleton key={width} className={`h-[38px] ${width} rounded-pill`} />
            ))}
          </div>
          <Skeleton className="h-12 w-full max-w-[340px]" />
        </div>

        <div className="mx-[-8px] overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr>
                {["w-[80px]", "w-[72px]", "w-[48px]", "w-[64px]", "w-[56px]", "w-[24px]"].map(
                  (width, index) => (
                    <th
                      key={width}
                      className={`border-b border-line px-3 py-2.5 ${
                        index >= 2 && index <= 3 ? "text-right" : "text-left"
                      }`}
                    >
                      <Skeleton className={`h-[11px] ${width}`} />
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row}>
                  <td className="border-b border-line px-3 py-3.5">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-[38px] w-[38px] rounded-[12px]" />
                      <Skeleton className="h-4 w-[120px]" />
                    </div>
                  </td>
                  <td className="border-b border-line px-3 py-3.5">
                    <Skeleton className="h-4 w-[86px]" />
                  </td>
                  <td className="border-b border-line px-3 py-3.5">
                    <Skeleton className="ml-auto h-4 w-[72px]" />
                  </td>
                  <td className="border-b border-line px-3 py-3.5">
                    <Skeleton className="ml-auto h-4 w-[40px]" />
                  </td>
                  <td className="border-b border-line px-3 py-3.5">
                    <Skeleton className="h-[24px] w-[58px] rounded-pill" />
                  </td>
                  <td className="border-b border-line px-3 py-3.5">
                    <Skeleton className="ml-auto h-[30px] w-[30px] rounded-[9px]" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SkeletonPage>
  );
}
