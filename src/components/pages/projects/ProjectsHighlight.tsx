"use client"

import { useCallback, useState, useEffect } from "react"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import SkeletonImage from "@/components/shared/SkeletonImage"
import ProjectTypeBadge from "@/components/ProjectTypeBadge"
import { getImageUrl } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import type { ProjectListItem } from "@/lib/services/api"

export default function ProjectsHighlight({
  projects,
}: {
  projects: ProjectListItem[]
}) {
  const single = projects.length === 1
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: !single,
    watchDrag: !single,
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  // Auto-advance every 5 seconds (skip for single item)
  useEffect(() => {
    if (!emblaApi || single) return
    const timer = setInterval(() => emblaApi.scrollNext(), 5000)
    return () => clearInterval(timer)
  }, [emblaApi, single])

  if (projects.length === 0) return null

  return (
    <section id="project-highlight" className="w-full mb-10 md:mb-14">
      <div className="relative rounded-xl w-full">
        {/* Carousel viewport */}
        <div ref={emblaRef} className="overflow-hidden rounded-xl">
          <div className="flex">
            {projects.map((project) => (
              <div
                key={project["project-slug"]}
                className="min-w-0 shrink-0 grow-0 basis-full"
              >
                <Link
                  href={"/projects/" + project["project-slug"]}
                  className="block relative w-full aspect-video"
                >
                  <SkeletonImage
                    src={
                      getImageUrl(project["media-highlight"]) ??
                      "/project-placeholder.svg"
                    }
                    alt={project.title}
                    fill
                    unoptimized
                    className="object-cover"
                    priority
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                  {/* Bottom-left info */}
                  <div className="absolute bottom-10 left-4 flex flex-col gap-1.5 pointer-events-none">
                    {typeof project.type === "object" &&
                      project.type !== null && (
                        <ProjectTypeBadge
                          name={project.type.name}
                          color={project.type.color}
                          className="text-xs font-medium px-2.5 py-1 rounded-full w-fit"
                        />
                      )}
                    <h3 className="text-white font-semibold text-lg md:text-2xl leading-tight drop-shadow-lg">
                      {project.title}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Previous button */}
        {!single && (
          <button
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center size-9 rounded-full cursor-pointer bg-black/40 hover:bg-black/65 text-white transition-colors backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}

        {/* Next button */}
        {!single && (
          <button
            onClick={scrollNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center size-9 rounded-full cursor-pointer bg-black/40 hover:bg-black/65 text-white transition-colors backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight className="size-5" />
          </button>
        )}

        {/* Navigation dots */}
        {!single && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  index === selectedIndex
                    ? "size-2.5 bg-white"
                    : "size-2 bg-white/50 hover:bg-white/75"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
