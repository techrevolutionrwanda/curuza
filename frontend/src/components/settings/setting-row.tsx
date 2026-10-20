import type { ReactNode } from "react";

/**
 * One line of the settings card.
 *
 * Mirrors the `.kv` row of templates/smart-ledger-web.html: the label sits
 * on the left in the muted ink colour, the value on the right. On narrow
 * screens the label stacks above the control so nothing is squeezed.
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
    <div className="flex flex-col gap-2 py-[13px] sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-ink-2">{label}</span>
      <div className="flex shrink-0 flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-end">
        {children}
      </div>
    </div>
  );
}
