"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  House,
  Megaphone,
  Gear,
} from "@phosphor-icons/react"
import { getActiveUser, getRoleForPersona } from "@/lib/mock-data"

export function AppSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const persona = searchParams.get("persona") || "sarah"
  const activeUser = getActiveUser(persona)
  const role = getRoleForPersona(persona)
  const { setOpenMobile } = useSidebar()

  // Build query string for links
  const qs = persona === "sarah" ? "" : `?persona=${persona}`

  // Initials from active user's name
  const initials = activeUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  // Close mobile sidebar when navigating to a new page
  useEffect(() => {
    setOpenMobile(false)
  }, [pathname, setOpenMobile])

  const mainLinks = [
    {
      label: "Home",
      href: `/home${qs}`,
      icon: House,
      active: pathname === "/home",
    },
    {
      label: "Promotions",
      href: `/requests${qs}`,
      icon: Megaphone,
      active: pathname.startsWith("/requests"),
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <img src="/logo-black.svg" alt="Amplify" className="h-6 dark:hidden" />
                <img src="/logo-white.svg" alt="Amplify" className="hidden h-6 dark:block" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainLinks.map((link) => (
                <SidebarMenuItem key={link.label}>
                  <SidebarMenuButton asChild isActive={link.active}>
                    <Link href={link.href}>
                      <link.icon className={`size-4${link.label === "Promotions" ? " -scale-x-100" : ""}`} />
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-0">
        <div className="px-4 pt-4 pb-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                <Link href={`/settings${qs}`}>
                  <Gear className="size-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
        <div className="border-t" />
        <div className="flex items-center gap-3 px-4 pt-4 pb-6">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-tight">{activeUser.name}</span>
            <span className="text-xs text-muted-foreground">
              {role === "sponsor" ? "Sponsor" : role === "both" ? "Publisher & Sponsor" : "Publisher"}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
