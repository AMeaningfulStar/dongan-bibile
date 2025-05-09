'use client'

import Link from 'next/link'

import { useAuthStore } from '@/stores/useAuthStore'

export default function Admin() {
  const { user } = useAuthStore()

  return (
    <div className="flex flex-grow flex-col items-center px-3 pt-4">
      <div className="mb-6 max-w-xl rounded-xl bg-yellow-100 px-6 py-4 text-sm text-gray-800 shadow-md">
        <p className="mb-2 font-semibold">⚠️ 관리자 페이지 사용 안내</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            관리자 페이지에서 수정 또는 삭제하는 데이터는 실시간으로 반영되며,{' '}
            <span className="font-semibold text-red-600">한 번 변경된 데이터는 되돌릴 수 없습니다</span>. 반드시
            신중하게 작업해 주세요.
          </li>
          <li>
            관리자 기능은 시스템에 큰 영향을 줄 수 있으므로,{' '}
            <span className="font-semibold">불필요한 변경이나 테스트용 데이터 조작은 금지</span>되어 있습니다.
          </li>
          <li>
            관리 권한은 <span className="font-semibold">메인 관리자에게 전적으로 위임</span>되어 있으며, 모든 변경사항은
            로그로 기록됩니다.
          </li>
          <li>시스템에 문제가 발생하거나 변경 전 상담이 필요한 경우, 반드시 메인 관리자와 협의 후 진행해 주세요.</li>
        </ul>
      </div>
      <h2 className="mt-6 w-full max-w-xl px-2 text-base font-bold text-gray-800">📂 관리 항목</h2>
      <div className="mt-4 grid w-full max-w-xl grid-cols-2 gap-x-3 gap-y-4">
        {user && user.role === 'admin' && (
          <div className="col-span-2 flex gap-x-3">
            <Link
              href={'/admin/churches'}
              className="flex w-full items-center justify-center rounded-xl bg-gl-green-opacity-50 px-4 py-2.5 text-caption-15-l text-gl-black-base shadow"
            >
              교회 관리
            </Link>
            <Link
              href={'/admin/departments'}
              className="flex w-full items-center justify-center rounded-xl bg-gl-green-opacity-50 px-4 py-2.5 text-caption-15-l text-gl-black-base shadow"
            >
              부서 관리
            </Link>
          </div>
        )}
        {user && user.role !== 'read_only' && (
          <div className="col-span-2 flex gap-x-3">
            <Link
              href={'/admin/season'}
              className="flex w-full items-center justify-center rounded-xl bg-gl-green-opacity-50 px-4 py-2.5 text-caption-15-l text-gl-black-base shadow"
            >
              시즌 관리
            </Link>
            <Link
              href={'/admin/schedule'}
              className="flex w-full items-center justify-center rounded-xl bg-gl-green-opacity-50 px-4 py-2.5 text-caption-15-l text-gl-black-base shadow"
            >
              성경 일정 관리
            </Link>
          </div>
        )}
        <Link
          href={'/admin/overview'}
          className="flex w-full items-center justify-center rounded-xl bg-gl-green-opacity-50 px-4 py-2.5 text-caption-15-l text-gl-black-base shadow"
        >
          현황 관리
        </Link>
        <Link
          href={'/admin/users'}
          className="flex w-full items-center justify-center rounded-xl bg-gl-green-opacity-50 px-4 py-2.5 text-caption-15-l text-gl-black-base shadow"
        >
          사용자 관리
        </Link>
      </div>
    </div>
  )
}
