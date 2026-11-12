import { Skeleton, SkeletonPage } from "./skeleton";

const FIELD_ROWS = [0, 1, 2, 3, 4, 5];
const TABS = ["Scan", "Voice assistant", "AI accuracy"];

/**
 * Loading shape of the AI workspace: the real header stays in place so the
 * layout does not jump, while the scan panel (photo + fields) loads.
 */
export function AiSkeleton() {
  return (
    <SkeletonPage className="ai-shell">
      <div className="ai-page">
        <header className="ai-head">
          <div>
            <span className="ai-eyebrow">Curuza AI</span>
            <h1 className="ai-title">Scanner &amp; voice</h1>
            <p className="ai-sub">
              Point the camera at a receipt or just say what happened. Curuza
              reads it, fills the fields, and asks before anything changes.
            </p>
          </div>

          <div className="ai-tabs" aria-hidden="true">
            {TABS.map((tab, index) => (
              <span
                key={tab}
                role="tab"
                aria-selected={index === 0}
                className="ai-tab"
              >
                {tab}
              </span>
            ))}
          </div>
        </header>

        <div className="ai-panel">
          <div className="scan-head">
            <div>
              <div className="crumb">Scan a record › Review</div>
              <h2 className="screen-title">Check before saving</h2>
            </div>
            <div className="scan-actions">
              <Skeleton className="h-11 w-[130px] rounded-[14px]" />
              <Skeleton className="h-11 w-[150px] rounded-[14px] bg-primary-soft" />
            </div>
          </div>

          <div className="h-[58px] w-full animate-pulse rounded-[12px] bg-[var(--ai-amber-bg)]" />

          <div className="scan-cols">
            <section className="photo-panel" aria-hidden="true">
              <div className="photo-head">
                <span className="photo-file">receipt-10-11.jpg</span>
                <span className="photo-tools">
                  <span className="photo-tool" />
                </span>
              </div>
              <div className="photo-canvas">
                <div className="h-[380px] w-[64%] max-w-[300px] animate-pulse rounded-[6px] bg-white/80" />
              </div>
            </section>

            <section className="fields-panel">
              <div className="space-y-3 p-4">
                <Skeleton className="h-8 w-full rounded-[8px]" />
                {FIELD_ROWS.map((row) => (
                  <div
                    key={row}
                    className="grid grid-cols-[1fr_0.8fr_1.2fr_0.6fr] items-center gap-3"
                  >
                    <Skeleton className="h-4 w-[70%]" />
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-10 w-full rounded-[8px]" />
                    <Skeleton className="h-4 w-[70%]" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}
