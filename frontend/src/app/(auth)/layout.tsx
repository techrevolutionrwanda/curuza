/**
 * Auth routes (login, register) render full-screen without the app shell:
 * the root layout gives them html/body + i18n, AuthShell provides the
 * split-screen brand + form layout.
 */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return <>{children}</>;
}
