'use client'

import Image from 'next/image'

import { NavMain } from '@features/admin/navigation/NavMain'
import { ADMIN_NAV } from '@features/admin/navigation/admin-menu'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@components/ui/sidebar'

import LogoIcon from '@public/logo.svg'

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/admin">
                <Image alt="logo" src={LogoIcon} width={20} height={20} className="h-5 w-5" />
                <span className="text-base font-semibold">청신호:관리자</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={ADMIN_NAV} />
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-1 text-sm text-muted-foreground">admin@placeholder</div>
      </SidebarFooter>
    </Sidebar>
  )
}
