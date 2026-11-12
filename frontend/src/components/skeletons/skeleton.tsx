import type { CSSProperties } from "react";

/**
 * A single pulsing placeholder block.
 *
 * Skeletons mirror the real page structure, so a block needs a width and a
 * height (`w-[220px] h-[18px]`). Everything else falls back to the panel
 * radius and the line colour used across the app.
 */
export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`animate-pulse rounded-panel bg-line ${className}`}
    />
  );
}

/**
 * Wraps a skeleton so assistive tech announces loading once, while the
 * placeholder shapes stay out of the accessibility tree.
 */
export function SkeletonPage({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" className={className}>
      <span className="sr-only">Loading…</span>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}
