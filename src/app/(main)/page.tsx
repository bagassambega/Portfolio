import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { getHero } from "@/lib/services/api"
import type { Media } from "@/lib/types/payload-types"
import RichTextRenderer from "@/components/shared/RichTextRenderer"
import { ArrowDown, GraduationCap, Briefcase, Code } from "lucide-react"

export const metadata: Metadata = {
  title: "Home",
}

export default async function Home() {
  const hero = await getHero()
  const heroMedia = hero?.media as Media | undefined
  const heroImageUrl = heroMedia?.url

  return (
    <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-zinc-50 dark:bg-black font-sans relative">
      {/* Section 1: Hero */}
      <section className="h-screen w-full snap-start flex flex-col items-center justify-center relative px-6 z-10">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl w-full z-20">
          {/* Hero Photo */}
          {heroImageUrl ? (
            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800 mb-8 z-20">
              <Image
                src={heroImageUrl}
                alt={heroMedia?.alt || "Hero Media"}
                fill
                unoptimized
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-zinc-200 dark:bg-zinc-800 mb-8" />
          )}

          {/* Explore About Me Title */}
          <div className="prose prose-zinc dark:prose-invert prose-p:text-4xl md:prose-p:text-6xl prose-p:font-bold prose-p:leading-tight mb-4">
            {hero?.title ? (
              <RichTextRenderer content={hero.title} />
            ) : (
              <h1 className="text-4xl md:text-6xl font-bold font-sans">
                Explore about me
              </h1>
            )}
          </div>

          {/* Subtitle / Description */}
          {hero?.description && (
            <div className="prose prose-zinc dark:prose-invert prose-p:text-lg md:prose-p:text-xl text-zinc-500 max-w-2xl mb-12">
              <RichTextRenderer content={hero.description} />
            </div>
          )}

          {/* Find Out More Button */}
          <Link
            href="#menu"
            className="group inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl hover:shadow-blue-500/25"
          >
            Find Out More
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </Link>
        </div>

        {/* Background Decoratives */}
        <div className="absolute inset-0 bg-grid-zinc-200/50 dark:bg-grid-white/[0.02] bg-[size:32px_32px] z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-black via-transparent to-transparent z-0" />
      </section>

      {/* Section 2: Menu Cards */}
      <section
        id="menu"
        className="h-[max(100vh,800px)] lg:h-screen w-full snap-start flex flex-col items-center justify-center px-6 py-20 relative z-10"
      >
        <div className="max-w-6xl w-full flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-zinc-900 dark:text-zinc-50">
            Select a path
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {/* Educations Card */}
            <Link
              href="/educations"
              className="group relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 flex flex-col items-center justify-center p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-200/50 dark:to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <GraduationCap className="w-24 h-24 mb-6 text-zinc-400 group-hover:text-blue-500 transition-colors duration-500" />
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white z-10 mb-2">
                Educations
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                My academic journey and publications.
              </p>
            </Link>

            {/* Projects Card */}
            <Link
              href="/projects"
              className="group relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 flex flex-col items-center justify-center p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-200/50 dark:to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Code className="w-24 h-24 mb-6 text-zinc-400 group-hover:text-blue-500 transition-colors duration-500" />
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white z-10 mb-2">
                Projects
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                Portfolio of active and notable work.
              </p>
            </Link>

            {/* Experiences Card */}
            <Link
              href="/experiences"
              className="group relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 flex flex-col items-center justify-center p-8"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-200/50 dark:to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Briefcase className="w-24 h-24 mb-6 text-zinc-400 group-hover:text-blue-500 transition-colors duration-500" />
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white z-10 mb-2">
                Experiences
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                Work & organizational milestones.
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
