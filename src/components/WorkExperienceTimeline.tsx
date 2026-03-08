import Link from "next/link"
import SkeletonImage from "@/components/shared/SkeletonImage"
import { Calendar, MapPin } from "lucide-react"
import type { WorkExperienceListItem } from "@/lib/services/api"
import type { Media, Corporation } from "@/lib/types/payload-types"
import RichTextRenderer from "@/components/shared/RichTextRenderer"
import { getOriginalImageUrl } from "@/lib/helpers"

export default function WorkExperienceTimeline({
  experiences,
}: {
  experiences: WorkExperienceListItem[]
}) {
  if (!experiences || experiences.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500">
        No work experiences found.
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto py-8">
      {experiences.map((exp, index) => {
        const corp = exp.corporation as Corporation | null
        const logoMedia = corp?.logo as Media | undefined
        const isLast = index === experiences.length - 1

        const startDate = new Date(exp.starting_date)
        const formattedStart = startDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })

        const formattedEnd =
          exp.type === "Ongoing" || !exp.end_date
            ? "Present"
            : new Date(exp.end_date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })

        const dateString = `${formattedStart} - ${formattedEnd}`
        const orgName = corp?.name || "Corporation"
        const orgDescription = corp?.description

        return (
          <div key={exp.id} className="flex flex-col items-center w-full group">
            <div className="w-4 h-4 rounded-full bg-blue-500 mb-4 shadow-[0_0_0_4px_rgba(59,130,246,0.2)] dark:shadow-[0_0_0_4px_rgba(59,130,246,0.4)] z-10 transition-transform duration-300 group-hover:scale-105 will-change-transform" />
            <Link
              href={`/experiences/work/${exp.slug}`}
              className="block w-full"
            >
              <div
                className="
                    flex flex-row items-start gap-6 
                    p-6 rounded-2xl border
                    bg-white dark:bg-zinc-900/40 
                    border-zinc-200 dark:border-zinc-800
                    transition-all duration-300 ease-out
                    hover:scale-101 hover:bg-zinc-100 dark:hover:bg-zinc-800 will-change-transform backface-hidden
                    cursor-pointer w-full opacity-0
                "
                style={{
                  animation: `fadeUp 0.5s ease-out forwards`,
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden flex items-center justify-center p-2 relative">
                  {logoMedia?.url ? (
                    <SkeletonImage
                      src={getOriginalImageUrl(logoMedia) ?? logoMedia.url}
                      alt={orgName}
                      fill
                      sizes="(max-width: 768px) 64px, 80px"
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="text-zinc-400 font-bold text-xl uppercase">
                      {orgName.substring(0, 2)}
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center h-full min-h-16 md:min-h-20">
                  <p className="text-sm md:text-base font-bold text-blue-500 hover:text-blue-400 mb-1 uppercase tracking-wide">
                    {orgName}
                  </p>

                  <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1 leading-tight">
                    {exp.title}
                  </h3>

                  {orgDescription && (
                    <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-3 max-w-xl">
                      <RichTextRenderer content={orgDescription} />
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400 font-mono">
                    <div className="flex items-center gap-1.5 uppercase tracking-wider">
                      <Calendar className="w-4 h-4" />
                      <span>{dateString}</span>
                    </div>
                    <div className="flex items-center gap-1.5 uppercase tracking-wider">
                      <MapPin className="w-4 h-4" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {!isLast && (
              <div className="w-0.5 h-12 md:h-14 bg-zinc-200 dark:bg-zinc-800 my-4 shrink-0 transition-colors" />
            )}
          </div>
        )
      })}
    </div>
  )
}
