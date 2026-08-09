import {
    MigrateDownArgs,
    MigrateUpArgs,
    sql,
} from "@payloadcms/db-vercel-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels"
    ADD COLUMN IF NOT EXISTS "certification_id" integer;

  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels"
      ADD CONSTRAINT "payload_locked_documents_rels_certification_fk"
      FOREIGN KEY ("certification_id") REFERENCES "public"."certification"("id")
      ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_certification_id_idx"
    ON "payload_locked_documents_rels" USING btree ("certification_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels"
    DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_certification_fk";

  DROP INDEX IF EXISTS "payload_locked_documents_rels_certification_id_idx";

  ALTER TABLE "payload_locked_documents_rels"
    DROP COLUMN IF EXISTS "certification_id";
  `)
}
