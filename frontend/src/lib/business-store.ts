"use client";

import { useSyncExternalStore } from "react";
import { SEED_SETTINGS } from "@/data/settings";

/**
 * The name of the shop, shared between the settings page and the app shell.
 *
 * The shell is rendered by the root layout, which stays static, so the
 * name travels through a cookie: the sidebar reads it with
 * `useSyncExternalStore` and the settings page writes it when the shop is
 * renamed.
 */
const COOKIE = "businessName";

const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
}

function getSnapshot(): string {
  if (typeof document === "undefined") return SEED_SETTINGS.businessName;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : SEED_SETTINGS.businessName;
}

function getServerSnapshot(): string {
  return SEED_SETTINGS.businessName;
}

/** Remember the new shop name for the sidebar and the next visit. */
export function publishBusinessName(name: string) {
  document.cookie = `${COOKIE}=${encodeURIComponent(name)}; path=/; max-age=31536000; samesite=lax`;
  notify();
}

/** The name of the shop, wherever it is shown. */
export function useBusinessName(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
