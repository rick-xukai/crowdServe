/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compiler: {
    styledComponents: true
  },
  output: 'standalone',
  images: {
    unoptimized: true
  },
  publicRuntimeConfig: {
    buildTime: new Date()
  }
};

module.exports = nextConfig;
