import type {
    CollectionConfig,
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from "payload"
import { revalidateTag } from "next/cache"
import * as Constant from "@/_config/Constant"

const revalidateSocialMedia: CollectionAfterChangeHook = () => {
    revalidateTag(Constant.CACHE_TAGS.SOCIAL_MEDIA, "days")
}

const deleteSocialMedia: CollectionAfterDeleteHook = () => {
    revalidateTag(Constant.CACHE_TAGS.SOCIAL_MEDIA, "days")
}

export const SocialMedia: CollectionConfig = {
    slug: "social-media",
    labels: {
        plural: "Social Medias",
        singular: "Social Media",
    },
    admin: {
        useAsTitle: "name",
    },
    hooks: {
        afterChange: [revalidateSocialMedia],
        afterDelete: [deleteSocialMedia],
    },
    fields: [
        {
            name: "name",
            label: "Platform Name",
            type: "text",
            required: true,
        },
        {
            name: "url",
            label: "URL/Username",
            type: "text",
        },
        {
            name: "logo",
            label: "Logo (SimpleIcons Logo Name, i.e. Moon, Sun)",
            type: "text",
            required: true,
        },
    ],
}
