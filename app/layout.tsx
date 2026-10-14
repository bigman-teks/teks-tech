import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const title = "Teks Tech — Tech That Works for You.";
const description = "Teks Tech builds websites, digital invitations, data solutions and practical digital tools for individuals, businesses and organizations.";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title, description,
  openGraph: { title, description, type: "website", siteName: "Teks Tech" },
  twitter: { card: "summary_large_image", title, description },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={`${inter.variable} ${grotesk.variable} ${mono.variable}`}><body>{children}</body></html>;
}
