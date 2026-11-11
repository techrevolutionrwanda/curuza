"use client";

import { useCallback, useMemo, useState } from "react";
import { CameraFlow } from "./camera-flow";
import { CameraIcon, ChartIcon, CheckIcon, WarningIcon } from "./icons";

type Form = {
  recordType: string;
  item: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  supplier: string;
  reference: string;
  date: string;
};

type EditableField = Exclude<keyof Form, "recordType">;

const INITIAL_FORM: Form = {
  recordType: "Stock in",
  item: "Cement 50 kg",
  quantity: "20",
  unit: "bags",
  unitPrice: "9,500",
  supplier: "Ruhango Hardware",
  reference: "INV-0347",
  date: "10/11/2026",
};

const AI_READ: Record<EditableField, string> = {
  item: "Cement 50kg",
  quantity: "20",
  unit: "bags",
  unitPrice: "9,500",
  supplier: "Ruhang? Hardwre",
  reference: "INV-0?47",
  date: "10/11/26",
};

const RECORD_TYPES = ["Stock in", "Sale", "Expense"];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatSavedDate(value: string) {
  const [day, month, year] = value.split("/").map(Number);
  if (!day || !month || !year || month > 12) return value;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

function toNumber(value: string) {
  const cleaned = value.replace(/[^\d.]/g, "");
  if (!cleaned) return Number.NaN;
  return Number(cleaned);
}

export function ScanPanel() {
  const [stage, setStage] = useState<"review" | "saved">("review");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [form, setForm] = useState<Form>(INITIAL_FORM);
  const [touched, setTouched] = useState<Partial<Record<EditableField, boolean>>>(
    { reference: true },
  );

  const total = useMemo(() => {
    const quantity = toNumber(form.quantity);
    const price = toNumber(form.unitPrice);
    if (!Number.isFinite(quantity) || !Number.isFinite(price)) return null;
    return quantity * price;
  }, [form.quantity, form.unitPrice]);

  const totalLabel = total === null ? "—" : `RWF ${total.toLocaleString("en-US")}`;

  const resetForm = useCallback(() => {
    setForm(INITIAL_FORM);
    setTouched({ reference: true });
    setZoom(1);
  }, []);

  const openCamera = useCallback(() => {
    resetForm();
    setStage("review");
    setCameraOpen(true);
  }, [resetForm]);

  const closeCamera = useCallback(() => setCameraOpen(false), []);

  const completeScan = useCallback(() => {
    setCameraOpen(false);
    setStage("review");
  }, []);

  function updateField(field: EditableField, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setTouched((current) => ({ ...current, [field]: true }));
  }

  return (
    <div className="ai-panel">
      {stage === "review" ? (
        <>
          <div className="scan-head">
            <div>
              <div className="crumb">Scan a record › Review</div>
              <h2 className="screen-title">Check before saving</h2>
            </div>
            <div className="scan-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={resetForm}
              >
                Discard
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStage("saved")}
              >
                <CheckIcon size={18} />
                Confirm and save
              </button>
            </div>
          </div>

          <div className="notice notice-amber">
            <WarningIcon size={20} className="notice-icon" />
            <span>
              <b>2 of 9 fields need a look.</b> Click a field to see where the AI
              read it on the photo.
            </span>
          </div>

          <div className="scan-cols">
            <section className="photo-panel" aria-label="Scanned photo">
              <div className="photo-head">
                <span className="photo-file">receipt-10-11.jpg</span>
                <span className="photo-tools">
                  <button
                    type="button"
                    className="photo-tool"
                    aria-label="Zoom out"
                    onClick={() =>
                      setZoom((current) => Math.max(0.8, Number((current - 0.1).toFixed(2))))
                    }
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="photo-tool"
                    aria-label="Zoom in"
                    onClick={() =>
                      setZoom((current) => Math.min(1.4, Number((current + 0.1).toFixed(2))))
                    }
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="photo-tool photo-tool-retake"
                    onClick={openCamera}
                  >
                    Retake
                  </button>
                </span>
              </div>

              <div className="photo-canvas">
                <div
                  className="receipt"
                  style={{ transform: `scale(${zoom})` }}
                  aria-hidden="true"
                >
                  <div className="r-title" />
                  <div className="r-sub r-outline-amber" />
                  <div className="r-rule" />
                  <div className="r-row">
                    <div
                      className="r-bar r-outline"
                      style={{ width: "55%" }}
                    />
                    <div className="r-bar" style={{ width: "18%" }} />
                  </div>
                  <div className="r-row">
                    <div className="r-bar" style={{ width: "40%" }} />
                    <div className="r-bar" style={{ width: "14%" }} />
                  </div>
                  <div className="r-rule" />
                  <div className="r-row">
                    <div
                      className="r-bar r-bar-strong"
                      style={{ width: "26%" }}
                    />
                    <div
                      className="r-bar r-bar-strong"
                      style={{ width: "24%" }}
                    />
                  </div>
                  <div
                    className="r-bar r-outline-amber r-foot"
                    style={{ width: "30%" }}
                  />
                </div>
              </div>

              <span className="photo-legend">
                Green = read clearly · Orange = unsure, please check
              </span>
            </section>

            <section className="fields-panel" aria-label="Extracted fields">
              <table className="fields-table">
                <thead>
                  <tr>
                    <th scope="col">Field</th>
                    <th scope="col">AI read</th>
                    <th scope="col">Value to save</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="field-name">Record type</td>
                    <td className="ai-read">Receipt</td>
                    <td>
                      <select
                        className="field-select"
                        aria-label="Record type to save"
                        value={form.recordType}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            recordType: event.target.value,
                          }))
                        }
                      >
                        {RECORD_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <span className="status">Clear</span>
                    </td>
                  </tr>

                  {(
                    [
                      ["item", "Item"],
                      ["quantity", "Quantity"],
                      ["unit", "Unit"],
                      ["unitPrice", "Unit price"],
                    ] as const
                  ).map(([field, label]) => (
                    <tr key={field}>
                      <td className="field-name">{label}</td>
                      <td className="ai-read">{AI_READ[field]}</td>
                      <td>
                        <input
                          className="field-input"
                          aria-label={`${label} to save`}
                          value={form[field]}
                          onChange={(event) =>
                            updateField(field, event.target.value)
                          }
                        />
                      </td>
                      <td>
                        <span className="status">Clear</span>
                      </td>
                    </tr>
                  ))}

                  <tr className="is-total">
                    <td className="field-name">Total</td>
                    <td className="ai-read">190,000</td>
                    <td>
                      <div className="total-box">
                        <span className="total-value">
                          {totalLabel}
                          <span className="total-calc">calculated</span>
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="status">Matches</span>
                    </td>
                  </tr>

                  <tr className="is-amber">
                    <td className="field-name">Supplier</td>
                    <td className="ai-read ai-read-amber">{AI_READ.supplier}</td>
                    <td>
                      <input
                        className={`field-input${touched.supplier ? "" : " is-amber"}`}
                        aria-label="Supplier to save"
                        value={form.supplier}
                        onChange={(event) =>
                          updateField("supplier", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      {touched.supplier ? (
                        <span className="status">Fixed by you</span>
                      ) : (
                        <span className="status-badge">Check this</span>
                      )}
                    </td>
                  </tr>

                  <tr className="is-amber">
                    <td className="field-name">Reference</td>
                    <td className="ai-read ai-read-amber">
                      {AI_READ.reference}
                    </td>
                    <td>
                      <input
                        className="field-input is-amber"
                        aria-label="Reference to save"
                        value={form.reference}
                        onChange={(event) =>
                          updateField("reference", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <span className="status">Fixed by you</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="field-name">Date</td>
                    <td className="ai-read">{AI_READ.date}</td>
                    <td>
                      <input
                        className="field-input"
                        aria-label="Date to save"
                        value={form.date}
                        onChange={(event) =>
                          updateField("date", event.target.value)
                        }
                      />
                    </td>
                    <td>
                      <span className="status">Clear</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="fields-foot">
                Saving sends the values through Curuza&apos;s normal validation.
                The AI output and your fixes are kept to measure accuracy.
              </p>
            </section>
          </div>
        </>
      ) : (
        <div className="saved">
          <div className="saved-head">
            <span className="saved-icon">
              <CheckIcon size={36} />
            </span>
            <h2 className="saved-title">Record saved</h2>
            <p className="saved-sub">
              Curuza checked it and added it to your records.
            </p>
          </div>

          <div className="summary-card">
            <div className="summary-top">
              <span className="summary-name">{form.item}</span>
              <span className="summary-badge">{form.recordType}</span>
            </div>
            <dl className="summary-grid">
              <dt>Quantity</dt>
              <dd>
                {form.quantity} {form.unit}
              </dd>
              <dt>Total</dt>
              <dd>{totalLabel}</dd>
              <dt>Supplier</dt>
              <dd>{form.supplier}</dd>
              <dt>Reference</dt>
              <dd>{form.reference}</dd>
              <dt>Date</dt>
              <dd>{formatSavedDate(form.date)}</dd>
            </dl>
          </div>

          <div className="note">
            <ChartIcon size={20} className="note-icon" />
            <span>
              You corrected <b>2 of 9 fields</b>. Your fixes help Curuza read
              records like this one better.
            </span>
          </div>

          <div className="saved-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={openCamera}
            >
              <CameraIcon size={20} />
              Scan another
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setStage("review")}
            >
              View record
            </button>
          </div>
        </div>
      )}

      {cameraOpen ? (
        <CameraFlow onClose={closeCamera} onComplete={completeScan} />
      ) : null}
    </div>
  );
}
