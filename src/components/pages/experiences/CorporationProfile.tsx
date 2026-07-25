"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
} from "react"
import { Building2, MapPin } from "lucide-react"
import RichTextRenderer from "@/components/shared/RichTextRenderer"
import SkeletonImage from "@/components/shared/SkeletonImage"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getOriginalImageUrl } from "@/lib/helpers"
import type { Corporation, Media } from "@/lib/types/payload-types"
import { cn } from "@/lib/utils"

const HOVER_DELAY_MS = 2000

function CorporationProfileContent({
  corporation,
  compact = false,
}: {
  corporation: Corporation
  compact?: boolean
}) {
  const logo = corporation.logo as Media | undefined
  const logoUrl = getOriginalImageUrl(logo)
  const location = [corporation.city, corporation.country]
    .filter(Boolean)
    .join(", ")

  return (
    <div className={cn("font-inter", compact ? "space-y-4" : "space-y-6")}>
      <div className="flex items-center gap-4 pr-6">
        <div
          className={cn(
            "relative shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700",
            compact ? "h-16 w-16" : "h-20 w-20 md:h-24 md:w-24"
          )}
        >
          {logoUrl ? (
            <SkeletonImage
              src={logoUrl}
              alt={logo?.alt || `${corporation.name} logo`}
              fill
              unoptimized
              sizes={compact ? "64px" : "(max-width: 768px) 80px, 96px"}
              className="object-contain p-2"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Building2
                className={cn(
                  "text-zinc-300 dark:text-zinc-600",
                  compact ? "h-8 w-8" : "h-10 w-10"
                )}
              />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h2
            className={cn(
              "font-bold leading-tight text-zinc-900 dark:text-zinc-50",
              compact ? "text-lg" : "text-xl md:text-2xl"
            )}
          >
            {corporation.name}
          </h2>
          {location && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{location}</span>
            </p>
          )}
        </div>
      </div>

      {corporation.description ? (
        <div
          className={cn(
            "border-t border-zinc-200 pt-4 leading-relaxed text-zinc-600 dark:border-zinc-800 dark:text-zinc-300 [&_p:last-child]:mb-0",
            compact ? "text-sm" : "text-sm md:text-base"
          )}
        >
          <RichTextRenderer content={corporation.description} />
        </div>
      ) : (
        <p className="border-t border-zinc-200 pt-4 text-sm italic text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          No company or organization description is available yet.
        </p>
      )}
    </div>
  )
}

export function CorporationDetailHeader({
  corporation,
  children,
}: {
  corporation: Corporation
  children: ReactNode
}) {
  const logo = corporation.logo as Media | undefined
  const logoUrl = getOriginalImageUrl(logo)

  return (
    <Dialog>
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
        <DialogTrigger asChild>
          <button
            type="button"
            className="group relative h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-3xl border border-zinc-100 bg-white p-4 shadow-sm outline-none transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-zinc-800 dark:focus-visible:ring-offset-zinc-950 md:h-32 md:w-32"
            aria-label={`View information about ${corporation.name}`}
          >
            {logoUrl ? (
              <SkeletonImage
                src={logoUrl}
                alt={logo?.alt || `${corporation.name} logo`}
                fill
                unoptimized
                sizes="(max-width: 768px) 96px, 128px"
                className="object-contain p-4 transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <Building2 className="mx-auto h-12 w-12 text-zinc-300 transition-colors group-hover:text-blue-400" />
            )}
          </button>
        </DialogTrigger>

        <div className="flex min-w-0 flex-col">
          <DialogTrigger asChild>
            <button
              type="button"
              className="mb-1 w-fit cursor-pointer rounded-sm text-left text-xl font-bold uppercase tracking-wider text-blue-500 outline-none transition-colors hover:text-blue-400 hover:underline hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
              aria-label={`View information about ${corporation.name}`}
            >
              {corporation.name}
            </button>
          </DialogTrigger>
          {children}
        </div>
      </div>

      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Company / Organization</DialogTitle>
        </DialogHeader>
        <CorporationProfileContent corporation={corporation} />
      </DialogContent>
    </Dialog>
  )
}

export function CorporationHoverPreview({
  corporation,
  children,
}: {
  corporation: Corporation
  children: ReactNode
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ left: 16, top: 96 })

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const positionFromTrigger = useCallback((trigger: HTMLElement) => {
    const root = rootRef.current
    if (!root) return

    const rootRect = root.getBoundingClientRect()
    const triggerRect = trigger.getBoundingClientRect()
    const previewWidth = Math.min(384, Math.max(280, rootRect.width - 16))
    const desiredLeft = triggerRect.left - rootRect.left
    const maxLeft = Math.max(8, rootRect.width - previewWidth - 8)

    setPosition({
      left: Math.min(Math.max(8, desiredLeft), maxLeft),
      top: triggerRect.bottom - rootRect.top + 10,
    })
  }, [])

  const startHoverTimer = useCallback(
    (trigger: HTMLElement) => {
      clearTimer()
      setIsOpen(false)
      positionFromTrigger(trigger)
      timerRef.current = setTimeout(() => {
        setIsOpen(true)
        timerRef.current = null
      }, HOVER_DELAY_MS)
    },
    [clearTimer, positionFromTrigger]
  )

  useEffect(() => {
    return clearTimer
  }, [clearTimer])

  const getTrigger = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return null

    return (
      target.closest<HTMLElement>("[data-corporation-preview-trigger]") ??
      target.querySelector<HTMLElement>("[data-corporation-preview-trigger]")
    )
  }

  const handlePointerOver = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return
    const trigger = getTrigger(event.target)
    if (!trigger || trigger.contains(event.relatedTarget as Node | null)) return
    startHoverTimer(trigger)
  }

  const handlePointerOut = (event: PointerEvent<HTMLDivElement>) => {
    const trigger = getTrigger(event.target)
    if (!trigger || trigger.contains(event.relatedTarget as Node | null)) return
    clearTimer()
    setIsOpen(false)
  }

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    const trigger = getTrigger(event.target)
    if (!trigger) return
    clearTimer()
    positionFromTrigger(trigger)
    setIsOpen(true)
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return
    clearTimer()
    setIsOpen(false)
  }

  return (
    <div
      ref={rootRef}
      className="relative w-full"
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          clearTimer()
          setIsOpen(false)
        }
      }}
    >
      {children}
      <div
        role="tooltip"
        aria-hidden={!isOpen}
        className={cn(
          "pointer-events-none absolute z-40 w-[min(24rem,calc(100%-1rem))] rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl shadow-zinc-950/15 transition duration-200 dark:border-zinc-700 dark:bg-zinc-900 dark:shadow-black/40",
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        )}
        style={{ left: position.left, top: position.top }}
      >
        <CorporationProfileContent corporation={corporation} compact />
      </div>
    </div>
  )
}
