"use client"

import Link from "next/link"
import { type ComponentType, useMemo, useState } from "react"
import {
  ArrowRight,
  Briefcase,
  FileText,
  FolderKanban,
  GraduationCap,
  Home,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react"
import {
  filterSearchItems,
  getContentTypeLabel,
  type SearchContentType,
  type SearchFilters,
  type SearchItem,
} from "@/lib/search"
import { Button } from "@/components/ui/button"
import SkeletonImage from "@/components/shared/SkeletonImage"

type SearchPageClientProps = {
  items: SearchItem[]
  initialQuery?: string
}

const iconByType: Record<
  SearchContentType,
  ComponentType<{ className?: string }>
> = {
  page: Home,
  project: FolderKanban,
  "work-experience": Briefcase,
  "organization-experience": Users,
  education: GraduationCap,
  publication: FileText,
}

const contentOptions: Array<{
  value: SearchFilters["contentType"]
  label: string
  icon: ComponentType<{ className?: string }>
}> = [
  { value: "all", label: "All", icon: Search },
  { value: "project", label: "Projects", icon: FolderKanban },
  { value: "work-experience", label: "Work", icon: Briefcase },
  { value: "organization-experience", label: "Org", icon: Users },
  { value: "education", label: "Education", icon: GraduationCap },
  { value: "publication", label: "Writing", icon: FileText },
  { value: "page", label: "Pages", icon: Home },
]

const labelClass =
  "flex flex-col gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400"

const fieldClass =
  "h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm normal-case tracking-normal text-zinc-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-blue-400 [&>option]:bg-white [&>option]:text-zinc-950 dark:[&>option]:bg-zinc-950 dark:[&>option]:text-zinc-50"

function uniqueSorted(values: Array<string | undefined>) {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value)))
  ).sort((a, b) => a.localeCompare(b))
}

function formatDate(date?: string | null) {
  if (!date) return null
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })
}

export default function SearchPageClient({
  items,
  initialQuery = "",
}: SearchPageClientProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialQuery,
    contentType: "all",
    subtype: "",
    tag: "",
    from: "",
    to: "",
    sort: "relevance",
  })

  const subtypes = useMemo(() => {
    return uniqueSorted(
      items
        .filter(
          (item) =>
            filters.contentType === "all" ||
            item.contentType === filters.contentType
        )
        .map((item) => item.subtype)
    )
  }, [filters.contentType, items])

  const tags = useMemo(() => {
    return uniqueSorted(
      items
        .filter(
          (item) =>
            filters.contentType === "all" ||
            item.contentType === filters.contentType
        )
        .flatMap((item) => item.tags)
    )
  }, [filters.contentType, items])

  const results = useMemo(
    () => filterSearchItems(items, filters),
    [filters, items]
  )

  const setFilter = <Key extends keyof SearchFilters>(
    key: Key,
    value: SearchFilters[Key]
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === "contentType" ? { subtype: "", tag: "" } : {}),
    }))
  }

  const clearFilters = () => {
    setFilters({
      query: "",
      contentType: "all",
      subtype: "",
      tag: "",
      from: "",
      to: "",
      sort: "relevance",
    })
  }

  return (
    <main className="min-h-dvh bg-zinc-50 px-4 pb-24 pt-4 text-zinc-950 dark:bg-gray-950 dark:text-zinc-50 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-300">
                Portfolio Index
              </p>
              <h1 className="text-3xl font-bold md:text-5xl">Search</h1>
            </div>
            <div className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
              {results.length} result{results.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="relative mt-7">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-400" />
            <input
              value={filters.query}
              onChange={(event) => setFilter("query", event.target.value)}
              placeholder="Search projects, experiences, education, tech stack..."
              className="h-16 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-12 pr-4 text-base outline-none transition-colors focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-blue-400 dark:focus:bg-zinc-950"
            />
          </div>
        </section>

        <div className="grid gap-7 lg:grid-cols-[19rem_1fr] lg:items-start">
          <aside className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 lg:sticky lg:top-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <SlidersHorizontal className="size-4 text-blue-600 dark:text-blue-300" />
                Filters
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={clearFilters}
                className="h-8 gap-1.5 px-2 text-xs text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
              >
                <X className="size-3.5" />
                Clear
              </Button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2">
              {contentOptions.map((option) => {
                const Icon = option.icon
                const active = filters.contentType === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFilter("contentType", option.value)}
                    className={`flex h-11 items-center gap-2 rounded-md border px-3 text-sm transition-colors ${
                      active
                        ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-500/15 dark:text-blue-200"
                        : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{option.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <label className={labelClass}>
                Type
                <select
                  value={filters.subtype}
                  onChange={(event) => setFilter("subtype", event.target.value)}
                  className={fieldClass}
                >
                  <option value="">Any</option>
                  {subtypes.map((subtype) => (
                    <option key={subtype} value={subtype}>
                      {subtype}
                    </option>
                  ))}
                </select>
              </label>

              <label className={labelClass}>
                Tag
                <select
                  value={filters.tag}
                  onChange={(event) => setFilter("tag", event.target.value)}
                  className={fieldClass}
                >
                  <option value="">Any</option>
                  {tags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </label>

              <label className={labelClass}>
                From
                <input
                  type="date"
                  value={filters.from}
                  onChange={(event) => setFilter("from", event.target.value)}
                  className={fieldClass}
                />
              </label>

              <label className={labelClass}>
                To
                <input
                  type="date"
                  value={filters.to}
                  onChange={(event) => setFilter("to", event.target.value)}
                  className={fieldClass}
                />
              </label>

              <label className={labelClass}>
                Sort
                <select
                  value={filters.sort}
                  onChange={(event) =>
                    setFilter(
                      "sort",
                      event.target.value as SearchFilters["sort"]
                    )
                  }
                  className={fieldClass}
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="title">Title</option>
                </select>
              </label>
            </div>
          </aside>

          <section className="grid gap-5">
            {results.length === 0 && (
              <div className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-400">
                No matching content for the current filters.
              </div>
            )}

            {results.map((item) => {
              const Icon = iconByType[item.contentType]
              const startDate = formatDate(item.date)
              const endDate = formatDate(item.endDate)
              const imageFit =
                item.contentType === "project" || item.contentType === "publication"
                  ? "object-cover"
                  : "object-contain p-4"

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group grid gap-5 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-blue-500/60 sm:p-5 md:grid-cols-[10rem_1fr_auto]"
                >
                  <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 text-zinc-600 transition-colors group-hover:border-blue-200 group-hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:group-hover:border-blue-500/40 dark:group-hover:text-blue-300 md:w-40">
                    {item.imageUrl ? (
                      <SkeletonImage
                        src={item.imageUrl}
                        alt={item.imageAlt ?? item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 160px"
                        unoptimized
                        className={imageFit}
                      />
                    ) : (
                      <Icon className="size-7" />
                    )}
                  </div>
                  <div className="min-w-0 py-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {item.title}
                      </h2>
                      <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                        {getContentTypeLabel(item.contentType)}
                      </span>
                      {item.subtype && (
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
                          {item.subtype}
                        </span>
                      )}
                    </div>
                    {item.excerpt && (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                        {item.excerpt}
                      </p>
                    )}
                    {item.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.tags.slice(0, 8).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm text-zinc-500 md:flex-col md:items-end md:py-1">
                    <span>
                      {startDate}
                      {endDate ? ` - ${endDate}` : ""}
                    </span>
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })}
          </section>
        </div>
      </div>
    </main>
  )
}
