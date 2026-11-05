import type { Metadata } from "next";
import ForgotPage from "../forgot-page";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Request a password reset link for your Curuza account.",
};

export default function Page() {
  return <ForgotPage />;
}
