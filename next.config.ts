import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "5001",
            },
        ],
    },
    experimental: {
        optimizePackageImports: ["framer-motion", "lucide-react"],
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
    },
};

export default nextConfig;
