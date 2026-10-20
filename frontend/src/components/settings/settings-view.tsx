"use client";

import { LOCALE_LABEL } from "@/i18n/dictionaries";
import { useI18n } from "@/i18n/locale-provider";
import type { Settings } from "@/data/settings";
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

  return (
    <div className="w-full">
      <div className="mb-[22px]">
        <h1 className="text-[28px] leading-tight tracking-[-0.02em]">
          {t.settings.title}
        </h1>
        <p className="mt-1 text-ink-2">{t.settings.subtitle}</p>
      </div>

      <div className="max-w-[640px] rounded-card bg-surface p-[22px] shadow-card">
        <SettingRow label={t.settings.rows.businessName}>
          <b>{settings.businessName}</b>
        </SettingRow>

        <SettingRow label={t.settings.rows.language}>
          <b>{LOCALE_LABEL[settings.locale]}</b>
        </SettingRow>

        <SettingRow label={t.settings.rows.currency}>
          <b className="num">{settings.currency}</b>
        </SettingRow>

        <SettingRow label={t.settings.rows.sms}>
          <SettingBadge tone="info">{t.settings.badge.plus}</SettingBadge>
        </SettingRow>

        <SettingRow label={t.settings.rows.backup}>
          <SettingBadge tone={settings.cloudBackup ? "ok" : "off"}>
            {settings.cloudBackup ? t.settings.badge.active : t.settings.badge.inactive}
          </SettingBadge>
        </SettingRow>
      </div>
    </div>
  );
}
