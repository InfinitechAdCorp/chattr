/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'production', // disable PWA in dev
});

const nextConfig = {
  // Your Next.js config options
  reactStrictMode: true,
  // any other settings
};

module.exports = withPWA(nextConfig);
