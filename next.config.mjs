/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'sarikarprakritik.com',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongodb'],
  },
}

export default nextConfig
