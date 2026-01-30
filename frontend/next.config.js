/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure webpack for react-pdf
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
}

module.exports = nextConfig
