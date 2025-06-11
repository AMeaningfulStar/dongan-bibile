'use client'

import { useAuthStore } from '@/stores/useAuthStore'
import Link from 'next/link'
import React from 'react'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user } = useAuthStore()

  if (!user || (user.role !== 'admin' && user.role !== 'department_admin' && user.role !== 'read_only')) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center px-4">
        <div className="mb-2 text-caption-15-l">접근 권한이 없습니다</div>
        <Link
          href={'/'}
          className="flex h-8 w-full max-w-60 items-center justify-center rounded-lg bg-gl-green-opacity-30 active:bg-gl-green-opacity-50"
        >
          <span className="text-sm font-normal leading-none">홈으로 돌아가기</span>
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
