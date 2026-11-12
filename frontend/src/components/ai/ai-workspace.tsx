"use client";

import { useState, type ReactNode } from "react";
import { AccuracyPanel } from "./accuracy-panel";
import { CameraIcon, ChartIcon, MicIcon } from "./icons";
import { ScanPanel } from "./scan-panel";
import { VoicePanel } from "./voice-panel";

type TabId = "scan" | "voice" | "accuracy";

const TABS: { id: TabId; label: string; icon: ReactNode }[] = [
  { id: "scan", label: "Scan", icon: <CameraIcon size={18} /> },
  { id: "voice", label: "Voice assistant", icon: <MicIcon size={18} /> },
  { id: "accuracy", label: "AI accuracy", icon: <ChartIcon size={18} /> },
];

/**
 * One workspace for the three AI screens of the template: scan a photo,
 * talk to the assistant, and review how the reading is doing.
 */
export function AiWorkspace() {
  const [tab, setTab] = useState<TabId>("scan");

  return (
    <div className="ai-shell">
      <div className="ai-page">
        <header className="ai-head">
          <div>
            <span className="ai-eyebrow">Curuza AI</span>
            <h1 className="ai-title">Scanner &amp; voice</h1>
            <p className="ai-sub">
              Point the camera at a receipt or just say what happened. Curuza
              reads it, fills the fields, and asks before anything changes.
            </p>
          </div>

          <div className="ai-tabs" role="tablist" aria-label="AI workspace">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                id={`ai-tab-${item.id}`}
                className="ai-tab"
                role="tab"
                aria-selected={tab === item.id}
                aria-controls={`ai-panel-${item.id}`}
                tabIndex={tab === item.id ? 0 : -1}
                onClick={() => setTab(item.id)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <div
          id="ai-panel-scan"
          className="ai-tabpanel"
          role="tabpanel"
          aria-labelledby="ai-tab-scan"
          hidden={tab !== "scan"}
        >
          <ScanPanel />
        </div>

        <div
          id="ai-panel-voice"
          className="ai-tabpanel"
          role="tabpanel"
          aria-labelledby="ai-tab-voice"
          hidden={tab !== "voice"}
        >
          <VoicePanel active={tab === "voice"} />
        </div>

        <div
          id="ai-panel-accuracy"
          className="ai-tabpanel"
          role="tabpanel"
          aria-labelledby="ai-tab-accuracy"
          hidden={tab !== "accuracy"}
        >
          <AccuracyPanel />
        </div>
      </div>
    </div>
  );
}
