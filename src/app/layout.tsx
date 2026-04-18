import type { Metadata } from "next";
import { Newsreader, Public_Sans } from "next/font/google";

import { AdminProvider } from "@/components/admin/admin-context";

import "./globals.css";

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500", "600", "700"],
});

const sans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
});

export const metadata: Metadata = {
  title: "RHT-NAV: Rural Health Transformation Navigator",
  description:
    "State decision framework for sequencing technology-enabled rural health investments under the Rural Health Transformation Program.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable}`}>
        <AdminProvider>
          {children}
        </AdminProvider>
      </body>
    </html>
  );
}
