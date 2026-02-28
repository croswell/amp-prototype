"use client"

import { useMemo, useCallback } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { PageHeader } from "@/components/page-header"
import { CaretRight } from "@phosphor-icons/react"
import { buildPersonaParams } from "@/lib/utils"
import {
  type RequestStatus,
  type PromotionRequest,
  promotionRequests,
  getHero,
  getDisplayStatus,
  getActiveUser,
  getRoleForPersona,
  getActiveViewRole,
  formatCurrency,
  calculatePayout,
} from "@/lib/mock-data"

type TabKey = "open" | "scheduled" | "published" | "declined"

const TAB_STATUSES: Record<TabKey, RequestStatus[]> = {
  open: ["pending", "in_review", "accepted"],
  scheduled: ["scheduled"],
  published: ["published"],
  declined: ["declined", "expired"],
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "open", label: "In Progress" },
  { key: "scheduled", label: "Scheduled" },
  { key: "published", label: "Published" },
  { key: "declined", label: "Declined" },
]

export function RequestsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const persona = searchParams.get("role") || "publisher"
  const view = searchParams.get("view")
  const activeUser = getActiveUser(persona)
  const role = getRoleForPersona(persona)
  const activeViewRole = getActiveViewRole(role, view)

  const personaParam = buildPersonaParams(persona, view, role)

  // Filter requests by active view role
  const requests = useMemo(() => {
    return activeViewRole === "publisher"
      ? promotionRequests.filter((r) => r.publisherId === activeUser.id)
      : promotionRequests.filter((r) => r.sponsorId === activeUser.id)
  }, [activeViewRole, activeUser])

  const filterByTab = (r: PromotionRequest, tabKey: TabKey) =>
    TAB_STATUSES[tabKey].includes(r.status)

  const tabCounts = Object.fromEntries(
    TABS.map((tab) => [tab.key, requests.filter((r) => filterByTab(r, tab.key)).length])
  ) as Record<TabKey, number>

  // Read tab from URL, falling back to first tab with items
  const tabFromUrl = searchParams.get("tab") as TabKey | null
  const defaultTab: TabKey =
    (tabFromUrl && TABS.some((t) => t.key === tabFromUrl) ? tabFromUrl : null) ??
    TABS.find((t) => tabCounts[t.key] > 0)?.key ??
    "open"

  // Sync tab changes to the URL
  const handleTabChange = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams.toString())
      if (value === "open") {
        next.delete("tab")
      } else {
        next.set("tab", value)
      }
      router.replace(`?${next.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )


  // ── Table columns ──
  const columns = useMemo<ColumnDef<PromotionRequest>[]>(
    () => [
      {
        accessorKey: "sponsorId",
        header: activeViewRole === "publisher" ? "Sponsor" : "Publisher",
        cell: ({ row }) => {
          const req = row.original
          const isIncoming = req.publisherId === activeUser.id
          const otherHero = getHero(isIncoming ? req.sponsorId : req.publisherId)
          const initials = otherHero ? otherHero.name.charAt(0) : "?"
          return (
            <Link
              href={`/requests/${req.id}${personaParam}`}
              className="flex items-center gap-3"
            >
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{otherHero?.name}</span>
            </Link>
          )
        },
      },
      {
        accessorKey: "adHeadline",
        header: "Campaign",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.adHeadline}</span>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const { label, color } = getDisplayStatus(row.original, activeViewRole)
          return (
            <Badge variant="secondary" className={color}>
              {label}
            </Badge>
          )
        },
      },
      {
        id: "payout",
        header: "Payout",
        cell: ({ row }) => {
          const sponsor = getHero(row.original.sponsorId)
          const publisher = getHero(row.original.publisherId)
          if (!sponsor || !publisher) return null
          const payout = calculatePayout(sponsor, publisher)
          if (!payout) return <span className="text-muted-foreground">—</span>
          return (
            <span className="font-medium">{formatCurrency(payout.amount)}</span>
          )
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/requests/${row.original.id}${personaParam}`}>
                View
              </Link>
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeViewRole, personaParam]
  )

  return (
    <div className="space-y-10">
      <PageHeader
        title="Promotions"
        description="Track and manage your promotion partnerships."
      />

      {/* ── Mobile: stacked sections by status ── */}
      <div className="space-y-8 sm:hidden">
        {TABS.map(({ key: tabKey, label }) => {
          const tabData = requests.filter((r) => filterByTab(r, tabKey))
          if (tabData.length === 0) return null
          return (
            <div key={tabKey} className="space-y-2">
              <h2 className="text-sm font-medium text-muted-foreground">{label}</h2>
              {tabData.map((req) => {
                const isIncoming = req.publisherId === activeUser.id
                const otherHero = getHero(isIncoming ? req.sponsorId : req.publisherId)
                const initials = otherHero ? otherHero.name.charAt(0) : "?"
                return (
                  <Link
                    key={req.id}
                    href={`/requests/${req.id}${personaParam}`}
                    className="flex w-full items-center gap-3 rounded-lg border p-3 text-left"
                  >
                    <Avatar className="size-8 shrink-0">
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{otherHero?.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{req.adHeadline}</p>
                    </div>
                    <Badge variant="secondary" className={`shrink-0 ${getDisplayStatus(req, activeViewRole).color}`}>
                      {getDisplayStatus(req, activeViewRole).label}
                    </Badge>
                    <CaretRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* ── Desktop: tabs with table ── */}
      <Tabs value={defaultTab} onValueChange={handleTabChange} className="hidden sm:block">
        <TabsList variant="line">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
              {tabCounts[tab.key] > 0 && (
                <Badge className="ml-1.5 h-5 bg-muted-foreground/20 px-1.5 py-0 text-xs tabular-nums text-foreground">
                  {tabCounts[tab.key]}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map(({ key: tabKey }) => {
          const tabData = requests.filter((r) => filterByTab(r, tabKey))
          return (
            <TabsContent key={tabKey} value={tabKey} className="mt-4">
              <DataTable columns={columns} data={tabData} />
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
