/**
 * Maps Tailwind color class names to hex values.
 * Tailwind cannot resolve dynamic class names at build time,
 * so we use inline styles with actual hex values.
 */
const TAILWIND_COLORS: Record<string, string> = {
  "slate-50": "#f8fafc",
  "slate-100": "#f1f5f9",
  "slate-200": "#e2e8f0",
  "slate-300": "#cbd5e1",
  "slate-400": "#94a3b8",
  "slate-500": "#64748b",
  "gray-400": "#9ca3af",
  "gray-500": "#6b7280",
  "red-300": "#fca5a5",
  "red-400": "#f87171",
  "red-500": "#ef4444",
  "orange-300": "#fdba74",
  "orange-400": "#fb923c",
  "orange-500": "#f97316",
  "yellow-300": "#fde047",
  "yellow-400": "#facc15",
  "yellow-500": "#eab308",
  "green-300": "#86efac",
  "green-400": "#4ade80",
  "green-500": "#22c55e",
  "blue-300": "#93c5fd",
  "blue-400": "#60a5fa",
  "blue-500": "#3b82f6",
  "indigo-400": "#818cf8",
  "indigo-500": "#6366f1",
  "purple-400": "#a78bfa",
  "purple-500": "#8b5cf6",
  "pink-400": "#f472b6",
  "pink-500": "#ec4899",
}

interface ProjectTypeBadgeProps {
  name: string
  color: string
}

export default function ProjectTypeBadge({
  name,
  color,
}: ProjectTypeBadgeProps) {
  const bgHex = TAILWIND_COLORS[color] ?? "#6b7280"

  return (
    <span
      className="text-xs text-white font-medium px-2.5 py-1 rounded-full w-fit"
      style={{ backgroundColor: bgHex }}
    >
      {name}
    </span>
  )
}
