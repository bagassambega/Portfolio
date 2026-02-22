import {
    MigrateUpArgs,
    MigrateDownArgs,
    sql,
} from "@payloadcms/db-vercel-postgres"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
    // 1. Create Organization Experience Types & Tables
    await db.execute(sql`
  CREATE TYPE "public"."enum_organization_experience_type" AS ENUM('Ongoing', 'Finished');
  CREATE TYPE "public"."enum_organization_experience_location" AS ENUM('Hybrid', 'Online', 'Offline');
  
  CREATE TABLE IF NOT EXISTS "organization_experience" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_organization_experience_type" NOT NULL,
  	"description" jsonb NOT NULL,
  	"location" "enum_organization_experience_location" NOT NULL,
  	"starting_date" timestamp(3) with time zone NOT NULL,
  	"end_date" timestamp(3) with time zone,
  	"corporation_id" integer NOT NULL,
  	"result" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "organization_experience_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );

  ALTER TABLE "organization_experience" ADD CONSTRAINT "organization_experience_corporation_id_corporation_id_fk" FOREIGN KEY ("corporation_id") REFERENCES "public"."corporation"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "organization_experience_rels" ADD CONSTRAINT "organization_experience_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."organization_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "organization_experience_rels" ADD CONSTRAINT "organization_experience_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;

  CREATE UNIQUE INDEX IF NOT EXISTS "organization_experience_slug_idx" ON "organization_experience" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "organization_experience_corporation_idx" ON "organization_experience" USING btree ("corporation_id");
  CREATE INDEX IF NOT EXISTS "organization_experience_updated_at_idx" ON "organization_experience" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "organization_experience_created_at_idx" ON "organization_experience" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "organization_experience_rels_order_idx" ON "organization_experience_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "organization_experience_rels_parent_idx" ON "organization_experience_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "organization_experience_rels_path_idx" ON "organization_experience_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "organization_experience_rels_media_id_idx" ON "organization_experience_rels" USING btree ("media_id");
  `)

    // 2. Modify Work Experience: Add Slug, Migrate Data, change Result to JSONB
    try {
        await db.execute(sql`
      ALTER TABLE "work_experience" ADD COLUMN IF NOT EXISTS "slug" varchar;
    `)
    } catch (e) {}

    // Fill existing slugs using corporation join
    try {
        await db.execute(sql`
        UPDATE "work_experience" we
        SET "slug" = LOWER(REGEXP_REPLACE(CONCAT(corp.name, '-', we.title), '[^a-zA-Z0-9]+', '-', 'g'))
        FROM "corporation" corp
        WHERE we.corporation_id = corp.id
        AND (we.slug IS NULL OR we.slug = '');
      `)
    } catch (e) {}

    // Enforce NOT NULL and UNIQUE on slug
    try {
        await db.execute(sql`
      ALTER TABLE "work_experience" ALTER COLUMN "slug" SET NOT NULL;
      CREATE UNIQUE INDEX IF NOT EXISTS "work_experience_slug_idx" ON "work_experience" USING btree ("slug");
    `)
    } catch (e) {}

    // 3. Convert Work Experience 'result' field from text to JSONB
    // User confirmed the result strings are completely empty/null, so we can just DROP and ADD
    try {
        await db.execute(sql`
        ALTER TABLE "work_experience" DROP COLUMN IF EXISTS "result";
        ALTER TABLE "work_experience" ADD COLUMN "result" jsonb;
     `)
    } catch (e) {}
}

export async function down({
    db,
    payload,
    req,
}: MigrateDownArgs): Promise<void> {
    await db.execute(sql`
  DROP TABLE IF EXISTS "organization_experience" CASCADE;
  DROP TABLE IF EXISTS "organization_experience_rels" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_organization_experience_type";
  DROP TYPE IF EXISTS "public"."enum_organization_experience_location";
  
  ALTER TABLE "work_experience" DROP COLUMN IF EXISTS "slug";
  ALTER TABLE "work_experience" DROP COLUMN IF EXISTS "result";
  ALTER TABLE "work_experience" ADD COLUMN "result" varchar;
  `)
}
