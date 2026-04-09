import React from "react"
import Link from "next/link"
import SkeletonImage from "@/components/shared/SkeletonImage"
import { Calendar, MapPin } from "lucide-react"
import type { OrganizationExperienceListItem } from "@/lib/services/api"
import type { Media, Corporation } from "@/lib/types/payload-types"
import { getOriginalImageUrl } from "@/lib/helpers"

interface Props {
  experience: OrganizationExperienceListItem
  index?: number
}

export default function OrganizationExperienceCard({ experience }: Props) {
  const corp = experience.corporation as Corporation
  const logoMedia = corp?.logo as Media | undefined

  const startDate = new Date(experience.starting_date)
  const formattedStart = startDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  })

  const formattedEnd =
    experience.type === "Ongoing" || !experience.end_date
      ? "Present"
      : new Date(experience.end_date).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })

  const dateString = `${formattedStart} - ${formattedEnd}`

  // Organization name as card title, Position (experience.title) as subtitle
  const orgName = corp?.name || "Organization"
  const positionTitle = experience.title

  return (
    <Link
      href={`/experiences/organization/${experience.slug}`}
      className="block w-full"
    >
      <div
        className="
                    flex flex-row items-start gap-6 
                    p-6 rounded-2xl border
                    bg-white dark:bg-zinc-900/40 
                    border-zinc-200 dark:border-zinc-800
                    transition-all duration-300 ease-out
                    hover:scale-105 hover:bg-zinc-100 dark:hover:bg-zinc-800
                    cursor-pointer w-full backface-hidden
                "
      >
        {/* Left side: Logo */}
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

        {/* Right side: Content */}
        <div className="flex flex-col justify-center h-full min-h-16 md:min-h-20">
          <p className="text-sm md:text-base font-bold text-blue-500 hover:text-blue-400 mb-1 tracking-wider uppercase">
            {orgName}
          </p>

          <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-tight">
            {positionTitle}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400 font-mono">
            <div className="flex items-center gap-1.5 uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>{dateString}</span>
            </div>
            <div className="flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>{experience.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
