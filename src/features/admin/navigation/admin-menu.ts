import type { LucideIcon } from "lucide-react"
import {
  CalendarRange,
  LayoutDashboard,
  NotebookPen,
} from "lucide-react"

export type AdminRole =
  | "mainAdmin"
  | "subAdmin"
  | "communityAdmin"
  | "groupAdmin"

export type AdminNavItem = {
  key: string
  label: string
  href?: string
  icon?: LucideIcon
  roles?: AdminRole[]        // 없으면 모든 관리자 역할에 노출
  children?: AdminNavItem[]
  disabled?: boolean
}

export const ADMIN_NAV: AdminNavItem[] = [
  {
    key: "dashboard",
    label: "관리자 홈",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["mainAdmin", "subAdmin"], // MVP 기준: 우선 메인/서브만
  },
  {
    key: "seasons",
    label: "시즌 관리",
    href: "/admin/seasons",
    icon: CalendarRange,
    roles: ["mainAdmin", "subAdmin"],
  },
  {
    key: "plans",
    label: "성경 일정 관리",
    icon: NotebookPen,
    roles: ["mainAdmin", "subAdmin"],
    children: [
      {
        key: "plans-seasons",
        label: "시즌 기준 관리",
        href: "/admin/plans/seasons",
      },
      {
        key: "plans-dates",
        label: "날짜 기준 관리",
        href: "/admin/plans/dates",
      },
    ],
  },
]