import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"
import config from "@payload-config"
import { CACHE_TAGS } from "@/_config/Constant"
import {
  getImageUrl,
  getOriginalImageUrl,
  lexicalToPlainText,
} from "@/lib/helpers"
import type {
  Corporation,
  Education,
  Media,
  OrganizationExperience,
  Project,
  ProjectType,
  Publication,
  Techstack,
  WorkExperience,
} from "@/lib/types/payload-types"
import type { SearchItem } from "@/lib/search"

const payload = await getPayload({ config })

function isObject<T extends { id: number }>(value: unknown): value is T {
  return typeof value === "object" && value !== null && "id" in value
}

function unique(values: Array<string | null | undefined>) {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value?.trim())))
  )
}

function richTextToString(content: unknown) {
  if (
    content &&
    typeof content === "object" &&
    "root" in content &&
    typeof content.root === "object"
  ) {
    return lexicalToPlainText(content as { root: Record<string, unknown> })
  }

  return ""
}

function excerpt(...values: string[]) {
  return values
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180)
}

function getMediaPreview(media: unknown, variant: "card" | "original" = "card") {
  if (!isObject<Media>(media)) return {}

  return {
    imageUrl:
      variant === "original" ? getOriginalImageUrl(media) : getImageUrl(media),
    imageAlt: media.alt,
  }
}

function emptyFacets() {
  return {
    techStacks: [],
    locations: [],
    statuses: [],
    organizations: [],
    labels: [],
  }
}

const pageItems: SearchItem[] = [
  {
    id: "page-home",
    title: "Home",
    href: "/",
    contentType: "page",
    typeLabel: "Page",
    subtype: "About",
    excerpt: "Personal introduction and portfolio navigation.",
    facets: {
      ...emptyFacets(),
      labels: ["About", "Profile"],
    },
    tags: ["About", "Home", "Profile"],
    searchText: "home about profile introduction bagas sambega software engineer",
  },
  {
    id: "page-projects",
    title: "Projects",
    href: "/projects",
    contentType: "page",
    typeLabel: "Page",
    subtype: "Projects",
    excerpt: "Portfolio of active and notable work.",
    facets: {
      ...emptyFacets(),
      labels: ["Portfolio"],
    },
    tags: ["Projects", "Portfolio"],
    searchText: "projects portfolio work software development",
  },
  {
    id: "page-experiences",
    title: "Experiences",
    href: "/experiences/work",
    contentType: "page",
    typeLabel: "Page",
    subtype: "Experiences",
    excerpt: "Work and organizational milestones.",
    facets: {
      ...emptyFacets(),
      labels: ["Work", "Organization"],
    },
    tags: ["Experiences", "Work", "Organization"],
    searchText: "experiences work organization career internship",
  },
  {
    id: "page-educations",
    title: "Educations",
    href: "/educations",
    contentType: "page",
    typeLabel: "Page",
    subtype: "Educations",
    excerpt: "Academic journey and publications.",
    facets: {
      ...emptyFacets(),
      labels: ["Academic", "Publications"],
    },
    tags: ["Educations", "Publications", "Academic"],
    searchText: "educations academic publications school university",
  },
]

export async function getSearchIndex(): Promise<SearchItem[]> {
  "use cache"
  cacheLife("days")
  cacheTag(CACHE_TAGS.PROJECTS)
  cacheTag(CACHE_TAGS.PROJECT_TYPES)
  cacheTag(CACHE_TAGS.TECHSTACKS)
  cacheTag(CACHE_TAGS.WORK_EXPERIENCES)
  cacheTag(CACHE_TAGS.ORGANIZATION_EXPERIENCES)
  cacheTag(CACHE_TAGS.CORPORATIONS)
  cacheTag(CACHE_TAGS.EDUCATION)
  cacheTag(CACHE_TAGS.PUBLICATIONS)

  const [projects, workExperiences, organizationExperiences, educations, publications] =
    await Promise.all([
      payload.find({
        collection: "project",
        limit: 0,
        depth: 2,
        sort: "-starting_date",
      }),
      payload.find({
        collection: "work-experience",
        limit: 0,
        depth: 2,
        sort: "-starting_date",
      }),
      payload.find({
        collection: "organization-experience",
        limit: 0,
        depth: 2,
        sort: "-starting_date",
      }),
      payload.find({
        collection: "education",
        limit: 0,
        depth: 1,
        sort: "createdAt",
      }),
      payload.find({
        collection: "publication",
        limit: 0,
        depth: 1,
        sort: "-publishDate",
      }),
    ])

  const projectItems: SearchItem[] = (projects.docs as Project[]).map(
    (project) => {
      const type = isObject<ProjectType>(project.type) ? project.type : null
      const techstacks = (project.techstack ?? []).filter(
        (tech): tech is Techstack => isObject<Techstack>(tech)
      )
      const highlighted = richTextToString(project["highlighted-description"])
      const description = richTextToString(project.description)
      const status = project.end_date ? "Finished" : "Present"
      const tags = unique([
        type?.name,
        ...techstacks.map((tech) => tech.name),
        status,
      ])

      return {
        id: `project-${project.id}`,
        title: project.title,
        href: `/projects/${project["project-slug"]}`,
        contentType: "project",
        typeLabel: "Project",
        subtype: type?.name ?? "Project",
        date: project.starting_date,
        endDate: project.end_date,
        ...getMediaPreview(project["media-highlight"], "card"),
        excerpt: excerpt(highlighted, description),
        facets: {
          ...emptyFacets(),
          techStacks: techstacks.map((tech) => tech.name),
          statuses: [status],
          labels: type?.name ? [type.name] : [],
        },
        tags,
        searchText: [
          project.title,
          type?.name,
          highlighted,
          description,
          ...tags,
        ].join(" "),
      }
    }
  )

  const workItems: SearchItem[] = (
    workExperiences.docs as WorkExperience[]
  ).map((experience) => {
    const corp = isObject<Corporation>(experience.corporation)
      ? experience.corporation
      : null
    const techstacks = (experience.techstacks ?? []).filter(
      (tech): tech is Techstack => isObject<Techstack>(tech)
    )
    const description = richTextToString(experience.description)
    const result = richTextToString(experience.result)
    const tags = unique([
      "Work",
      experience.type,
      experience.location,
      corp?.name,
      corp?.city,
      corp?.country,
      ...techstacks.map((tech) => tech.name),
    ])

    return {
      id: `work-experience-${experience.id}`,
      title: `${experience.title}${corp ? ` at ${corp.name}` : ""}`,
      href: `/experiences/work/${experience.slug}`,
      contentType: "work-experience",
      typeLabel: "Experience",
      subtype: "Work Experience",
      date: experience.starting_date,
      endDate: experience.end_date,
      ...getMediaPreview(corp?.logo, "original"),
      excerpt: excerpt(description, result),
      facets: {
        ...emptyFacets(),
        techStacks: techstacks.map((tech) => tech.name),
        locations: [experience.location],
        statuses: [experience.type],
        organizations: corp?.name ? [corp.name] : [],
        labels: ["Work"],
      },
      tags,
      searchText: [
        experience.title,
        corp?.name,
        corp?.city,
        corp?.country,
        experience.type,
        experience.location,
        description,
        result,
        ...tags,
      ].join(" "),
    }
  })

  const organizationItems: SearchItem[] = (
    organizationExperiences.docs as OrganizationExperience[]
  ).map((experience) => {
    const corp = isObject<Corporation>(experience.corporation)
      ? experience.corporation
      : null
    const description = richTextToString(experience.description)
    const result = richTextToString(experience.result)
    const tags = unique([
      "Organization",
      experience.type,
      experience.location,
      corp?.name,
      corp?.city,
      corp?.country,
    ])

    return {
      id: `organization-experience-${experience.id}`,
      title: `${experience.title}${corp ? ` at ${corp.name}` : ""}`,
      href: `/experiences/organization/${experience.slug}`,
      contentType: "organization-experience",
      typeLabel: "Experience",
      subtype: "Organization Experience",
      date: experience.starting_date,
      endDate: experience.end_date,
      ...getMediaPreview(corp?.logo, "original"),
      excerpt: excerpt(description, result),
      facets: {
        ...emptyFacets(),
        locations: [experience.location],
        statuses: [experience.type],
        organizations: corp?.name ? [corp.name] : [],
        labels: ["Organization"],
      },
      tags,
      searchText: [
        experience.title,
        corp?.name,
        corp?.city,
        corp?.country,
        experience.type,
        experience.location,
        description,
        result,
        ...tags,
      ].join(" "),
    }
  })

  const educationItems: SearchItem[] = (educations.docs as Education[]).map(
    (education) => {
      const description = richTextToString(education.description)
      const tags = unique([
        education.level,
        education.gpa ? `GPA ${education.gpa}` : null,
        education.credits ? `${education.credits} SKS` : null,
      ])

      return {
        id: `education-${education.id}`,
        title: education.name,
        href: "/educations",
        contentType: "education",
        typeLabel: "Education",
        subtype: education.level,
        date: education.createdAt,
        ...getMediaPreview(education.logo, "original"),
        excerpt: description,
        facets: {
          ...emptyFacets(),
          organizations: [education.name],
          labels: tags,
        },
        tags,
        searchText: [education.name, education.level, description, ...tags].join(
          " "
        ),
      }
    }
  )

  const publicationItems: SearchItem[] = (
    publications.docs as Publication[]
  ).map((publication) => {
    const description = richTextToString(publication.description)
    const status = publication.isPublished ? "Published" : "Unpublished"
    const tags = unique([
      "Publication",
      status,
      publication.publishedTo,
    ])

    return {
      id: `publication-${publication.id}`,
      title: publication.title,
      href: publication.url || "/educations",
      contentType: "publication",
      typeLabel: "Publication",
      subtype: publication.publishedTo ?? "Publication",
      date: publication.publishDate,
      ...getMediaPreview(publication.image?.[0], "card"),
      excerpt: description,
      facets: {
        ...emptyFacets(),
        statuses: [status],
        organizations: publication.publishedTo ? [publication.publishedTo] : [],
        labels: ["Publication"],
      },
      tags,
      searchText: [
        publication.title,
        publication.publishedTo,
        description,
        ...tags,
      ].join(" "),
    }
  })

  return [
    ...pageItems,
    ...projectItems,
    ...workItems,
    ...organizationItems,
    ...educationItems,
    ...publicationItems,
  ]
}
