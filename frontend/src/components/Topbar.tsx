"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/locale-provider";
import { fetchCurrentUser, logoutAuth, type AuthUser } from "@/lib/auth";
import { publishBusinessName } from "@/lib/business-store";

export function Topbar() {
  const { t } = useI18n();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetchCurrentUser(controller.signal)
      .then((currentUser) => {
        if (controller.signal.aborted) return;
        if (!currentUser) {
          router.replace("/");
          return;
        }
        setUser(currentUser);
        if (currentUser.businessName) publishBusinessName(currentUser.businessName);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("Unable to load account information.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingUser(false);
      });

    return () => controller.abort();
  }, [router]);

  async function handleLogout() {
    setError("");
    setLoggingOut(true);
    try {
      await logoutAuth();
      window.location.replace("/");
    } catch {
      setError("Unable to log out. Please try again.");
      setLoggingOut(false);
    }
  }

  const initials =
    user?.username
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "–";

  return (
    <header className="topbar sticky top-0 z-10 flex items-center gap-3.5 border-b border-line bg-bg/90 px-8 py-4 backdrop-blur">
      {/* Search */}
      <label className="topbar-search flex min-w-0 flex-1 items-center gap-2.5 rounded-[14px] border-[1.5px] border-line bg-surface px-[14px] min-h-12 focus-within:border-primary max-w-[460px]">
        <svg
          className="h-5 w-5 shrink-0 text-ink-3"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <input
          className="min-h-[46px] min-w-0 flex-1 border-0 bg-transparent outline-none"
          placeholder={t.topbar.search}
          aria-label={t.topbar.search}
        />
      </label>

      <button
        type="button"
        aria-label={t.topbar.newSale}
        onClick={() => router.push("/home?newSale=1")}
        className="topbar-new-sale inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-accent px-5 font-bold text-[#3A2A00] transition hover:brightness-95"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span className="topbar-gold-text">{t.topbar.newSale}</span>
      </button>

      <div className="topbar-actions flex items-center gap-2.5">
        <Link
          href="/settings"
          aria-label={t.nav.settings}
          title={t.nav.settings}
          className="topbar-user flex min-w-0 items-center gap-2.5 rounded-panel px-1 py-1 transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span
            aria-hidden="true"
            className="topbar-avatar grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[14px] bg-primary-soft font-extrabold text-primary-dark"
          >
            {loadingUser ? "…" : initials}
          </span>
          <span className="topbar-user-text min-w-0">
            <b className="block max-w-36 truncate text-sm font-semibold text-ink">
              {loadingUser ? "…" : user?.username}
            </b>
            <small className="block max-w-36 truncate text-xs text-ink-2">
              {user?.businessName || t.topbar.owner}
            </small>
          </span>
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          aria-label={t.topbar.logout}
          className="topbar-logout inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            className="topbar-logout-icon hidden"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5M21 12H9" />
          </svg>
          <span className="topbar-logout-text">
            {loggingOut ? t.topbar.loggingOut : t.topbar.logout}
          </span>
        </button>
      </div>
      {error ? (
        <span
          role="alert"
          className="topbar-error max-w-40 truncate text-xs font-medium text-danger"
        >
          {error}
        </span>
      ) : null}
    </header>
  );
}
