import Footer from "@/components/layouts/Footer"
import Navbar from "@/components/layouts/Navbar"
import { ThemeProvider } from "@/components/layouts/ThemeProvider"
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

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Portfolio" />
      </head>
      <body>
        <Suspense>
          <div
            className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              {children}
              <Footer />
            </ThemeProvider>
          </div>
        </Suspense>
      </body>
    </html>
  )
}
