import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function ProjectCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      <Skeleton className="w-full aspect-video rounded-none" />
      <CardContent className="flex flex-col gap-3 p-4">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-4 w-28 mt-1" />
      </CardContent>
    </Card>
  )
}
