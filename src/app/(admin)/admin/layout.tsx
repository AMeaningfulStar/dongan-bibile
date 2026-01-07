import { redirect } from 'next/navigation'

import { ForbiddenError, UnauthorizedError } from '@/features/admin/auth/errors'
import { requireAdmin } from '@/features/admin/auth/guard'
import { AdminShell } from '@features/admin/layout/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    // MVP: mainAdmin/subAdmin 둘 다 허용
    await requireAdmin(['mainAdmin', 'subAdmin'])
  } catch (e: any) {
    // 1) 세션이 없거나(UNAUTHORIZED)
    if (e instanceof UnauthorizedError) {
      redirect(`/login?next=/admin`)
    }

    // 2) role이 없거나(FORBIDDEN)
    if (e instanceof ForbiddenError) {
      redirect('/403')
    }

    // 예외 케이스는 안전하게 403
    redirect('/403')
  }
  return <AdminShell>{children}</AdminShell>
}
