"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

const EDGE_THRESHOLD = 96

function getScrollState() {
  const root = document.documentElement
  const scrollTop = window.scrollY || root.scrollTop
  const maxScrollTop = Math.max(0, root.scrollHeight - window.innerHeight)

  return {
    canScrollDown: maxScrollTop - scrollTop > EDGE_THRESHOLD,
    canScrollUp: scrollTop > EDGE_THRESHOLD,
  }
}

export default function DetailScrollControls() {
  const [scrollState, setScrollState] = useState({
    canScrollDown: false,
    canScrollUp: false,
  })

  useEffect(() => {
    const updateScrollState = () => setScrollState(getScrollState())

    updateScrollState()
    window.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)

    return () => {
      window.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [])

  const buttonClassName =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white/85 text-zinc-600 shadow-lg shadow-zinc-900/10 backdrop-blur transition-all duration-200 hover:cursor-pointer hover:border-blue-300 hover:text-blue-600 hover:shadow-blue-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:border-zinc-700 dark:bg-zinc-900/85 dark:text-zinc-300 dark:shadow-black/30 dark:hover:border-blue-500/50 dark:hover:text-blue-300"

  if (!scrollState.canScrollUp && !scrollState.canScrollDown) return null

  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2 md:bottom-6 md:right-6">
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          buttonClassName,
          scrollState.canScrollUp
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        )}
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        aria-label="Scroll to bottom"
        onClick={() =>
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          })
        }
        className={cn(
          buttonClassName,
          scrollState.canScrollDown
            ? "translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
