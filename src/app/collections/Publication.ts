import type { CollectionConfig } from "payload";

export const Publication: CollectionConfig = {
    slug: "publication",
    fields: [
        {
            name: "title",
            label: "Publication/Article Title",
            type: "text",
            required: true,
        },
        {
            name: "description",
            label: "Publication/Article Description",
            type: "richText",
        },
        {
            name: "url",
            label: "Publication/Article URL",
            type: "text",
        },
        {
            name: "repository",
            label: "Publication/Article Repository URL",
            type: "text",
        },
        {
            name: "image",
            label: "Publication/Article Documentation",
            type: "relationship",
            relationTo: "media",
            hasMany: true
        },
        {
            name: "files",
            label: "Publication/Article Files",
            type: "relationship",
            relationTo: "files",
            hasMany: true
        },
    ]
}