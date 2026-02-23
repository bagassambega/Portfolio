import type { Metadata } from "next"
import Image from "next/image"
import { getEducationsList, getPublicationsList } from "@/lib/services/api"
import { getImageUrl } from "@/lib/helpers"
import PublicationCard from "@/components/PublicationCard"
import type { Media } from "@/lib/types/payload-types"

export const metadata: Metadata = {
  title: "Educations",
}

export default async function EducationsPage() {
  const educations = await getEducationsList()
  const publications = await getPublicationsList()

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-zinc-50 dark:bg-black w-full px-4 py-12 md:py-24">
      <div className="flex flex-col w-full max-w-6xl gap-16">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans tracking-tight text-zinc-900 dark:text-zinc-50">
            Educations
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
            My academic background and notable publications.
          </p>
        </div>

        {/* Massive Education Cards */}
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {educations.map((edu, index) => {
              const logoMedia = edu.logo as Media | undefined
              const logoUrl = logoMedia ? getImageUrl(logoMedia) : null

              return (
                <div
                  key={edu.id}
                  className="flex flex-col items-center justify-center p-12 bg-zinc-100 dark:bg-[#1a1a1a] border border-zinc-200 dark:border-zinc-800 rounded-[2rem] hover:bg-zinc-200 dark:hover:bg-[#222] transition-colors duration-300 opacity-0"
                  style={{
                    animation: `fadeUp 0.5s ease-out forwards`,
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {logoUrl ? (
                    <div className="relative w-40 h-40 md:w-48 md:h-48 mb-8 drop-shadow-2xl">
                      <Image
                        src={logoUrl}
                        alt={logoMedia?.alt || edu.name}
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-40 h-40 md:w-48 md:h-48 mb-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  )}
                  <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white text-center mb-2">
                    {edu.name}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-lg text-center">
                    {edu.level}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 my-8" />

        {/* Publications Grid */}
        <section className="w-full flex flex-col items-center">
          <div className="flex flex-col items-center text-center gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-zinc-900 dark:text-zinc-50">
              Publications & Articles
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Documents, papers, and write-ups I have authored.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {publications.length > 0 ? (
              publications.map((pub, index) => (
                <PublicationCard key={pub.id} publication={pub} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-zinc-500">
                No publications found yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
