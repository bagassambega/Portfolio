import type { GlobalConfig, GlobalAfterChangeHook } from "payload"
import { revalidateTag } from "next/cache"
import * as Constant from "@/_config/Constant"

const revalidateHero: GlobalAfterChangeHook = () => {
    revalidateTag(Constant.CACHE_TAGS.HERO, "days")
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
