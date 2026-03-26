import type { Metadata } from "next"
import SkeletonImage from "@/components/shared/SkeletonImage"
import Link from "next/link"
import { getHero, getSocialMedia } from "@/lib/services/api"
import type { Media } from "@/lib/types/payload-types"
import RichTextRenderer from "@/components/shared/RichTextRenderer"
import ScrollToButton from "@/components/shared/ScrollToButton"
import { ArrowDown, GraduationCap, Briefcase, Code } from "lucide-react"

export const metadata: Metadata = {
  title: "Home",
}

export default async function Home() {
  const hero = await getHero()
  const heroMedia = hero?.media as Media | undefined
  const heroImageUrl = heroMedia?.url
  const socialMedia = await getSocialMedia()

  return (
    <div className="absolute top-0 z-[-12] h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-zinc-50 dark:bg-gray-950 font-sans">
      <section className="min-h-dvh overflow-y-hidden py-20 w-full snap-start flex flex-col items-center justify-center relative px-6 z-10">
        <div className="flex flex-col md:flex-row justify-center items-center md:justify-between gap-4 md:gap-12 max-w-6xl w-full z-20 mt-8 md:mt-0">
          {heroImageUrl ? (
            <div className="relative w-50 h-50 md:w-96 md:h-96 rounded-xl md:rounded-4xl overflow-hidden shadow-2xl mb-2 md:mb-10 z-20">
              <SkeletonImage
                src={heroImageUrl}
                alt={heroMedia?.alt || "Hero Media"}
                fill
                unoptimized
                className="object-cover"
                preload
              />
            </div>
          ) : (
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-zinc-200 dark:bg-zinc-800 mb-8" />
          )}

          <div className="flex flex-col items-center justify-center text-center gap-0 md:gap-6">
            <div className="font-sans text-zinc-800 dark:text-zinc-50 text-3xl md:text-5xl font-bold mb-2 md:mb-4">
              Bagas Sambega R.
            </div>

            <div className="font-mono tracking-widest text-muted-foreground text-sm md:text-2xl mb-4 md:mb-6">
              SOFTWARE ENGINEER
            </div>

            {hero?.description && (
              <div className="text-center prose prose-zinc dark:prose-invert prose-p:text-sm text-sm md:text-xl md:prose-p:text-2xl leading-7 md:leading-9 text-zinc-500 max-w-2xl mb-0 md:mb-12">
                <RichTextRenderer content={hero.description} />
              </div>
            )}

            <ScrollToButton
              targetId="menu"
              className="group inline-flex items-center justify-center gap-1 md:gap-2 mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-lg transition-all hover:scale-105 hover:cursor-pointer shadow-xl hover:shadow-blue-500/25 backface-hidden"
            >
              Find Out More
              <ArrowDown className="w-4.5 h-4.5 md:w-5 md:h-5 animate-bounce-down transition-transform " />
            </ScrollToButton>
          </div>
        </div>
      </section>

      <section
        id="menu"
        className="min-h-dvh py-20 w-full snap-start flex flex-col items-center justify-center px-6 relative z-10"
      >
        <div className="max-w-6xl w-full flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 md:mb-16 text-zinc-900 dark:text-zinc-50 text-center">
            Select a path
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
            <Link
              href="/educations"
              className="group relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all duration-500 hover:scale-[1.02] md:hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 flex flex-row md:flex-col items-center md:justify-center p-6 md:p-8 md:aspect-3/4 gap-4 md:gap-0 backface-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-b md:from-transparent from-zinc-200/50 to-zinc-200/50 dark:to-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <GraduationCap className="shrink-0 w-12 h-12 md:w-24 md:h-24 md:mb-6 text-zinc-400 group-hover:text-blue-500 transition-colors duration-500 z-10" />
              <div className="flex flex-col gap-2 md:items-center text-left md:text-center z-10">
                <h3 className="text-xl md:text-3xl font-bold text-zinc-900 dark:text-white md:mb-2 leading-tight">
                  Educations
                </h3>
                <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 md:delay-100 line-clamp-2 md:line-clamp-none">
                  My academic journey and publications.
                </p>
              </div>
            </Link>

            <Link
              href="/projects"
              className="group relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all duration-500 hover:scale-[1.02] md:hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 flex flex-row md:flex-col items-center md:justify-center p-6 md:p-8 md:aspect-3/4 gap-4 md:gap-0 backface-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-b md:from-transparent from-zinc-200/50 to-zinc-200/50 dark:to-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Code className="shrink-0 w-12 h-12 md:w-24 md:h-24 md:mb-6 text-zinc-400 group-hover:text-blue-500 transition-colors duration-500 z-10" />
              <div className="flex flex-col gap-2 md:items-center text-left md:text-center z-10">
                <h3 className="text-xl md:text-3xl font-bold text-zinc-900 dark:text-white md:mb-2 leading-tight">
                  Projects
                </h3>
                <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 md:delay-100 line-clamp-2 md:line-clamp-none">
                  Portfolio of active and notable work.
                </p>
              </div>
            </Link>

            <Link
              href="/experiences"
              className="group relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all duration-500 hover:scale-[1.02] md:hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 flex flex-row md:flex-col items-center md:justify-center p-6 md:p-8 md:aspect-3/4 gap-4 md:gap-0 backface-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-b md:from-transparent from-zinc-200/50 to-zinc-200/50 dark:to-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Briefcase className="shrink-0 w-12 h-12 md:w-24 md:h-24 md:mb-6 text-zinc-400 group-hover:text-blue-500 transition-colors duration-500 z-10" />
              <div className="flex flex-col gap-2 md:items-center text-left md:text-center z-10">
                <h3 className="text-xl md:text-3xl font-bold text-zinc-900 dark:text-white md:mb-2 leading-tight">
                  Experiences
                </h3>
                <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 md:delay-100 line-clamp-2 md:line-clamp-none">
                  Work & organizational milestones.
                </p>
              </div>
            </Link>
          </div>


            {socialMedia && socialMedia.length > 0 && (
              <div className="flex gap-4 mt-2 md:mt-0">
                {socialMedia.map((sm) => {
                  if (!sm.logo) return null
                  return (
                    <a
                      key={sm.id}
                      href={sm.url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={sm.name}
                      className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200"
                    >
                      {sm.logo}
                    </a>
                  )
                })}
              </div>
            )}
        </div>
      </section>
    </div>
  )
}
