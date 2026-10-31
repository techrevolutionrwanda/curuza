/**
 * Auth routes (login, register, forgot password, reset password) render
 * full-screen without the app shell: the root layout gives them html/body + i18n,
 * AuthShell provides the split-screen brand + form layout.
 */
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}