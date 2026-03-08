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
  description: "Bagas Sambega's Personal Web Portfolio",
  applicationName: "Portfolio",
  authors: [
    {
      name: "Bagas Sambega Rosyada",
      url: "bagassambega@gmail.com"
    },
    {
      name: "Bagas Sambega Rosyada",
      url: "bagassambega.dev@gmail.com"
    },
  ]
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
