"use client";

import { format } from "date-fns";
import type { Sale } from "@/data/sales";
import { useI18n } from "@/i18n/locale-provider";
import { Modal } from "@/components/stock/modal";

export function CustomerCard({
  sale,
  onClose,
  onPay,
  onRemind,
}: {
  sale: Sale;
  onClose: () => void;
  onPay?: () => void;
  onRemind?: () => void;
}) {
  const { t } = useI18n();
  const customerName = sale.customerName || t.sales.walkIn;

  return (
    <Modal open onClose={onClose} ariaLabel={`${t.sales.columns.customer}: ${customerName}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-primary-soft text-lg font-extrabold text-primary-dark">
            {customerName.trim().slice(0, 1).toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold text-ink">{customerName}</h2>
            <p className="mt-1 text-sm text-ink-2">
              {sale.createdAt && format(new Date(sale.createdAt), "PPp")}
            </p>
          </div>
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

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-panel border border-line p-3">
          <p className="text-xs font-semibold text-ink-2">{t.sales.columns.customer}</p>
          <p className="mt-1 break-words text-sm font-bold text-ink">{customerName}</p>
        </div>
        <div className="rounded-panel border border-line p-3">
          <p className="text-xs font-semibold text-ink-2">{t.sales.columns.phone}</p>
          {sale.customerPhone ? (
            <a className="mt-1 inline-block text-sm font-bold text-primary-dark hover:underline" href={`tel:${sale.customerPhone}`}>
              {sale.customerPhone}
            </a>
          ) : (
            <p className="mt-1 text-sm font-bold text-ink-2">-</p>
          )}
        </div>
      </div>

      <section className="mt-5">
        <h3 className="text-sm font-bold text-ink">{t.sales.columns.products}</h3>
        <ul className="mt-2 divide-y divide-line border-y border-line">
          {sale.items.map((item) => (
            <li key={`${sale.id}-${item.productId}`} className="flex items-start justify-between gap-4 py-3 text-sm">
              <span className="min-w-0">
                <b className="block break-words text-ink">{item.name}</b>
                <span className="text-xs text-ink-2">{item.quantity} × {item.price.toLocaleString("en-US")} RWF</span>
              </span>
              <b className="shrink-0 text-right text-ink num">
                {(item.price * item.quantity).toLocaleString("en-US")} RWF
              </b>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-panel bg-bg p-4">
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-ink-2">{t.sales.columns.payment}</span>
          <b className="text-ink">{t.sales.payment[sale.paymentMethod]}</b>
        </div>
        <div className="mt-3 flex justify-between gap-4 text-sm">
          <span className="text-ink-2">{t.sales.columns.total}</span>
          <b className="text-ink num">{sale.total.toLocaleString("en-US")} RWF</b>
        </div>
        <div className="mt-2 flex justify-between gap-4 text-sm">
          <span className="text-ink-2">{t.sales.paid}</span>
          <b className="text-ink num">{sale.paid.toLocaleString("en-US")} RWF</b>
        </div>
        <div className="mt-2 flex justify-between gap-4 text-sm">
          <span className="text-ink-2">{t.sales.balance}</span>
          <b className={`num ${sale.owed > 0 ? "font-bold text-danger" : "text-success"}`}>
            {sale.owed.toLocaleString("en-US")} RWF
          </b>
        </div>
        {sale.owed > 0 && sale.dueDate && (
          <div className="mt-2 flex justify-between gap-4 text-sm">
            <span className="text-ink-2">{t.debtors.dueDate}</span>
            <b className="text-ink">{format(new Date(sale.dueDate), "PP")}</b>
          </div>
        )}
      </section>

      {(onPay || onRemind) && sale.owed > 0 && (
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          {onRemind && (
            <button
              type="button"
              onClick={onRemind}
              className="min-h-11 rounded-panel border border-line px-5 font-bold text-primary-dark transition hover:bg-primary-soft"
            >
              {t.debtors.reminder.send}
            </button>
          )}
          {onPay && (
            <button
              type="button"
              onClick={onPay}
              className="min-h-11 rounded-panel bg-primary px-5 font-bold text-white transition hover:bg-primary-dark"
            >
              {t.debtors.pay}
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}