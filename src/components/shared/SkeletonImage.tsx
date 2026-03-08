"use client"

import { useState } from "react"
import NextImage, { type ImageProps } from "next/image"
import { cn } from "@/lib/utils"

type Props = ImageProps & {
  /**
   * Extra classes applied to the wrapper div.
   * For `fill` images the wrapper is already `absolute inset-0`;
   * for width/height images it is `relative block`.
   */
  containerClassName?: string
}

/**
 * Drop-in replacement for next/image that shows an animated skeleton
 * while the image is loading, then cross-fades to the real image.
 *
 * Works for both `fill` and explicit `width`/`height` variants.
 * The skeleton always sits as an `absolute inset-0` overlay inside
 * the wrapper, so the parent's layout is never affected.
 */
export default function SkeletonImage({
  className,
  containerClassName,
  onLoad,
  ...props
}: Props) {
  const [loaded, setLoaded] = useState(false)

  const handleLoad: ImageProps["onLoad"] = (e) => {
    setLoaded(true)
    onLoad?.(e)
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        // For fill images: become the positioned ancestor that fill measures against
        props.fill ? "absolute inset-0" : "block",
        containerClassName
      )}
    >
      {/* Skeleton shimmer — hidden once image loads */}
      {!loaded && (
        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      )}

      <NextImage
        {...props}
        className={cn(
          "transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={handleLoad}
      />
    </div>
  )
}
