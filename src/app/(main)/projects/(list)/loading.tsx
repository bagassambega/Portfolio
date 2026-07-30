import ProjectCardSkeleton from "@/components/pages/projects/ProjectCardSkeleton"

export default function Loading() {
  return (
    <main className="flex flex-col items-center justify-center bg-zinc-50 dark:bg-gray-950 max-w-full">
      <section className="w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-5 md:gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </main>
  )
}
