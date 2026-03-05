import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, ExternalLink, Github } from "lucide-react"
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
  )
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
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Projects
          </Link>
        </AnimatedSection>

        {/* Banner + Header */}
        <AnimatedSection delay={100}>
          <section id="overview" className="mb-12">
            {bannerUrl && (
              <div className="w-full rounded-2xl overflow-hidden mb-8 border border-border">
                <Image
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
                    <Github className="w-3.5 h-3.5" />
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
            <section id="tech-stack" className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
              <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
                {techstacks.map((tech) => (
                  <li key={tech.id}>
                    {tech.url ? (
                      <a
                        href={tech.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {tech.name}
                      </a>
                    ) : (
                      <span>{tech.name}</span>
                    )}
                  </li>
                ))}
              </ul>
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
                        <Image
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
