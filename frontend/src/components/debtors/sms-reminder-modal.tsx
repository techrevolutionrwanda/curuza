"use client";

import { useEffect, useState } from "react";
import { formatMoney, type Debtor } from "@/data/debtors";
import { interpolate, type Locale } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/locale-provider";
import {
  previewReminder,
  sendReminder,
  SmsApiError,
  type GatewayInfo,
  type ReminderPreview,
} from "@/lib/sms-api";
import { Modal } from "@/components/stock/modal";

/**
 * Preview and send one debtor reminder. The body is rendered by the backend so
 * the character count and the text that goes to the gateway cannot drift.
 */
export function SmsReminderModal({
  open,
  debtor,
  onClose,
  onSent,
}: {
  open: boolean;
  debtor: Debtor | null;
  onClose: () => void;
  onSent: (scheduledFor: string) => void;
}) {
  const { t } = useI18n();
  const [locale, setLocale] = useState<Locale | null>(null);
  const [loaded, setLoaded] = useState<{
    key: string;
    preview: ReminderPreview;
    gateway: GatewayInfo;
  } | null>(null);
  const [loadError, setLoadError] = useState<{ key: string; message: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const saleId = debtor?.id;
  const requestKey = `${saleId ?? "none"}:${locale ?? "auto"}`;
  const preview = loaded?.key === requestKey ? loaded.preview : null;
  const gateway = loaded?.key === requestKey ? loaded.gateway : null;
  const loading = open && Boolean(saleId) && !preview && loadError?.key !== requestKey;
  const error = sendError || (loadError?.key === requestKey ? loadError.message : "");

  useEffect(() => {
    if (!open || !saleId) return;
    let cancelled = false;
    const key = `${saleId}:${locale ?? "auto"}`;

    previewReminder({ saleIds: [saleId], locale: locale ?? undefined })
      .then((result) => {
        if (cancelled) return;
        setLoaded({ key, preview: result.preview, gateway: result.gateway });
      })
      .catch((cause) => {
        if (cancelled) return;
        setLoadError({
          key,
          message: cause instanceof Error ? cause.message : t.debtors.reminder.title,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [open, saleId, locale, t.debtors.reminder.title]);

  async function handleSend() {
    if (!debtor) return;
    setSending(true);
    setSendError("");
    try {
      const result = await sendReminder({
        saleIds: [debtor.id],
        locale: locale ?? preview?.locale ?? "rw",
      });
      onSent(result.message.scheduledFor);
      onClose();
    } catch (cause) {
      if (cause instanceof SmsApiError && cause.reason && cause.reason !== "duplicate") {
        setSendError(t.debtors.reminder.blocked[cause.reason]);
      } else {
        setSendError(cause instanceof Error ? cause.message : t.debtors.reminder.title);
      }
    } finally {
      setSending(false);
    }
  }

  const blockedText = preview?.blockedReason
    ? t.debtors.reminder.blocked[preview.blockedReason]
    : null;
  const canSend =
    Boolean(preview?.canSend) && !preview?.overBudget && !loading && !sending;

  return (
    <Modal open={open} onClose={onClose} ariaLabel={t.debtors.reminder.title}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-ink">{t.debtors.reminder.title}</h2>
          <p className="mt-1 text-sm text-ink-2">{t.debtors.reminder.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-panel border border-line text-lg text-ink-2 transition hover:bg-bg"
          aria-label={t.common.close}
        >
          ×
        </button>
      </div>

      {debtor && (
        <div className="mt-4 rounded-panel border border-line bg-bg px-4 py-3">
          <div className="flex items-baseline justify-between gap-3">
            <b className="truncate text-sm text-ink">{debtor.name}</b>
            <b className="shrink-0 text-sm text-danger num">
              {formatMoney(preview?.amount ?? debtor.owed)} RWF
            </b>
          </div>
          <p className="mt-0.5 text-xs text-ink-2">{preview?.phone ?? debtor.phone}</p>
        </div>
      )}

      <label className="mt-4 block text-[13px] font-semibold text-ink-2">
        {t.debtors.reminder.language}
        <select
          value={locale ?? preview?.locale ?? "rw"}
          onChange={(event) => {
            setLocale(event.target.value as Locale);
            setSendError("");
          }}
          className="mt-1 min-h-11 w-full rounded-panel border border-line bg-surface px-3 outline-none focus:border-primary"
          disabled={sending}
        >
          <option value="rw">Kinyarwanda</option>
          <option value="en">English</option>
        </select>
      </label>

      <section className="mt-4">
        <h3 className="text-[13px] font-semibold text-ink-2">{t.debtors.reminder.body}</h3>
        <div className="mt-1 min-h-[92px] whitespace-pre-wrap rounded-panel border border-line bg-surface px-4 py-3 text-sm text-ink">
          {loading && !preview ? (
            <div className="h-4 w-3/4 animate-pulse rounded bg-line" />
          ) : (
            preview?.fullBody ?? preview?.body ?? "-"
          )}
        </div>
        {preview && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-2">
            <span>{interpolate(t.debtors.reminder.chars, { count: String(preview.totalLength), max: String(preview.maxLength) })}</span>
            <span>{interpolate(t.debtors.reminder.cost, { cost: String(preview.cost) })}</span>
            {preview.segments > 1 && <span>{preview.segments} SMS</span>}
          </div>
        )}
      </section>

      {gateway?.dryRun && (
        <p className="mt-3 rounded-panel bg-accent-soft px-3 py-2 text-xs font-semibold text-warning">
          {t.debtors.reminder.dryRun}
        </p>
      )}
      {preview?.overBudget && (
        <p className="mt-3 text-sm font-semibold text-danger">{t.debtors.reminder.tooLong}</p>
      )}
      {blockedText && !preview?.canSend && (
        <p className="mt-3 text-sm font-semibold text-danger">{blockedText}</p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-danger">
          {error}
        </p>
      )}

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onClose}
          className="min-h-12 rounded-panel border border-line px-4 font-bold"
          disabled={sending}
        >
          {t.common.cancel}
        </button>
        <button
          type="button"
          onClick={() => void handleSend()}
          className="min-h-12 flex-1 rounded-panel bg-primary px-4 font-bold text-white disabled:opacity-60"
          disabled={!canSend}
        >
          {sending ? t.debtors.reminder.sending : t.debtors.reminder.send}
        </button>
      </div>
    </Modal>
  );
}
