/** @type {import('next').NextConfig} */
const createPWA = require("@ducanh2912/next-pwa").default

const withPWA = createPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  // Remove this line or set to false to enable PWA in development
  disable: false, // Changed from: disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
  },
})

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // Development - Laravel local server with port 8000
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/images/**",
      },
      // Development - Laravel local server without port (default 80)
      {
        protocol: "http",
        hostname: "localhost",
        port: "",
        pathname: "/images/**",
      },
      // Development - 127.0.0.1 alternative
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "",
        pathname: "/images/**",
      },
      // Production - Your Laravel API domain
      {
        protocol: "https",
        hostname: "infinitech-api4.site",
        pathname: "/images/**",
      },
      // Fallback for any other subdomains
      {
        protocol: "https",
        hostname: "*.infinitech-api4.site",
        pathname: "/images/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
  },
}

module.exports = withPWA(nextConfig)
