import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://unitcrate.com"),
  alternates: { canonical: "/" },
  title: {
    default: "UnitCrate — Unit Converters for Everything",
    template: "%s · UnitCrate",
  },
  description:
    "Fast, accurate unit converters for length, weight, temperature, volume, area, speed, time, data, and more. No signup. No ads. No limits.",
  keywords: ["unit converter", "length converter", "weight converter", "temperature converter", "unit conversion"],
  applicationName: "UnitCrate",
  authors: [{ name: "UnitCrate" }],
  openGraph: {
    type: "website",
    siteName: "UnitCrate",
    title: "UnitCrate — Unit Converters for Everything",
    description: "Fast, accurate unit converters. See all units at once.",
    url: "https://unitcrate.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "UnitCrate — Unit Converters for Everything",
    description: "Fast, accurate unit converters. See all units at once.",
  },
  robots: { index: true, follow: true },
};

// Static hardcoded string — no user input, no XSS risk
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})()` as const;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
