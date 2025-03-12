// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from 'next';

let userConfig: Partial<NextConfig> | undefined;

try {
    userConfig = require('./v0-user-next.config').default;
} catch (e) {
    // Ignore error if the file does not exist
}

/** @type {NextConfig} */
const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true
    },
    typescript: {
        ignoreBuildErrors: true
    },
    images: {
        unoptimized: true, // If you want optimization, set this to false
        domains: ['res.cloudinary.com'], // Allow images from Cloudinary
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '/**' // Allow all paths from Cloudinary
            }
        ]
    },
    experimental: {
        webpackBuildWorker: true,
        parallelServerBuildTraces: true,
        parallelServerCompiles: true
    },
    ...userConfig // Merge userConfig into nextConfig
};

export default nextConfig;
