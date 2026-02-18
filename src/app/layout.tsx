import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Portfolio - Bagas Sambega",
  description: "Portfolio",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
    </>
  )
}
