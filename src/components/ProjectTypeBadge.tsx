import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      color: {
        slate:
          "bg-slate-100 text-slate-800 dark:bg-slate-800/80 dark:text-slate-300 ring-1 ring-inset ring-slate-500/20",
        gray: "bg-gray-100 text-gray-800 dark:bg-gray-800/80 dark:text-gray-300 ring-1 ring-inset ring-gray-500/20",
        red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 ring-1 ring-inset ring-red-600/20",
        orange:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 ring-1 ring-inset ring-orange-600/20",
        amber:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 ring-1 ring-inset ring-amber-600/20",
        yellow:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 ring-1 ring-inset ring-yellow-600/20",
        green:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 ring-1 ring-inset ring-green-600/20",
        emerald:
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 ring-1 ring-inset ring-emerald-600/20",
        teal: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 ring-1 ring-inset ring-teal-600/20",
        cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 ring-1 ring-inset ring-cyan-600/20",
        blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-inset ring-blue-600/20",
        indigo:
          "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 ring-1 ring-inset ring-indigo-600/20",
        violet:
          "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 ring-1 ring-inset ring-violet-600/20",
        purple:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 ring-1 ring-inset ring-purple-600/20",
        fuchsia:
          "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 ring-1 ring-inset ring-fuchsia-600/20",
        pink: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 ring-1 ring-inset ring-pink-600/20",
        rose: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 ring-1 ring-inset ring-rose-600/20",
      },
    },
    defaultVariants: {
      color: "slate",
    },
  }
)

const VALID_COLORS = [
  "slate",
  "gray",
  "red",
  "orange",
  "amber",
  "yellow",
  "green",
  "emerald",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const

type ValidColor = (typeof VALID_COLORS)[number]

export interface ProjectTypeBadgeProps {
  className?: string
  name: string
  color?: string | null
}

export default function ProjectTypeBadge({
  className,
  name,
  color,
}: ProjectTypeBadgeProps) {
  const colorStr = typeof color === "string" ? color : "slate"
  const isValidColor = VALID_COLORS.includes(colorStr as ValidColor)
  const validColor: ValidColor = isValidColor
    ? (colorStr as ValidColor)
    : "slate"

  return (
    <span
      className={cn(badgeVariants({ color: validColor || "slate" }), className)}
    >
      {name}
    </span>
  )
}
