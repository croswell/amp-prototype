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
import { CaretUpDown, Check } from "@phosphor-icons/react"

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
    },
    {
      label: "Promotions",
      href: `/requests${qs}`,
      active: pathname.startsWith("/requests"),
    },
    {
      label: "Settings",
      href: `/settings${qs}`,
      active: pathname === "/settings",
    },
  ]

  return (
    <nav className="border-b bg-card">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href={`/${qs}`}>
            <img src="/logo-black.svg" alt="Amplify" className="h-6 dark:hidden" />
            <img src="/logo-white.svg" alt="Amplify" className="hidden h-6 dark:block" />
          </Link>
          <div className="flex items-center gap-1">
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
                <button className="flex items-center gap-2 rounded-md border px-2.5 py-1.5 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar size="sm">
                    <AvatarFallback>{firstInitial}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{activeViewRole === "publisher" ? "Publisher" : "Sponsor"}</span>
                  <CaretUpDown className="size-3.5 text-muted-foreground" />
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
              <Avatar size="sm">
                <AvatarFallback>{firstInitial}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{activeUser.name}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
