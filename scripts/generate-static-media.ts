import "dotenv/config"

import { createHash } from "node:crypto"
import { mkdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { getPayload } from "payload"
import sharp from "sharp"
import config from "../payload.config"
import type { Media } from "../src/lib/types/payload-types"
import type {
  StaticMediaEntry,
  StaticMediaManifest,
  StaticMediaVariant,
} from "../src/lib/static-media"

const rootDir = process.cwd()
const outputDir = path.join(rootDir, "public", "generated", "media")
const manifestPath = path.join(
  rootDir,
  "src",
  "generated",
  "static-media-manifest.ts"
)

const quality = Number(process.env.STATIC_MEDIA_QUALITY ?? 82)
const originalMaxWidth = Number(process.env.STATIC_MEDIA_ORIGINAL_MAX_WIDTH ?? 1920)
const serverUrl =
  process.env.NEXT_PUBLIC_SERVER_URL ??
  process.env.PAYLOAD_PUBLIC_SERVER_URL ??
  "http://localhost:3000"

type VariantName = keyof StaticMediaEntry

type VariantConfig = {
  name: VariantName
  width?: number
  height?: number
  fit?: keyof sharp.FitEnum
}

const variants: VariantConfig[] = [
  { name: "original", width: originalMaxWidth, fit: "inside" },
  { name: "tablet", width: 1024, fit: "inside" },
  { name: "card", width: 1200, height: 700, fit: "cover" },
  { name: "thumbnail", width: 400, height: 300, fit: "cover" },
]

function isOptimizableImage(media: Media) {
  if (!media.url || !media.mimeType?.startsWith("image/")) return false
  return !["image/gif", "image/svg+xml"].includes(media.mimeType)
}

function resolveSourceUrl(rawUrl: string) {
  try {
    return new URL(rawUrl).toString()
  } catch {
    return new URL(rawUrl, serverUrl).toString()
  }
}

function hashAsset(media: Media, variant: VariantConfig) {
  return createHash("sha256")
    .update(
      JSON.stringify({
        id: media.id,
        updatedAt: media.updatedAt,
        url: media.url,
        variant,
        quality,
      })
    )
    .digest("hex")
    .slice(0, 12)
}

async function downloadSource(media: Media) {
  if (!media.url) throw new Error(`Media ${media.id} has no URL`)

  const sourceUrl = resolveSourceUrl(media.url)
  const response = await fetch(sourceUrl)

  if (!response.ok) {
    throw new Error(
      `Failed to download media ${media.id} (${response.status} ${response.statusText}): ${sourceUrl}`
    )
  }

  return Buffer.from(await response.arrayBuffer())
}

async function generateVariant(
  source: Buffer,
  media: Media,
  variant: VariantConfig
): Promise<StaticMediaVariant> {
  const hash = hashAsset(media, variant)
  const filename = `${media.id}-${variant.name}-${hash}.webp`
  const outputPath = path.join(outputDir, filename)

  const pipeline = sharp(source)
    .rotate()
    .resize({
      width: variant.width,
      height: variant.height,
      fit: variant.fit,
      position: "center",
      withoutEnlargement: true,
    })
    .webp({ quality })

  const { data, info } = await pipeline.toBuffer({ resolveWithObject: true })
  await writeFile(outputPath, data)

  return {
    url: `/generated/media/${filename}`,
    width: info.width,
    height: info.height,
    format: "webp",
  }
}

function manifestSource(manifest: StaticMediaManifest) {
  return `import type { StaticMediaManifest } from "@/lib/static-media"

const staticMediaManifest: StaticMediaManifest = ${JSON.stringify(manifest, null, 2)}

export default staticMediaManifest
`
}

async function main() {
  await rm(outputDir, { recursive: true, force: true })
  await mkdir(outputDir, { recursive: true })

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: "media",
    depth: 0,
    limit: 0,
  })

  const mediaDocs = result.docs as Media[]
  const manifest: StaticMediaManifest = { media: {} }
  let generatedCount = 0
  let skippedCount = 0

  for (const media of mediaDocs) {
    if (!isOptimizableImage(media)) {
      skippedCount += 1
      continue
    }

    try {
      const source = await downloadSource(media)
      const entry: StaticMediaEntry = {}

      for (const variant of variants) {
        entry[variant.name] = await generateVariant(source, media, variant)
        generatedCount += 1
      }

      manifest.media[String(media.id)] = entry
    } catch (error) {
      skippedCount += 1
      console.warn(
        `[static-media] Skipped media ${media.id}: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }

  await writeFile(manifestPath, manifestSource(manifest))

  console.log(
    `[static-media] Generated ${generatedCount} variants for ${
      Object.keys(manifest.media).length
    } media item(s); skipped ${skippedCount}.`
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
