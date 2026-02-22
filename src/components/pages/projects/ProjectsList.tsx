"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import ProjectCardSkeleton from "@/components/pages/projects/ProjectCardSkeleton"
import type { ProjectListItem, Media, ProjectsPage } from "@/lib/services/api"

const LIMIT = 10

function lexicalToPlainText(
  description: ProjectListItem["highlighted-description"]
): string {
  const traverse = (node: Record<string, unknown>): string => {
    if (node.text && typeof node.text === "string") return node.text
    if (Array.isArray(node.children)) {
      return (node.children as Record<string, unknown>[])
        .map(traverse)
        .join(" ")
    }
    return ""
  }
  return traverse(description.root as Record<string, unknown>)
    .replace(/\s+/g, " ")
    .trim()
}

function getImageUrl(highlight: ProjectListItem["media-highlight"]): string {
  if (highlight && typeof highlight === "object") {
    const media = highlight as Media
    const raw =
      media.sizes?.card?.url ??
      media.sizes?.thumbnail?.url ??
      media.url ??
      "/project-placeholder.svg"

    try {
      const parsed = new URL(raw)
      return parsed.pathname
    } catch {
      return raw
    }
  }
  return "/project-placeholder.svg"
}

/**
 * Props now include initialData — the first page of projects, fetched
 * server-side at build time by the parent server component.
 */
interface ProjectsListProps {
  initialData: ProjectsPage
}

export default function ProjectsList({ initialData }: ProjectsListProps) {
  // Initialize with server-fetched data — no client fetch needed for page 1
  const [docs, setDocs] = useState<ProjectListItem[]>(initialData.docs)
  const [nextCursor, setNextCursor] = useState<number | null>(
    initialData.nextCursor
  )
  const [isFetching, setIsFetching] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const fetchPage = useCallback(async (cursor: number) => {
    setIsFetching(true)
    try {
      const res = await fetch(`/api/projects?cursor=${cursor}&limit=${LIMIT}`)
      const data: ProjectsPage = await res.json()
      setDocs((prev) => [...prev, ...data.docs])
      setNextCursor(data.nextCursor)
    } finally {
      setIsFetching(false)
    }
  }, [])

  // IntersectionObserver — triggers fetch when sentinel enters viewport
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor) fetchPage(nextCursor)
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [fetchPage, nextCursor])

  return (
    <section className="w-full max-w-5xl px-6 flex flex-col justify-center items-center font-inter">
      <div className="flex flex-col items-center justify-center gap-4 mb-16">
        <h2 className="text-5xl font-semibold font-sans">Projects</h2>
        <span className="dark:text-gray-400 text-gray-600">
          All projects I participated and created to implement my knowledge and
          enhance my skills
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {docs.map((project, index) => (
          <Link
            key={project["project-slug"]}
            href={"/projects/" + project["project-slug"]}
            rel="noopener noreferrer"
            className="group"
          >
            <Card
              className="flex flex-col overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 pt-0 opacity-0"
              style={{
                animation: `fadeUp 0.5s ease-out forwards`,
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative w-full aspect-video">
                <Image
                  src={getImageUrl(project["media-highlight"])}
                  alt={project.title}
                  fill
                  unoptimized
                  className="object-cover"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
              <CardContent className="flex flex-col gap-2 px-4">
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full w-fit">
                  {project.type}
                </span>
                <h3 className="font-semibold text-base leading-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {lexicalToPlainText(project["highlighted-description"])}
                </p>
                <time className="text-xs text-muted-foreground mt-1">
                  {new Date(project.starting_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </CardContent>
            </Card>
          </Link>
        ))}

        {isFetching &&
          Array.from({ length: LIMIT }).map((_, i) => (
            <ProjectCardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>

      {nextCursor && !isFetching && (
        <div ref={sentinelRef} className="h-4 w-full" aria-hidden />
      )}
    </section>
  )
}
