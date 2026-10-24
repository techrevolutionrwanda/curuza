import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell, authLinkCls } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account · Curuza",
  description:
    "Create your Curuza account and start recording sales, stock and debts today.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Tell us about you and your business to get started."
      brandLead="Set up your business in under a minute and start recording sales, stock and debts today."
      brandPoints={[
        "Free to get started",
        "Works on phone and computer",
        "Your data stays private",
      ]}
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className={authLinkCls}>
            Log in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
