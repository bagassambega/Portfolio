import Link from "next/link"
import Image from "next/image"
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
    <section className="w-full max-w-5xl px-6 flex flex-col justify-center items-center font-inter">
      <div className="flex flex-col items-center justify-center gap-4 mb-16">
        <h2 className="text-3xl md:text-5xl font-semibold font-sans">
          Projects
        </h2>
        <span className="dark:text-gray-400 text-gray-600">
          All projects I participated and created to implement my knowledge and
          enhance my skills
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <Link
            key={project["project-slug"]}
            href={"/projects/" + project["project-slug"]}
            rel="noopener noreferrer"
            className="group"
          >
            <Card
              className="flex flex-col overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 pt-0 opacity-0"
              style={{
                animation: `fadeUp 0.5s ease-out forwards`,
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative w-full aspect-video">
                <Image
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
              <CardContent className="flex flex-col gap-2 px-4">
                {typeof project.type === "object" && project.type !== null ? (
                  <ProjectTypeBadge
                    name={project.type.name}
                    color={project.type.color}
                  />
                ) : (
                  <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full w-fit">
                    {String(project.type)}
                  </span>
                )}
                <h3 className="font-semibold text-base leading-tight">
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
