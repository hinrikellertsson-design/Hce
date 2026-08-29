import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Bókanir | Hótel og matvælaskólinn",
  description:
    "Bókaðu borð á æfingum Matreiðslu og framreiðsludeildar hjá Hótel og matvælaskólanum — hádegis- og kvöldverðir nemenda.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="is" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
