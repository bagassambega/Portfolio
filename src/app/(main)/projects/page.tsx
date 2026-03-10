import { getProjectsList } from "@/lib/services/api"
import ProjectsHighlight from "@/components/pages/projects/ProjectsHighlight"
import ProjectsList from "@/components/pages/projects/ProjectsList"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects",
}

export default async function ProjectsPage() {
  const data = await getProjectsList()  
  const highlightedProjects = data.docs.filter((p) => p.isHighlighted)

  return (
    <main className="flex flex-col items-center justify-center bg-zinc-50 dark:bg-gray-950 max-w-full">
      <div className="w-full max-w-5xl px-6 flex flex-col justify-center items-center font-inter">
        <div className="flex flex-col items-center justify-center gap-4 mb-10 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans tracking-tight text-zinc-900 dark:text-zinc-50">
            Projects  
          </h2>
          <span className="text-lg md:text-xl dark:text-gray-400 text-gray-600 text-center">
            All projects I participated and created
          </span>
        </div>
        <ProjectsHighlight projects={highlightedProjects} />
        <ProjectsList projects={data.docs} />
      </div>
    </main>
  )
}
