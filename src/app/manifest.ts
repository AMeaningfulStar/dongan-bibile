import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '청소년성경통독',
    short_name: '청신호',
    description: '청소년 성경 통독 서비스',
    start_url: '/',
    display: 'standalone',
    icons: [
      {
        src: '/image/192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/image/256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/image/512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
