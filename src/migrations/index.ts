import * as migration_20260222_154250_org_experience from "./20260222_154250_org_experience"
import * as migration_20260223_022520_publication_enhancement from "./20260223_022520_publication_enhancement"
import * as migration_20260223_052839_techstack_to_workexp from "./20260223_052839_techstack_to_workexp"
import * as migration_20260414_000001_social_media_username from "./20260414_000001_social_media_username"

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
]
