import type { CollectionConfig } from "payload";

export const Corporation: CollectionConfig = {
    slug: "corporation",
    admin: {
        useAsTitle: "name",
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
            relationTo: "media"
        }
    ]
}