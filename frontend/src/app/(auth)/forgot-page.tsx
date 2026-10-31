import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const identifier = String(form.identifier?.value ?? "");
    const email = String(form.email?.value ?? "");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier, email }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to process request.");
      setError(
        "If an account with that phone or email exists, a password reset link has been sent."
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to process your request."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      {error && (
        <p role="alert" className="text-sm text-danger">{error}</p>
      )}

      <div>
        <label htmlFor="identifier" className="block text-sm font-medium text-ink-2">
          Phone or email
        </label>
        <input
          id="identifier"
          name="identifier"
          type="text"
          placeholder="e.g. 0788 000 000"
          className="flex min-w-0 flex-1 rounded-panel border border-line bg-surface px-3.5 text-sm outline-none focus:border-primary"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink-2">
          Email (optional)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          className="flex min-w-0 flex-1 rounded-panel border border-line bg-surface px-3.5 text-sm outline-none focus:border-primary"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-panel bg-primary text-[15px] font-bold text-white"
      >
        Send reset link
      </button>

      <div className="text-center text-sm text-ink-3">
        <a href="/login">Back to login</a>
      </div>
    </form>
  );
}