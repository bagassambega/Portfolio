import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "corporation_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "corporation_rels" CASCADE;
  ALTER TABLE "work_experience_rels" ADD COLUMN "techstack_id" integer;
  ALTER TABLE "work_experience_rels" ADD CONSTRAINT "work_experience_rels_techstack_fk" FOREIGN KEY ("techstack_id") REFERENCES "public"."techstack"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "work_experience_rels_techstack_id_idx" ON "work_experience_rels" USING btree ("techstack_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "corporation_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"techstack_id" integer
  );
  
  ALTER TABLE "work_experience_rels" DROP CONSTRAINT "work_experience_rels_techstack_fk";
  
  DROP INDEX "work_experience_rels_techstack_id_idx";
  ALTER TABLE "corporation_rels" ADD CONSTRAINT "corporation_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."corporation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "corporation_rels" ADD CONSTRAINT "corporation_rels_techstack_fk" FOREIGN KEY ("techstack_id") REFERENCES "public"."techstack"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "corporation_rels_order_idx" ON "corporation_rels" USING btree ("order");
  CREATE INDEX "corporation_rels_parent_idx" ON "corporation_rels" USING btree ("parent_id");
  CREATE INDEX "corporation_rels_path_idx" ON "corporation_rels" USING btree ("path");
  CREATE INDEX "corporation_rels_techstack_id_idx" ON "corporation_rels" USING btree ("techstack_id");
  ALTER TABLE "work_experience_rels" DROP COLUMN "techstack_id";`)
}
