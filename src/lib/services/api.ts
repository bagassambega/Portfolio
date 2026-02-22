import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"
import config from "@payload-config"
import { CACHE_TAGS } from "@/_config/Constant"
import type { Project, Media } from "@/lib/types/payload-types"

const PAGE_LIMIT = 10

export type { Project, Media }

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
 * Fetches a page of projects for the list view using Payload's `select`.
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
