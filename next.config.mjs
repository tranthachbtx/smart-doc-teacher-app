/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  staticPageGenerationTimeout: 300,
  async rewrites() {
    return [
      {
        source: '/api/gemini-tunnel/:path*',
        destination: 'https://generativelanguage.googleapis.com/:path*',
      },
    ];
  },
};

export default nextConfig;