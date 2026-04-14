/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: '.next',
  images: {
    unoptimized: true
  },
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL || 'http://10.9.0.80:8911',
    NEXT_PUBLIC_BACKEND_API_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://10.9.0.80:8911',
    NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000'
  }
}

module.exports = nextConfig
