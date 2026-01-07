import { cookies } from 'next/headers'

import { adminAuth } from '@libs/firebase-admin'

import type { AdminRole } from '../navigation/admin-menu'

export type AdminSession = {
  uid: string
  adminRole: AdminRole
  email?: string
}

export async function requireAdmin(allowedRoles: AdminRole[] = ['mainAdmin', 'subAdmin']): Promise<AdminSession> {
  const sessionCookie = cookies().get('__session')?.value

  // 1) __session 쿠키 존재 확인
  if (!sessionCookie) {
    throw new Error('UNAUTHORIZED: missing session')
  }

  // 2) Firebase Admin으로 session cookie 검증
  // checkRevoked: true 를 주면, revoke된 세션을 막을 수 있음
  const decoded = await adminAuth.verifySessionCookie(sessionCookie, true)

  // 3) custom claims의 adminRole 확인 (MVP: mainAdmin | subAdmin)
  const role = decoded.adminRole as AdminRole | undefined

  if (!role) {
    throw new Error('FORBIDDEN: missing adminRole')
  }

  if (!allowedRoles.includes(role)) {
    throw new Error('FORBIDDEN: insufficient role')
  }

  return {
    uid: decoded.uid,
    adminRole: role,
    email: decoded.email,
  }
}
