import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

type RevalidatePrewarmBody = {
    tags?: string[]
    paths?: string[]
}

const toUnique = (items: string[]) => Array.from(new Set(items))

const normalizePath = (path: string) => {
    if (!path) return null
    const normalized = path.startsWith("/") ? path : `/${path}`
    if (normalized.startsWith("/api/")) return null
    return normalized
}

export async function POST(req: NextRequest) {
    const secret = process.env.REVALIDATE_SECRET

    if (!secret) {
        return NextResponse.json(
            { ok: false, message: "REVALIDATE_SECRET is not configured" },
            { status: 500 }
        )
    }

    const providedSecret = req.headers.get("x-revalidate-secret")
    if (providedSecret !== secret) {
        return NextResponse.json(
            { ok: false, message: "Unauthorized" },
            { status: 401 }
        )
    }

    let body: RevalidatePrewarmBody
    try {
        body = (await req.json()) as RevalidatePrewarmBody
    } catch {
        return NextResponse.json(
            { ok: false, message: "Invalid JSON body" },
            { status: 400 }
        )
    }

    const tags = toUnique(
        (body.tags ?? []).map((tag) => tag.trim()).filter(Boolean)
    )
    const paths = toUnique(
        (body.paths ?? [])
            .map((path) => normalizePath(path.trim()))
            .filter((path): path is string => Boolean(path))
    )

    for (const tag of tags) {
        revalidateTag(tag, "days")
    }

    for (const path of paths) {
        revalidatePath(path)
    }

    const origin =
        process.env.NEXT_PUBLIC_SERVER_URL ||
        process.env.SERVER_URL ||
        req.nextUrl.origin

    const warmResults = await Promise.allSettled(
        paths.map(async (path) => {
            const response = await fetch(`${origin}${path}`, {
                method: "GET",
                cache: "no-store",
                headers: {
                    "x-prewarm": "1",
                },
            })

            return {
                path,
                status: response.status,
                ok: response.ok,
            }
        })
    )

    const failedPrewarmPaths = warmResults
        .filter(
            (result): result is PromiseRejectedResult =>
                result.status === "rejected"
        )
        .map((result) => String(result.reason))

    const nonOkPrewarmPaths = warmResults
        .filter(
            (
                result
            ): result is PromiseFulfilledResult<{
                path: string
                status: number
                ok: boolean
            }> => result.status === "fulfilled"
        )
        .filter((result) => !result.value.ok)
        .map((result) => `${result.value.path} (${result.value.status})`)

    return NextResponse.json({
        ok: true,
        revalidatedTags: tags,
        revalidatedPaths: paths,
        prewarmedPaths: paths,
        failedPrewarmPaths,
        nonOkPrewarmPaths,
    })
}
