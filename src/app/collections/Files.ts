import type {
    CollectionConfig,
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from "payload"
import { revalidateTag } from "next/cache"
import * as Constant from "@/_config/Constant"
import { triggerRevalidatePrewarm } from "@/lib/services/revalidate-prewarm"

const revalidateFiles: CollectionAfterChangeHook = async () => {
    revalidateTag(Constant.CACHE_TAGS.PUBLICATIONS, "days")

    await triggerRevalidatePrewarm({
        tags: [Constant.CACHE_TAGS.PUBLICATIONS],
        paths: ["/educations"],
    })
}

const deleteFiles: CollectionAfterDeleteHook = async () => {
    revalidateTag(Constant.CACHE_TAGS.PUBLICATIONS, "days")

    await triggerRevalidatePrewarm({
        tags: [Constant.CACHE_TAGS.PUBLICATIONS],
        paths: ["/educations"],
    })
}

export const Files: CollectionConfig = {
    slug: "files",
    hooks: {
        afterChange: [revalidateFiles],
        afterDelete: [deleteFiles],
    },
    access: {
        read: () => true,
    },
    upload: {
        displayPreview: true,
        mimeTypes: ["application/pdf"],
    },
    fields: [
        {
            name: "alt",
            type: "text",
            label: "Alternative Text/Description",
            required: true,
        },
        {
            name: "url",
            type: "text",
            label: "Alternative File URL",
        },
    ],
}
