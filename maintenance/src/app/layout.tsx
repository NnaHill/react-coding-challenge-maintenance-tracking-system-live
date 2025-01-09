import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maintenance App",
  description: "Equipment maintenance management application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="bg-gray-800 text-white p-4">
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link href="/maintenance-record-form" className="hover:text-gray-300">
                Maintenance Record Form
              </Link>
            </li>
            <li>
              <Link href="/equipment-form" className="hover:text-gray-300">
                Equipment Form
              </Link>
            </li>
          </ul>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}