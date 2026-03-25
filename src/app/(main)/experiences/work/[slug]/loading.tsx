import SlugPageLayout from "@/components/shared/SlugPageLayout"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <SlugPageLayout
      tocItems={[
        { id: "overview", label: "Overview" },
        { id: "role-description", label: "Work Description" },
        { id: "tech-stack", label: "Tech Stack" },
        { id: "results", label: "Results & Deliverables" },
        { id: "documentation", label: "Documentation" },
      ]}
    >
      <div className="font-inter">
        <Skeleton className="h-5 w-44 mb-12" />

        <section
          id="overview"
          className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12"
        >
          <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-3xl" />

          <div className="flex flex-col w-full">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-7 w-20 rounded-full" />
            </div>
          </div>
        </section>

        <Skeleton className="w-full h-px mb-12" />

        <section id="role-description" className="mb-16">
          <Skeleton className="h-8 w-44 mb-6" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>
        </section>

        <section id="tech-stack" className="mb-16">
          <Skeleton className="h-8 w-36 mb-6" />
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        </section>

        <section id="results" className="mb-16">
          <Skeleton className="h-8 w-56 mb-6" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        </section>

        <section id="documentation" className="mb-12">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <Skeleton className="w-full aspect-video rounded-xl" />
              <Skeleton className="h-4 w-44 mx-auto" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-full aspect-video rounded-xl" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
          </div>
        </section>
      </div>
    </SlugPageLayout>
  )
}
