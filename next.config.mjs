/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'AURAVEIN.IN',
        port: '3000',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
}

export default nextConfig
