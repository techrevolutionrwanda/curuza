import type { ReactNode } from "react";

/**
 * One line of the settings card.
 *
 * Mirrors the `.kv` row of templates/smart-ledger-web.html: the label sits
 * on the left in the muted ink colour, the value on the right.
 */
export function SettingRow({
  label,
  children,
}: {
  label: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-line py-[13px] last:border-b-0">
      <span className="text-ink-2">{label}</span>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}
