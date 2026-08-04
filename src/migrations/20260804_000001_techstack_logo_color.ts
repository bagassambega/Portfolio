import {
    MigrateUpArgs,
    MigrateDownArgs,
    sql,
} from "@payloadcms/db-vercel-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.execute(sql`
    ALTER TABLE "techstack" ADD COLUMN IF NOT EXISTS "logo_color" varchar DEFAULT 'neutral';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.execute(sql`
    ALTER TABLE "techstack" DROP COLUMN IF EXISTS "logo_color";
  `)
}
