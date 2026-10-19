"use client";

const debtors = [
  { initial: "JM", name: "Jean Marie", date: "18 Ukw 2026", repaid: "30%", owed: "45,000" },
  { initial: "CU", name: "Chantal Uwase", date: "02 Ukw 2026", repaid: "75%", owed: "12,500" },
];

export function DebtorsTable() {
  return (
    <div className="bg-surface rounded-lg p-[22px] shadow-md">
      <div className="flex justify-between items-center mb-[16px] gap-[10px] flex-wrap">
        <div>
          <h3 className="text-[16px] font-bold mb-[2px] text-ink">
            Amadeni ya vuba
          </h3>
          <div className="text-ink-2 text-[13px]">Recent debtors</div>
        </div>
        <button className="h-[38px] px-[14px] rounded-[11px] font-bold text-[13px] bg-primary-soft text-primary-dark inline-flex items-center justify-center">
          Reba byose
        </button>
      </div>
      <div className="overflow-x-auto mx-[-8px]">
        <table className="w-full border-collapse min-w-[560px]">
          <thead>
            <tr>
              <th className="text-[12px] uppercase tracking-[0.06em] text-ink-2 text-left px-[12px] py-[10px] border-b border-line font-bold">
                Umukiriya
              </th>
              <th className="text-[12px] uppercase tracking-[0.06em] text-ink-2 text-left px-[12px] py-[10px] border-b border-line font-bold">
                Yishyuwe
              </th>
              <th className="text-[12px] uppercase tracking-[0.06em] text-ink-2 text-right px-[12px] py-[10px] border-b border-line font-bold">
                Asigaye
              </th>
              <th className="text-[12px] uppercase tracking-[0.06em] text-ink-2 text-left px-[12px] py-[10px] border-b border-line font-bold"></th>
            </tr>
          </thead>
          <tbody>
            {debtors.map((d, i) => (
              <tr key={i} className="hover:bg-[#fafcfb]">
                <td
                  className={`px-[12px] py-[14px] align-middle ${
                    i === debtors.length - 1 ? "border-b-0" : "border-b border-line"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-[42px] w-[42px] rounded-[14px] bg-primary-soft text-primary-dark grid place-items-center font-extrabold shrink-0">
                      {d.initial}
                    </div>
                    <div>
                      <b className="block text-ink">{d.name}</b>
                      <span className="text-[12px] text-ink-2">{d.date}</span>
                    </div>
                  </div>
                </td>
                <td
                  className={`px-[12px] py-[14px] align-middle ${
                    i === debtors.length - 1 ? "border-b-0" : "border-b border-line"
                  }`}
                >
                  <div className="h-[8px] bg-line rounded-full overflow-hidden min-w-[100px]">
                    <i className="h-full bg-danger" style={{ width: d.repaid }} aria-hidden="true" />
                  </div>
                </td>
                <td
                  className={`text-right px-[12px] py-[14px] align-middle ${
                    i === debtors.length - 1 ? "border-b-0" : "border-b border-line"
                  }`}
                >
                  <b className="text-danger font-nums tracking-[-0.01em]">{d.owed}</b>
                </td>
                <td
                  className={`text-right px-[12px] py-[14px] align-middle ${
                    i === debtors.length - 1 ? "border-b-0" : "border-b border-line"
                  }`}
                >
                  <button className="h-[38px] px-[14px] rounded-[11px] font-bold text-[13px] bg-primary-soft text-primary-dark inline-flex items-center justify-center">
                    SMS
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
