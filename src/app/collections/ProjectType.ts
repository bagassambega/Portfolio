import type {
    CollectionConfig,
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from "payload"
import { revalidateTag } from "next/cache"
import * as Constant from "@/_config/Constant"
import { triggerRevalidatePrewarm } from "@/lib/services/revalidate-prewarm"

const revalidateProjectTypes: CollectionAfterChangeHook = async () => {
    revalidateTag(Constant.CACHE_TAGS.PROJECT_TYPES, "days")
    revalidateTag(Constant.CACHE_TAGS.PROJECTS, "days")

    await triggerRevalidatePrewarm({
        tags: [Constant.CACHE_TAGS.PROJECT_TYPES, Constant.CACHE_TAGS.PROJECTS],
        paths: ["/projects"],
    })
}

const deleteProjectTypes: CollectionAfterDeleteHook = async () => {
    revalidateTag(Constant.CACHE_TAGS.PROJECT_TYPES, "days")
    revalidateTag(Constant.CACHE_TAGS.PROJECTS, "days")

    await triggerRevalidatePrewarm({
        tags: [Constant.CACHE_TAGS.PROJECT_TYPES, Constant.CACHE_TAGS.PROJECTS],
        paths: ["/projects"],
    })
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
            type: "select",
            required: true,
            options: [
                { label: "Slate", value: "slate" },
                { label: "Gray", value: "gray" },
                { label: "Red", value: "red" },
                { label: "Orange", value: "orange" },
                { label: "Amber", value: "amber" },
                { label: "Yellow", value: "yellow" },
                { label: "Green", value: "green" },
                { label: "Emerald", value: "emerald" },
                { label: "Teal", value: "teal" },
                { label: "Cyan", value: "cyan" },
                { label: "Blue", value: "blue" },
                { label: "Indigo", value: "indigo" },
                { label: "Violet", value: "violet" },
                { label: "Purple", value: "purple" },
                { label: "Fuchsia", value: "fuchsia" },
                { label: "Pink", value: "pink" },
                { label: "Rose", value: "rose" },
            ],
            defaultValue: "slate",
            admin: {
                description: "Select the badge color for this project type.",
            },
        },
    ],
}
