"use client"

import { useState } from "react"
import SkeletonImage from "@/components/shared/SkeletonImage"
import { ChevronDown, Download, ExternalLink } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { PublicationListItem } from "@/lib/services/api"
import type { Media, File as PayloadFile } from "@/lib/types/payload-types"
import RichTextRenderer from "@/components/shared/RichTextRenderer"
import { getImageUrl } from "@/lib/helpers"

export default function PublicationCard({
  publication,
  index = 0,
}: {
  publication: PublicationListItem
  index?: number
}) {
  const [open, setOpen] = useState(false)

  const rawImages = (publication.image || []) as Media[]
  const mainImage = rawImages.length > 0 ? rawImages[0] : null
  const mainImageUrl = mainImage ? getImageUrl(mainImage) : null

  // The files array can be populated File docs
  const files = (publication.files || []) as PayloadFile[]

  const formatPublishDate = (dateString?: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const formatPublishYear = (dateString?: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.getFullYear().toString()
  }

  const formattedDate = formatPublishDate(publication.publishDate)
  const publishYear = formatPublishYear(publication.publishDate)
  const publishedOrganization =
    publication.isPublished && publication.publishedTo?.trim()
      ? publication.publishedTo.trim()
      : null

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="w-full border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 overflow-hidden opacity-0 backface-hidden"
      style={{
        animation: `fadeUp 0.5s ease-out forwards`,
        animationDelay: `${index * 100}ms`,
      }}
    >
      <CollapsibleTrigger asChild>
        <button
          type="button"
          className="group w-full px-5 py-4 md:px-6 md:py-5 flex items-center justify-between gap-4 text-left cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
        >
          <h3 className="font-semibold text-sm md:text-base text-zinc-900 dark:text-zinc-50 leading-tight transition-colors">
            {publication.title}
          </h3>
          <span className="inline-flex items-center gap-2 shrink-0 text-sm md:text-base text-zinc-500 dark:text-zinc-400">
            {publishYear}
            <ChevronDown
              className={`w-4 h-4 transition-all duration-200 ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </span>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="px-5 pb-5 md:px-6 md:pb-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-5">
          {mainImageUrl && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <SkeletonImage
                src={mainImageUrl}
                alt={mainImage?.alt || publication.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            {formattedDate && <span>{formattedDate}</span>}

            {publishedOrganization && (
              <span className="inline-flex items-center rounded-full px-3 py-2 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-inset ring-blue-600/20">
                {publishedOrganization}
              </span>
            )}

            {publication.url && (
              <a
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border-2 border-zinc-300 dark:border-zinc-700 text-sm hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open the Publication
              </a>
            )}

            {publication.repository && (
              <a
                href={publication.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border-2 border-zinc-300 dark:border-zinc-700 text-sm hover:bg-zinc-900 hover:text-zinc-50 dark:hover:bg-zinc-100 dark:hover:text-zinc-900 hover:border-zinc-900 dark:hover:border-zinc-100 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Repository
              </a>
            )}
          </div>

          {publication.description && (
            <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed">
              <RichTextRenderer content={publication.description} />
            </div>
          )}

          {files.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {files.map((file, idx) => {
                const fileUrl = file.url
                if (!fileUrl) return null

                return (
                  <a
                    key={idx}
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={file.filename || "Open File"}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors max-w-[18rem]"
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {file.filename || "Open File"}
                    </span>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
