import type {
    CollectionConfig,
    CollectionAfterChangeHook,
    CollectionAfterDeleteHook,
    CollectionBeforeValidateHook,
} from "payload"
import { revalidateTag } from "next/cache"
import * as Constant from "@/_config/Constant"
import { triggerRevalidatePrewarm } from "@/lib/services/revalidate-prewarm"

const revalidateOrganizationExperiences: CollectionAfterChangeHook = async ({
    doc,
}) => {
    revalidateTag(Constant.CACHE_TAGS.ORGANIZATION_EXPERIENCES, "days")

    const slug = typeof doc?.slug === "string" ? doc.slug : undefined

    await triggerRevalidatePrewarm({
        tags: [Constant.CACHE_TAGS.ORGANIZATION_EXPERIENCES],
        paths: slug
            ? ["/experiences", `/experiences/organization/${slug}`]
            : ["/experiences"],
    })
}

const deleteOrganizationExperiences: CollectionAfterDeleteHook = async () => {
    revalidateTag(Constant.CACHE_TAGS.ORGANIZATION_EXPERIENCES, "days")

    await triggerRevalidatePrewarm({
        tags: [Constant.CACHE_TAGS.ORGANIZATION_EXPERIENCES],
        paths: ["/experiences"],
    })
}

/**
 * Auto-generates `slug` from `corporation.name` and `title` if not provided.
 * Format: [corporation-name]-[title], trimmed, lowercase, hyphens instead of spaces.
 */
const generateSlug: CollectionBeforeValidateHook = async ({ data, req }) => {
    if (
        data &&
        (!data.slug || data.slug === "") &&
        data.title &&
        data.corporation
    ) {
        try {
            // Determine the ID whether it's an object or a raw string/number
            const corpId =
                typeof data.corporation === "object"
                    ? data.corporation.id
                    : data.corporation

            const corp = await req.payload.findByID({
                collection: "corporation",
                id: corpId,
                depth: 0,
            })

            if (corp && corp.name) {
                const rawString = `${corp.name}-${data.title}`
                data.slug = rawString
                    .toLowerCase()
                    .replace(/\s+/g, "-") // replace spaces with hyphens
                    .replace(/[^a-z0-9-]/g, "") // strip all non-alphanumeric/hyphen symbols
                    .replace(/-+/g, "-") // replace multiple continuous hyphens with a single one
                    .replace(/^-|-$/g, "") // trim trailing/leading hyphens
            }
        } catch (error) {
            console.error(
                "Error fetching corporation for OrganizationExperience slug automatically.",
                error
            )
            // Fallback to just the title if corporation fetch fails
            data.slug = data.title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "")
        }
    }
    return data
}

export const OrganizationExperience: CollectionConfig = {
    slug: "organization-experience",
    labels: {
        plural: "Organization Experiences",
        singular: "Organization Experience",
    },
    admin: {
        useAsTitle: "title",
    },
    hooks: {
        beforeValidate: [generateSlug],
        afterChange: [revalidateOrganizationExperiences],
        afterDelete: [deleteOrganizationExperiences],
    },
    fields: [
        {
            name: "title",
            type: "text",
            label: "Title/Position",
            required: true,
        },
        {
            name: "slug",
            label: "Slug",
            type: "text",
            required: true,
            unique: true,
            index: true,
            admin: {
                position: "sidebar",
                description:
                    "Auto-generated from Corporation Name and Title. Override manually if needed.",
            },
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
            type: "richText",
            label: "Result (URL, Repository, Final Artifacts)",
        },
    ],
}
