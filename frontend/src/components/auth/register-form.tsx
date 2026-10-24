"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { startSession } from "@/lib/session";
import { authLinkCls } from "./auth-shell";
import { AuthInput, PasswordField } from "./auth-fields";

/**
 * The registration form from templates/register.html.
 *
 * Client-side checks only for now (password length, match, terms) —
 * there is no auth API in the backend yet.
 */
export function RegisterForm() {
  const [error, setError] = useState("");
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    // Never submit anywhere until the backend exposes an auth API.
    e.preventDefault();

    const f = e.currentTarget;
    const terms = f.elements.namedItem("terms") as HTMLInputElement;

    if (f.password.value.length < 8) {
      setError("Password must be at least 8 characters.");
    } else if (f.password.value !== f.confirm.value) {
      setError("Passwords do not match.");
    } else if (!terms.checked) {
      setError("Please accept the terms to continue.");
    } else if (!f.checkValidity()) {
      setError("Please fill in all required fields.");
    } else {
      setError("");
      // TODO: create the account via the auth API once it exists.
      startSession();
      router.push("/home");
    }
  }

  return (
    <form id="register-form" noValidate onSubmit={handleSubmit}>
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
          htmlFor="business"
          className="mb-1.5 block text-[13px] font-semibold text-ink-2"
        >
          Business name
        </label>
        <AuthInput
          id="business"
          name="business"
          type="text"
          autoComplete="organization"
          placeholder="e.g. Mama Keza Shop"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="fullname"
          className="mb-1.5 block text-[13px] font-semibold text-ink-2"
        >
          Your full name
        </label>
        <AuthInput
          id="fullname"
          name="fullname"
          type="text"
          autoComplete="name"
          placeholder="e.g. Keza Uwase"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3.5 max-[480px]:grid-cols-1 max-[480px]:gap-0">
        <div className="mb-4">
          <label
            htmlFor="phone"
            className="mb-1.5 block text-[13px] font-semibold text-ink-2"
          >
            Phone
          </label>
          <AuthInput
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="0788 000 000"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-1.5 block text-[13px] font-semibold text-ink-2"
          >
            Email{" "}
            <span className="font-medium text-ink-3">(optional)</span>
          </label>
          <AuthInput
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3.5 max-[480px]:grid-cols-1 max-[480px]:gap-0">
        <div className="mb-4">
          <label
            htmlFor="pw1"
            className="mb-1.5 block text-[13px] font-semibold text-ink-2"
          >
            Password
          </label>
          <PasswordField
            id="pw1"
            name="password"
            autoComplete="new-password"
            minLength={8}
            placeholder="At least 8 characters"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="pw2"
            className="mb-1.5 block text-[13px] font-semibold text-ink-2"
          >
            Confirm password
          </label>
          <PasswordField
            id="pw2"
            name="confirm"
            autoComplete="new-password"
            placeholder="Repeat password"
            required
          />
        </div>
      </div>

      <label className="mb-[22px] mt-1.5 flex cursor-pointer items-start gap-2.5 text-[13px] font-medium leading-[1.45] text-ink-2">
        <input
          type="checkbox"
          name="terms"
          required
          className="mt-px h-[17px] w-[17px] flex-none accent-primary"
        />
        <span>
          I agree to the{" "}
          <a href="#" className={authLinkCls}>
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="#" className={authLinkCls}>
            Privacy Policy
          </a>
          .
        </span>
      </label>

      <button
        type="submit"
        className="flex h-[50px] w-full items-center justify-center rounded-panel bg-primary text-[15px] font-bold text-white transition hover:bg-primary-dark active:translate-y-px focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Create account
      </button>
    </form>
  );
}
