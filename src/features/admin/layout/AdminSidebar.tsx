// src/features/admin/layout/AdminSidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ADMIN_NAV } from "../navigation/admin-menu"

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r p-4">
      <h2 className="mb-4 font-bold">Admin</h2>

      <nav className="space-y-2">
        {ADMIN_NAV.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href + "/")

          return (
            <div key={item.key}>
              {/* 상위 메뉴 */}
              <Link
                href={item.href}
                className={`block rounded px-3 py-2 text-sm ${
                  isActive
                    ? "bg-muted font-medium"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {item.label}
              </Link>

              {/* 하위 메뉴 */}
              {item.children && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.children.map((child) => {
                    const isChildActive =
                      pathname === child.href ||
                      pathname.startsWith(child.href + "/")

                    return (
                      <Link
                        key={child.key}
                        href={child.href}
                        className={`block rounded px-3 py-1.5 text-sm ${
                          isChildActive
                            ? "bg-muted font-medium"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {child.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}