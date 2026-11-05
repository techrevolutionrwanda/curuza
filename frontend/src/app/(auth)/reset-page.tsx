"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ResetPage() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    if (!token) {
      // No token, redirect to login
    }
  }, [token]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword: password, confirmPassword: confirm }),
          credentials: "include",
        }
      );
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || "Unable to reset password.");
      setSuccess(true);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to reset your password."
      );
    }
  }

  if (!token) {
    return (
      <div>
        <h1>Password Reset</h1>
        <p>Invalid or missing reset token.</p>
        <a href="/login">Go to login</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      {error && (
        <p role="alert" className="text-sm text-danger">{error}</p>
      )}

      {success && (
        <p className="text-sm text-success">Your password has been reset. You can now log in.</p>
      )}

      <div>
        <label className="block text-sm font-medium text-ink-2">
          New password
        </label>
        <input
          type="password"
          name="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="flex min-w-0 flex-1 rounded-panel border border-line bg-surface px-3.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-2">
          Confirm password
        </label>
        <input
          type="password"
          name="confirm"
          placeholder="Repeat password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="flex min-w-0 flex-1 rounded-panel border border-line bg-surface px-3.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <button
        type="submit"
        disabled={success}
        className="w-full rounded-panel bg-primary text-[15px] font-bold text-white"
      >
        {success ? "Success!" : "Reset password"}
      </button>

      <div className="text-center text-sm text-ink-3">
        <a href="/login">Already have an account? Log in</a>
      </div>
    </form>
  );
}