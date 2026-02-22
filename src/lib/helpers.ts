import type { Media } from "@/lib/types/payload-types"

/**
 * Extracts a usable pathname from a Payload Media relationship field.
 * Handles both resolved objects (depth >= 1) and raw IDs (depth 0).
 * Returns null when no image is available.
 */
export function getImageUrl(
    media: number | Media | null | undefined
): string | null {
    if (!media || typeof media === "number") return null
    const raw =
        media.sizes?.card?.url ??
        media.sizes?.thumbnail?.url ??
        media.url ??
        null
    if (!raw) return null
    try {
        return new URL(raw).pathname
    } catch {
        return raw
    }
}

/**
 * Converts a Payload Lexical rich-text JSON structure to plain text.
 * Recursively traverses children nodes, concatenating text leaves.
 */
export function lexicalToPlainText(content: {
    root: Record<string, unknown>
}): string {
    const traverse = (node: Record<string, unknown>): string => {
        if (node.text && typeof node.text === "string") return node.text
        if (Array.isArray(node.children)) {
            return (node.children as Record<string, unknown>[])
                .map(traverse)
                .join(" ")
        }
        return ""
    }
    return traverse(content.root).replace(/\s+/g, " ").trim()
}

/**
 * Formats a date string to a short month/year display.
 * Example: "2025-01-15" → "Jan 2025"
 */
export function formatDateShort(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
    })
}

/**
 * Formats a date string to a full date display.
 * Example: "2025-01-15" → "January 15, 2025"
 */
export function formatDateFull(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}
