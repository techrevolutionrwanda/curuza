import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell, authLinkCls } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Log in · Curuza",
  description: "Log in to Curuza to manage your business.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your business."
      brandLead="Keep your stock, sales and customer debts in one simple place, so your business grows every day."
      brandPoints={[
        "Track stock in real time",
        "Never forget who owes you",
        "See clear daily reports",
      ]}
      cardClassName="max-w-[440px]"
      footer={
        <>
          New to Curuza?{" "}
          <Link href="/register" className={authLinkCls}>
            Create an account
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
