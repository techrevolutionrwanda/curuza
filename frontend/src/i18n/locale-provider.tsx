"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  dictionaries,
  type Dictionary,
  type Locale,
} from "@/i18n/dictionaries";

export type { Dictionary, Locale };

/** Name of the cookie that remembers the chosen language. */
const LOCALE_COOKIE = "locale";

/**
 * The cookie is the store: the language lives in a cookie so it survives a
 * reload, and the provider subscribes to it with `useSyncExternalStore`.
 */
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

function readLocaleCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]*)`),
  );
  const value = match ? decodeURIComponent(match[1]) : null;
  return value === "rw" || value === "en" ? value : null;
}

function getSnapshot(): Locale {
  return readLocaleCookie() ?? DEFAULT_LOCALE;
}

function writeLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
}

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  // The server renders with `initialLocale`; once the page is alive the
  // cookie takes over, so a language picked earlier is restored.
  const locale = useSyncExternalStore(subscribe, getSnapshot, () => initialLocale);

  const setLocale = useCallback((next: Locale) => {
    if (next === getSnapshot()) return;
    writeLocaleCookie(next);
    notify();
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t: dictionaries[locale] }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useI18n(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useI18n must be used within a LocaleProvider");
  }
  return context;
}
