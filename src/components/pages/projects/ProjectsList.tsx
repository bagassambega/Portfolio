"use client"

import Link from "next/link"
import SkeletonImage from "@/components/shared/SkeletonImage"
import { Card, CardContent } from "@/components/ui/card"
import { getImageUrl } from "@/lib/helpers"
import ProjectTypeBadge from "@/components/pages/projects/ProjectTypeBadge"
import type { ProjectListItem } from "@/lib/services/api"
import type { Techstack } from "@/lib/types/payload-types"
import { cn } from "@/lib/utils"
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

type SortKey = "starting_date" | "title" | "end_date" | "duration"
type SortDirection = "asc" | "desc"
type OpenPanel = "sort" | "filter" | null
type PageItem = number | "ellipsis"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "starting_date", label: "Start date" },
  { value: "title", label: "Title" },
  { value: "end_date", label: "Finish date" },
  { value: "duration", label: "Duration" },
]
const PAGE_SIZE_OPTIONS = [5, 10, 25] as const

function isTechstack(value: unknown): value is Techstack {
  return typeof value === "object" && value !== null && "id" in value
}

function getProjectTechstacks(project: ProjectListItem) {
  return (project.techstack ?? []).filter(isTechstack)
}

function getDateTime(value?: string | null) {
  return value ? new Date(value).getTime() : Number.POSITIVE_INFINITY
}

function getDuration(project: ProjectListItem) {
  const start = new Date(project.starting_date).getTime()
  const end = project.end_date ? new Date(project.end_date).getTime() : Date.now()
  return end - start
}

function getRichTextPlainText(content: ProjectListItem["highlighted-description"]) {
  const fragments: string[] = []

  function visit(node: unknown) {
    if (!node || typeof node !== "object") return
    const record = node as {
      text?: unknown
      children?: unknown
    }

    if (typeof record.text === "string") {
      fragments.push(record.text)
    }

    if (Array.isArray(record.children)) {
      record.children.forEach(visit)
    }
  }

  visit(content?.root)
  return fragments.join(" ").replace(/\s+/g, " ").trim()
}

function getPaginationItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 10) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const firstPages = [1, 2, 3, 4]
  const lastPages = Array.from(
    { length: 4 },
    (_, index) => totalPages - 3 + index
  )

  if (currentPage <= 5) {
    return [1, 2, 3, 4, 5, "ellipsis", ...lastPages]
  }

  if (currentPage >= totalPages - 4) {
    return [...firstPages, "ellipsis", totalPages - 4, ...lastPages]
  }

  return [...firstPages, "ellipsis", currentPage, "ellipsis", ...lastPages]
}

export default function ProjectsList({
  projects,
}: {
  projects: ProjectListItem[]
}) {
  const [sortKey, setSortKey] = useState<SortKey>("starting_date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [selectedTechIds, setSelectedTechIds] = useState<number[]>([])
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null)
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(
    25
  )
  const [currentPage, setCurrentPage] = useState(1)
  const controlsRef = useRef<HTMLDivElement>(null)

  const techOptions = useMemo(() => {
    const options = new Map<number, Techstack>()

    projects.forEach((project) => {
      getProjectTechstacks(project).forEach((tech) => {
        options.set(tech.id, tech)
      })
    })

    return Array.from(options.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
  }, [projects])

  const selectedTechSet = useMemo(
    () => new Set(selectedTechIds),
    [selectedTechIds]
  )
  const hasActiveControls =
    sortKey !== "starting_date" ||
    sortDirection !== "desc" ||
    selectedTechIds.length > 0

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        controlsRef.current &&
        !controlsRef.current.contains(event.target as Node)
      ) {
        setOpenPanel(null)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenPanel(null)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const displayedProjects = useMemo(() => {
    return projects
      .filter((project) => {
        if (selectedTechSet.size === 0) return true

        return getProjectTechstacks(project).some((tech) =>
          selectedTechSet.has(tech.id)
        )
      })
      .map((project, index) => ({ project, index }))
      .sort((a, b) => {
        let comparison = 0

        if (sortKey === "title") {
          comparison = a.project.title.localeCompare(b.project.title)
        } else if (sortKey === "starting_date") {
          comparison =
            getDateTime(a.project.starting_date) -
            getDateTime(b.project.starting_date)
        } else if (sortKey === "end_date") {
          comparison =
            getDateTime(a.project.end_date) - getDateTime(b.project.end_date)
        } else {
          comparison = getDuration(a.project) - getDuration(b.project)
        }

        if (comparison === 0) comparison = a.index - b.index
        return sortDirection === "asc" ? comparison : -comparison
      })
      .map(({ project }) => project)
  }, [projects, selectedTechSet, sortDirection, sortKey])

  const totalPages = Math.max(1, Math.ceil(displayedProjects.length / pageSize))
  const effectiveCurrentPage = Math.min(currentPage, totalPages)
  const paginatedProjects = useMemo(() => {
    const start = (effectiveCurrentPage - 1) * pageSize
    return displayedProjects.slice(start, start + pageSize)
  }, [displayedProjects, effectiveCurrentPage, pageSize])
  const paginationItems = useMemo(
    () => getPaginationItems(effectiveCurrentPage, totalPages),
    [effectiveCurrentPage, totalPages]
  )
  const pageStart =
    displayedProjects.length === 0
      ? 0
      : (effectiveCurrentPage - 1) * pageSize + 1
  const pageEnd = Math.min(
    effectiveCurrentPage * pageSize,
    displayedProjects.length
  )

  const toggleTech = (techId: number) => {
    setCurrentPage(1)
    setSelectedTechIds((current) =>
      current.includes(techId)
        ? current.filter((id) => id !== techId)
        : [...current, techId]
    )
  }

  const resetControls = () => {
    setSortKey("starting_date")
    setSortDirection("desc")
    setSelectedTechIds([])
    setCurrentPage(1)
    setOpenPanel(null)
  }

  return (
    <section id="project-list" className="w-full">
      <div className="relative z-20 mb-5 flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {displayedProjects.length} of {projects.length} projects
        </p>

        <div ref={controlsRef} className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setOpenPanel((current) => (current === "sort" ? null : "sort"))
            }
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:cursor-pointer",
              openPanel === "sort" || sortKey !== "starting_date" || sortDirection !== "desc"
                ? "border-blue-500 bg-blue-500 text-white"
                : "border-zinc-200 bg-white/75 text-zinc-600 hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
            )}
            aria-label="Sort projects"
            title="Sort projects"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              setOpenPanel((current) =>
                current === "filter" ? null : "filter"
              )
            }
            className={cn(
              "relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:cursor-pointer",
              openPanel === "filter" || selectedTechIds.length > 0
                ? "border-blue-500 bg-blue-500 text-white"
                : "border-zinc-200 bg-white/75 text-zinc-600 hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
            )}
            aria-label="Filter projects"
            title="Filter projects"
          >
            <Filter className="h-4 w-4" />
            {selectedTechIds.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-950 px-1 text-[10px] text-white ring-1 ring-white dark:bg-white dark:text-zinc-950 dark:ring-zinc-950">
                {selectedTechIds.length}
              </span>
            )}
          </button>

          {hasActiveControls && (
            <button
              type="button"
              onClick={resetControls}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white/75 text-zinc-500 transition-colors hover:cursor-pointer hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
              aria-label="Reset project controls"
              title="Reset project controls"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}

          {openPanel === "sort" && (
            <div className="absolute right-0 top-11 w-60 rounded-xl border border-zinc-200 bg-white p-3 shadow-xl shadow-zinc-950/10 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/30">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Sort
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSortDirection((current) =>
                      current === "asc" ? "desc" : "asc"
                    )
                    setCurrentPage(1)
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:cursor-pointer hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
                  aria-label={`Sort ${
                    sortDirection === "asc" ? "descending" : "ascending"
                  }`}
                  title={sortDirection === "asc" ? "Ascending" : "Descending"}
                >
                  {sortDirection === "asc" ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="flex flex-col gap-1">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSortKey(option.value)
                      setCurrentPage(1)
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:cursor-pointer",
                      sortKey === option.value
                        ? "bg-blue-500 text-white"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-blue-300"
                    )}
                  >
                    <span>{option.label}</span>
                    {sortKey === option.value && (
                      <Check className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {openPanel === "filter" && (
            <div className="absolute right-0 top-11 w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-zinc-200 bg-white p-3 shadow-xl shadow-zinc-950/10 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/30">
              <div className="mb-3">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Tech Stack
                </p>
              </div>

              {techOptions.length > 0 ? (
                <div className="flex max-h-72 flex-col gap-1 overflow-y-auto pr-1">
                  {techOptions.map((tech) => {
                    const active = selectedTechSet.has(tech.id)

                    return (
                      <button
                        key={tech.id}
                        type="button"
                        onClick={() => toggleTech(tech.id)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:cursor-pointer",
                          active
                            ? "bg-blue-500 text-white"
                            : "text-zinc-600 hover:bg-zinc-100 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-blue-300"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                            active
                              ? "border-white bg-white text-blue-500"
                              : "border-zinc-300 dark:border-zinc-600"
                          )}
                        >
                          {active && (
                            <Check
                              className="h-3.5 w-3.5 text-blue-700 dark:text-blue-800"
                              strokeWidth={3.5}
                            />
                          )}
                        </span>
                        <span>{tech.name}</span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  No tech stack available.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5 md:gap-6">
        {paginatedProjects.map((project, index) => {
          const startDate = new Date(project.starting_date).toLocaleDateString(
            "en-US",
            {
              month: "short",
              year: "numeric",
            }
          )
          const endDate = project.end_date
            ? new Date(project.end_date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : "Present"

          return (
            <Link
              key={project["project-slug"]}
              href={"/projects/" + project["project-slug"]}
              rel="noopener noreferrer"
              className="group"
            >
              <Card
                className="grid overflow-hidden border-zinc-200 bg-white/85 p-0 opacity-0 shadow-sm transition-all duration-300 hover:border-blue-200 hover:bg-zinc-50 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/45 dark:hover:border-blue-500/30 dark:hover:bg-zinc-900 md:grid-cols-[minmax(18rem,0.95fr)_minmax(0,1.25fr)]"
                style={{
                  animation: `fadeUp 0.5s ease-out forwards`,
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 md:h-full md:min-h-64">
                  <SkeletonImage
                    src={
                      getImageUrl(project["media-highlight"]) ??
                      "/project-placeholder.svg"
                    }
                    alt={project.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </div>
                <CardContent className="flex min-w-0 flex-col justify-center gap-4 p-5 md:p-7">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    {typeof project.type === "object" &&
                    project.type !== null ? (
                      <ProjectTypeBadge
                        name={project.type.name}
                        color={project.type.color}
                        className="w-fit rounded-full px-2.5 py-1 text-xs font-medium"
                      />
                    ) : (
                      <span className="w-fit rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                        {String(project.type)}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <Calendar className="h-3.5 w-3.5" />
                      <time>{startDate}</time>
                      <span>-</span>
                      <time>{endDate}</time>
                    </span>
                  </div>

                  <h3 className="text-2xl font-semibold leading-tight text-zinc-900 transition-colors duration-300 group-hover:text-blue-700 dark:text-zinc-50 dark:group-hover:text-blue-400 md:text-3xl">
                    {project.title}
                  </h3>
                  <p className="line-clamp-4 font-inter text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
                    {getRichTextPlainText(project["highlighted-description"])}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors group-hover:text-blue-500 dark:text-blue-400">
                    View project
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 items-center gap-4 rounded-xl border border-zinc-200 bg-white/70 p-4 dark:border-zinc-800 dark:bg-zinc-900/35 md:grid-cols-[1fr_auto_1fr]">
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 md:text-left">
          Showing {pageStart}-{pageEnd} of {displayedProjects.length}
        </p>

        <div className="flex justify-center">
          {totalPages > 1 && (
          <nav
            aria-label="Project pagination"
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(1, Math.min(page, totalPages) - 1)
                )
              }
              disabled={effectiveCurrentPage === 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:cursor-pointer hover:border-blue-300 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
              aria-label="Previous project page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {paginationItems.map((item, index) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${index}`}
                  className="inline-flex h-9 min-w-9 items-center justify-center px-2 text-sm text-zinc-500 dark:text-zinc-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCurrentPage(item)}
                  aria-current={
                    effectiveCurrentPage === item ? "page" : undefined
                  }
                  className={cn(
                    "inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-sm transition-colors hover:cursor-pointer",
                    effectiveCurrentPage === item
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-zinc-200 text-zinc-600 hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
                  )}
                >
                  {item}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={effectiveCurrentPage === totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-600 transition-colors hover:cursor-pointer hover:border-blue-300 hover:text-blue-600 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
              aria-label="Next project page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </nav>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 md:justify-end">
          <label
            htmlFor="projects-page-size"
            className="text-sm text-zinc-500 dark:text-zinc-400"
          >
            Per page
          </label>
          <select
            id="projects-page-size"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value) as typeof pageSize)
              setCurrentPage(1)
            }}
            className="h-9 rounded-full border border-zinc-200 bg-white px-3 text-sm text-zinc-700 transition-colors hover:cursor-pointer hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-blue-500/50"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option
                key={option}
                value={option}
                className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
              >
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  )
}
