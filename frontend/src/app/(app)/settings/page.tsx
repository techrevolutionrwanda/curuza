import { Suspense } from "react";
import { connection } from "next/server";
import { SettingsSkeleton } from "@/components/settings/settings-skeleton";
import { SettingsView } from "@/components/settings/settings-view";
import { getSettings } from "./_lib/repository";
import { getAccountProfile } from "./_lib/account";

async function SettingsData() {
  await connection();
  const [settings, profile] = await Promise.all([
    Promise.resolve(getSettings()),
    getAccountProfile(),
  ]);
  return <SettingsView settings={{ ...settings, ...profile }} />;
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsData />
    </Suspense>
  );
}
