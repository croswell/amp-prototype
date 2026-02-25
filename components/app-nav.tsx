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
import { currentUser } from "@/lib/mock-data"
import {
  Compass,
  EnvelopeSimple,
  CaretUpDown,
  Check,
} from "@phosphor-icons/react"

export function AppNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "publisher"
  const firstInitial = currentUser.name.charAt(0)

  return (
    <nav className="border-b">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href={`/?role=${role}`}
            className="flex items-center gap-2 text-sm font-medium tracking-tight"
          >
            <img src="/icon-black.svg" alt="" className="size-6 rounded-sm" />
            Amplify
          </Link>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/directory?role=${role}`}>
                <Compass data-icon="inline-start" className="size-4" />
                Directory
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/requests?role=${role}`}>
                <EnvelopeSimple data-icon="inline-start" className="size-4" />
                Requests
              </Link>
            </Button>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-sm border px-2 py-1.5 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar size="sm">
                <AvatarFallback>{firstInitial}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-xs font-medium leading-tight">
                  {currentUser.name}
                </p>
                <p className="text-[10px] leading-tight text-muted-foreground capitalize">
                  {role}
                </p>
              </div>
              <CaretUpDown className="size-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild disabled={role === "publisher"}>
              <Link href={`${pathname}?role=publisher`} className="flex items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback>{firstInitial}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-xs font-medium">{currentUser.name}</p>
                  <p className="text-[10px] text-muted-foreground">Publisher</p>
                </div>
                {role === "publisher" && <Check className="ml-auto size-3.5" />}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild disabled={role === "sponsor"}>
              <Link href={`${pathname}?role=sponsor`} className="flex items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback>{firstInitial}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-xs font-medium">{currentUser.name}</p>
                  <p className="text-[10px] text-muted-foreground">Sponsor</p>
                </div>
                {role === "sponsor" && <Check className="ml-auto size-3.5" />}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
