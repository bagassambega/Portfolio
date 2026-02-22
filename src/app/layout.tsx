import type { Metadata } from "next"
import { Suspense } from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"
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
  return (
    <>
      <Suspense>
        {children}
        <Analytics />
        <SpeedInsights />
      </Suspense>
    </>
  )
}
