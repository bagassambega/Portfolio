import { buildConfig } from "payload"
import { vercelPostgresAdapter } from "@payloadcms/db-vercel-postgres"
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import path from "path"
import { fileURLToPath } from "url"
import sharp from "sharp"
import { Media } from "@/app/collections/Media"
import { WorkExperience } from "@/app/collections/WorkExperience"
import { Project } from "@/app/collections/Project"
import { Hero } from "@/app/collections/Hero"
import { Corporation } from "@/app/collections/Corporation"
import { SocialMedia } from "@/app/collections/SocialMedia"
import { Education } from "@/app/collections/Education"
import { Users } from "@/app/collections/Users"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
    admin: {
        user: "users",
        importMap: {
            baseDir: path.resolve(dirname),
        },
    },
    sharp,
    globals: [Hero],
    collections: [
        Users,
        Corporation,
        Education,
        Media,
        WorkExperience,
        Project,
        SocialMedia,
    ],
    editor: lexicalEditor(),
    secret: process.env.PAYLOAD_SECRET || "",
    typescript: {
        outputFile: path.resolve(dirname, "payload-types.ts"),
    },
    db: vercelPostgresAdapter({
        pool: {
            connectionString: process.env.DATABASE_URI || "",
        },
    }),
    plugins: [
        vercelBlobStorage({
            enabled: true,
            collections: {
                media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
        }),
    ],
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000",
})
