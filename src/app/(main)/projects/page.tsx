import ProjectsHighlight from "@/components/pages/projects/ProjectsHighlight"
import ProjectsList from "@/components/pages/projects/ProjectsList"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects",
}

export default function ProjectsPage() {
  return (
    <main className="flex flex-col items-center justify-center bg-zinc-50 dark:bg-black max-w-full">
      <ProjectsHighlight />
      <ProjectsList />
    </main>
  )
}
