"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { PromotionSheet, BADGE_COLORS } from "@/components/promotion-sheet"
import { X } from "@phosphor-icons/react"
import {
  type RequestStatus,
  type PromotionRequest,
  promotionRequests,
  getHero,
  currentUser,
  formatCurrency,
} from "@/lib/mock-data"

// Deterministic days remaining (1–7) based on ID
function getDaysRemaining(id: string): number {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return (hash % 7) + 1
}

// Get the Mon–Sun week range containing a given date string
function getWeekRange(dateStr: string): string {
  const d = new Date(dateStr)
  const day = d.getDay()
  const diffToMon = day === 0 ? -6 : 1 - day
  const mon = new Date(d)
  mon.setDate(d.getDate() + diffToMon)
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  const fmt = (dt: Date) =>
    dt.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  return `${fmt(mon)} – ${fmt(sun)}`
}

type TabKey = RequestStatus

const TABS: { key: TabKey; label: string }[] = [
  { key: "inbox", label: "Inbox" },
  { key: "accepted", label: "Accepted" },
  { key: "published", label: "Published" },
  { key: "expired", label: "Expired" },
]

export function RequestsContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "publisher"

  // Sheet state
  const [selectedRequest, setSelectedRequest] = useState<PromotionRequest | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Status overrides for demo (simulating state changes within the session)
  const [statusOverrides, setStatusOverrides] = useState<Record<string, RequestStatus>>({})

  // Filter requests by role, then apply any local status overrides
  const requests = useMemo(() => {
    const filtered =
      role === "publisher"
        ? promotionRequests.filter((r) => r.publisherId === currentUser.id)
        : promotionRequests.filter((r) => r.sponsorId === currentUser.id)
    return filtered.map((r) => ({
      ...r,
      status: statusOverrides[r.id] || r.status,
    }))
  }, [role, statusOverrides])

  function getEffectiveStatus(req: PromotionRequest): RequestStatus {
    return statusOverrides[req.id] || req.status
  }

  function openSheet(request: PromotionRequest) {
    setSelectedRequest(request)
    setSheetOpen(true)
  }

  function handleDismissFromTable(requestId: string) {
    setStatusOverrides((prev) => ({ ...prev, [requestId]: "expired" }))
  }

  function handleStatusChange(requestId: string, newStatus: RequestStatus) {
    setStatusOverrides((prev) => ({ ...prev, [requestId]: newStatus }))
  }

  // ── Table columns ──

  const inboxColumns = useMemo<ColumnDef<PromotionRequest>[]>(
    () => [
      {
        accessorKey: "sponsorId",
        header: "Sponsor",
        cell: ({ row }) => {
          const req = row.original
          const isIncoming = req.publisherId === currentUser.id
          const otherHero = getHero(isIncoming ? req.sponsorId : req.publisherId)
          const initials = otherHero ? otherHero.name.charAt(0) : "?"
          return (
            <button
              onClick={() => openSheet(req)}
              className="flex items-center gap-3 cursor-pointer text-left"
            >
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{otherHero?.name}</span>
            </button>
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
        id: "fee",
        header: "Payout",
        cell: ({ row }) => (
          <Badge variant="outline" className={`${BADGE_COLORS.greenOutline} tabular-nums`}>
            {formatCurrency(row.original.proposedFee)}
          </Badge>
        ),
      },
      {
        id: "schedule",
        header: "Schedule",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {getWeekRange(row.original.proposedDate)}
          </span>
        ),
      },
      {
        id: "expires",
        header: "Expires",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {getDaysRemaining(row.original.id)} days
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button size="sm" onClick={() => openSheet(row.original)}>
              View
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const defaultColumns = useMemo<ColumnDef<PromotionRequest>[]>(
    () => [
      {
        accessorKey: "sponsorId",
        header: "Sponsor",
        cell: ({ row }) => {
          const req = row.original
          const isIncoming = req.publisherId === currentUser.id
          const otherHero = getHero(isIncoming ? req.sponsorId : req.publisherId)
          const initials = otherHero ? otherHero.name.charAt(0) : "?"
          return (
            <button
              onClick={() => openSheet(req)}
              className="flex items-center gap-3 cursor-pointer text-left"
            >
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{otherHero?.name}</span>
            </button>
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
        id: "fee",
        header: "Payout",
        cell: ({ row }) => (
          <Badge variant="outline" className={`${BADGE_COLORS.greenOutline} tabular-nums`}>
            {formatCurrency(row.original.proposedFee)}
          </Badge>
        ),
      },
      {
        id: "schedule",
        header: "Schedule",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {getWeekRange(row.original.proposedDate)}
          </span>
        ),
      },
      {
        id: "expires",
        header: "Expires",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {getDaysRemaining(row.original.id)} days
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button size="sm" onClick={() => openSheet(row.original)}>
              View
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const effectiveStatus = selectedRequest
    ? getEffectiveStatus(selectedRequest)
    : null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-medium tracking-tight">Promotions</h1>

      <Tabs defaultValue="inbox">
        <TabsList variant="line">
          {TABS.map((tab) => {
            const count = requests.filter((r) => r.status === tab.key).length
            return (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.label}
                {tab.key === "inbox" && (
                  <Badge
                    variant="secondary"
                    className="ml-1.5 px-1.5 py-0 text-[10px] tabular-nums text-muted-foreground"
                  >
                    {count}
                  </Badge>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>
        {TABS.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="mt-6">
            <DataTable
              columns={tab.key === "inbox" ? inboxColumns : defaultColumns}
              data={requests.filter((r) => r.status === tab.key)}
            />
          </TabsContent>
        ))}
      </Tabs>

      <PromotionSheet
        request={selectedRequest}
        status={effectiveStatus}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
