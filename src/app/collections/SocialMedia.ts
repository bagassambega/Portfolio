import type {
    CollectionConfig,
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
} from "payload"
import { revalidateTag } from "next/cache"
import * as Constant from "@/_config/Constant"
import { triggerRevalidatePrewarm } from "@/lib/services/revalidate-prewarm"

const revalidateSocialMedia: CollectionAfterChangeHook = async () => {
    revalidateTag(Constant.CACHE_TAGS.SOCIAL_MEDIA, "days")

    await triggerRevalidatePrewarm({
        tags: [Constant.CACHE_TAGS.SOCIAL_MEDIA],
        paths: ["/"],
    })
}

const deleteSocialMedia: CollectionAfterDeleteHook = async () => {
    revalidateTag(Constant.CACHE_TAGS.SOCIAL_MEDIA, "days")

    await triggerRevalidatePrewarm({
        tags: [Constant.CACHE_TAGS.SOCIAL_MEDIA],
        paths: ["/"],
    })
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
            name: "username",
            label: "Username (for tooltip)",
            type: "text",
        },
        {
            name: "logo",
            label: "Logo (SVG, i.e. can be taken from Simple Icons or https://techicons.dev/)",
            type: "text",
            required: true,
        },
    ],
}
