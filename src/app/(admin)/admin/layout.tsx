import { redirect } from 'next/navigation'

import { requireAdmin } from '@/features/admin/auth/guard'
import { AdminShell } from '@features/admin/layout/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    // MVP: mainAdmin/subAdmin 둘 다 허용
    await requireAdmin(['mainAdmin', 'subAdmin'])
  } catch (e: any) {
    // 1) 세션이 없거나(UNAUTHORIZED) 2) role이 없거나(FORBIDDEN)
    // MVP에서는 로그인으로 보내는 UX가 가장 단순
    redirect('/login?next=/admin')
  }
  return <AdminShell>{children}</AdminShell>
}
