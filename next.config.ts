import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/heic-hero',
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
