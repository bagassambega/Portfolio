import type { Metadata } from "next"
import { getEducationsList, getPublicationsList } from "@/lib/services/api"
import PublicationCard from "@/components/pages/educations/PublicationCard"
import EducationalModal from "@/components/pages/educations/EducationModal"

export const metadata: Metadata = {
  title: "Educations",
}

export default async function EducationsPage() {
  const educations = await getEducationsList()
  const publications = await getPublicationsList()

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-zinc-50 dark:bg-gray-950 w-full px-4 py-12 md:py-24">
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

        {/* Education Cards */}
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <EducationalModal educations={educations}/>
          </div>
        </section>

        <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 my-8" />

        {/* Publications List */}
        <section className="w-full flex flex-col items-center">
          <div className="flex flex-col items-center text-center gap-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-zinc-900 dark:text-zinc-50">
              Publications & Articles
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Documents, papers, and write-ups I have authored.
            </p>
          </div>

          <div className="flex flex-col justify-center items-center gap-2 md:gap-4 w-full">
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
