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
  serverExternalPackages: ['mongodb'],
}

export default nextConfig
