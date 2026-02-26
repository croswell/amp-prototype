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
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { currentUser } from "@/lib/mock-data"
import { Gear, CaretUpDown, Check } from "@phosphor-icons/react"

export function AppNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const rawRole = searchParams.get("role") || "publisher"
  const hasSwitcher = rawRole === "both" || searchParams.get("switcher") === "true"
  const activeRole = rawRole === "both" ? "publisher" : rawRole
  const roleParam = hasSwitcher ? `${activeRole}&switcher=true` : activeRole
  const firstInitial = currentUser.name.charAt(0)

  const navLinks = [
    {
      label: "Home",
      href: `/home?role=${roleParam}`,
      active: pathname === "/home",
    },
    {
      label: "Promotions",
      href: `/requests?role=${roleParam}`,
      active: pathname.startsWith("/requests"),
    },
  ]

  return (
    <nav className="border-b bg-card">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href={`/?role=${roleParam}`}>
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
          <Button
            variant="ghost"
            size="icon"
            asChild
            data-active={pathname === "/settings" || undefined}
            className="data-[active]:bg-accent"
          >
            <Link href={`/settings?role=${roleParam}`}>
              <Gear className="size-4" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
          {hasSwitcher ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md border px-2.5 py-1.5 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar size="sm">
                    <AvatarFallback>{firstInitial}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm capitalize">{activeRole}</span>
                  <CaretUpDown className="size-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
                {["publisher", "sponsor"].map((r) => (
                  <DropdownMenuItem key={r} asChild disabled={activeRole === r}>
                    <Link href={`${pathname}?role=${r}&switcher=true`}>
                      <span className="capitalize">{r}</span>
                      {activeRole === r && <Check className="ml-auto size-3.5" />}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2 px-1">
              <span className="text-sm">{currentUser.name}</span>
              <Avatar size="sm">
                <AvatarFallback>{firstInitial}</AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
