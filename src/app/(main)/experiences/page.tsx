import type { Metadata } from "next"
import {
  getWorkExperiencesList,
  getOrganizationExperiencesList,
} from "@/lib/services/api"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WorkExperienceTimeline from "@/components/WorkExperienceTimeline"
import OrganizationExperienceCard from "@/components/OrganizationExperienceCard"

export const metadata: Metadata = {
  title: "Experiences",
}

export default async function ExperiencesPage() {
  const workExperiences = await getWorkExperiencesList()
  const orgExperiences = await getOrganizationExperiencesList()

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-zinc-50 dark:bg-black w-full px-4 py-12 md:py-24">
      <div className="flex flex-col items-center w-full max-w-5xl gap-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans tracking-tight text-zinc-900 dark:text-zinc-50">
            Experiences
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
            A timeline of my professional work and organizational involvement.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="work" className="w-full mt-8">
          <div className="flex justify-center mb-12">
            <TabsList className="grid w-full max-w-100 grid-cols-2 rounded-full p-1 bg-zinc-200/50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <TabsTrigger
                value="work"
                className="rounded-full text-sm md:text-base font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm transition-all"
              >
                Work
              </TabsTrigger>
              <TabsTrigger
                value="org"
                className="rounded-full text-sm md:text-base font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm transition-all"
              >
                Organization
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="work"
            className="w-full mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="flex flex-col items-center w-full">
              <h3 className="text-2xl font-semibold mb-8 text-zinc-800 dark:text-zinc-200">
                Work Experiences
              </h3>
              <WorkExperienceTimeline experiences={workExperiences} />
            </div>
          </TabsContent>

          <TabsContent
            value="org"
            className="w-full mt-0 focus-visible:outline-none focus-visible:ring-0"
          >
            <div className="flex flex-col items-center w-full">
              <h3 className="text-2xl font-semibold mb-8 text-zinc-800 dark:text-zinc-200">
                Organization Experiences
              </h3>
              <div className="grid grid-cols-1 w-full max-w-3xl gap-6">
                {orgExperiences.length > 0 ? (
                  orgExperiences.map((exp) => (
                    <OrganizationExperienceCard key={exp.id} experience={exp} />
                  ))
                ) : (
                  <div className="text-center py-12 text-zinc-500">
                    No organization experiences found.
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
