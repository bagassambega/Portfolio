import type {
    CollectionConfig,
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from "payload"
import { revalidateTag } from "next/cache"
import * as Constant from "@/_config/Constant"

const revalidatePublications: CollectionAfterChangeHook = () => {
    revalidateTag(Constant.CACHE_TAGS.PUBLICATIONS, "days")
}

const deletePublications: CollectionAfterDeleteHook = () => {
    revalidateTag(Constant.CACHE_TAGS.PUBLICATIONS, "days")
}

export const Publication: CollectionConfig = {
    slug: "publication",
    admin: {
        useAsTitle: "title",
    },
    hooks: {
        afterChange: [revalidatePublications],
        afterDelete: [deletePublications],
    },
    fields: [
        {
            name: "title",
            label: "Publication/Article Title",
            type: "text",
            required: true,
        },
        {
            name: "description",
            label: "Publication/Article Description",
            type: "richText",
        },
        {
            name: "url",
            label: "Publication/Article URL",
            type: "text",
        },
        {
            name: "repository",
            label: "Publication/Article Repository URL",
            type: "text",
        },
        {
            name: "image",
            label: "Publication/Article Documentation",
            type: "relationship",
            relationTo: "media",
            hasMany: true,
        },
        {
            name: "files",
            label: "Publication/Article Files",
            type: "relationship",
            relationTo: "files",
            hasMany: true,
        },
        {
            name: "isPublished",
            label: "Is Published?",
            type: "checkbox",
            defaultValue: false,
            admin: {
                position: "sidebar",
            },
        },
        {
            name: "publishedTo",
            label: "Published To (e.g. Medium, IEEE)",
            type: "text",
            admin: {
                position: "sidebar",
                condition: (data) => Boolean(data?.isPublished),
            },
        },
        {
            name: "publishDate",
            label: "Completion / Publish Date",
            type: "date",
            required: true,
            admin: {
                position: "sidebar",
                date: {
                    pickerAppearance: "dayOnly",
                    displayFormat: "MMMM yyyy",
                },
            },
        },
    ],
}
