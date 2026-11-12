"use client";

import { useState } from "react";
import { ProfitCard } from "./profit-card";
import { ReportsHead } from "./reports-head";
import { SummaryCard } from "./summary-card";
import { TopCategoriesCard } from "./top-categories-card";
import { sumSales, type Sale } from "@/data/sales";
import type { Category } from "@/data/products";
import { useI18n } from "@/i18n/locale-provider";

/**
 * The reports page.
 *
 * The layout follows the `#reports` section of
 * templates/smart-ledger-web.html: a page head, then the profit and the
 * summary side by side, then the top categories.
 */
export function ReportsView({
  sales,
  categories,
}: {
  sales: Sale[];
  categories: Category[];
}) {
  const [period, setPeriod] = useState(0);
  const [chartType, setChartType] = useState(0);
  const { locale, t } = useI18n();
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  if (period === 1) {
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  } else if (period === 2) {
    start.setDate(1);
  }
  const periodSales = sales.filter((sale) => {
    const createdAt = new Date(sale.createdAt);
    return createdAt >= start && createdAt <= end;
  });
  const categorySales = new Map<string, number>();
  for (const sale of periodSales) {
    for (const item of sale.items) {
      categorySales.set(item.category, (categorySales.get(item.category) ?? 0) + item.quantity);
    }
  }
  const topCategories = [...categorySales]
    .map(([id, count]) => {
      const category = categories.find((item) => item.id === id);
      return {
        id,
        name: category?.label[locale] ?? category?.label.rw ?? id,
        count,
      };
    })
    .sort((a, b) => b.count - a.count);
  const salesTotal = sumSales(periodSales, (sale) => sale.total);
  const collectedTotal = sumSales(periodSales, (sale) => sale.paid);
  const owedTotal = sumSales(periodSales, (sale) => sale.owed);

  return (
    <div className="reports-page w-full">
      <div className="reports-screen">
      <ReportsHead
        period={period}
        onPeriodChange={setPeriod}
        onExcelExport={async () => {
          // ExcelJS is ~260 KB compressed. Load it only when the user actually
          // exports, instead of with the Reports page.
          const { default: ExcelJS } = await import("exceljs");
          const workbook = new ExcelJS.Workbook();
          workbook.creator = "Curuza";
          workbook.created = new Date();

          const summary = workbook.addWorksheet("Summary");
          summary.columns = [
            { header: t.reports.summary.title, key: "metric", width: 34 },
            { header: "RWF", key: "amount", width: 20 },
          ];
          summary.addRows([
            [t.reports.periodLabel, t.reports.periods[period]],
            [t.reports.summary.rows.sales, sumSales(periodSales, (sale) => sale.total)],
            [t.reports.summary.rows.cash, sumSales(periodSales, (sale) => sale.paid)],
            [t.reports.summary.rows.credit, sumSales(periodSales, (sale) => sale.owed)],
          ]);

          const transactions = workbook.addWorksheet("Sales");
          transactions.columns = [
            { header: t.sales.columns.date, key: "date", width: 24 },
            { header: t.sales.columns.customer, key: "customer", width: 26 },
            { header: t.sales.columns.phone, key: "phone", width: 20 },
            { header: t.sales.columns.products, key: "products", width: 48 },
            { header: t.sales.columns.payment, key: "payment", width: 20 },
            { header: t.sales.columns.total, key: "total", width: 18 },
            { header: t.sales.paid, key: "paid", width: 18 },
            { header: t.sales.balance, key: "owed", width: 18 },
          ];
          transactions.addRows(periodSales.map((sale) => ({
            date: new Date(sale.createdAt).toLocaleString(locale === "rw" ? "rw-RW" : "en-US"),
            customer: sale.customerName || t.sales.walkIn,
            phone: sale.customerPhone,
            products: sale.items
              .map((item) => `${item.name} (${item.category}) × ${item.quantity} @ ${item.price.toLocaleString("en-US")} RWF`)
              .join("; "),
            payment: t.sales.payment[sale.paymentMethod],
            total: sale.total,
            paid: sale.paid,
            owed: sale.owed,
          })));
          transactions.autoFilter = { from: "A1", to: "H1" };
          transactions.views = [{ state: "frozen", ySplit: 1 }];
          for (const column of [6, 7, 8]) {
            transactions.getColumn(column).numFmt = '#,##0 "RWF"';
          }

          const categorySheet = workbook.addWorksheet("Categories");
          categorySheet.columns = [
            { header: t.reports.categories.category, key: "category", width: 32 },
            { header: t.reports.categories.quantity, key: "quantity", width: 18 },
          ];
          categorySheet.addRows(topCategories.map(({ name, count }) => ({
            category: name,
            quantity: count,
          })));

          for (const worksheet of workbook.worksheets) {
            const header = worksheet.getRow(1);
            header.height = 26;
            header.font = { bold: true, color: { argb: "FFFFFFFF" } };
            header.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF0E7A5F" },
            };
            header.alignment = { vertical: "middle" };
            if (worksheet.name !== "Summary") {
              worksheet.views = [{ state: "frozen", ySplit: 1 }];
            }
          }

          const bytes = await workbook.xlsx.writeBuffer();
          const url = URL.createObjectURL(new Blob([bytes as BlobPart], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }));
          const link = document.createElement("a");
          link.href = url;
          link.download = `report-${["today", "this-week", "this-month"][period]}.xlsx`;
          document.body.append(link);
          link.click();
          link.remove();
          window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        }}
        onPdfExport={() => window.print()}
      />

      <div className="mb-[18px] grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] lg:gap-[18px]">
        <ProfitCard sales={periodSales} total={salesTotal} period={period} chartType={chartType} onChartTypeChange={setChartType} />
        <SummaryCard
          sales={salesTotal}
          collected={collectedTotal}
          owed={owedTotal}
        />
      </div>

      <TopCategoriesCard categories={topCategories} />
      </div>

      <article className="reports-print-view">
        <header className="mb-6 border-b border-line pb-4">
          <p className="text-xs font-bold uppercase text-primary-dark">Curuza · {t.reports.title}</p>
          <h1 className="mt-2 text-[28px] font-bold text-ink">{t.reports.title}</h1>
          <p className="mt-1 text-sm text-ink-2">{t.reports.subtitle}</p>
          <p className="mt-2 text-sm font-bold text-ink">
            {t.reports.periodLabel}: {t.reports.periods[period]}
          </p>
        </header>

        <div className="reports-print-summary mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            [t.reports.summary.rows.sales, salesTotal],
            [t.reports.summary.rows.cash, collectedTotal],
            [t.reports.summary.rows.credit, owedTotal],
            [t.reports.profit.transactions.replace("{count}", String(periodSales.length)), periodSales.length],
          ].map(([label, amount]) => (
            <section key={label} className="rounded-panel border border-line p-3">
              <p className="text-xs text-ink-2">{label}</p>
              <p className="mt-1 text-lg font-bold text-ink">
                {Number(amount).toLocaleString("en-US")}{label === t.reports.profit.transactions.replace("{count}", String(periodSales.length)) ? "" : " RWF"}
              </p>
            </section>
          ))}
        </div>

        <section className="reports-print-chart mb-6">
          <ProfitCard
            sales={periodSales}
            total={salesTotal}
            period={period}
            chartType={chartType}
            onChartTypeChange={setChartType}
          />
        </section>

        <section className="reports-print-categories">
          <h2 className="text-lg font-bold text-ink">{t.reports.categories.title}</h2>
          <p className="mb-3 mt-1 text-sm text-ink-2">{t.reports.categories.subtitle}</p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-2">
                <th className="py-2">{t.reports.categories.category}</th>
                <th className="py-2 text-right">{t.reports.categories.quantity}</th>
              </tr>
            </thead>
            <tbody>
              {topCategories.map((category) => (
                <tr key={category.id} className="border-b border-line">
                  <td className="py-2 font-semibold text-ink">{category.name}</td>
                  <td className="py-2 text-right text-ink-2">
                    {t.reports.categories.units.replace("{count}", String(category.count))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {topCategories.length === 0 && (
            <p className="py-4 text-sm text-ink-2">{t.reports.categories.empty}</p>
          )}
        </section>
      </article>
    </div>
  );
}
