import { Code } from "lucide-react"

import { cn } from "@/lib/utils"
import type { Techstack } from "@/lib/types/payload-types"

type TechStackLogoColor = NonNullable<Techstack["logoColor"]>

const logoColorClasses: Record<TechStackLogoColor, string> = {
  neutral:
    "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:border-zinc-700/50",
  black:
    "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100 dark:border-zinc-200",
  white:
    "bg-zinc-950 text-white hover:bg-black dark:bg-zinc-950 dark:text-white dark:hover:bg-black dark:border-zinc-700",
}

export default function TechStackPill({ tech }: { tech: Techstack }) {
  const logoColor = tech.logoColor ?? "neutral"

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium transition-colors hover:cursor-pointer",
        logoColorClasses[logoColor]
      )}
    >
      {tech.logo ? (
        <div
          className="flex h-4 w-4 items-center justify-center [&>svg]:h-full [&>svg]:w-full"
          dangerouslySetInnerHTML={{ __html: tech.logo }}
        />
      ) : (
        <Code className="h-4 w-4" />
      )}
      {tech.url ? (
        <a
          href={tech.url}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-blue-500"
        >
          {tech.name}
        </a>
      ) : (
        <span>{tech.name}</span>
      )}
    </div>
  )
}
