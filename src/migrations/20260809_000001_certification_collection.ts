import {
    MigrateDownArgs,
    MigrateUpArgs,
    sql,
} from "@payloadcms/db-vercel-postgres"

export async function up({ db }: MigrateUpArgs): Promise<void> {
    await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_certification_status" AS ENUM('active', 'completed', 'in_progress', 'expired');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_certification_logo_display_mode" AS ENUM('certification', 'issuer', 'both', 'none');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    CREATE TYPE "public"."enum_certification_theme_mode" AS ENUM('gradient', 'solid', 'subtle');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS "certification" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "issuer" varchar NOT NULL,
    "summary" varchar,
    "issued_at" timestamp(3) with time zone NOT NULL,
    "expires_at" timestamp(3) with time zone,
    "status" "enum_certification_status" DEFAULT 'active' NOT NULL,
    "credential_url" varchar,
    "credential_id" varchar,
    "issuer_logo_id" integer,
    "certification_logo_id" integer,
    "working_period_start" timestamp(3) with time zone,
    "working_period_end" timestamp(3) with time zone,
    "logo_display_mode" "enum_certification_logo_display_mode" DEFAULT 'certification' NOT NULL,
    "theme_color" varchar DEFAULT '#f97316',
    "theme_color_end" varchar DEFAULT '#f59e0b',
    "theme_mode" "enum_certification_theme_mode" DEFAULT 'gradient' NOT NULL,
    "skills" varchar,
    "sort_order" numeric DEFAULT 0,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "certification_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "techstack_id" integer
  );

  DO $$ BEGIN
    ALTER TABLE "certification" ADD CONSTRAINT "certification_issuer_logo_id_media_id_fk" FOREIGN KEY ("issuer_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "certification" ADD CONSTRAINT "certification_certification_logo_id_media_id_fk" FOREIGN KEY ("certification_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "certification_rels" ADD CONSTRAINT "certification_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."certification"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "certification_rels" ADD CONSTRAINT "certification_rels_techstack_fk" FOREIGN KEY ("techstack_id") REFERENCES "public"."techstack"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "certification_issuer_logo_idx" ON "certification" USING btree ("issuer_logo_id");
  CREATE INDEX IF NOT EXISTS "certification_certification_logo_idx" ON "certification" USING btree ("certification_logo_id");
  CREATE INDEX IF NOT EXISTS "certification_sort_order_idx" ON "certification" USING btree ("sort_order");
  CREATE INDEX IF NOT EXISTS "certification_updated_at_idx" ON "certification" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "certification_created_at_idx" ON "certification" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "certification_rels_order_idx" ON "certification_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "certification_rels_parent_idx" ON "certification_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "certification_rels_path_idx" ON "certification_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "certification_rels_techstack_id_idx" ON "certification_rels" USING btree ("techstack_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    await db.execute(sql`
  DROP TABLE IF EXISTS "certification_rels" CASCADE;
  DROP TABLE IF EXISTS "certification" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_certification_theme_mode";
  DROP TYPE IF EXISTS "public"."enum_certification_logo_display_mode";
  DROP TYPE IF EXISTS "public"."enum_certification_status";
  `)
}
