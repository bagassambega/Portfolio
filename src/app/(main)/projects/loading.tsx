import ProjectCardSkeleton from "@/components/pages/projects/ProjectCardSkeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main className="flex flex-col items-center justify-center bg-zinc-50 dark:bg-black max-w-full">
      <section className="w-full max-w-6xl px-6 py-10">
        <Skeleton className="h-8 w-40 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </main>
  )
}
