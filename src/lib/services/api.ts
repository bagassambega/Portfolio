import { cacheLife, cacheTag } from "next/cache"
import { getPayload } from "payload"
import config from "@payload-config"
import { CACHE_TAGS } from "@/_config/Constant"
import type { Project, Media } from "@/lib/types/payload-types"

const PAGE_LIMIT = 10

export type { Project, Media }

export type ProjectsPage = {
    docs: Project[]
    hasNextPage: boolean
    nextCursor: number | null
    totalDocs: number
}

/**
 * Fetches a page of projects from Payload CMS using cursor-based (page) pagination.
 * Each (cursor, limit) combination is independently cached and tagged.
 *
 * @param cursor  Page number (1-indexed)
 * @param limit   Number of items per page (default: 10)
 */
export async function getProjects(
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
        depth: 1, // populates media-highlight, media, techstack
        sort: "-starting_date",
    })

    return {
        docs: result.docs as Project[],
        hasNextPage: result.hasNextPage,
        nextCursor: result.hasNextPage ? cursor + 1 : null,
        totalDocs: result.totalDocs,
    }
}
