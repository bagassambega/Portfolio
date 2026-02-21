import type { NextConfig } from "next"
import { withPayload } from "@payloadcms/next/withPayload"

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    cacheComponents: true,
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
