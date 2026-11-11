import type { Metadata } from "next";
import { AiWorkspace } from "@/components/ai/ai-workspace";

export const metadata: Metadata = {
  title: "AI",
};

export default function AiPage() {
  return <AiWorkspace />;
}
