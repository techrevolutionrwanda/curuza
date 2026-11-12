"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useBusinessName } from "@/lib/business-store";
import { useI18n, type Dictionary } from "@/i18n/locale-provider";

type NavItem = {
  href: string;
  /** Key of the label in the dictionary, so the nav can be translated. */
  labelKey: keyof Dictionary["nav"];
  icon: ReactNode;
  /** Shown as a small count badge on the right of the item. */
  badge?: number;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/home",
    labelKey: "home",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z" />
      </svg>
    ),
  },
  {
    href: "/sales",
    labelKey: "sales",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h5" />
      </svg>
    ),
  },
  {
    href: "/stock",
    labelKey: "stock",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8" />
      </svg>
    ),
  },
  {
    href: "/debtors",
    labelKey: "debtors",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" />
      </svg>
    ),
  },
  {
    href: "/reports",
    labelKey: "reports",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </svg>
    ),
  },
  {
    href: "/ai",
    labelKey: "ai",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 3l1.9 4.6 4.6 1.9-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
        <path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" />
      </svg>
    ),
  },
  // settings
  {
    href: "/settings",
    labelKey: "settings",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.51-1H7a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 9 13.6a1.65 1.65 0 0 0 .33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H15a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 19.4 9z" />
      </svg>
    ),
  },
];

/** The four destinations that stay in the mobile tab bar. */
const PRIMARY_HREFS = new Set(["/home", "/sales", "/stock", "/debtors"]);

const PRIMARY_ITEMS = NAV_ITEMS.filter((item) => PRIMARY_HREFS.has(item.href));
const MORE_ITEMS = NAV_ITEMS.filter((item) => !PRIMARY_HREFS.has(item.href));

const MORE_ICON = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M5 12h.01M12 12h.01M19 12h.01" />
  </svg>
);

export function Sidebar({ lowStockCount }: { lowStockCount: number }) {
  const pathname = usePathname();
  const businessName = useBusinessName();
  const { t } = useI18n();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  // Lock the page behind the mobile menu and let Escape close it.
  useEffect(() => {
    if (!moreOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [moreOpen]);

  const closeMore = () => {
    setMoreOpen(false);
    moreButtonRef.current?.focus();
  };

  const renderItem = (item: NavItem) => {
    const active = pathname === item.href;
    const badge = item.href === "/stock" ? lowStockCount : item.badge;

    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={[
          "sidebar-nav-item flex min-h-12 items-center gap-3 rounded-[14px] px-[14px] text-sm font-semibold",
          active
            ? "bg-primary-soft text-primary-dark"
            : "text-ink-2 hover:bg-bg",
        ].join(" ")}
      >
        {item.icon}
        <span>{t.nav[item.labelKey]}</span>
        {badge !== undefined && badge > 0 && (
          <span className="sidebar-pill ml-auto rounded-pill bg-danger px-2 py-0.5 text-xs font-extrabold text-white">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  const moreActive =
    moreOpen || MORE_ITEMS.some((item) => item.href === pathname);

  return (
    <aside className="side sticky top-0 flex h-full flex-col gap-1.5 border-r border-line bg-surface px-[14px] py-5">
      {/* Brand */}
      <div className="sidebar-brand flex items-center gap-3 px-2 pt-1 pb-[18px]">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 120 120"
            role="img"
            aria-label="Curuza symbol"
          >
            <title>Curuza symbol</title>
            <path
              d="M93.7 31.7 A44 44 0 1 0 93.7 88.3"
              fill="none"
              stroke="#0d6c54"
              strokeWidth={16}
              strokeLinecap="round"
            />
            <circle cx="96" cy="60" r="13" fill="#f4b122" />
          </svg>
        </div>
        <div>
          <b className="block text-lg font-bold text-ink">CURUZA</b>
          <small className="mt-1 block text-xs text-ink-2">
            {businessName}
          </small>
        </div>
      </div>

      {/* Desktop navigation */}
      <nav
        className="sidebar-nav sidebar-nav-desktop flex flex-col gap-2"
        aria-label={t.nav.menu}
      >
        {NAV_ITEMS.map(renderItem)}
      </nav>

      {/* Mobile tab bar: four primary destinations plus the rest behind "More". */}
      <nav
        className="sidebar-nav sidebar-nav-mobile"
        aria-label={t.nav.menu}
      >
        {PRIMARY_ITEMS.map(renderItem)}
        <button
          type="button"
          ref={moreButtonRef}
          aria-expanded={moreOpen}
          aria-controls="sidebar-more"
          aria-haspopup="dialog"
          onClick={() => setMoreOpen((open) => !open)}
          className={[
            "sidebar-nav-item flex min-h-12 items-center gap-3 rounded-[14px] px-[14px] text-sm font-semibold",
            moreActive
              ? "bg-primary-soft text-primary-dark"
              : "text-ink-2 hover:bg-bg",
          ].join(" ")}
        >
          {MORE_ICON}
          <span>{t.nav.more}</span>
        </button>
      </nav>

      <div className="sidebar-spacer flex-1" aria-hidden="true" />

      {/* Promo */}
      <div className="sidebar-plan rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-4 text-white">
        <b className="block text-sm font-bold">Curuza</b>
        <span className="mt-1 block text-xs text-white/80">
          {t.nav.planDescription}
        </span>
        <button
          type="button"
          className="mt-3 inline-flex h-[40px] items-center justify-center gap-2 rounded-xl bg-accent px-5 font-extrabold text-[#3A2A00] hover:brightness-95"
        >
          {t.nav.planCta}
        </button>
      </div>

      {moreOpen && (
        <div
          className="sidebar-sheet-layer"
          role="presentation"
          onClick={closeMore}
        >
          <div
            id="sidebar-more"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sidebar-more-title"
            className="sidebar-sheet"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="sidebar-sheet-handle" aria-hidden="true" />
            <div className="sidebar-sheet-head">
              <h2 id="sidebar-more-title" className="sidebar-sheet-title">
                {t.nav.menu}
              </h2>
              <button
                type="button"
                className="sidebar-sheet-close"
                aria-label={t.nav.close}
                onClick={closeMore}
                autoFocus
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="sidebar-sheet-list">
              {MORE_ITEMS.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMore}
                    className={[
                      "sidebar-sheet-item",
                      active ? "is-active" : "",
                    ].join(" ")}
                  >
                    {item.icon}
                    <span>{t.nav[item.labelKey]}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
