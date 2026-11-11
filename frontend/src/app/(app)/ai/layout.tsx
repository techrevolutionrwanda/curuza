import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./ai.css";

// The AI screens use the same two display faces as the hi-fi template.
// Inter comes from the root layout, so only these two are loaded here.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export default function AiLayout({ children }: LayoutProps<"/ai">) {
  return (
    <div className={`${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
      {children}
    </div>
  );
}
