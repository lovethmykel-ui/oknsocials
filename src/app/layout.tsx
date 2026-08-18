import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OKN Social OS — Social Command Center",
  description:
    "Institutional-grade social operations, autonomous AI director, and multi-platform command center for the OKN ecosystem.",
  keywords: [
    "OKN",
    "OKNEXUS",
    "Social OS",
    "Command Center",
    "AI Social Director",
    "Web3",
    "Fintech",
  ],
  authors: [{ name: "OKN Core Systems" }],
  icons: {
    icon: "/assets/brand/OKN_logo_mark_transparent.png",
    apple: "/assets/brand/OKN_logo_mark_transparent.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full antialiased selection:bg-blue-600/30 selection:text-white`}
    >
      <body className="min-h-full flex flex-col bg-[#050609] text-slate-100 antialiased overflow-x-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
