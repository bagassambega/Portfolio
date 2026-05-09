"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ThemeToggleProps = {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn("group relative cursor-pointer rounded-full", className)}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
      <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-md bg-zinc-800 dark:bg-zinc-200 px-2 py-1 text-xs text-white dark:text-zinc-900 opacity-0 transition-all group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 font-medium hidden md:block">
        Toggle theme
      </span>
    </Button>
  )
}
