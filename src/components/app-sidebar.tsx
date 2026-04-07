import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import * as React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { auth } from '@/lib/auth'
import { NavMain } from './nav-main'
import { TheSidebarFooter } from './the-sidebar-footer'

export default async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = await getTranslations()
  const session = await auth()

  type AllowedHref = '/' | '/dashboard' | '/settings'

  const user = {
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    avatar: session?.user?.image || '',
  }

  const navMain: {
    title: string
    url: AllowedHref | '#'
    iconName: string
    isActive?: boolean
    children: {
      title: string
      url: AllowedHref | '#'
    }[]
  }[] = [
    {
      title: t('sidebar.navMain.coreFeatures.label'),
      url: '#',
      iconName: 'AppWindow',
      isActive: true,
      children: [
        {
          title: t('sidebar.navMain.coreFeatures.items.dashboard'),
          url: '/dashboard',
        },
        {
          title: t('sidebar.navMain.coreFeatures.items.settings'),
          url: '/settings',
        },
      ],
    },
    {
      title: t('sidebar.navMain.documentation.label'),
      url: '#',
      iconName: 'FileTypeDoc',
      children: [
        {
          title: 'How to',
          url: '#',
        },
      ],
    },
    {
      title: t('sidebar.navMain.apiEndpoints.label'),
      url: '#',
      iconName: 'Api',
      children: [
        {
          title: 'How to',
          url: '#',
        },
      ],
    },
  ]

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={(
                <Link href="/">
                  <div className="flex justify-center items-center bg-sidebar-primary rounded-lg size-8 aspect-square text-sidebar-primary-foreground">
                    Logo
                  </div>
                  <div className="flex-1 grid text-sm text-left leading-tight">
                    <span className="font-medium truncate">{t('common.appName')}</span>
                    <span className="text-xs truncate">{t('common.tagline')}</span>
                  </div>
                </Link>
              )}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('sidebar.navMain.mainLabel')}</SidebarGroupLabel>
          {navMain.map(item => (
            <NavMain
              item={item}
              key={item.title}
            />
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <TheSidebarFooter user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
