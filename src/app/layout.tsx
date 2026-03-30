import type { Metadata } from "next";
import { Inter, Poppins, Noto_Sans_Bengali, Amaranth } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

const amaranth = Amaranth({
  variable: "--font-amaranth",
  subsets: ["latin"],
  weight: ["400", "700"],
});

import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Mohishaban M Alim Madrasah",
  description: "A premium, interactive school management system for Mohishaban M Alim Madrasah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${inter.variable} ${poppins.variable} ${notoSansBengali.variable} ${amaranth.variable} antialiased bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 w-full relative">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
