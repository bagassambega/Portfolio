import type {
    CollectionConfig,
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from "payload"
import { revalidateTag } from "next/cache"
import * as Constant from "@/_config/Constant"

const revalidateCorporations: CollectionAfterChangeHook = () => {
    revalidateTag(Constant.CACHE_TAGS.CORPORATIONS, "days")
    revalidateTag(Constant.CACHE_TAGS.WORK_EXPERIENCES, "days")
}

const deleteCorporations: CollectionAfterDeleteHook = () => {
    revalidateTag(Constant.CACHE_TAGS.CORPORATIONS, "days")
    revalidateTag(Constant.CACHE_TAGS.WORK_EXPERIENCES, "days")
}

export const Corporation: CollectionConfig = {
    slug: "corporation",
    admin: {
        useAsTitle: "name",
    },
    hooks: {
        afterChange: [revalidateCorporations],
        afterDelete: [deleteCorporations],
    },
    fields: [
        {
            name: "name",
            label: "Corporation Name",
            type: "text",
            required: true,
        },
        {
            name: "city",
            label: "Corporation's City Location",
            type: "text",
            required: true,
        },
        {
            name: "country",
            label: "Corporation's Country Location",
            type: "text",
            required: true,
        },
        {
            name: "description",
            label: "Description",
            type: "richText",
        },
        {
            name: "logo",
            label: "Corporation's Logo",
            type: "relationship",
            relationTo: "media",
            hasMany: false,
        },
    ],
}
