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

/**
 * Extracts a relative image path from a Payload media object.
 *
 * Payload prefixes media URLs with its configured `serverURL`, producing
 * absolute URLs like `http://localhost:3000/api/media/file/img.webp` (local)
 * or `https://bagassambega.vercel.app/api/media/file/img.webp` (production).
 *
 * Since these images are served by the same Next.js server via Payload's
 * /api/media/file route, the origin is stripped to produce a relative path
 * (e.g., `/api/media/file/img.webp`). This avoids:
 *   1. Next.js Image Optimization SSRF protection blocking localhost (private IP).
 *   2. The need to whitelist every possible hostname in next.config.ts.
 */
function getImageUrl(highlight: ProjectListItem["media-highlight"]): string {
  if (highlight && typeof highlight === "object") {
    const media = highlight as Media
    const raw =
      media.sizes?.card?.url ??
      media.sizes?.thumbnail?.url ??
      media.url ??
      "/project-placeholder.svg"

    // Strip origin from absolute URLs to produce a relative path.
    // e.g., "http://localhost:3000/api/media/file/img.webp" → "/api/media/file/img.webp"
    try {
      const parsed = new URL(raw)
      return parsed.pathname
    } catch {
      // Already a relative path or placeholder — return as-is.
      return raw
    }
  }
  return "/project-placeholder.svg"
}

export default function ProjectsList() {
  const [docs, setDocs] = useState<ProjectListItem[]>([])
  const [nextCursor, setNextCursor] = useState<number | null>(null)
  const [isFetching, setIsFetching] = useState(true)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const initialised = useRef(false)

  const fetchPage = useCallback(async (cursor: number) => {
    setIsFetching(true)
    try {
      const res = await fetch(`/api/projects?cursor=${cursor}&limit=${LIMIT}`)
      const data: ProjectsPage = await res.json()
      setDocs((prev) => (cursor === 1 ? data.docs : [...prev, ...data.docs]))
      setNextCursor(data.nextCursor)
    } finally {
      setIsFetching(false)
    }
  }, [])

  // Fetch page 1 on mount
  useEffect(() => {
    if (initialised.current) return
    initialised.current = true
    fetchPage(1)
  }, [fetchPage])

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
    <section className="w-full max-w-6xl px-6 py-10">
      <h2 className="text-2xl font-semibold mb-6">All Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map((project, index) => (
          <Link
            key={project["project-slug"]}
            href={project.url ?? project.sourcecode ?? "#"}
            target={project.url || project.sourcecode ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="group"
          >
            <Card className="flex flex-col overflow-hidden transition-shadow group-hover:shadow-lg pt-0">
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
              <CardContent className="flex flex-col gap-2 p-4">
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
