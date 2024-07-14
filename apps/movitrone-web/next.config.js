/** @type {import('next').NextConfig} */
// const { withNextVideo } = require('next-video/process');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],

};

module.exports = nextConfig;