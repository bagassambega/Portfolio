import type { GlobalConfig, GlobalAfterChangeHook } from "payload"
import { revalidateTag } from "next/cache"
import * as Constant from "@/_config/Constant"
import { triggerRevalidatePrewarm } from "@/lib/services/revalidate-prewarm"

const revalidateHero: GlobalAfterChangeHook = async () => {
    revalidateTag(Constant.CACHE_TAGS.HERO, "days")

    await triggerRevalidatePrewarm({
        tags: [Constant.CACHE_TAGS.HERO],
        paths: ["/"],
    })
}

export const Hero: GlobalConfig = {
    slug: "hero",
    hooks: {
        afterChange: [revalidateHero],
    },
    fields: [
        {
            name: "title",
            label: "Hero Title",
            type: "richText",
            required: true,
        },
        {
            name: "description",
            label: "Hero Description",
            type: "richText",
        },
        {
            name: "media",
            label: "Hero Media",
            type: "relationship",
            relationTo: "media",
        },
    ],
}
