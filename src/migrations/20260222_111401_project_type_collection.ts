import {
    MigrateUpArgs,
    MigrateDownArgs,
    sql,
} from "@payloadcms/db-vercel-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
    // 1. Create the project_type table
    await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "project_type" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "color" varchar NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "project_type_updated_at_idx"
      ON "project_type" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "project_type_created_at_idx"
      ON "project_type" USING btree ("created_at");
  `)

    // 2. Seed initial project type data
    await db.execute(sql`
    INSERT INTO "project_type" ("name", "color")
    VALUES
      ('Academic Project',      'blue-400'),
      ('Personal Project',      'yellow-400'),
      ('Organization Project',  'red-400'),
      ('External Project',      'green-400')
    ON CONFLICT DO NOTHING;
  `)

    // 3. Add type_id FK column to project table
    await db.execute(sql`
    ALTER TABLE "project"
      ADD COLUMN IF NOT EXISTS "type_id" integer;

    ALTER TABLE "project"
      ADD CONSTRAINT "project_type_id_project_type_id_fk"
      FOREIGN KEY ("type_id")
      REFERENCES "public"."project_type" ("id")
      ON DELETE set null ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "project_type_idx"
      ON "project" USING btree ("type_id");
  `)

    // 4. Migrate existing text type values to FK references
    await db.execute(sql`
    UPDATE "project"
    SET "type_id" = pt."id"
    FROM "project_type" pt
    WHERE "project"."type" = pt."name";
  `)

    // 5. Drop the old text type column
    await db.execute(sql`
    ALTER TABLE "project" DROP COLUMN IF EXISTS "type";
  `)

    // 6. Add project_type_id to payload_locked_documents_rels if not exists
    await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "project_type_id" integer;

    DO $$ BEGIN
      ALTER TABLE "payload_locked_documents_rels"
        ADD CONSTRAINT "payload_locked_documents_rels_project_type_fk"
        FOREIGN KEY ("project_type_id")
        REFERENCES "public"."project_type" ("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_project_type_id_idx"
      ON "payload_locked_documents_rels" USING btree ("project_type_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    // 1. Re-add the old text type column
    await db.execute(sql`
    ALTER TABLE "project"
      ADD COLUMN IF NOT EXISTS "type" varchar;
  `)

    // 2. Restore text values from FK
    await db.execute(sql`
    UPDATE "project"
    SET "type" = pt."name"
    FROM "project_type" pt
    WHERE "project"."type_id" = pt."id";
  `)

    // 3. Drop the FK column
    await db.execute(sql`
    ALTER TABLE "project" DROP CONSTRAINT IF EXISTS "project_type_id_project_type_id_fk";
    ALTER TABLE "project" DROP COLUMN IF EXISTS "type_id";
  `)

    // 4. Clean up locked documents refs
    await db.execute(sql`
    ALTER TABLE "payload_locked_documents_rels"
      DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_project_type_fk";
    ALTER TABLE "payload_locked_documents_rels"
      DROP COLUMN IF EXISTS "project_type_id";
  `)

    // 5. Drop the project_type table
    await db.execute(sql`
    DROP TABLE IF EXISTS "project_type" CASCADE;
  `)
}
