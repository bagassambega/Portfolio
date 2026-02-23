"use client"

import { useState } from "react"
import Image from "next/image"
import { LinkIcon, Download, ExternalLink, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

  // The image array can be populated Media docs
  const rawImages = (publication.image || []) as Media[]
  const mainImage = rawImages.length > 0 ? rawImages[0] : null
  const mainImageUrl = mainImage ? getImageUrl(mainImage) : null

  // The files array can be populated File docs
  const files = (publication.files || []) as PayloadFile[]

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (publication.url) {
      navigator.clipboard.writeText(publication.url)
    }
  }

  const formatPublishDate = (dateString?: string | null) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const formattedDate = formatPublishDate(publication.publishDate)
  const showPublishedTo = publication.isPublished && publication.publishedTo

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 flex flex-col items-start h-full pb-6 opacity-0"
          style={{
            animation: `fadeUp 0.5s ease-out forwards`,
            animationDelay: `${index * 100}ms`,
          }}
        >
          {/* Top Image Box */}
          <div className="relative w-full aspect-video bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-800 overflow-hidden mb-4">
            {mainImageUrl ? (
              <Image
                src={mainImageUrl}
                alt={mainImage?.alt || publication.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                <FileText className="w-12 h-12 opacity-50" />
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Title & Metadata */}
          <div className="px-5 w-full pr-14 flex flex-col gap-1.5">
            <h3 className="font-bold text-lg md:text-xl text-zinc-900 dark:text-zinc-50 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
              {publication.title}
            </h3>
            {formattedDate && (
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {formattedDate}
              </p>
            )}
            {showPublishedTo && (
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Published to: {publication.publishedTo}
              </p>
            )}
          </div>

          {/* Quick Link Copy Button */}
          {publication.url && (
            <button
              onClick={handleCopyLink}
              className="absolute bottom-5 right-5 p-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-colors z-20"
              title="Copy URL"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </DialogTrigger>

      {/* The Modal Content */}
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 p-0 sm:rounded-3xl">
        <div className="p-6 md:p-8">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl md:text-4xl font-bold leading-tight mb-2">
              {publication.title}
            </DialogTitle>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
              {formattedDate && (
                <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                  {formattedDate}
                </span>
              )}
              {showPublishedTo && (
                <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/40 px-3 py-1 text-xs font-semibold text-blue-800 dark:text-blue-300">
                  Published to: {publication.publishedTo}
                </span>
              )}
            </div>
          </DialogHeader>

          {/* Hero Output inside modal */}
          {mainImageUrl && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 border border-zinc-200 dark:border-zinc-800">
              <Image
                src={mainImageUrl}
                alt={publication.title}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          )}

          {/* Description */}
          {publication.description && (
            <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed mb-8">
              <RichTextRenderer content={publication.description} />
            </div>
          )}

          {/* Additional Images Gallery */}
          {rawImages.length > 1 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4">Documentation</h4>
              <div className="grid grid-cols-2 gap-4">
                {rawImages.slice(1).map((img, idx) => {
                  const url = getImageUrl(img)
                  if (!url) return null
                  return (
                    <div
                      key={idx}
                      className="relative w-full aspect-video rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
                    >
                      <Image
                        src={url}
                        alt={img?.alt || "Gallery image"}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Action Buttons Container */}
          <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
            {publication.url && (
              <a
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open Link
              </a>
            )}

            {publication.repository && (
              <a
                href={publication.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white px-5 py-2.5 rounded-full font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Repository
              </a>
            )}

            {/* File Downloads */}
            {files.map((file, idx) => {
              const fileUrl = getImageUrl(file as never) // files use the same URL logic locally
              if (!fileUrl) return null
              return (
                <a
                  key={idx}
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-5 py-2.5 rounded-full font-medium transition-colors border border-zinc-200 dark:border-zinc-700"
                >
                  <Download className="w-4 h-4" />
                  {file.filename || "Download File"}
                </a>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
