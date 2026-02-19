import type { CollectionConfig } from "payload"
import * as Constant from "@/_config/Constant"

export const WorkExperience: CollectionConfig = {
    slug: "work-experience",
    labels: {
        plural: "Work Experiences",
        singular: "Work Experience",
    },
    admin: {
        useAsTitle: "title",
    },
    fields: [
        {
            name: "title",
            type: "text",
            label: "Title/Position",
            required: true,
        },
        {
            name: "type",
            type: "select",
            label: "Status",
            options: Object.values(Constant.WORK_STATUS),
            required: true,
        },
        {
            name: "description",
            type: "richText",
            label: "Description",
            required: true,
        },
        {
            name: "location",
            type: "select",
            options: Object.values(Constant.WORK_LOCATION),
            required: true,
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
            name: "corporation",
            type: "relationship",
            label: "Corporation",
            required: true,
            relationTo: "corporation",
        },
        {
            name: "documentation",
            type: "relationship",
            label: "Images/Videos",
            relationTo: "media",
            hasMany: true,
        },
        {
            name: "result",
            type: "text",
            label: "Result (URL, Repository)"
        },
    ],
}
