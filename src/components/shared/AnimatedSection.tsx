"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface Props {
  children: ReactNode
  /** stagger delay in milliseconds */
  delay?: number
  className?: string
}

/**
 * Wraps children in a div that slides up and fades in when it enters the viewport.
 */
export default function AnimatedSection({
  children,
  delay = 0,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.style.transitionDelay = `${delay}ms`
          node.classList.remove("opacity-0", "translate-y-5")
          node.classList.add("opacity-100", "translate-y-0")
          observer.unobserve(node)
        }
      },
      { threshold: 0.05 }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={cn(
        "opacity-0 translate-y-5 transition-[opacity,transform] duration-700 ease-out",
        className
      )}
    >
      {children}
    </div>
  )
}
