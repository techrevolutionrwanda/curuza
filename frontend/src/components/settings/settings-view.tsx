"use client";

import { useCallback, useState } from "react";
import { useI18n } from "@/i18n/locale-provider";
import { Toast, type ToastMsg } from "@/components/toast";
import {
  setCloudBackupAction,
  setSmsRemindersAction,
} from "@/app/(app)/settings/_lib/actions";
import type { Settings } from "@/data/settings";
import { BusinessForm } from "./business-form";
import { LanguageSwitch } from "./language-switch";
import { SettingBadge } from "./setting-badge";
import { SettingRow } from "./setting-row";
import { SettingToggle } from "./setting-toggle";

/**
 * Formats a backup timestamp.
 *
 * The format is fixed so the server and the browser always render the
 * same string and React never sees a mismatch.
 */
function formatBackup(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

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
          <div className="flex items-center gap-2.5">
            <SettingBadge tone={settings.smsReminders ? "ok" : "off"}>
              {settings.smsReminders
                ? t.settings.badge.active
                : t.settings.badge.inactive}
            </SettingBadge>
            <SettingToggle
              action={setSmsRemindersAction}
              enabled={settings.smsReminders}
              label={t.settings.rows.sms}
            />
          </div>
        </SettingRow>

        <SettingRow label={t.settings.rows.backup}>
          <div className="flex items-center gap-2.5">
            <SettingBadge tone={settings.cloudBackup ? "ok" : "off"}>
              {settings.cloudBackup
                ? t.settings.badge.active
                : t.settings.badge.inactive}
            </SettingBadge>
            <SettingToggle
              action={setCloudBackupAction}
              enabled={settings.cloudBackup}
              label={t.settings.rows.backup}
            />
          </div>
        </SettingRow>

        <SettingRow label={t.settings.rows.lastBackup}>
          <b className="num">
            {settings.lastBackupAt
              ? formatBackup(settings.lastBackupAt)
              : t.settings.badge.never}
          </b>
        </SettingRow>
      </div>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
