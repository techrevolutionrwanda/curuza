"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { submitAuth } from "@/lib/auth";
import { authLinkCls } from "./auth-shell";
import { AuthInput, PasswordField } from "./auth-fields";

export function LoginForm() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    try {
      await submitAuth("login", {
        identifier: String(formData.get("identifier") ?? ""),
        password: String(formData.get("password") ?? ""),
      });
      router.replace("/home");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to log in. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error ? (
        <p
          role="alert"
          className="mb-4 rounded-panel bg-danger-soft px-3.5 py-2.5 text-[13px] font-semibold text-danger"
        >
          {error}
        </p>
      ) : null}
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
        <a href="/forgot-password" className={authLinkCls}>
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex h-[50px] w-full items-center justify-center rounded-panel bg-primary text-[15px] font-bold text-white transition hover:bg-primary-dark active:translate-y-px focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {submitting ? "Logging in…" : "Log in"}
      </button>
    </form>
  );
}
