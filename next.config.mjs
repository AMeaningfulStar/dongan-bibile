/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa'

const isProd = process.env.NODE_ENV === 'production' // 배포 버전에만 PWA 활성화

const pwaConfig = withPWA({
  dest: 'public',
  disable: !isProd,
  skipWaiting: true,
  register: true,
  runtimeCaching: [],
})

const nextConfig = {}

export default pwaConfig(nextConfig)
