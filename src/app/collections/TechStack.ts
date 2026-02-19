import type { CollectionConfig } from "payload";

export const TechStack: CollectionConfig = {
    slug: "techstack",
    fields: [
        {
            name: "name",
            type: "text",
            label: "Tech Stack Name",
            required: true,
        },
        {
            name: "url",
            type: "text",
            label: "Tech Stack URL",
        },
        {
            name: "logo",
            type: "text",
            label: "Tech Stack Logo (Lucide React)",
        },
    ]
}