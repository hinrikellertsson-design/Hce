import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StaticContentProvider } from "@/lib/StaticContentContext";
import { AppShell } from "@/components/AppShell";
import { PinGate } from "@/components/PinGate";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hlíðin Lodge — Quality Manual",
  description: "Interactive operations checklist for Hlíðin Lodge housekeeping and hospitality staff.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <StaticContentProvider>
          <PinGate>
            <AppShell>{children}</AppShell>
          </PinGate>
        </StaticContentProvider>
      </body>
    </html>
  );
}
