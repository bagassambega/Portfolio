import { notFound } from "next/navigation"
import Link from "next/link"
import SkeletonImage from "@/components/shared/SkeletonImage"
import { ArrowLeft, Calendar, Code, ExternalLink } from "lucide-react"
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/services/api"
import type { Media, Techstack } from "@/lib/types/payload-types"
import RichTextRenderer from "@/components/shared/RichTextRenderer"
import AnimatedSection from "@/components/shared/AnimatedSection"
import SlugPageLayout from "@/components/shared/SlugPageLayout"
import type { TocItem } from "@/components/shared/TableOfContents"
import ProjectTypeBadge from "@/components/ProjectTypeBadge"
import { getOriginalImageUrl, formatDateShort } from "@/lib/helpers"

import type { Metadata } from "next"

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return { title: "Project Not Found" }

  return {
    title: project.title,
    description: `${project.type} — ${project.title}`,
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  const bannerMedia =
    typeof project["media-highlight"] === "object" &&
    project["media-highlight"] !== null
      ? (project["media-highlight"] as Media)
      : null
  const bannerUrl = getOriginalImageUrl(project["media-highlight"])
  const bannerWidth = bannerMedia?.width ?? 1920
  const bannerHeight = bannerMedia?.height ?? 1080
  const techstacks = (project.techstack ?? []).filter(
    (t): t is Techstack => typeof t !== "number"
  ).sort((a, b) => a.name.localeCompare(b.name))
  const mediaItems = (project.media ?? []).filter(
    (m): m is Media => typeof m !== "number"
  )
  const dateRange = project.end_date
    ? `${formatDateShort(project.starting_date)} – ${formatDateShort(
        project.end_date
      )}`
    : `${formatDateShort(project.starting_date)} – Present`

  const tocItems: TocItem[] = [
    { id: "overview", label: "Overview" },
    { id: "description", label: "Description" },
    ...(techstacks.length > 0
      ? [{ id: "tech-stack", label: "Tech Stack" }]
      : []),
    ...(mediaItems.length > 0
      ? [{ id: "screenshots", label: "Screenshots" }]
      : []),
  ]

  return (
    <SlugPageLayout tocItems={tocItems}>
      <div className="font-inter">
        {/* Back link */}
        <AnimatedSection delay={0}>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-400 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </AnimatedSection>

        {/* Banner + Header */}
        <AnimatedSection delay={100}>
          <section id="overview" className="mb-12">
            {bannerUrl && (
              <div className="w-full rounded-2xl overflow-hidden mb-8 border border-border">
                <SkeletonImage
                  src={bannerUrl}
                  alt={project.title}
                  width={bannerWidth}
                  height={bannerHeight}
                  unoptimized
                  className="w-full h-auto"
                  priority
                />
              </div>
            )}

            <div>
              <div className="mb-4">
                {typeof project.type === "object" && project.type !== null ? (
                  <ProjectTypeBadge
                    name={project.type.name}
                    color={project.type.color}
                  />
                ) : (
                  <span className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-2 block">
                    Project
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                {project.title}
              </h1>

              <div className="text-lg text-muted-foreground mb-6">
                <RichTextRenderer
                  content={project["highlighted-description"]}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {dateRange}
                </span>

                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-border text-sm hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open the Project
                  </a>
                )}

                {project.sourcecode && (
                  <a
                    href={project.sourcecode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-border text-sm hover:bg-foreground hover:text-background hover:border-foreground transition-all"
                  >
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5"
                    >
                      <title>GitHub</title>
                      <path
                        fill="currentColor"
                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                      />
                    </svg>
                    Source Code
                  </a>
                )}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Description */}
        <AnimatedSection>
          <section id="description" className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <RichTextRenderer content={project.description} />
          </section>
        </AnimatedSection>

        {/* Tech Stack */}
        {techstacks.length > 0 && (
          <AnimatedSection>
            <section id="tech-stack" className="mb-16">
              <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
                Tech Stack
              </h2>
              <div className="flex flex-wrap gap-3">
                {techstacks.map((tech: Techstack) => (
                  <div
                    key={tech.id}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors border border-zinc-200 dark:border-zinc-700/50 hover:cursor-pointer"
                  >
                    {tech.logo ? (
                      <div
                        className="w-4 h-4 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                        dangerouslySetInnerHTML={{ __html: tech.logo }}
                      />
                    ) : (
                      <Code className="w-4 h-4" />
                    )}
                    {tech.url ? (
                      <a
                        href={tech.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-500 transition-colors"
                      >
                        {tech.name}
                      </a>
                    ) : (
                      <span>{tech.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </AnimatedSection>
        )}

        {/* Screenshots */}
        {mediaItems.length > 0 && (
          <AnimatedSection>
            <section id="screenshots" className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Screenshots</h2>
              <div className="flex flex-col gap-8">
                {mediaItems.map((media) => {
                  const url = getOriginalImageUrl(media)
                  if (!url) return null
                  return (
                    <figure key={media.id} className="space-y-2">
                      <div className="w-full rounded-xl overflow-hidden border border-border bg-zinc-100 dark:bg-zinc-900/50 flex items-center justify-center p-2 md:p-4">
                        <SkeletonImage
                          src={url}
                          alt={media.alt}
                          width={media.width ?? 1920}
                          height={media.height ?? 1080}
                          unoptimized
                          className="w-auto h-auto max-w-full max-h-[75vh] object-contain rounded-lg shadow-sm"
                          loading="lazy"
                        />
                      </div>
                      {media.alt && (
                        <figcaption className="text-xs text-muted-foreground text-center">
                          {media.alt}
                        </figcaption>
                      )}
                    </figure>
                  )
                })}
              </div>
            </section>
          </AnimatedSection>
        )}
      </div>
    </SlugPageLayout>
  )
}
