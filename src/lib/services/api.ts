import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"
import config from "@payload-config"
import { CACHE_TAGS } from "@/_config/Constant"
import type {
    Project,
    WorkExperience,
    OrganizationExperience,
} from "@/lib/types/payload-types"

export type ProjectListItem = Pick<
    Project,
    | "id"
    | "title"
    | "project-slug"
    | "highlighted-description"
    | "type"
    | "starting_date"
    | "end_date"
    | "url"
    | "sourcecode"
    | "media-highlight"
>

export type ProjectsData = {
    docs: ProjectListItem[]
    totalDocs: number
}

/**
 * Fetches all projects for the list view.
 * Uses "use cache" with cacheTag — the cache is invalidated on-demand
 * by Payload hooks when projects are created, updated, or deleted.
 */
export async function getProjectsList(): Promise<ProjectsData> {
    "use cache"
    cacheLife("days")
    cacheTag(CACHE_TAGS.PROJECTS)

    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: "project",
        limit: 0, // 0 = return all documents
        depth: 1,
        sort: "-starting_date",
        select: {
            title: true,
            "project-slug": true,
            "highlighted-description": true,
            type: true,
            starting_date: true,
            end_date: true,
            url: true,
            sourcecode: true,
            "media-highlight": true,
        },
    })

    return {
        docs: result.docs as ProjectListItem[],
        totalDocs: result.totalDocs,
    }
}

/**
 * Fetches a single project by its slug for the detail page.
 * Returns the full project with all relationships resolved (depth: 2).
 * Returns null if no project matches the slug.
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
    "use cache"
    cacheLife("days")
    cacheTag(CACHE_TAGS.PROJECTS)

    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: "project",
        where: {
            "project-slug": { equals: slug },
        },
        limit: 1,
        depth: 2,
    })

    return (result.docs[0] as Project) ?? null
}

/**
 * Returns all project slugs for generateStaticParams.
 * Used at build time to pre-render all project detail pages.
 */
export async function getAllProjectSlugs(): Promise<string[]> {
    "use cache"
    cacheLife("days")
    cacheTag(CACHE_TAGS.PROJECTS)

    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: "project",
        limit: 0, // 0 = return all documents
        depth: 0,
        select: {
            "project-slug": true,
        },
    })

    return result.docs
        .map((doc) => (doc as Pick<Project, "project-slug">)["project-slug"])
        .filter(Boolean)
}

export type WorkExperienceListItem = Pick<
    WorkExperience,
    | "id"
    | "title"
    | "slug"
    | "type"
    | "location"
    | "starting_date"
    | "end_date"
    | "corporation"
>

export type OrganizationExperienceListItem = Pick<
    OrganizationExperience,
    | "id"
    | "title"
    | "slug"
    | "type"
    | "location"
    | "starting_date"
    | "end_date"
    | "corporation"
>

export async function getWorkExperiencesList() {
    "use cache"
    cacheLife("days")
    cacheTag(CACHE_TAGS.WORK_EXPERIENCES)

    const payload = await getPayload({ config })
    const result = await payload.find({
        collection: "work-experience",
        limit: 0,
        depth: 2, // Need depth 2 to get corporation -> logo -> url
        sort: "-starting_date",
        select: {
            title: true,
            slug: true,
            type: true,
            location: true,
            starting_date: true,
            end_date: true,
            corporation: true,
        },
    })
    return result.docs as WorkExperienceListItem[]
}

export async function getOrganizationExperiencesList() {
    "use cache"
    cacheLife("days")
    cacheTag(CACHE_TAGS.ORGANIZATION_EXPERIENCES)

    const payload = await getPayload({ config })
    const result = await payload.find({
        collection: "organization-experience",
        limit: 0,
        depth: 2, // Need depth 2 to get corporation -> logo -> url
        sort: "-starting_date",
        select: {
            title: true,
            slug: true,
            type: true,
            location: true,
            starting_date: true,
            end_date: true,
            corporation: true,
        },
    })
    return result.docs as OrganizationExperienceListItem[]
}

export async function getWorkExperienceBySlug(
    slug: string
): Promise<WorkExperience | null> {
    "use cache"
    cacheLife("days")
    cacheTag(CACHE_TAGS.WORK_EXPERIENCES)

    const payload = await getPayload({ config })
    const result = await payload.find({
        collection: "work-experience",
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 2,
    })
    return (result.docs[0] as WorkExperience) ?? null
}

export async function getOrganizationExperienceBySlug(
    slug: string
): Promise<OrganizationExperience | null> {
    "use cache"
    cacheLife("days")
    cacheTag(CACHE_TAGS.ORGANIZATION_EXPERIENCES)

    const payload = await getPayload({ config })
    const result = await payload.find({
        collection: "organization-experience",
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 2,
    })
    return (result.docs[0] as OrganizationExperience) ?? null
}

export async function getAllWorkExperienceSlugs(): Promise<string[]> {
    "use cache"
    cacheLife("days")
    cacheTag(CACHE_TAGS.WORK_EXPERIENCES)

    const payload = await getPayload({ config })
    const result = await payload.find({
        collection: "work-experience",
        limit: 0,
        depth: 0,
        select: { slug: true },
    })
    return result.docs.map((d) => d.slug).filter(Boolean) as string[]
}

export async function getAllOrganizationExperienceSlugs(): Promise<string[]> {
    "use cache"
    cacheLife("days")
    cacheTag(CACHE_TAGS.ORGANIZATION_EXPERIENCES)

    const payload = await getPayload({ config })
    const result = await payload.find({
        collection: "organization-experience",
        limit: 0,
        depth: 0,
        select: { slug: true },
    })
    return result.docs.map((d) => d.slug).filter(Boolean) as string[]
}
