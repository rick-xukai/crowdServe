/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  compiler: {
    styledComponents: true
  },
  output: 'standalone',
  images: {
    unoptimized: true
  },
  publicRuntimeConfig: {
    buildTime: new Date()
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/events',
        permanent: true,
      },
      {
        source: '/my',
        destination: '/events',
        permanent: true,
      },
      {
        source: '/crowdfund',
        destination: '/events',
        permanent: true,
      },
      {
        source: '/my/tickets/:slug',
        destination: '/events',
        permanent: true,
      },
    ]
  },
};

module.exports = nextConfig;
