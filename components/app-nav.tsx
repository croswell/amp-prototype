"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { getActiveUser, getRoleForPersona, getActiveViewRole } from "@/lib/mock-data"
import { CaretUpDown, Check, House, Megaphone, Gear } from "@phosphor-icons/react"

const viewOptions = [
  { key: "publisher" as const, label: "Publisher" },
  { key: "sponsor" as const, label: "Sponsor" },
]

export function AppNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const persona = searchParams.get("role") || "publisher"
  const view = searchParams.get("view")
  const activeUser = getActiveUser(persona)
  const role = getRoleForPersona(persona)
  const activeViewRole = getActiveViewRole(role, view)
  const firstInitial = activeUser.name.charAt(0)

  // Build query string preserving persona and view params
  function buildQs(overrides?: { view?: string }) {
    const params = new URLSearchParams()
    if (persona !== "publisher") params.set("role", persona)
    const v = overrides?.view ?? view
    if (v && role === "both") params.set("view", v)
    const str = params.toString()
    return str ? `?${str}` : ""
  }

  const qs = buildQs()

  const navLinks = [
    {
      label: "Home",
      href: `/home${qs}`,
      active: pathname === "/home",
      icon: House,
    },
    {
      label: "Promotions",
      href: `/requests${qs}`,
      active: pathname.startsWith("/requests"),
      icon: Megaphone,
    },
    {
      label: "Settings",
      href: `/settings${qs}`,
      active: pathname === "/settings",
      icon: Gear,
    },
  ]

  return (
    <>
      {/* ── Top nav ── */}
      <nav className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <Link href={`/${qs}`}>
              {/* Icon-only logo on mobile, full logo on sm+ */}
              <img src="/icon-black.svg" alt="Amplify" className="h-8 dark:hidden sm:hidden" />
              <img src="/icon-white.svg" alt="Amplify" className="hidden h-8 dark:block sm:!hidden" />
              <img src="/logo-black.svg" alt="Amplify" className="hidden h-6 sm:block dark:sm:hidden" />
              <img src="/logo-white.svg" alt="Amplify" className="hidden h-6 dark:sm:block" />
            </Link>
            <div className="hidden items-center gap-1 sm:flex">
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={link.active ? "text-foreground" : "text-muted-foreground"}
                >
                  <Link href={link.href}>
                    {link.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {role === "both" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-md sm:border sm:px-2.5 sm:py-1.5 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
                    <Avatar className="size-8 sm:size-6">
                      <AvatarFallback>{firstInitial}</AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm sm:inline">{activeViewRole === "publisher" ? "Publisher" : "Sponsor"}</span>
                    <CaretUpDown className="hidden size-3.5 text-muted-foreground sm:block" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">{activeUser.name}</div>
                  {viewOptions.map((opt) => (
                    <DropdownMenuItem key={opt.key} asChild>
                      <Link href={`${pathname}${buildQs({ view: opt.key })}`}>
                        <div className="flex flex-1 items-center justify-between">
                          <span className="text-sm">{opt.label}</span>
                          {activeViewRole === opt.key && <Check className="size-3.5" />}
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2 px-1">
                <Avatar className="size-8 sm:size-6">
                  <AvatarFallback>{firstInitial}</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:inline">{activeUser.name}</span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile bottom tab bar (hidden on detail pages) ── */}
      <div className={`fixed inset-x-0 bottom-0 z-50 border-t bg-card sm:hidden${/^\/requests\/[^/]+/.test(pathname) ? " hidden" : ""}`}>
        <div className="flex items-center justify-around py-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex flex-col items-center gap-1 px-3 py-1 text-xs ${
                  link.active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className={`size-5${link.icon === Megaphone ? " -scale-x-100" : ""}`} weight={link.active ? "fill" : "regular"} />
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
