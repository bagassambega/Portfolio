import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

async function getProjects() {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return [
    {
      id: 1,
      title: "Portfolio Website",
      description: "Personal portfolio built with Next.js and Payload CMS.",
      tag: "Web",
      image: "/project-placeholder.svg",
      date: "2025-01-15",
    },
    {
      id: 2,
      title: "E-Commerce App",
      description: "Full-stack e-commerce platform with cart and checkout.",
      tag: "Fullstack",
      image: "/project-placeholder.svg",
      date: "2024-11-03",
    },
    {
      id: 3,
      title: "CLI Tool",
      description: "A developer productivity tool built in Rust.",
      tag: "Systems",
      image: "/project-placeholder.svg",
      date: "2024-08-20",
    },
  ]
}

export default async function ProjectsList() {
  const projects = await getProjects()

  return (
    <section className="w-full max-w-6xl px-6 py-10">
      <h2 className="text-2xl font-semibold mb-6">All Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link key={project.id} href="#" className="group">
            <Card className="flex flex-col overflow-hidden transition-shadow group-hover:shadow-lg">
              <div className="relative w-full aspect-video">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="flex flex-col gap-2 p-4">
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full w-fit">
                  {project.tag}
                </span>
                <h3 className="font-semibold text-base leading-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
                <time className="text-xs text-muted-foreground mt-1">
                  {new Date(project.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
