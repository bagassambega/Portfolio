import type { Media } from "@/lib/types/payload-types"
import staticMediaManifest from "@/generated/static-media-manifest"

export type StaticMediaVariant = {
  url: string
  width: number
  height: number
  format: "webp"
}

export type StaticMediaEntry = Partial<
  Record<"original" | "thumbnail" | "card" | "tablet", StaticMediaVariant>
>

export type StaticMediaManifest = {
  media: Record<string, StaticMediaEntry>
}

export function getStaticMediaVariant(
  media: number | Media | null | undefined,
  preferredVariants: Array<keyof StaticMediaEntry>
): StaticMediaVariant | null {
  if (!media || typeof media === "number") return null

  const manifest = staticMediaManifest.media[String(media.id)]
  if (!manifest) return null

  for (const variant of preferredVariants) {
    const asset = manifest[variant]
    if (asset) return asset
  }

  return null
}
