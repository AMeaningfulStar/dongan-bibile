import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '청소년 성경 통독',
  description: '청소년을 위한 말씀을 읽고 묵상하는 웹',
  icons: {
    icon: '/icon/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
