import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function ProjectCardSkeleton() {
  return (
    <Card className="grid overflow-hidden p-0 md:grid-cols-[minmax(18rem,0.95fr)_minmax(0,1.25fr)]">
      <Skeleton className="aspect-video w-full rounded-none md:h-full md:min-h-64" />
      <CardContent className="flex flex-col justify-center gap-4 p-5 md:p-7">
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-8 w-3/4 md:h-10" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="mt-1 h-5 w-28" />
      </CardContent>
    </Card>
  )
}
