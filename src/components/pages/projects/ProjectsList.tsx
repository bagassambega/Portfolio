import Link from "next/link"
import SkeletonImage from "@/components/shared/SkeletonImage"
import { Card, CardContent } from "@/components/ui/card"
import { getImageUrl } from "@/lib/helpers"
import RichTextRenderer from "@/components/shared/RichTextRenderer"
import ProjectTypeBadge from "@/components/pages/projects/ProjectTypeBadge"
import type { ProjectListItem } from "@/lib/services/api"
import { ArrowRight, Calendar } from "lucide-react"

export default function ProjectsList({
  projects,
}: {
  projects: ProjectListItem[]
}) {
  return (
    <section id="project-list" className="w-full">
      <div className="flex flex-col gap-5 md:gap-6">
        {projects.map((project, index) => {
          const startDate = new Date(project.starting_date).toLocaleDateString(
            "en-US",
            {
              month: "short",
              year: "numeric",
            }
          )
          const endDate = project.end_date
            ? new Date(project.end_date).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })
            : "Present"

          return (
          <Link
            key={project["project-slug"]}
            href={"/projects/" + project["project-slug"]}
            rel="noopener noreferrer"
            className="group"
          >
            <Card
              className="grid overflow-hidden border-zinc-200 bg-white/85 p-0 opacity-0 shadow-sm transition-all duration-300 hover:border-blue-200 hover:bg-zinc-50 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900/45 dark:hover:border-blue-500/30 dark:hover:bg-zinc-900 md:grid-cols-[minmax(18rem,0.95fr)_minmax(0,1.25fr)]"
              style={{
                animation: `fadeUp 0.5s ease-out forwards`,
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 md:h-full md:min-h-64">
                <SkeletonImage
                  src={
                    getImageUrl(project["media-highlight"]) ??
                    "/project-placeholder.svg"
                  }
                  alt={project.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
              <CardContent className="flex min-w-0 flex-col justify-center gap-4 p-5 md:p-7">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {typeof project.type === "object" && project.type !== null ? (
                    <ProjectTypeBadge
                      name={project.type.name}
                      color={project.type.color}
                      className="w-fit rounded-full px-2.5 py-1 text-xs font-medium"
                    />
                  ) : (
                    <span className="w-fit rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                      {String(project.type)}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <Calendar className="h-3.5 w-3.5" />
                    <time>{startDate}</time>
                    <span>-</span>
                    <time>{endDate}</time>
                  </span>
                </div>

                <h3 className="text-2xl font-semibold leading-tight text-zinc-900 transition-colors duration-300 group-hover:text-blue-700 dark:text-zinc-50 dark:group-hover:text-blue-400 md:text-3xl">
                  {project.title}
                </h3>
                <RichTextRenderer
                  content={project["highlighted-description"]}
                  className="font-inter text-sm leading-relaxed text-zinc-600 line-clamp-4 dark:text-zinc-300 md:text-base [&>ol]:mb-0 [&>p]:mb-0 [&>ul]:mb-0"
                />
                <span className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors group-hover:text-blue-500 dark:text-blue-400">
                  View project
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </CardContent>
            </Card>
          </Link>
        )})}
      </div>
    </section>
  )
}
