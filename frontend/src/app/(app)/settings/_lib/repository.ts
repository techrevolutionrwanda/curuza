import "server-only";

import type { Settings } from "@/data/settings";
import { getShopSettings } from "./settings-api";

export type { Settings };

export async function getSettings(): Promise<Settings> {
  const shop = await getShopSettings();
  return {
    username: "",
    email: "",
    businessName: "",
    phone: "",
    ...shop,
  };
}