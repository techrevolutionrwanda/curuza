/**
 * Small status pill used on the settings rows.
 *
 * Mirrors the `.badge` of templates/smart-ledger-web.html.
 */
const TONE = {
  ok: "bg-primary-soft text-primary-dark",
  info: "bg-info-soft text-info",
  off: "bg-line text-ink-2",
} as const;

export type BadgeTone = keyof typeof TONE;

export function SettingBadge({
  tone = "ok",
  children,
}: {
  tone?: BadgeTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-pill px-[11px] py-1 text-[12px] font-extrabold ${TONE[tone]}`}
    >
      {children}
    </span>
  );
}
