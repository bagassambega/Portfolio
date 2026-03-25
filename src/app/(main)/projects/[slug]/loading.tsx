import SlugPageLayout from "@/components/shared/SlugPageLayout"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <SlugPageLayout
      tocItems={[
        { id: "overview", label: "Overview" },
        { id: "description", label: "Description" },
        { id: "tech-stack", label: "Tech Stack" },
        { id: "screenshots", label: "Screenshots" },
      ]}
    >
      <div className="font-inter">
        <Skeleton className="h-5 w-36 mb-8" />

        <section id="overview" className="mb-12">
          <Skeleton className="w-full aspect-video rounded-2xl mb-8" />

          <div className="mb-4">
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          <Skeleton className="h-12 w-3/4 mb-3" />

          <div className="mb-6 space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-9 w-36 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
        </section>

        <section id="description" className="mb-12">
          <Skeleton className="h-8 w-44 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        </section>

        <section id="tech-stack" className="mb-16">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-8 w-32 rounded-lg" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </section>

        <section id="screenshots" className="mb-12">
          <Skeleton className="h-8 w-40 mb-6" />
          <div className="flex flex-col gap-8">
            <div className="space-y-2">
              <Skeleton className="w-full aspect-video rounded-xl" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-full aspect-video rounded-xl" />
              <Skeleton className="h-4 w-44 mx-auto" />
            </div>
          </div>
        </section>
      </div>
    </SlugPageLayout>
  )
}
