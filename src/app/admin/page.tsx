'use client'
import Link from 'next/link'

export default function Admin() {
  return (
    <div className="flex flex-col gap-y-6 py-8">
      <Link
        href={'/admin/setbible'}
        className="flex h-8 w-36 items-center justify-center rounded-lg border border-black bg-white"
      >
        <span className="text-sm font-normal leading-none">성경읽기 관리</span>
      </Link>
    </div>
  )
}
