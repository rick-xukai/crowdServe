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
  }
};

module.exports = nextConfig;
