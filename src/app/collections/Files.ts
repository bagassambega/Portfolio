import type { CollectionConfig } from "payload"

export const Files: CollectionConfig = {
    slug: "files",
    upload: {
        displayPreview: true,
        mimeTypes: ["application/pdf"],
    },
    fields: [
        {
            name: "alt",
            type: "text",
            label: "Alternative Text/Description",
            required: true,
        },
        {
            name: "url",
            type: "text",
            label: "Alternative File URL",
        },
    ],
}
