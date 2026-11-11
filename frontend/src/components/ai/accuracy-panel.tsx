"use client";

import { useState } from "react";
import { CheckIcon } from "./icons";

const KPIS = [
  {
    label: "Scans reviewed",
    value: "412",
    sub: "photos confirmed by users",
  },
  {
    label: "Fields kept as read",
    value: "91%",
    sub: "our accuracy score",
    tone: "is-green" as const,
  },
  {
    label: "Handwritten scans",
    value: "74%",
    sub: "fields kept — weakest area",
    tone: "is-amber" as const,
  },
  {
    label: "Voice commands understood",
    value: "88%",
    sub: "confirmed without changes",
  },
];

const FIXED_FIELDS = [
  {
    name: "Supplier / customer",
    count: 58,
    mistake: "Misspelled names in handwriting",
  },
  {
    name: "Reference number",
    count: 41,
    mistake: "0 and O, 1 and 7 mixed up",
  },
  {
    name: "Date",
    count: 23,
    mistake: "Day and month swapped",
  },
  {
    name: "Unit",
    count: 17,
    mistake: "Kinyarwanda unit words not recognised",
  },
];

const MODELS = [
  { label: "Read photos", value: "Gemini Flash" },
  { label: "Structure / commands", value: "Gemini Flash-Lite" },
  { label: "Speech to text", value: "Browser, transcribe API backup" },
  { label: "Spoken replies", value: "Browser" },
];

export function AccuracyPanel() {
  const [added, setAdded] = useState<Record<string, boolean>>({});

  function toggleExample(name: string) {
    setAdded((current) => ({ ...current, [name]: !current[name] }));
  }

  return (
    <div className="ai-panel">
      <div className="head-row">
        <div>
          <div className="crumb">Team only · admins</div>
          <h2 className="acc-title">
            AI accuracy
            <span className="acc-badge">Example data</span>
          </h2>
        </div>
        <span className="acc-period">November 2026</span>
      </div>

      <div className="acc-kpis">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="kpi-card">
            <span className="kpi-label">{kpi.label}</span>
            <span className={`kpi-value${kpi.tone ? ` ${kpi.tone}` : ""}`}>
              {kpi.value}
            </span>
            <span className="kpi-sub">{kpi.sub}</span>
          </div>
        ))}
      </div>

      <div className="acc-cols">
        <section className="acc-table-card">
          <div className="acc-table-head">
            <h2>Most-fixed fields</h2>
            <span>AI output compared with what users saved</span>
          </div>
          <table className="acc-table">
            <thead>
              <tr>
                <th scope="col">Field</th>
                <th scope="col">Times fixed</th>
                <th scope="col">Typical mistake</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {FIXED_FIELDS.map((field) => {
                const isAdded = Boolean(added[field.name]);
                return (
                  <tr key={field.name}>
                    <td className="cell-name">{field.name}</td>
                    <td>{field.count}</td>
                    <td className="cell-muted">{field.mistake}</td>
                    <td className="cell-action">
                      <button
                        type="button"
                        className="add-example"
                        aria-pressed={isAdded}
                        onClick={() => toggleExample(field.name)}
                      >
                        {isAdded ? "Added as example" : "Add as example"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="acc-side">
          <div className="acc-card">
            <h2>How we improve</h2>

            <div className="acc-step">
              <span className="acc-step-mark">
                <CheckIcon size={16} strokeWidth={2.6} />
              </span>
              <div>
                <b>1 · Prompting</b>
                <div className="acc-step-sub">
                  Instructions + Curuza field names.
                </div>
              </div>
            </div>

            <div className="acc-step">
              <span className="acc-step-mark is-current" aria-hidden="true" />
              <div>
                <b>2 · Examples — current</b>
                <div className="acc-step-sub">
                  6 of 10 example records added to the prompt.
                </div>
              </div>
            </div>

            <div className="acc-step">
              <span className="acc-step-mark is-later" aria-hidden="true" />
              <div>
                <b>3 · Fine-tuning — not yet</b>
                <div className="acc-step-sub">
                  Only if examples aren&apos;t enough, after hundreds of
                  corrected records with personal data removed.
                </div>
              </div>
            </div>
          </div>

          <div className="acc-card acc-models">
            <h2>Models in use</h2>
            {MODELS.map((model) => (
              <div key={model.label} className="acc-model-row">
                <span>{model.label}</span>
                <b>{model.value}</b>
              </div>
            ))}
            <span className="acc-models-note">
              Paid configuration for customer records. Check provider pricing
              and data policy before launch.
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
