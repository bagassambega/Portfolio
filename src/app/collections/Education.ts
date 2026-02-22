import type {
    CollectionConfig,
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from "payload"
import { revalidateTag } from "next/cache"
import * as Constant from "@/_config/Constant"

const revalidateEducation: CollectionAfterChangeHook = () => {
    revalidateTag(Constant.CACHE_TAGS.EDUCATION, "days")
}

const deleteEducation: CollectionAfterDeleteHook = () => {
    revalidateTag(Constant.CACHE_TAGS.EDUCATION, "days")
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
