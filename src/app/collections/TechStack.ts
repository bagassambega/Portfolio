import type {
    CollectionConfig,
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from "payload"
import { revalidateTag } from "next/cache"
import * as Constant from "../../_config/Constant"
import { triggerRevalidatePrewarm } from "@/lib/services/revalidate-prewarm"

const revalidateTechStacks: CollectionAfterChangeHook = async () => {
    revalidateTag(Constant.CACHE_TAGS.TECHSTACKS, "days")
    revalidateTag(Constant.CACHE_TAGS.PROJECTS, "days")

    await triggerRevalidatePrewarm({
        tags: [Constant.CACHE_TAGS.TECHSTACKS, Constant.CACHE_TAGS.PROJECTS],
        paths: ["/projects"],
    })
}

const deleteTechStacks: CollectionAfterDeleteHook = async () => {
    revalidateTag(Constant.CACHE_TAGS.TECHSTACKS, "days")
    revalidateTag(Constant.CACHE_TAGS.PROJECTS, "days")

    await triggerRevalidatePrewarm({
        tags: [Constant.CACHE_TAGS.TECHSTACKS, Constant.CACHE_TAGS.PROJECTS],
        paths: ["/projects"],
    })
}

export const TechStack: CollectionConfig = {
    slug: "techstack",
    hooks: {
        afterChange: [revalidateTechStacks],
        afterDelete: [deleteTechStacks],
    },
    admin: {
        useAsTitle: "name",
    },
    fields: [
        {
            name: "name",
            type: "text",
            label: "Tech Stack Name",
            required: true,
        },
        {
            name: "url",
            type: "text",
            label: "Tech Stack URL",
        },
        {
            name: "logo",
            type: "text",
            label: "Tech Stack Logo (SVG, example source: https://techicons.dev/ or Simple Icons)",
        },
    ],
    defaultSort: "name",
}
