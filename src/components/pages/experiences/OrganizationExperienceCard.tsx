import React from "react"
import Link from "next/link"
import SkeletonImage from "@/components/shared/SkeletonImage"
import { ArrowRight, Calendar, MapPin } from "lucide-react"
import type { OrganizationExperienceListItem } from "@/lib/services/api"
import type { Media, Corporation } from "@/lib/types/payload-types"
import { getOriginalImageUrl } from "@/lib/helpers"
import { CorporationHoverPreview } from "./CorporationProfile"

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

  const card = (
    <Link
      href={`/experiences/organization/${experience.slug}`}
      className="group block w-full"
    >
      <div
        className="
                    flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7
                    p-5 md:p-7 rounded-2xl border
                    bg-white dark:bg-zinc-900/40 
                    border-zinc-200 dark:border-zinc-800
                    transition-all duration-300 ease-out
                    hover:-translate-y-0.5 hover:border-blue-200 hover:bg-zinc-100 hover:shadow-lg dark:hover:border-blue-500/30 dark:hover:bg-zinc-800/80
                    cursor-pointer w-full backface-hidden
                "
      >
        {/* Left side: Logo */}
        <div
          data-corporation-preview-trigger
          className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-100 bg-white p-2 shadow-sm dark:border-zinc-800 md:h-20 md:w-20"
        >
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
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <p
            data-corporation-preview-trigger
            className="mb-1 text-sm font-bold uppercase tracking-wider text-blue-500 hover:text-blue-400 md:text-base"
          >
            {orgName}
          </p>

          <h3 className="mb-3 text-xl font-bold leading-tight text-zinc-900 dark:text-zinc-100 md:text-2xl">
            {positionTitle}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-sm text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5 uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>{dateString}</span>
            </div>
            <div className="flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>{experience.location}</span>
            </div>
            <span className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs uppercase tracking-wider text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
              {experience.type}
            </span>
          </div>
        </div>

        <div className="hidden self-center text-blue-500 transition-transform group-hover:translate-x-1 sm:block">
          <ArrowRight className="h-5 w-5" />
        </div>
      </div>
    </Link>
  )

  return corp ? (
    <CorporationHoverPreview corporation={corp}>
      {card}
    </CorporationHoverPreview>
  ) : (
    card
  )
}
