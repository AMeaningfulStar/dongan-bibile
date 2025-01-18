import type { Metadata } from 'next'
import './globals.css'

import Layout from '@/components/Layout'

export const metadata: Metadata = {
  title: '청신호',
  description: '청소년2부 신약일독 호우!',
  icons: [
    {
      url: '/image/192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      url: '/image/256.png',
      sizes: '256x256',
      type: 'image/png',
    },
    {
      url: '/image/512.png',
      sizes: '512x512',
      type: 'image/png',
    },
    {
      url: '/icon/favicon.ico',
      type: 'image/x-icon',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/image/192.png" />
        <link rel="apple-touch-icon" href="/image/512.png" />
        <link rel="apple-touch-icon" href="/image/1024.png" />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
