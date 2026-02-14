import type { CollectionConfig } from "payload";

export const SocialMedia: CollectionConfig = {
    slug: "social-media",
    labels: {
        plural: "Social Medias",
        singular: "Social Media",
    },
    admin: {
        useAsTitle: "name",
    },
    fields: [
        {
            name: "name",
            label: "Platform Name",
            type: "text",
            required: true,
        },
        {
            name: "url",
            label: "URL/Username",
            type: "text",
        },
        {
            name: "logo",
            label: "Logo (Lucide React Icon Logo Name, i.e. Moon, Sun)",
            type: "text",
            required: true,
        }
    ]
}