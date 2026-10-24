import type { ReactNode } from "react";
import { CuruzaLogo } from "./curuza-logo";

/** Gold tick used in the brand panel bullet points. */
function Tick() {
  return (
    <span className="grid h-[26px] w-[26px] flex-none place-items-center rounded-full bg-accent text-[#3a2a00]">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}

type AuthShellProps = {
  /** Heading of the card (the h1). */
  title: string;
  /** Sentence under the heading. */
  subtitle: string;
  /** Lead paragraph in the brand panel. */
  brandLead: string;
  /** Bullet points under the lead; each gets a gold tick. */
  brandPoints: string[];
  /** Width of the card: 480px for register, 440px for login. */
  cardClassName?: string;
  /** Content of the last line, after the "or" divider. */
  footer?: ReactNode;
  children: ReactNode;
};

/**
 * Full-screen shell for the auth pages: gradient brand panel on the left,
 * centered card on the right (brand panel hidden below 900px, like the
 * HTML templates in /templates).
 */
export function AuthShell({
  title,
  subtitle,
  brandLead,
  brandPoints,
  cardClassName = "max-w-[480px]",
  footer,
  children,
}: AuthShellProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 min-[901px]:grid-cols-2">
      {/* Brand panel */}
      <aside className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden bg-gradient-to-br from-primary to-primary-dark p-14 text-white max-[900px]:hidden">
        {/* Decorative circles */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[90px] -top-[90px] h-[280px] w-[280px] rounded-full bg-accent opacity-[.18]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[50px] -left-[50px] h-[160px] w-[160px] rounded-full bg-accent opacity-[.14]"
        />

        <div className="relative z-10 flex flex-col gap-7">
          <div className="grid h-24 w-24 place-items-center rounded-card bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
            <CuruzaLogo className="h-full w-full" />
          </div>
          <div>
            <h2 className="m-0 text-[44px] font-extrabold leading-none tracking-[-1.5px]">
              Curuza
            </h2>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[.22em] text-accent">
              Ubucuruzi · Sell &amp; Trade
            </p>
          </div>
          <p className="m-0 max-w-[380px] text-[17px] leading-[1.55] text-white/[0.88]">
            {brandLead}
          </p>
          <ul className="m-0 grid list-none gap-3.5 p-0">
            {brandPoints.map((point) => (
              <li key={point} className="flex items-center gap-3 text-[15px] font-semibold">
                <Tick />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Form side */}
      <main className="flex items-center justify-center px-5 py-8 max-[900px]:items-start max-[900px]:px-4 max-[900px]:pt-6 max-[900px]:pb-10">
        <section
          aria-labelledby="auth-title"
          className={`animate-rise w-full rounded-card border border-line bg-surface p-9 shadow-card max-[900px]:px-5 max-[900px]:py-[26px] ${cardClassName}`}
        >
          {/* Small brand shown above the card on mobile */}
          <div className="mb-6 hidden items-center gap-3 max-[900px]:flex">
            <div className="grid h-[52px] w-[52px] place-items-center rounded-[14px] border border-line bg-white p-[7px]">
              <CuruzaLogo className="h-full w-full" />
            </div>
            <b className="text-[22px] font-extrabold tracking-[-.5px] text-primary-dark">
              Curuza
            </b>
          </div>

          <h1 id="auth-title" className="mb-1.5 text-[26px] font-extrabold tracking-[-.6px]">
            {title}
          </h1>
          <p className="mb-[26px] text-sm leading-[1.5] text-ink-2">{subtitle}</p>

          {children}

          <div className="my-[22px] flex items-center gap-3 text-xs text-ink-3">
            <span className="h-px flex-1 bg-line" />
            or
            <span className="h-px flex-1 bg-line" />
          </div>
          {footer ? (
            <p className="m-0 text-center text-sm text-ink-2">{footer}</p>
          ) : null}
        </section>
      </main>
    </div>
  );
}
