import * as migration_20260222_154250_org_experience from "./20260222_154250_org_experience"
import * as migration_20260223_022520_publication_enhancement from "./20260223_022520_publication_enhancement"
import * as migration_20260223_052839_techstack_to_workexp from "./20260223_052839_techstack_to_workexp"
import * as migration_20260414_000001_social_media_username from "./20260414_000001_social_media_username"
import * as migration_20260804_000001_techstack_logo_color from "./20260804_000001_techstack_logo_color"
import * as migration_20260809_000001_certification_collection from "./20260809_000001_certification_collection"
import * as migration_20260809_000002_certification_locked_documents from "./20260809_000002_certification_locked_documents"

export const migrations = [
    {
        up: migration_20260222_154250_org_experience.up,
        down: migration_20260222_154250_org_experience.down,
        name: "20260222_154250_org_experience",
    },
    {
        up: migration_20260223_022520_publication_enhancement.up,
        down: migration_20260223_022520_publication_enhancement.down,
        name: "20260223_022520_publication_enhancement",
    },
    {
        up: migration_20260223_052839_techstack_to_workexp.up,
        down: migration_20260223_052839_techstack_to_workexp.down,
        name: "20260223_052839_techstack_to_workexp",
    },
    {
        up: migration_20260414_000001_social_media_username.up,
        down: migration_20260414_000001_social_media_username.down,
        name: "20260414_000001_social_media_username",
    },
    {
        up: migration_20260804_000001_techstack_logo_color.up,
        down: migration_20260804_000001_techstack_logo_color.down,
        name: "20260804_000001_techstack_logo_color",
    },
    {
        up: migration_20260809_000001_certification_collection.up,
        down: migration_20260809_000001_certification_collection.down,
        name: "20260809_000001_certification_collection",
    },
    {
        up: migration_20260809_000002_certification_locked_documents.up,
        down: migration_20260809_000002_certification_locked_documents.down,
        name: "20260809_000002_certification_locked_documents",
    },
]
