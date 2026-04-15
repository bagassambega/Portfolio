type RevalidatePrewarmPayload = {
    tags?: string[]
    paths?: string[]
}

const getServerUrl = () => {
    return (
        process.env.NEXT_PUBLIC_SERVER_URL ||
        process.env.SERVER_URL ||
        "http://localhost:3000"
    )
}

/**
 * Triggers the internal revalidate+prewarm endpoint.
 * This allows Payload hooks to proactively warm affected routes.
 */
export async function triggerRevalidatePrewarm(
    payload: RevalidatePrewarmPayload
): Promise<void> {
    const secret = process.env.REVALIDATE_SECRET

    if (!secret) {
        console.warn(
            "[revalidate-prewarm] REVALIDATE_SECRET is not set; skipping proactive prewarm."
        )
        return
    }

    try {
        const response = await fetch(
            `${getServerUrl()}/api/revalidate-prewarm`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-revalidate-secret": secret,
                },
                body: JSON.stringify(payload),
                cache: "no-store",
            }
        )

        if (!response.ok) {
            const body = await response.text()
            console.error(
                `[revalidate-prewarm] Failed (${response.status}): ${body}`
            )
        }
    } catch (error) {
        console.error("[revalidate-prewarm] Request failed", error)
    }
}
