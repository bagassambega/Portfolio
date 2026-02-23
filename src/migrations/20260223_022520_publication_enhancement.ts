import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "publication" ADD COLUMN "is_published" boolean DEFAULT false;
  ALTER TABLE "publication" ADD COLUMN "published_to" varchar;
  ALTER TABLE "publication" ADD COLUMN "publish_date" timestamp(3) with time zone NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "publication" DROP COLUMN "is_published";
  ALTER TABLE "publication" DROP COLUMN "published_to";
  ALTER TABLE "publication" DROP COLUMN "publish_date";`)
}
