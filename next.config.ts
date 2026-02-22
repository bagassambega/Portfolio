import type { NextConfig } from "next"
import { withPayload } from "@payloadcms/next/withPayload"

const nextConfig: NextConfig = {
    reactCompiler: true,
    experimental: {
        useCache: true,
    },
    cacheLife: {
        days: {
            stale: 3600,
            revalidate: 86400,
            expire: 604800,
        },
    },
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
            },
            {
                protocol: "https",
                hostname: "bagassambega.vercel.app",
            },
            {
                protocol: "https",
                hostname: "bagassambega.my.id",
            },
            {
                protocol: "https",
                hostname: "*.public.blob.vercel-storage.com",
            },
        ],
    },
}

export default withPayload(nextConfig)
