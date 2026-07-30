import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WorkExperienceTimeline from "@/components/pages/experiences/WorkExperienceTimeline"
import OrganizationExperienceCard from "@/components/pages/experiences/OrganizationExperienceCard"
import {
  getOrganizationExperiencesList,
  getWorkExperiencesList,
} from "@/lib/services/api"

type ExperiencesViewProps = {
  activeTab: "work" | "organization"
}

export default async function ExperiencesView({
  activeTab,
}: ExperiencesViewProps) {
  const isWork = activeTab === "work"
  const workExperiences = isWork ? await getWorkExperiencesList() : []
  const orgExperiences = isWork ? [] : await getOrganizationExperiencesList()

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-zinc-50 dark:bg-gray-950 w-full px-4">
      <div className="flex flex-col items-center w-full max-w-5xl gap-2 md:gap-8">
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans tracking-tight text-zinc-900 dark:text-zinc-50">
            Experiences
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
            A timeline of my professional work and organizational involvement.
          </p>
        </div>

        <Tabs value={activeTab} className="w-full mt-8">
          <div className="flex justify-center mb-12">
            <TabsList className="grid w-full p-0 max-w-100 grid-cols-2 rounded-lg bg-zinc-200/50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <TabsTrigger
                value="work"
                asChild
                className="rounded-lg text-sm md:text-base font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm transition-all hover:cursor-pointer"
              >
                <Link href="/experiences/work">Work</Link>
              </TabsTrigger>
              <TabsTrigger
                value="organization"
                asChild
                className="rounded-lg text-sm md:text-base font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm transition-all hover:cursor-pointer"
              >
                <Link href="/experiences/organization">Organization</Link>
              </TabsTrigger>
            </TabsList>
          </div>

          {isWork ? (
            <TabsContent
              value="work"
              className="w-full mt-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <div className="flex flex-col items-center w-full">
                <h3 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
                  Work Experiences
                </h3>
                <WorkExperienceTimeline experiences={workExperiences} />
              </div>
            </TabsContent>
          ) : (
            <TabsContent
              value="organization"
              className="w-full mt-0 focus-visible:outline-none focus-visible:ring-0"
            >
              <div className="flex flex-col items-center w-full">
                <h3 className="text-2xl font-semibold mb-8 text-zinc-800 dark:text-zinc-200">
                  Organizational Experiences
                </h3>
                <div className="grid grid-cols-1 w-full max-w-4xl gap-5 md:gap-6">
                  {orgExperiences.length > 0 ? (
                    orgExperiences.map((exp) => (
                      <OrganizationExperienceCard
                        key={exp.id}
                        experience={exp}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 text-zinc-500">
                      No organization experiences found.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </main>
  )
}
