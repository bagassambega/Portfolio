import type { CollectionConfig } from "payload";
import * as Constant from "../../_config/Constant";

export const Project: CollectionConfig = {
    slug: "project",
    admin: {
        useAsTitle: 'title'
    },
    fields: [
        {
            name: "title",
            label: "Title",
            type: "text",
            required: true
        },
        {
            name: "description",
            label: "Description",
            type: "richText",
            required: true
        },
        {
            name: "type",
            label: "Project Type",
            type: "select",
            options: Object.values(Constant.PROJECT_TYPE),
            required: true,
        },
        {
            name: "sourcecode",
            label: "Source Code URL",
            type: "text",
        },
        {
            name: "url",
            label: "URL Deployment (to visit)",
            type: "text",
        },
        {
            name: "starting_date",
            type: "date",
            label: "Starting Date",
            required: true,
        },
        {
            name: "end_date",
            type: "date",
            label: "End Date",
        },
        {
            name: "media-highlight",
            label: "Highlight",
            type: "relationship",
            relationTo: "media",
        },
        {
            name: "media",
            label: "Media",
            type: "relationship",
            relationTo: "media",
            hasMany: true
        },
        {
            name: "techstack",
            label: "Tech Stacks",
            type: "relationship",
            relationTo: "techstack",
            hasMany: true
        },
    ]
}