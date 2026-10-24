/**
 * The Curuza symbol: the gold dot closing the green arc.
 * Same artwork as the one in the sidebar, sized by the caller.
 */
export function CuruzaLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label="Curuza logo"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M93.7 31.7 A44 44 0 1 0 93.7 88.3"
        fill="none"
        stroke="#0d6c54"
        strokeWidth={16}
        strokeLinecap="round"
      />
      <circle cx="96" cy="60" r="13" fill="#f4b122" />
    </svg>
  );
}
