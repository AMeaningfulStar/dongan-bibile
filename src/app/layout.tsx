import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '청소년 성경 통독',
  description: '청소년을 위한 말씀을 읽고 묵상하는 웹',
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
      </head>
      <body>{children}</body>
    </html>
  )
}
