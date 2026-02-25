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
  Compass,
  Megaphone,
  CreditCard,
  Gear,
} from "@phosphor-icons/react"

export function AppSidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "both"
  const { setOpenMobile } = useSidebar()

  // Close mobile sidebar when navigating to a new page
  useEffect(() => {
    setOpenMobile(false)
  }, [pathname, setOpenMobile])

  const mainLinks = [
    {
      label: "Dashboard",
      href: `/dashboard?role=${role}`,
      icon: House,
      active: pathname === "/dashboard",
    },
    {
      label: "Discover",
      href: `/directory?role=${role}`,
      icon: Compass,
      active: pathname === "/directory",
    },
    {
      label: "Promotions",
      href: `/requests?role=${role}`,
      icon: Megaphone,
      active: pathname.startsWith("/requests"),
    },
    {
      label: "Payments",
      href: `/payments?role=${role}`,
      icon: CreditCard,
      active: pathname === "/payments",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex size-8 items-center justify-center rounded-sm bg-foreground text-background">
                  <span className="text-xs font-bold">A</span>
                </div>
                <span className="text-sm font-medium text-primary">Amplify</span>
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
        <div className="px-4 pt-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                <Link href={`/settings?role=${role}`}>
                  <Gear className="size-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
        <div className="border-t" />
        <div className="flex items-center gap-3 px-4 py-3">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">AJ</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-tight">Alex Johnson</span>
            <span className="text-xs text-muted-foreground">
              {role === "advertiser" ? "Sponsor" : "Publisher"}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
