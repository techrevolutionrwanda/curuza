"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { submitAuth } from "@/lib/auth";
import { authLinkCls } from "./auth-shell";
import { AuthInput, PasswordField } from "./auth-fields";

export function RegisterForm() {
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const password = String(formData.get("password") ?? "");
    const confirm = String(formData.get("confirm") ?? "");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
    } else if (password !== confirm) {
      setError("Passwords do not match.");
    } else if (!formData.has("terms")) {
      setError("Please accept the terms to continue.");
    } else if (!form.checkValidity()) {
      setError("Please fill in all required fields.");
    } else {
      setError("");
      setSubmitting(true);
      try {
        await submitAuth("register", {
          username: String(formData.get("fullname") ?? ""),
          businessName: String(formData.get("business") ?? ""),
          phone: String(formData.get("phone") ?? ""),
          email: String(formData.get("email") ?? ""),
          password,
        });
        router.replace("/login");
        router.refresh();
      } catch (cause) {
        setError(
          cause instanceof Error
            ? cause.message
            : "Unable to create your account. Please try again.",
        );
      } finally {
        setSubmitting(false);
      }
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
        disabled={submitting}
        className="flex h-[50px] w-full items-center justify-center rounded-panel bg-primary text-[15px] font-bold text-white transition hover:bg-primary-dark active:translate-y-px focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {submitting ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
