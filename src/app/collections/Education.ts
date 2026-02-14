import type { CollectionConfig } from "payload";

export const Education: CollectionConfig = {
    slug: "education",
    admin: {
        useAsTitle: "name",
    },
    fields: [
        {
            name: "level",
            label: "Level (School, University)",
            type: "text",
            required: true,
        },
        {
            name: "name",
            label: "Institution Name",
            type: "text",
            required: true,
        },
        {
            name: "gpa",
            label: "GPA",
            type: "number",
        },
        {
            name: "credits",
            label: "Credits (SKS)",
            type: "number",
        },
        {
            name: "description",
            label: "Descriptions",
            type: "richText",
        },
        {
            name: "logo",
            label: "Logo",
            type: "relationship",
            relationTo: "media",
        },
    ]
}