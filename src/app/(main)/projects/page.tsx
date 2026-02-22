import { getProjectsList } from "@/lib/services/api"
import ProjectsHighlight from "@/components/pages/projects/ProjectsHighlight"
import ProjectsList from "@/components/pages/projects/ProjectsList"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects",
}

export default async function ProjectsPage() {
  const data = await getProjectsList()

  return (
    <main className="flex flex-col items-center justify-center bg-zinc-50 dark:bg-black max-w-full">
      <ProjectsHighlight />
      <ProjectsList projects={data.docs} />
    </main>
  )
}
