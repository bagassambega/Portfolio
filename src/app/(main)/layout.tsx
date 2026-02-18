import Footer from "@/components/layouts/Footer"
import Navbar from "@/components/layouts/Navbar"
import { ThemeProvider } from "@/components/layouts/ThemeProvider"
import { Geist, Geist_Mono } from "next/font/google"
import { ReactNode } from "react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
      </body>
    </html>
  )
}
