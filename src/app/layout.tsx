import type { Metadata } from "next";
import { Inter, Poppins, Noto_Sans_Bengali } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Premium School Management System",
  description: "A dark-modern, interactive school management system inspired by coderVai.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${poppins.variable} ${notoSansBengali.variable} antialiased bg-background text-foreground min-h-screen flex flex-col pt-20`}
      >
        <Navbar />
        <main className="flex-1 w-full relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
