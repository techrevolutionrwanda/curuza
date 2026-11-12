import { Skeleton, SkeletonPage } from "../skeletons/skeleton";

const INPUT_ROWS = [0, 1, 2, 3, 4];
const TOGGLE_ROWS = [0, 1];

/** Loading shape of the settings page: head and the profile/settings card. */
export function SettingsSkeleton() {
  return (
    <SkeletonPage className="w-full">
      <div className="mb-[22px]">
        <Skeleton className="h-[30px] w-[160px]" />
        <Skeleton className="mt-2 h-[18px] w-[280px]" />
      </div>

      <div className="max-w-[640px] rounded-card bg-surface p-[22px] shadow-card">
        {INPUT_ROWS.map((row) => (
          <div
            key={row}
            className="flex flex-col gap-2 border-b border-line py-[13px] sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-10 w-full sm:w-[240px]" />
          </div>
        ))}

        <div className="flex justify-end border-b border-line pt-[14px] pb-[13px]">
          <Skeleton className="h-12 w-full bg-primary-soft sm:w-[96px]" />
        </div>

        <div className="flex flex-col gap-2 border-b border-line py-[13px] sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Skeleton className="h-4 w-[90px]" />
          <Skeleton className="h-10 w-[170px]" />
        </div>

        {TOGGLE_ROWS.map((row) => (
          <div
            key={row}
            className="flex flex-col gap-2 border-b border-line py-[13px] sm:flex-row sm:items-center sm:justify-between sm:gap-4"
          >
            <Skeleton className="h-4 w-[110px]" />
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-[26px] w-[70px] rounded-pill" />
              <Skeleton className="h-[26px] w-[46px] rounded-pill" />
            </div>
          </div>
        ))}

        <div className="flex flex-col gap-2 py-[13px] sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Skeleton className="h-4 w-[130px]" />
          <Skeleton className="h-4 w-[140px]" />
        </div>
      </div>
    </SkeletonPage>
  );
}
