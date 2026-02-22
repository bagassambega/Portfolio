import type {
    CollectionConfig,
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from "payload"
import { revalidateTag } from "next/cache"
import * as Constant from "@/_config/Constant"

const revalidateProjectTypes: CollectionAfterChangeHook = () => {
    revalidateTag(Constant.CACHE_TAGS.PROJECT_TYPES, "days")
    revalidateTag(Constant.CACHE_TAGS.PROJECTS, "days")
}

const deleteProjectTypes: CollectionAfterDeleteHook = () => {
    revalidateTag(Constant.CACHE_TAGS.PROJECT_TYPES, "days")
    revalidateTag(Constant.CACHE_TAGS.PROJECTS, "days")
}

export const ProjectType: CollectionConfig = {
    slug: "project-type",
    labels: {
        plural: "Project Types",
        singular: "Project Type",
    },
    admin: {
        useAsTitle: "name",
    },
    hooks: {
        afterChange: [revalidateProjectTypes],
        afterDelete: [deleteProjectTypes],
    },
    fields: [
        {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
        },
        {
            name: "color",
            label: "Color",
            type: "text",
            required: true,
            admin: {
                description:
                    "Tailwind color class (e.g. blue-400, yellow-400, red-400, green-400)",
            },
        },
    ],
}
