const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        hostname: '*', // TODO match real sources
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  compiler: {
    emotion: {
      // default is true. It will be disabled when build type is production.
      sourceMap: false,
    },
  },
};
module.exports = withBundleAnalyzer(nextConfig);
