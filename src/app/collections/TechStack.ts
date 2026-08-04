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
    revalidateTag(Constant.CACHE_TAGS.WORK_EXPERIENCES, "days")

    await triggerRevalidatePrewarm({
        tags: [
            Constant.CACHE_TAGS.TECHSTACKS,
            Constant.CACHE_TAGS.PROJECTS,
            Constant.CACHE_TAGS.WORK_EXPERIENCES,
        ],
        paths: ["/projects", "/experiences/work"],
    })
}

const deleteTechStacks: CollectionAfterDeleteHook = async () => {
    revalidateTag(Constant.CACHE_TAGS.TECHSTACKS, "days")
    revalidateTag(Constant.CACHE_TAGS.PROJECTS, "days")
    revalidateTag(Constant.CACHE_TAGS.WORK_EXPERIENCES, "days")

    await triggerRevalidatePrewarm({
        tags: [
            Constant.CACHE_TAGS.TECHSTACKS,
            Constant.CACHE_TAGS.PROJECTS,
            Constant.CACHE_TAGS.WORK_EXPERIENCES,
        ],
        paths: ["/projects", "/experiences/work"],
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
        {
            name: "logoColor",
            type: "select",
            label: "Logo Color",
            defaultValue: "neutral",
            options: [
                {
                    label: "Neutral",
                    value: "neutral",
                },
                {
                    label: "Black",
                    value: "black",
                },
                {
                    label: "White",
                    value: "white",
                },
            ],
            admin: {
                description:
                    "Use Black for black SVG logos that need a white pill in dark mode. Use White for white SVG logos that need a black pill.",
            },
        },
    ],
    defaultSort: "name",
}
