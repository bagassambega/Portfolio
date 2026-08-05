import { Code } from "lucide-react"

import { cn } from "@/lib/utils"
import type { Techstack } from "@/lib/types/payload-types"

type TechStackLogoColor = NonNullable<Techstack["logoColor"]>

const logoColorClasses: Record<TechStackLogoColor, string> = {
  neutral: "",
  black: "bg-zinc-100 dark:bg-zinc-100",
  white: "bg-zinc-800/50 dark:bg-zinc-800/50",
}

export default function TechStackPill({ tech }: { tech: Techstack }) {
  const logoColor = tech.logoColor ?? "neutral"

  return (
    <div
      className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:cursor-pointer hover:bg-zinc-200 dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      {tech.logo ? (
        <div
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded p-0.5 [&>svg]:h-full [&>svg]:w-full",
            logoColorClasses[logoColor]
          )}
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
