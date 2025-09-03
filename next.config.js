const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: 'veg-md',
  output: 'export',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
  // Ensure consistent relative paths for static hosting
  trailingSlash: true
};

// When running in GitHub Actions, configure basePath/assetPrefix automatically
// if (process.env.GITHUB_ACTIONS === 'true' && process.env.GITHUB_REPOSITORY) {
//   const repo = process.env.GITHUB_REPOSITORY.split('/')[1];
//   if (repo) {
//     nextConfig.basePath = `/${repo}`;
//     nextConfig.assetPrefix = `/${repo}/`;
//   }
// }

module.exports = withNextIntl(nextConfig);
