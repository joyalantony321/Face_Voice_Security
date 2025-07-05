/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Remove output: 'export' to allow API routes to work properly
  // output: 'export',
};

module.exports = nextConfig;