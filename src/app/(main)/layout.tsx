import Footer from "@/components/layouts/Footer"
import Navbar from "@/components/layouts/Navbar"
import { ThemeProvider } from "@/components/layouts/ThemeProvider"
import { getSocialMedia } from "@/lib/services/api"
import { Geist, Geist_Mono, Inter } from "next/font/google"
import { Suspense, type ReactNode } from "react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: false,
})

export default async function MainLayout({
  children,
}: {
  children: ReactNode
}) {
  const socialMedia = (await getSocialMedia()) ?? []

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Portfolio" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
      >
        <Suspense>
          <div>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar socialMedia={socialMedia} />
              {children}
              <Footer />
            </ThemeProvider>
          </div>
        </Suspense>
      </body>
    </html>
  )
}
