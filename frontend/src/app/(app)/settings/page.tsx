import { Suspense } from "react";
import { connection } from "next/server";
import { SettingsSkeleton } from "@/components/settings/settings-skeleton";
import { SettingsView } from "@/components/settings/settings-view";
import { getSettings } from "./_lib/repository";

async function SettingsData() {
  await connection();
  return <SettingsView settings={getSettings()} />;
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsData />
    </Suspense>
  );
}
