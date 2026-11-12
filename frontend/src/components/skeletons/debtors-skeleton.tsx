import { Skeleton, SkeletonPage } from "./skeleton";

const SUMMARY_CARDS = [0, 1, 2];
const TABLE_ROWS = [0, 1, 2, 3, 4, 5];
const CARD_ROWS = [0, 1, 2, 3];

/**
 * Loading shape of the debtors page: head, search box, the three summary
 * cards, then the responsive table/cards list.
 */
export function DebtorsSkeleton() {
  return (
    <SkeletonPage className="mx-auto w-full max-w-[1400px]">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <div>
          <Skeleton className="h-[30px] w-[150px]" />
          <Skeleton className="mt-1 h-[16px] w-[290px]" />
        </div>
        <Skeleton className="h-11 w-full sm:w-[160px]" />
      </div>

      {/* Search */}
      <div className="mb-5 flex items-center gap-3">
        <Skeleton className="h-5 w-5 shrink-0 rounded-full" />
        <Skeleton className="h-[54px] flex-1 rounded-[16px]" />
      </div>

      {/* Summary cards */}
      <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SUMMARY_CARDS.map((card) => (
          <div
            key={card}
            className={`flex min-h-[100px] items-center gap-3 rounded-[22px] border border-line bg-surface px-5 py-4 ${
              card === 2 ? "sm:col-span-2 lg:col-span-1" : ""
            }`}
          >
            <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1">
              <Skeleton className="h-[13px] w-[110px]" />
              <Skeleton className="mt-[6px] h-[26px] w-[140px]" />
            </div>
          </div>
        ))}
      </div>

      {/* Wide screens: table */}
      <div className="hidden overflow-hidden rounded-[22px] border border-line bg-surface xl:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="bg-[#FAFCFB]">
                {["w-[88px]", "w-[70px]", "w-[58px]", "w-[64px]", "w-[48px]", "w-[64px]"].map(
                  (width, index) => (
                    <th key={index} className="border-b border-line px-4 py-3 text-left">
                      <Skeleton className={`h-[11px] ${width}`} />
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row) => (
                <tr key={row} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-[42px] w-[42px] shrink-0 rounded-[12px]" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[110px]" />
                        <Skeleton className="h-[11px] w-[80px]" />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-[90px]" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="ml-auto h-4 w-[70px]" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-[8px] w-full max-w-[140px] rounded-full" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="ml-auto h-4 w-[70px]" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="ml-auto h-[30px] w-[70px] rounded-panel" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phones and tablets: cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:hidden">
        {CARD_ROWS.map((card) => (
          <div
            key={card}
            className="rounded-[18px] border border-line bg-surface p-4"
          >
            <div className="flex items-start gap-3">
              <Skeleton className="h-[42px] w-[42px] shrink-0 rounded-[12px]" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-[60%]" />
                <Skeleton className="h-3 w-[45%]" />
                <Skeleton className="h-3 w-[55%]" />
              </div>
              <div className="shrink-0 space-y-2">
                <Skeleton className="ml-auto h-[9px] w-[34px]" />
                <Skeleton className="ml-auto h-4 w-[64px]" />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <Skeleton className="h-[11px] w-[96px]" />
              <Skeleton className="h-[11px] w-[72px]" />
            </div>
            <Skeleton className="mt-2 h-2 w-full rounded-full" />

            <div className="mt-3 flex gap-2">
              <Skeleton className="h-10 flex-1 rounded-[11px] bg-primary-soft" />
              <Skeleton className="h-10 flex-1 rounded-[11px]" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonPage>
  );
}
