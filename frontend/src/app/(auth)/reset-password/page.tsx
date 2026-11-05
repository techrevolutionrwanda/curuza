import type { Metadata } from "next";
import { Suspense } from "react";
import ResetPage from "../reset-page";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new password for your Curuza account.",
};

export default function Page() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <ResetPage />
    </Suspense>
  );
}
