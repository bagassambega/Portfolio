/**
 * Adds the `project_slug` column to the `project` table and sets
 * the slug for the existing "Personal Notes" project.
 *
 * Usage:  npx tsx src/scripts/add-project-slug.ts
 *
 * Requires DATABASE_URI in .env or .env.local.
 */
import "dotenv/config"
import pg from "pg"

const DATABASE_URI = process.env.DATABASE_URI
if (!DATABASE_URI) {
    console.error("ERROR: DATABASE_URI not set in environment.")
    process.exit(1)
}

const client = new pg.Client({ connectionString: DATABASE_URI })

async function run() {
    await client.connect()
    console.log("Connected to database.")

    try {
        await client.query("BEGIN")

        // 1. Add column with a temporary default so existing rows pass NOT NULL
        console.log("Adding project_slug column...")
        await client.query(`
            ALTER TABLE "project"
            ADD COLUMN IF NOT EXISTS "project_slug" VARCHAR NOT NULL DEFAULT ''
        `)

        // 2. Set slug for the existing project
        console.log('Setting slug "personal-notes" for existing project...')
        const result = await client.query(`
            UPDATE "project"
            SET "project_slug" = 'personal-notes'
            WHERE "project_slug" = ''
        `)
        console.log(`  Updated ${result.rowCount} row(s).`)

        // 3. Create unique index
        console.log("Creating unique index on project_slug...")
        await client.query(`
            CREATE UNIQUE INDEX IF NOT EXISTS "project_slug_idx"
            ON "project" ("project_slug")
        `)

        // 4. Remove the temporary default
        console.log("Removing temporary default...")
        await client.query(`
            ALTER TABLE "project"
            ALTER COLUMN "project_slug" DROP DEFAULT
        `)

        await client.query("COMMIT")
        console.log("Done. Column added and indexed successfully.")
    } catch (err) {
        await client.query("ROLLBACK")
        console.error("Migration failed, rolled back:", err)
        process.exit(1)
    } finally {
        await client.end()
    }
}

run()
