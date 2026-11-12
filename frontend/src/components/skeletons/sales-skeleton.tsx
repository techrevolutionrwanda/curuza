import { Skeleton, SkeletonPage } from "./skeleton";

const ROWS = [0, 1, 2, 3, 4, 5];

/**
 * Loading shape of the sales page: the head with the "new sale" action and
 * the eight-column sales table.
 */
export function SalesSkeleton() {
  return (
    <SkeletonPage className="mx-auto w-full max-w-[1400px]">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Skeleton className="h-[30px] w-[160px]" />
          <Skeleton className="mt-2 h-[16px] w-[300px]" />
        </div>
        <Skeleton className="h-12 w-[150px]" />
      </div>

      <div className="overflow-x-auto rounded-card bg-surface shadow-card">
        <table className="w-full min-w-[980px] border-collapse">
          <thead>
            <tr className="bg-bg">
              {["w-[64px]", "w-[72px]", "w-[56px]", "w-[64px]", "w-[48px]", "w-[64px]", "w-[44px]", "w-[52px]"].map(
                (width) => (
                  <th key={width} className="px-3 py-3 text-left">
                    <Skeleton className={`h-[11px] ${width}`} />
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row} className="border-b border-line last:border-b-0">
                <td className="px-3 py-3.5">
                  <Skeleton className="h-4 w-[92px]" />
                </td>
                <td className="px-3 py-3.5">
                  <Skeleton className="h-4 w-[100px]" />
                </td>
                <td className="px-3 py-3.5">
                  <Skeleton className="h-4 w-[84px]" />
                </td>
                <td className="px-3 py-3.5">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[110px]" />
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <Skeleton className="ml-auto h-4 w-[80px]" />
                </td>
                <td className="px-3 py-3.5">
                  <Skeleton className="h-[26px] w-[68px] rounded-pill bg-primary-soft" />
                </td>
                <td className="px-3 py-3.5">
                  <Skeleton className="ml-auto h-4 w-[80px]" />
                </td>
                <td className="px-3 py-3.5">
                  <Skeleton className="ml-auto h-4 w-[72px]" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SkeletonPage>
  );
}
