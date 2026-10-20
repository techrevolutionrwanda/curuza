"use client";

import { useCallback, useState } from "react";
import { useI18n } from "@/i18n/locale-provider";
import { Toast, type ToastMsg } from "@/components/toast";
import type { Settings } from "@/data/settings";
import { BusinessForm } from "./business-form";
import { LanguageSwitch } from "./language-switch";
import { SettingBadge } from "./setting-badge";
import { SettingRow } from "./setting-row";

/**
 * The settings page.
 *
 * The layout follows the `#settings` section of
 * templates/smart-ledger-web.html: a page head and a single card of
 * key/value rows.
 */
export function SettingsView({ settings }: { settings: Settings }) {
  const { t } = useI18n();
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const pushToast = useCallback(() => {
    setToasts((ts) => [
      ...ts,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, key: "settingsSaved" },
    ]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((ts) => ts.filter((x) => x.id !== id));
  }, []);

  return (
    <div className="w-full">
      <div className="mb-[22px]">
        <h1 className="text-[28px] leading-tight tracking-[-0.02em]">
          {t.settings.title}
        </h1>
        <p className="mt-1 text-ink-2">{t.settings.subtitle}</p>
      </div>

      <div className="max-w-[640px] divide-y divide-line rounded-card bg-surface p-[22px] shadow-card">
        <BusinessForm settings={settings} onSaved={pushToast} />

        <SettingRow label={t.settings.rows.language}>
          <LanguageSwitch />
        </SettingRow>

        <SettingRow label={t.settings.rows.sms}>
          <SettingBadge tone="info">{t.settings.badge.plus}</SettingBadge>
        </SettingRow>

        <SettingRow label={t.settings.rows.backup}>
          <SettingBadge tone={settings.cloudBackup ? "ok" : "off"}>
            {settings.cloudBackup
              ? t.settings.badge.active
              : t.settings.badge.inactive}
          </SettingBadge>
        </SettingRow>
      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
