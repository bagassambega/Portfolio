import type {
    CollectionConfig,
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
    CollectionBeforeValidateHook,
} from "payload"
import { revalidateTag } from "next/cache"
import * as Constant from "../../_config/Constant"

const revalidateProjects: CollectionAfterChangeHook = () => {
    revalidateTag(Constant.CACHE_TAGS.PROJECTS, "days")
}

const deleteProjects: CollectionAfterDeleteHook = () => {
    revalidateTag(Constant.CACHE_TAGS.PROJECTS, "days")
}

/**
 * Auto-generates `project-slug` from `title` if not provided.
 * Converts to lowercase, replaces spaces with hyphens, and strips
 * any characters that are not alphanumeric or hyphens.
 */
const generateSlug: CollectionBeforeValidateHook = ({ data }) => {
    if (
        data &&
        (!data["project-slug"] || data["project-slug"] === "") &&
        data.title
    ) {
        data["project-slug"] = data.title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "")
    }
    return data
}

export const Project: CollectionConfig = {
    slug: "project",
    admin: {
        useAsTitle: "title",
    },
    hooks: {
        beforeValidate: [generateSlug],
        afterChange: [revalidateProjects],
        afterDelete: [deleteProjects],
    },
    fields: [
        {
            name: "title",
            label: "Title",
            type: "text",
            required: true,
        },
        {
            name: "project-slug",
            label: "Slug",
            type: "text",
            required: true,
            unique: true,
            index: true,
            admin: {
                position: "sidebar",
                description:
                    "Auto-generated from title. Override manually if needed.",
            },
        },
        {
            name: "highlighted-description",
            type: "richText",
            label: "Highlighted Description",
            required: true,
        },
        {
            name: "description",
            label: "Description",
            type: "richText",
            required: true,
        },
        {
            name: "type",
            label: "Project Type",
            type: "select",
            options: Object.values(Constant.PROJECT_TYPE),
            required: true,
        },
        {
            name: "sourcecode",
            label: "Source Code URL",
            type: "text",
        },
        {
            name: "url",
            label: "URL Deployment (to visit)",
            type: "text",
        },
        {
            name: "starting_date",
            type: "date",
            label: "Starting Date",
            required: true,
        },
        {
            name: "end_date",
            type: "date",
            label: "End Date",
        },
        {
            name: "media-highlight",
            label: "Highlighted Media",
            type: "relationship",
            relationTo: "media",
        },
        {
            name: "media",
            label: "Media",
            type: "relationship",
            relationTo: "media",
            hasMany: true,
        },
        {
            name: "techstack",
            label: "Tech Stacks",
            type: "relationship",
            relationTo: "techstack",
            hasMany: true,
        },
        {
            name: "isHighlighted",
            type: "checkbox",
            label: "Wants to Highlight?",
            defaultValue: false,
        },
    ],
}
