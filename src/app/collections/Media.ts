import type {
    CollectionConfig,
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from "payload"
import { revalidateTag } from "next/cache"
import * as Constant from "../../_config/Constant"
import { triggerRevalidatePrewarm } from "@/lib/services/revalidate-prewarm"

const revalidateMedia: CollectionAfterChangeHook = async () => {
    revalidateTag(Constant.CACHE_TAGS.MEDIA, "days")
    revalidateTag(Constant.CACHE_TAGS.PROJECTS, "days")
    revalidateTag(Constant.CACHE_TAGS.HERO, "days")
    revalidateTag(Constant.CACHE_TAGS.WORK_EXPERIENCES, "days")
    revalidateTag(Constant.CACHE_TAGS.ORGANIZATION_EXPERIENCES, "days")
    revalidateTag(Constant.CACHE_TAGS.EDUCATION, "days")
    revalidateTag(Constant.CACHE_TAGS.PUBLICATIONS, "days")

    await triggerRevalidatePrewarm({
        tags: [
            Constant.CACHE_TAGS.MEDIA,
            Constant.CACHE_TAGS.PROJECTS,
            Constant.CACHE_TAGS.HERO,
            Constant.CACHE_TAGS.WORK_EXPERIENCES,
            Constant.CACHE_TAGS.ORGANIZATION_EXPERIENCES,
            Constant.CACHE_TAGS.EDUCATION,
            Constant.CACHE_TAGS.PUBLICATIONS,
        ],
        paths: ["/", "/projects", "/experiences", "/educations"],
    })
}

const deleteMedia: CollectionAfterDeleteHook = async () => {
    revalidateTag(Constant.CACHE_TAGS.MEDIA, "days")
    revalidateTag(Constant.CACHE_TAGS.PROJECTS, "days")
    revalidateTag(Constant.CACHE_TAGS.HERO, "days")
    revalidateTag(Constant.CACHE_TAGS.WORK_EXPERIENCES, "days")
    revalidateTag(Constant.CACHE_TAGS.ORGANIZATION_EXPERIENCES, "days")
    revalidateTag(Constant.CACHE_TAGS.EDUCATION, "days")
    revalidateTag(Constant.CACHE_TAGS.PUBLICATIONS, "days")

    await triggerRevalidatePrewarm({
        tags: [
            Constant.CACHE_TAGS.MEDIA,
            Constant.CACHE_TAGS.PROJECTS,
            Constant.CACHE_TAGS.HERO,
            Constant.CACHE_TAGS.WORK_EXPERIENCES,
            Constant.CACHE_TAGS.ORGANIZATION_EXPERIENCES,
            Constant.CACHE_TAGS.EDUCATION,
            Constant.CACHE_TAGS.PUBLICATIONS,
        ],
        paths: ["/", "/projects", "/experiences", "/educations"],
    })
}

export const Media: CollectionConfig = {
    slug: "media",
    access: {
        read: () => true,
    },
    hooks: {
        afterChange: [revalidateMedia],
        afterDelete: [deleteMedia],
    },
    upload: {
        imageSizes: [
            {
                name: "thumbnail",
                width: 400,
                height: 300,
                position: "centre",
            },
            {
                name: "card",
                width: 1200,
                height: 700,
                position: "centre",
            },
            {
                name: "tablet",
                width: 1024,
                height: undefined,
                position: "centre",
            },
        ],
        adminThumbnail: "thumbnail",
        mimeTypes: ["image/*", "video/*"],
    },
    fields: [
        {
            name: "alt",
            type: "text",
            label: "Alternative Text/Caption",
            required: true,
        },
    ],
}
