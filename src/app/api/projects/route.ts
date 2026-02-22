import { type NextRequest, NextResponse } from "next/server"
import { getProjectsList } from "@/lib/services/api"

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl
    const cursor = Number(searchParams.get("cursor") ?? "1")
    const limit = Number(searchParams.get("limit") ?? "10")

    if (isNaN(cursor) || cursor < 1 || isNaN(limit) || limit < 1) {
        return NextResponse.json(
            { error: "Invalid cursor or limit" },
            { status: 400 }
        )
    }

    const data = await getProjectsList(cursor, limit)
    return NextResponse.json(data)
}
