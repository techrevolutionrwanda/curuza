import type { ReactNode } from "react";

/**
 * One line of the settings card.
 *
 * Mirrors the `.kv` row of templates/smart-ledger-web.html: the label sits
 * on the left in the muted ink colour, the value on the right.
 *
 * The separator is drawn by the container with `divide-y divide-line`, so a
 * group of rows can be nested (a form) and still read as one list.
 */
export function SettingRow({
  label,
  children,
}: {
  label: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-[13px]">
      <span className="text-ink-2">{label}</span>
      <div className="flex shrink-0 flex-col items-end gap-1">{children}</div>
    </div>
  );
}
