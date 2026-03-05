"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { List, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { type TocItem } from "./TableOfContents"

interface Props {
  items: TocItem[]
}

const SWIPE_OPEN_THRESHOLD = 60 // px swiped right to open
const SWIPE_CLOSE_THRESHOLD = 60 // px swiped left to close
const EDGE_ZONE = 32 // px from left edge that counts as an open gesture

export default function TocDrawer({ items }: Props) {
  const [open, setOpen] = useState(false)

  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  // Swipe handlers
  const onTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }, [])

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current
      const deltaY = e.changedTouches[0].clientY - touchStartY.current

      // Ignore mostly-vertical swipes
      if (Math.abs(deltaY) > Math.abs(deltaX)) return

      if (
        !open &&
        deltaX > SWIPE_OPEN_THRESHOLD &&
        touchStartX.current <= EDGE_ZONE
      ) {
        setOpen(true)
      } else if (open && deltaX < -SWIPE_CLOSE_THRESHOLD) {
        setOpen(false)
      }
    },
    [open]
  )

  useEffect(() => {
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchend", onTouchEnd, { passive: true })
    return () => {
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchend", onTouchEnd)
    }
  }, [onTouchStart, onTouchEnd])

  if (!items.length) return null

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close table of contents" : "Open table of contents"}
        className={cn(
          "fixed top-4 left-4 z-40 xl:hidden",
          "flex items-center justify-center p-2 rounded-full",
          "bg-white dark:bg-gray-800",
          "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300",
          "transition-colors duration-200 active:scale-95"
        )}
      >
        {open ? <X size={20} /> : <List size={20} />}
      </button>

      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-40 xl:hidden bg-black/40 backdrop-blur-sm",
          "transition-opacity duration-300",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Table of contents"
        className={cn(
          "fixed top-0 left-0 h-full z-50 xl:hidden",
          "w-72 max-w-[85vw]",
          "bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800",
          "shadow-2xl flex flex-col",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            On this page
          </span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TOC links */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <ul className="space-y-0.5">
            {items.map((item) => (
              <DrawerLink
                key={item.id}
                item={item}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

// Internal link component that tracks active state
function DrawerLink({
  item,
  onNavigate,
}: {
  item: TocItem
  onNavigate: () => void
}) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = document.getElementById(item.id)
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "-10% 0% -55% 0%", threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [item.id])

  return (
    <li>
      <a
        href={`#${item.id}`}
        onClick={(e) => {
          e.preventDefault()
          onNavigate()
          // Small timeout so drawer closes before scroll fires
          setTimeout(() => {
            document
              .getElementById(item.id)
              ?.scrollIntoView({ behavior: "smooth", block: "start" })
          }, 200)
        }}
        className={cn(
          "block text-sm py-2 pl-3 border-l-2 transition-all duration-200 leading-snug",
          active
            ? "border-blue-500 text-blue-500 font-medium"
            : "border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-600"
        )}
      >
        {item.label}
      </a>
    </li>
  )
}
