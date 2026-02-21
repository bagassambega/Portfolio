import type {
    CollectionConfig,
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from "payload"
import { revalidateTag } from "next/cache"
import * as Constant from "../../_config/Constant"

const revalidateMedia: CollectionAfterChangeHook = () => {
    revalidateTag(Constant.CACHE_TAGS.MEDIA, "days")
    revalidateTag(Constant.CACHE_TAGS.PROJECTS, "days")
}

const deleteMedia: CollectionAfterDeleteHook = () => {
    revalidateTag(Constant.CACHE_TAGS.MEDIA, "days")
    revalidateTag(Constant.CACHE_TAGS.PROJECTS, "days")
}

export const Media: CollectionConfig = {
    slug: "media",
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
                width: 768,
                height: 1024,
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
