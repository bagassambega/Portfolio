"use client"

import type { ReactNode } from "react"

type ScrollToButtonProps = {
  targetId: string
  className?: string
  children: ReactNode
}

export default function ScrollToButton({
  targetId,
  className,
  children,
}: ScrollToButtonProps) {
  return (
    <button
      onClick={() =>
        document
          .getElementById(targetId)
          ?.scrollIntoView({ behavior: "smooth" })
      }
      className={className}
    >
      {children}
    </button>
  )
}
