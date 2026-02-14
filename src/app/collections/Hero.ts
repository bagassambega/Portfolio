import type { GlobalConfig } from "payload";

export const Hero: GlobalConfig = {
    slug: "hero",
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
            relationTo: "media"
        }
    ]
}