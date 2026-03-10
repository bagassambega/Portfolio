import Link from "next/link"
import SkeletonImage from "@/components/shared/SkeletonImage"
import { Card, CardContent } from "@/components/ui/card"
import { getImageUrl, lexicalToPlainText, formatDateFull } from "@/lib/helpers"
import ProjectTypeBadge from "@/components/ProjectTypeBadge"
import type { ProjectListItem } from "@/lib/services/api"

export default function ProjectsList({
  projects,
}: {
  projects: ProjectListItem[]
}) {
  return (
    <section id="project-list">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <Link
            key={project["project-slug"]}
            href={"/projects/" + project["project-slug"]}
            rel="noopener noreferrer"
            className="group"
          >
            <Card
              className="flex flex-col overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 hover:bg-zinc-100 dark:hover:bg-zinc-900 pt-0 opacity-0"
              style={{
                animation: `fadeUp 0.5s ease-out forwards`,
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative w-full aspect-video">
                <SkeletonImage
                  src={
                    getImageUrl(project["media-highlight"]) ??
                    "/project-placeholder.svg"
                  }
                  alt={project.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-101 transition-transform duration-300"
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
              <CardContent className="flex flex-col gap-2 px-4 sm:py-4 flex-1 min-w-0 justify-center">
                {typeof project.type === "object" && project.type !== null ? (
                  <ProjectTypeBadge
                    name={project.type.name}
                    color={project.type.color}
                    className="text-xs font-medium px-2.5 py-1 rounded-full w-fit"
                  />
                ) : (
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full w-fit">
                    {String(project.type)}
                  </span>
                )}
                <h3 className="font-semibold text-base leading-tight group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {lexicalToPlainText(project["highlighted-description"])}
                </p>
                <span className="text-xs text-muted-foreground mt-1">
                  <time>{formatDateFull(project.starting_date)}</time>
                  {project.end_date ? (
                    <>
                      <time>- {formatDateFull(project.end_date)}</time>
                    </>
                  ) : (
                    <>{" - Present"}</>
                  )}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
