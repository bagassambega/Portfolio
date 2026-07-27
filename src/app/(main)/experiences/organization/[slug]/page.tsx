import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, MapPin } from "lucide-react"
import {
  getOrganizationExperienceBySlug,
  getAllOrganizationExperienceSlugs,
} from "@/lib/services/api"
import type { Corporation, Media } from "@/lib/types/payload-types"
import RichTextRenderer from "@/components/shared/RichTextRenderer"
import AnimatedSection from "@/components/shared/AnimatedSection"
import SlugPageLayout from "@/components/shared/SlugPageLayout"
import type { TocItem } from "@/components/shared/TableOfContents"
import { formatDateShort } from "@/lib/helpers"
import type { Metadata } from "next"
import { CorporationDetailHeader } from "@/components/pages/experiences/CorporationProfile"
import ExperienceDocumentationSection from "@/components/pages/experiences/ExperienceDocumentationSection"

export async function generateStaticParams() {
  const slugs = await getAllOrganizationExperienceSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const exp = await getOrganizationExperienceBySlug(slug)
  if (!exp) return { title: "Organization Experience Not Found" }

  const corp = exp.corporation as Corporation
  return {
    title: `${exp.title} at ${corp?.name || "Organization"}`,
    description: `Organization experience details for ${exp.title}`,
  }
}

export default async function OrganizationExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const exp = await getOrganizationExperienceBySlug(slug)

  if (!exp) notFound()

  const corp = exp.corporation as Corporation
  const mediaItems = (exp.documentation ?? []).filter(
    (m: number | Media): m is Media => typeof m !== "number"
  )
  const dateRange = exp.end_date
    ? `${formatDateShort(exp.starting_date)} – ${formatDateShort(exp.end_date)}`
    : `${formatDateShort(exp.starting_date)} – Present`

  const tocItems: TocItem[] = [
    { id: "overview", label: "Overview" },
    { id: "role-description", label: "Role Description" },
    ...(exp.result ? [{ id: "results", label: "Results & Deliverables" }] : []),
    ...(mediaItems.length > 0
      ? [{ id: "documentation", label: "Documentation" }]
      : []),
  ]

  return (
    <SlugPageLayout tocItems={tocItems}>
      <div className="font-inter">
        {/* Back link */}
        <AnimatedSection delay={0}>
          <Link
            href="/experiences/organization"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-blue-500 transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Experiences
          </Link>
        </AnimatedSection>

        {/* Header Section */}
        <AnimatedSection delay={100}>
          <section
            id="overview"
            className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12"
          >
            <CorporationDetailHeader corporation={corp}>
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
            </CorporationDetailHeader>
          </section>
        </AnimatedSection>

        {/* Divider */}
        <AnimatedSection delay={150}>
          <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 mb-12" />
        </AnimatedSection>

        {/* Role Description */}
        <AnimatedSection>
          <section id="role-description" className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
              Role Description
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-blue-500">
              <RichTextRenderer content={exp.description} />
            </div>
          </section>
        </AnimatedSection>

        {/* Results & Deliverables */}
        {exp.result && (
          <AnimatedSection>
            <section id="results" className="mb-16">
              <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
                Results & Deliverables
              </h2>
              <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-a:text-blue-500">
                <RichTextRenderer content={exp.result} />
              </div>
            </section>
          </AnimatedSection>
        )}

        {/* Documentation */}
        {mediaItems.length > 0 && (
          <AnimatedSection>
            <ExperienceDocumentationSection mediaItems={mediaItems} />
          </AnimatedSection>
        )}
      </div>
    </SlugPageLayout>
  )
}
