import {
    MigrateUpArgs,
    MigrateDownArgs,
    sql,
} from "@payloadcms/db-vercel-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.execute(sql`
    ALTER TABLE "social_media" ADD COLUMN IF NOT EXISTS "username" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.execute(sql`
    ALTER TABLE "social_media" DROP COLUMN IF EXISTS "username";
  `)
}
