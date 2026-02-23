import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, MapPin, Briefcase, Code } from "lucide-react"
import {
  getWorkExperienceBySlug,
  getAllWorkExperienceSlugs,
} from "@/lib/services/api"
import type { Media, Corporation, Techstack } from "@/lib/types/payload-types"
import RichTextRenderer from "@/components/shared/RichTextRenderer"
import { formatDateShort } from "@/lib/helpers"
import type { Metadata } from "next"

export async function generateStaticParams() {
  const slugs = await getAllWorkExperienceSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const exp = await getWorkExperienceBySlug(slug)
  if (!exp) return { title: "Experience Not Found" }

  const corp = exp.corporation as Corporation
  return {
    title: `${exp.title} at ${corp?.name || "Company"}`,
    description: `Work experience details for ${exp.title}`,
  }
}

export default async function WorkExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const exp = await getWorkExperienceBySlug(slug)

  if (!exp) notFound()

  const corp = exp.corporation as Corporation
  const logoUrl = (corp?.logo as Media | undefined)?.url

  const techstacks = (exp.techstacks ?? []).filter(
    (t: number | Techstack): t is Techstack => typeof t !== "number"
  )

  const mediaItems = (exp.documentation ?? []).filter(
    (m: number | Media): m is Media => typeof m !== "number"
  )

  const dateRange = exp.end_date
    ? `${formatDateShort(exp.starting_date)} – ${formatDateShort(exp.end_date)}`
    : `${formatDateShort(exp.starting_date)} – Present`

  return (
    <main className="flex flex-col items-center bg-zinc-50 dark:bg-black min-h-screen">
      <article className="w-full max-w-3xl px-6 py-16 font-inter">
        <Link
          href="/experiences"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-blue-500 transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Experiences
        </Link>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
          {/* Logo Box */}
          <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 bg-white rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex items-center justify-center p-4 relative overflow-hidden">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={corp?.name || "Company Logo"}
                fill
                unoptimized
                className="object-contain p-4"
              />
            ) : (
              <Briefcase className="w-12 h-12 text-zinc-300" />
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-xl font-bold text-blue-500 mb-1 tracking-wider uppercase">
              {corp?.name || "Company"}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 leading-tight">
              {exp.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400 font-mono">
              <span className="inline-flex items-center gap-2 uppercase tracking-wide">
                <Calendar className="w-4 h-4" />
                {dateRange}
              </span>
              <span className="inline-flex items-center gap-2 uppercase tracking-wide">
                <MapPin className="w-4 h-4" />
                {exp.location}
              </span>
              <span className="inline-flex items-center gap-2 uppercase tracking-wide text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full">
                {exp.type}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 mb-12" />

        {/* Content Sections */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
            Role Description
          </h2>
          <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-blue-500">
            <RichTextRenderer content={exp.description} />
          </div>
        </section>

        {techstacks.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-3">
              {techstacks.map((tech: Techstack) => (
                <div
                  key={tech.id}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-sm font-medium transition-colors border border-zinc-200 dark:border-zinc-700/50"
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
        )}

        {exp.result && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
              Results & Deliverables
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-blue-500">
              <RichTextRenderer content={exp.result} />
            </div>
          </section>
        )}

        {mediaItems.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
              Documentation
            </h2>
            <div className="flex flex-col gap-8">
              {mediaItems.map((media) => {
                const url = media.url
                if (!url) return null
                return (
                  <figure key={media.id} className="space-y-2">
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                      <Image
                        src={url}
                        alt={media.alt || "Documentation Image"}
                        fill
                        unoptimized
                        className="object-cover"
                        loading="lazy"
                      />
                    </div>
                    {media.alt && (
                      <figcaption className="text-sm font-medium text-zinc-500 dark:text-zinc-400 text-center mt-3">
                        {media.alt}
                      </figcaption>
                    )}
                  </figure>
                )
              })}
            </div>
          </section>
        )}
      </article>
    </main>
  )
}
