"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { PageHeader } from "@/components/page-header"
import { CaretRight } from "@phosphor-icons/react"
import {
  type RequestStatus,
  type PromotionRequest,
  promotionRequests,
  getHero,
  getStatusColor,
  STATUS_LABELS,
  getActiveUser,
  getRoleForPersona,
  formatCurrency,
  calculatePayout,
} from "@/lib/mock-data"

type TabKey = "open" | "scheduled" | "published" | "declined"

const TAB_STATUSES: Record<TabKey, RequestStatus[]> = {
  open: ["pending", "in_review", "accepted"],
  scheduled: ["scheduled"],
  published: ["published", "paid"],
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
  const persona = searchParams.get("persona") || "sarah"
  const activeUser = getActiveUser(persona)
  const role = getRoleForPersona(persona)

  const personaParam = persona && persona !== "sarah" ? `?persona=${persona}` : ""

  // Filter requests by role
  const requests = useMemo(() => {
    return role === "publisher"
      ? promotionRequests.filter((r) => r.publisherId === activeUser.id)
      : promotionRequests.filter((r) => r.sponsorId === activeUser.id)
  }, [role, activeUser])

  const filterByTab = (r: PromotionRequest, tabKey: TabKey) =>
    TAB_STATUSES[tabKey].includes(r.status)

  const tabCounts = Object.fromEntries(
    TABS.map((tab) => [tab.key, requests.filter((r) => filterByTab(r, tab.key)).length])
  ) as Record<TabKey, number>

  const defaultTab: TabKey = TABS.find((t) => tabCounts[t.key] > 0)?.key ?? "open"

  // Direction-aware status label for pending items
  function getDisplayStatus(req: PromotionRequest): { label: string; color: string } {
    if (req.status === "pending") {
      const userInitiated =
        (role === "publisher" && req.initiatedBy === "publisher") ||
        (role === "sponsor" && req.initiatedBy === "sponsor")
      if (userInitiated) {
        return { label: "Requested", color: getStatusColor("pending") }
      }
      return {
        label: "New",
        color: "bg-[#CBD7CC]/50 text-[#2A3D35] dark:bg-[#405B50]/40 dark:text-[#CBD7CC]",
      }
    }
    return { label: STATUS_LABELS[req.status], color: getStatusColor(req.status) }
  }

  // ── Table columns ──
  const columns = useMemo<ColumnDef<PromotionRequest>[]>(
    () => [
      {
        accessorKey: "sponsorId",
        header: role === "publisher" ? "Sponsor" : "Publisher",
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
          const { label, color } = getDisplayStatus(row.original)
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
    [role, personaParam]
  )

  return (
    <div className="space-y-10">
      <PageHeader
        title="Promotions"
        description="Track and manage your promotion partnerships."
      />

      <Tabs defaultValue={defaultTab}>
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
              {/* Desktop: table */}
              <div className="hidden md:block">
                <DataTable columns={columns} data={tabData} />
              </div>
              {/* Mobile: card list */}
              <div className="md:hidden space-y-2">
                {tabData.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No promotions in this category
                  </p>
                ) : (
                  tabData.map((req) => {
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
                        <Badge variant="secondary" className={`shrink-0 ${getDisplayStatus(req).color}`}>
                          {getDisplayStatus(req).label}
                        </Badge>
                        <CaretRight className="size-4 shrink-0 text-muted-foreground" />
                      </Link>
                    )
                  })
                )}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
