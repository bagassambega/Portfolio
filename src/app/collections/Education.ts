import type {
    CollectionConfig,
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from "payload"
import { revalidateTag } from "next/cache"
import * as Constant from "@/_config/Constant"
import { triggerRevalidatePrewarm } from "@/lib/services/revalidate-prewarm"

const revalidateEducation: CollectionAfterChangeHook = async () => {
    revalidateTag(Constant.CACHE_TAGS.EDUCATION, "days")

    await triggerRevalidatePrewarm({
        tags: [Constant.CACHE_TAGS.EDUCATION],
        paths: ["/educations"],
    })
}

const deleteEducation: CollectionAfterDeleteHook = async () => {
    revalidateTag(Constant.CACHE_TAGS.EDUCATION, "days")

    await triggerRevalidatePrewarm({
        tags: [Constant.CACHE_TAGS.EDUCATION],
        paths: ["/educations"],
    })
}

export const Education: CollectionConfig = {
    slug: "education",
    admin: {
        useAsTitle: "name",
    },
    hooks: {
        afterChange: [revalidateEducation],
        afterDelete: [deleteEducation],
    },
    fields: [
        {
            name: "level",
            label: "Level (School, University)",
            type: "text",
            required: true,
        },
        {
            name: "name",
            label: "Institution Name",
            type: "text",
            required: true,
        },
        {
            name: "gpa",
            label: "GPA",
            type: "number",
        },
        {
            name: "credits",
            label: "Credits (SKS)",
            type: "number",
        },
        {
            name: "description",
            label: "Descriptions",
            type: "richText",
        },
        {
            name: "logo",
            label: "Logo",
            type: "relationship",
            relationTo: "media",
        },
    ],
}
