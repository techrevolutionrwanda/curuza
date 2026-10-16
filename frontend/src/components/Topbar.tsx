"use client";

export function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-line bg-surface/90 px-8 py-4 backdrop-blur">
      {/* Search */}
      <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border-2 border-line bg-surface px-4 py-2.5">
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
          className="min-h-12 flex-1 border-0 bg-transparent outline-none"
          placeholder="Shakisha igicuruzwa cyangwa umukiriya…"
        />
      </label>

      {/* Sync toggle */}
      <button
        type="button"
        className="flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-semibold text-primary-dark"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-success" />
        <span>Byabitswe</span>
      </button>

      {/* New sale.
          The sale dialog itself is built by another developer, so this button
          intentionally has no click handler yet. */}
      <button
        type="button"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-5 font-extrabold text-[#3A2A00] transition hover:brightness-95"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>Gurisha</span>
      </button>

      {/* User */}
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft font-extrabold text-primary-dark">
          MU
        </div>
        <div>
          <b className="block text-sm font-semibold text-ink">Mukamana</b>
          <small className="block text-xs text-ink-2">Nyiri duka · Owner</small>
        </div>
      </div>
    </header>
  );
}
