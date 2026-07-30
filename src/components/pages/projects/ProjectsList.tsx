"use client"

import Link from "next/link"
import SkeletonImage from "@/components/shared/SkeletonImage"
import { Card, CardContent } from "@/components/ui/card"
import { getImageUrl } from "@/lib/helpers"
import ProjectTypeBadge from "@/components/pages/projects/ProjectTypeBadge"
import type { ProjectListItem } from "@/lib/services/api"
import type { Techstack } from "@/lib/types/payload-types"
import { cn } from "@/lib/utils"
import { ArrowRight, Calendar, Check, Filter, RotateCcw } from "lucide-react"
import { useMemo, useState } from "react"

type SortKey = "starting_date" | "title" | "end_date" | "duration"
type SortDirection = "asc" | "desc"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "starting_date", label: "Start date" },
  { value: "title", label: "Title" },
  { value: "end_date", label: "Finish date" },
  { value: "duration", label: "Duration" },
]

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

export default function ProjectsList({
  projects,
}: {
  projects: ProjectListItem[]
}) {
  const [sortKey, setSortKey] = useState<SortKey>("starting_date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [selectedTechIds, setSelectedTechIds] = useState<number[]>([])

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

  const toggleTech = (techId: number) => {
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
  }

  return (
    <section id="project-list" className="w-full">
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white/75 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/35 md:p-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Browse Projects
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {displayedProjects.length} of {projects.length} projects
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
              <div className="flex flex-wrap items-center gap-2">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSortKey(option.value)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors hover:cursor-pointer",
                      sortKey === option.value
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-zinc-200 text-zinc-600 hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSortDirection((current) =>
                      current === "asc" ? "desc" : "asc"
                    )
                  }
                  className="rounded-full border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:cursor-pointer hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
                >
                  {sortDirection === "asc" ? "Ascending" : "Descending"}
                </button>
                <button
                  type="button"
                  onClick={resetControls}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-colors hover:cursor-pointer hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
                  aria-label="Reset project filters"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {techOptions.length > 0 && (
            <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                <Filter className="h-3.5 w-3.5" />
                Tech Stack
              </div>
              <div className="flex flex-wrap gap-2">
                {techOptions.map((tech) => {
                  const active = selectedTechSet.has(tech.id)

                  return (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => toggleTech(tech.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors hover:cursor-pointer",
                        active
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-zinc-200 text-zinc-600 hover:border-blue-300 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-blue-500/50 dark:hover:text-blue-300"
                      )}
                    >
                      {active && <Check className="h-3.5 w-3.5" />}
                      {tech.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5 md:gap-6">
        {displayedProjects.map((project, index) => {
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
    </section>
  )
}
