"use client"

import type { ImageProps } from "next/image"
import { Maximize2 } from "lucide-react"
import { useState } from "react"
import SkeletonImage from "@/components/shared/SkeletonImage"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type MediaPreviewProps = ImageProps & {
  containerClassName?: string
  previewClassName?: string
  previewTitle?: string
}

function toNumber(value: ImageProps["width"] | ImageProps["height"]) {
  if (typeof value === "number") return value
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  return undefined
}

export default function MediaPreview({
  alt,
  className,
  containerClassName,
  previewClassName,
  previewTitle,
  src,
  width,
  height,
  ...props
}: MediaPreviewProps) {
  const [open, setOpen] = useState(false)
  const previewWidth = toNumber(width) ?? 1920
  const previewHeight = toNumber(height) ?? 1080
  const title = previewTitle || alt || "Image preview"

  return (
    <>
      <div
        className={cn(
          "group/media-preview relative",
          props.fill ? "absolute inset-0" : "block",
          containerClassName
        )}
      >
        <SkeletonImage
          {...props}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
        />
        <button
          type="button"
          aria-label={`Preview ${alt || "image"}`}
          className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-zinc-950/70 text-white opacity-0 shadow-lg backdrop-blur transition duration-200 hover:scale-105 hover:bg-zinc-950 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 group-hover/media-preview:opacity-100"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            setOpen(true)
          }}
        >
          <Maximize2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[calc(100vh-2rem)] max-w-[min(96vw,1200px)] overflow-hidden border-zinc-200 bg-zinc-950/95 p-3 shadow-2xl dark:border-zinc-800 [&_[data-slot=dialog-close]]:text-white">
          <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex max-h-[calc(100vh-4.5rem)] items-center justify-center overflow-auto rounded-md bg-zinc-950">
            <SkeletonImage
              src={src}
              alt={alt}
              width={previewWidth}
              height={previewHeight}
              unoptimized={props.unoptimized}
              className={cn(
                "h-auto max-h-[calc(100vh-5rem)] w-auto max-w-full object-contain",
                previewClassName
              )}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
