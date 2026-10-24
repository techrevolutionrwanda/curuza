"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { startSession } from "@/lib/session";
import { authLinkCls } from "./auth-shell";
import { AuthInput, PasswordField } from "./auth-fields";

/**
 * The login form from templates/login.html.
 *
 * No API call yet — the backend has no auth routes, so submitting starts
 * the placeholder session and continues to the dashboard.
 */
export function LoginForm() {
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    // TODO: verify the credentials against the auth API once it exists.
    e.preventDefault();
    startSession();
    router.push("/home");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="login-id"
          className="mb-1.5 block text-[13px] font-semibold text-ink-2"
        >
          Phone or email
        </label>
        <AuthInput
          id="login-id"
          name="identifier"
          type="text"
          autoComplete="username"
          placeholder="e.g. 0788 000 000"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="login-pw"
          className="mb-1.5 block text-[13px] font-semibold text-ink-2"
        >
          Password
        </label>
        <PasswordField
          id="login-pw"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
        />
      </div>

      <div className="mb-[22px] mt-1 flex items-center justify-between gap-3 text-[13px]">
        <label className="m-0 flex cursor-pointer items-center gap-2 font-medium text-ink-2">
          <input
            type="checkbox"
            name="remember"
            className="h-[17px] w-[17px] accent-primary"
          />
          Remember me
        </label>
        <a href="#" className={authLinkCls}>
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className="flex h-[50px] w-full items-center justify-center rounded-panel bg-primary text-[15px] font-bold text-white transition hover:bg-primary-dark active:translate-y-px focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Log in
      </button>
    </form>
  );
}
