"use client";

import { useState, type InputHTMLAttributes } from "react";

/** Field style shared by the login and register forms (from the templates). */
export const authInputCls =
  "h-12 w-full rounded-panel border-[1.5px] border-line bg-surface px-3.5 text-[15px] text-ink outline-none transition placeholder:text-ink-3 focus:border-primary focus:shadow-[0_0_0_4px_var(--color-primary-soft)]";

/** A plain text field with the auth styling. */
export function AuthInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${authInputCls} ${className ?? ""}`} />;
}

/** A password field with the Show / Hide toggle from the templates. */
export function PasswordField({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`${authInputCls} pr-[70px] ${className ?? ""}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 h-8 -translate-y-1/2 rounded-[10px] px-2.5 text-xs font-bold text-primary transition hover:bg-primary-soft focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
