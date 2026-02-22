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
    ],
}
