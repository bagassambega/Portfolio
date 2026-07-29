import MediaPreview from "@/components/shared/MediaPreview"
import { getOriginalImageUrl } from "@/lib/helpers"
import type { Media } from "@/lib/types/payload-types"

type ExperienceDocumentationSectionProps = {
  mediaItems: Media[]
}

const MEDIA_CAPTION_CLASS =
  "mt-3 text-center text-sm font-normal text-white drop-shadow-sm md:text-base"

export default function ExperienceDocumentationSection({
  mediaItems,
}: ExperienceDocumentationSectionProps) {
  if (mediaItems.length === 0) return null

  return (
    <section id="documentation" className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
        Documentation
      </h2>
      <div className="flex flex-col gap-8">
        {mediaItems.map((media) => {
          const url = getOriginalImageUrl(media)
          if (!url) return null

          return (
            <figure key={media.id} className="space-y-2">
              <div className="w-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 flex items-center justify-center p-2 md:p-4">
                {media.mimeType?.startsWith("video/") ? (
                  <video
                    src={url}
                    controls
                    playsInline
                    preload="metadata"
                    className="w-auto h-auto max-w-full max-h-[75vh] rounded-lg shadow-sm"
                  />
                ) : (
                  <MediaPreview
                    src={url}
                    alt={media.alt || "Documentation Image"}
                    width={media.width ?? 1920}
                    height={media.height ?? 1080}
                    unoptimized
                    className="w-auto h-auto max-w-full max-h-[75vh] object-contain rounded-lg shadow-sm"
                    loading="lazy"
                  />
                )}
              </div>
              {media.alt && (
                <figcaption className={MEDIA_CAPTION_CLASS}>
                  {media.alt}
                </figcaption>
              )}
            </figure>
          )
        })}
      </div>
    </section>
  )
}
