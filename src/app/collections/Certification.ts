import type {
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
    CollectionConfig,
} from "payload"
import { revalidateTag } from "next/cache"
import * as Constant from "@/_config/Constant"
import { triggerRevalidatePrewarm } from "@/lib/services/revalidate-prewarm"

const revalidateCertifications: CollectionAfterChangeHook = async () => {
    revalidateTag(Constant.CACHE_TAGS.CERTIFICATIONS, "days")

    await triggerRevalidatePrewarm({
        tags: [Constant.CACHE_TAGS.CERTIFICATIONS],
        paths: ["/educations"],
    })
}

const deleteCertifications: CollectionAfterDeleteHook = async () => {
    revalidateTag(Constant.CACHE_TAGS.CERTIFICATIONS, "days")

    await triggerRevalidatePrewarm({
        tags: [Constant.CACHE_TAGS.CERTIFICATIONS],
        paths: ["/educations"],
    })
}

export const Certification: CollectionConfig = {
    slug: "certification",
    labels: {
        plural: "Certifications",
        singular: "Certification",
    },
    admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "issuer", "status", "issuedAt", "sortOrder"],
    },
    hooks: {
        afterChange: [revalidateCertifications],
        afterDelete: [deleteCertifications],
    },
    fields: [
        {
            name: "title",
            label: "Certification Title",
            type: "text",
            required: true,
        },
        {
            name: "issuer",
            label: "Issuer",
            type: "text",
            required: true,
        },
        {
            name: "summary",
            label: "Summary",
            type: "textarea",
        },
        {
            name: "issuedAt",
            label: "Issued At",
            type: "date",
            required: true,
            admin: {
                date: {
                    pickerAppearance: "dayOnly",
                    displayFormat: "MMMM yyyy",
                },
                position: "sidebar",
            },
        },
        {
            name: "expiresAt",
            label: "Expires At",
            type: "date",
            admin: {
                date: {
                    pickerAppearance: "dayOnly",
                    displayFormat: "MMMM yyyy",
                },
                position: "sidebar",
            },
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            defaultValue: "active",
            options: [
                { label: "Active", value: "active" },
                { label: "Completed", value: "completed" },
                { label: "In Progress", value: "in_progress" },
                { label: "Expired", value: "expired" },
            ],
            admin: {
                position: "sidebar",
            },
        },
        {
            name: "credentialUrl",
            label: "Credential URL",
            type: "text",
        },
        {
            name: "credentialId",
            label: "Credential ID",
            type: "text",
        },
        {
            name: "issuerLogo",
            label: "Issuer Logo",
            type: "relationship",
            relationTo: "media",
        },
        {
            name: "certificationLogo",
            label: "Certification Logo",
            type: "relationship",
            relationTo: "media",
        },
        {
            name: "workingPeriod",
            label: "Working Period",
            type: "group",
            admin: {
                description:
                    "Optional training period showing when and how long the certification preparation took.",
            },
            fields: [
                {
                    name: "start",
                    label: "Start",
                    type: "date",
                    admin: {
                        date: {
                            pickerAppearance: "dayOnly",
                            displayFormat: "MMMM yyyy",
                        },
                    },
                },
                {
                    name: "end",
                    label: "End",
                    type: "date",
                    admin: {
                        date: {
                            pickerAppearance: "dayOnly",
                            displayFormat: "MMMM yyyy",
                        },
                    },
                },
            ],
        },
        {
            name: "logoDisplayMode",
            label: "Logo Display Mode",
            type: "select",
            required: true,
            defaultValue: "certification",
            options: [
                { label: "Certification Logo", value: "certification" },
                { label: "Issuer Logo", value: "issuer" },
                { label: "Both Logos", value: "both" },
                { label: "No Logo", value: "none" },
            ],
        },
        {
            name: "themeColor",
            label: "Theme Color",
            type: "text",
            defaultValue: "#f97316",
            admin: {
                description:
                    "Primary card accent color. Use a CSS color such as #f97316, rgb(...), or oklch(...).",
            },
        },
        {
            name: "themeColorEnd",
            label: "Theme Color End",
            type: "text",
            defaultValue: "#f59e0b",
            admin: {
                description:
                    "Optional second color for gradient themes. Leave empty for a single-color theme.",
            },
        },
        {
            name: "themeMode",
            label: "Theme Mode",
            type: "select",
            required: true,
            defaultValue: "gradient",
            options: [
                { label: "Gradient", value: "gradient" },
                { label: "Solid", value: "solid" },
                { label: "Subtle", value: "subtle" },
            ],
        },
        {
            name: "skills",
            label: "Skills",
            type: "text",
            admin: {
                description:
                    "Comma-separated freeform skills, separate from reusable Tech Stack documents.",
            },
        },
        {
            name: "techstacks",
            label: "Tech Stacks",
            type: "relationship",
            relationTo: "techstack",
            hasMany: true,
        },
        {
            name: "sortOrder",
            label: "Sort Order",
            type: "number",
            defaultValue: 0,
            admin: {
                position: "sidebar",
            },
        },
    ],
    defaultSort: "sortOrder",
}
