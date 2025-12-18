import React from 'react'

export const metadata = { title: '하루빛 관리자', description: '관리자 패널 레이아웃' }

type Props = { children: React.ReactNode }

export default function AdminLayout({ children }: Props) {
  return <div>{children}</div>
}
