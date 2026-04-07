'use client'

import { IconApi, IconAppWindow, IconChevronRight, IconFileTypeDoc } from '@tabler/icons-react'
import React from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Link } from '@/i18n/navigation'

// Icon mapping
const iconMap = {
  AppWindow: IconAppWindow,
  FileTypeDoc: IconFileTypeDoc,
  Api: IconApi,
}

// Base type for menu items
interface MenuItemBase {
  title: string
  iconName: string
  isActive?: boolean
}

// Type for child items (without icon)
interface MenuItemChild {
  title: string
  url: Parameters<typeof Link>[0]['href'] | '#'
}

// Main menu item type (allows '#' for expandable items)
type MenuItem = MenuItemBase & {
  url: Parameters<typeof Link>[0]['href'] | '#'
  children?: MenuItemChild[]
}

interface NavMainProps {
  item: MenuItem
}

export function NavMain({
  item,
}: NavMainProps) {
  const { state, isMobile } = useSidebar()
  const IconComponent = iconMap[item.iconName as keyof typeof iconMap]

  return (
    <SidebarMenu>
      <Collapsible
        defaultOpen={item.isActive}
      >
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={state === 'collapsed' && !isMobile ? item.title : undefined}
            render={(
              item.url === '#'
                ? (
                    <div className="flex items-center gap-2">
                      {IconComponent && <IconComponent />}
                      <span>{item.title}</span>
                    </div>
                  )
                : (
                    <Link href={item.url}>
                      {IconComponent && <IconComponent />}
                      <span>{item.title}</span>
                    </Link>
                  )
            )}
          />
          {item.children?.length
            ? (
                <>
                  <CollapsibleTrigger
                    render={(
                      <SidebarMenuAction className="data-open:rotate-90 data-panel-open:rotate-90">
                        <IconChevronRight />
                        <span className="sr-only">Toggle</span>
                      </SidebarMenuAction>
                    )}
                  />
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children.map(item => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton render={(
                            item.url === '#'
                              ? (
                                  <span>{item.title}</span>
                                )
                              : (
                                  <Link href={item.url}>
                                    <span>{item.title}</span>
                                  </Link>
                                )
                          )}
                          />
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              )
            : null}
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  )
}
