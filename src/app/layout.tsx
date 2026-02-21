import type { Metadata } from "next"
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    template: "%s | Bagas Sambega",
    default: "Portfolio | Bagas Sambega",
  },
  description: "Portfolio",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>
  {children}
  <Analytics />
  <SpeedInsights />
  </>
}
