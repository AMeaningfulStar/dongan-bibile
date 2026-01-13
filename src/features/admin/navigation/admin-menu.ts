import type { LucideIcon } from 'lucide-react'
import { CalendarCog, House } from 'lucide-react'

export type AdminRole = 'mainAdmin' | 'subAdmin'
//   | "communityAdmin"
//   | "groupAdmin"

export type AdminNavItem = {
  key: string
  label: string
  href: string
  icon?: LucideIcon
  // roles?: AdminRole[]        // 없으면 모든 관리자 역할에 노출
  children?: AdminNavItem[]
}

export const ADMIN_NAV: AdminNavItem[] = [
  {
    key: 'dashboard',
    label: '관리자 홈',
    href: '/admin',
    icon: House,
  },
  {
    key: 'courses',
    label: '커스텀 코스 관리',
    href: '/admin/courses',
    icon: CalendarCog,
  },
]
