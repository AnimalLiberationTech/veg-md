const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
    ],
  },
  // Ensure consistent relative paths for static hosting
  trailingSlash: true
};

// Apply basePath/assetPrefix only when explicitly requested by deployment config.
const rawBasePath = process.env.NEXT_BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH || '';
const normalizedBasePath = rawBasePath
  ? `/${rawBasePath.replace(/^\/+|\/+$/g, '')}`
  : '';

if (normalizedBasePath && normalizedBasePath !== '/') {
  nextConfig.basePath = normalizedBasePath;
  nextConfig.assetPrefix = `${normalizedBasePath}/`;
}

module.exports = withNextIntl(nextConfig);
