import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { ThemeProvider } from "@/components/layouts/ThemeProvider"
import { Inter } from "next/font/google"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: false,
})

export default function Unauthorized() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`bg-zinc-50 dark:bg-gray-950 ${inter.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen items-center justify-center font-inter">
            <div className="mx-auto max-w-2xl px-6 py-32 text-center">
              {/* 401 Text */}
              <div className="mb-8">
                <h1 className="text-9xl font-bold text-zinc-900 dark:text-zinc-50 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  401
                </h1>
                <div className="mt-4 h-1 w-24 bg-linear-to-r from-zinc-900 to-zinc-600 dark:from-zinc-50 dark:to-zinc-400 mx-auto rounded-full" />
              </div>

              {/* Error Message */}
              <div className="mb-12 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
                <h2 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
                  Not Authorized
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                  You don&apos;t have permission to access this page
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Link>
                </Button>
              </div>

              {/* Additional Help Text */}
              <div className="mt-16 animate-in fade-in duration-1000 delay-500">
                <p className="text-sm text-zinc-500 dark:text-zinc-500">
                  If you believe this is a mistake, please contact me
                </p>
              </div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
