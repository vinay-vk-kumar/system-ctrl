import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Server Health | Monitor",
  description: "Developer-centric server health monitoring dashboard",
};

import { Sidebar } from "@/components/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${jetbrainsMono.variable} font-mono antialiased bg-background text-foreground h-screen overflow-hidden selection:bg-neon-green/30`}
      >
        <div className="absolute inset-0 scanline pointer-events-none z-50 opacity-10" />
        <Sidebar />
        <main className="pl-16 h-full overflow-y-auto w-full relative z-10 transition-all duration-300">
          <div className="p-6 min-h-full max-w-7xl mx-auto flex flex-col gap-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
