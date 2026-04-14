"use client"

import { cn } from "@/lib/utils"
import { Contact } from "lucide-react"
import { Button } from "../ui/button"
import { useEffect, useRef, useState } from "react"
import type { SocialMedia } from "@/lib/types/payload-types"

type SocMedBarProps = {
  className?: string
  socialMedia: (Pick<SocialMedia, "id" | "name" | "url" | "logo"> & {
    username?: string | null
  })[]
}

function normalizeSocialUrl(url?: string | null): string {
  if (!url) return "#"
  if (/^(https?:)?\/\//i.test(url) || /^(mailto:|tel:)/i.test(url)) {
    return url
  }
  return `https://${url}`
}

export default function SocMedBar({ className, socialMedia }: SocMedBarProps) {
  const [isActive, setIsActive] = useState<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsActive(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsActive(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="ghost"
        size="icon"
        className={cn("cursor-pointer rounded-full", className)}
        onClick={() => setIsActive((prev) => !prev)}
        aria-label="Toggle social media"
        aria-expanded={isActive}
        aria-haspopup="menu"
        disabled={socialMedia.length === 0}
      >
        <Contact className="h-5 w-5" />
      </Button>

      {isActive && socialMedia.length > 0 && (
        <div className="absolute top-full right-0 mt-2 z-50 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg p-2">
          <div className="flex flex-col md:flex-row items-center gap-2">
            {socialMedia.map((item) => (
              <a
                key={item.id}
                href={normalizeSocialUrl(item.url)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.name}${item.username ? ` (${item.username})` : ""}`}
                title={item.username || item.name}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full dark:text-gray-400 text-gray-500 dark:hover:text-gray-200 hover:text-gray-700 dark:hover:bg-gray-700 hover:bg-gray-100 transition-colors duration-300"
              >
                <span
                  className="inline-flex h-4 w-4 items-center justify-center [&_svg]:h-4 [&_svg]:w-4 [&_svg]:block"
                  dangerouslySetInnerHTML={{ __html: item.logo }}
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
