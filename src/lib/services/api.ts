import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"
import config from "@payload-config"
import { CACHE_TAGS } from "@/_config/Constant"
import type { Project, Media, Techstack } from "@/lib/types/payload-types"

const PAGE_LIMIT = 10

export type { Project, Media, Techstack }

export type ProjectListItem = Pick<
    Project,
    | "id"
    | "title"
    | "project-slug"
    | "highlighted-description"
    | "type"
    | "starting_date"
    | "url"
    | "sourcecode"
    | "media-highlight"
>

export type ProjectsPage = {
    docs: ProjectListItem[]
    hasNextPage: boolean
    nextCursor: number | null
    totalDocs: number
}

/**
 * Fetches a page of projects for the list view.
 * @param cursor  Page number (1-indexed)
 * @param limit   Number of items per page (default: 10)
 */
export async function getProjectsList(
    cursor: number = 1,
    limit: number = PAGE_LIMIT
): Promise<ProjectsPage> {
    "use cache"
    cacheLife("days")
    cacheTag(CACHE_TAGS.PROJECTS)

    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: "project",
        page: cursor,
        limit,
        depth: 1,
        sort: "-starting_date",
        select: {
            title: true,
            "project-slug": true,
            "highlighted-description": true,
            type: true,
            starting_date: true,
            url: true,
            sourcecode: true,
            "media-highlight": true,
        },
    })

    return {
        docs: result.docs as ProjectListItem[],
        hasNextPage: result.hasNextPage,
        nextCursor: result.hasNextPage ? cursor + 1 : null,
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
