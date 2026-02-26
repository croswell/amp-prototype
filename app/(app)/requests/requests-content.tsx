"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { PromotionSheet } from "@/components/promotion-sheet"
import { PayoutBadge } from "@/components/payout-badge"
import {
  type RequestStatus,
  type PromotionRequest,
  promotionRequests,
  getHero,
  currentUser,
  getStatusColor,
  STATUS_LABELS,
} from "@/lib/mock-data"
import { formatDate } from "@/components/promotion-sheet"

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

// Publisher tabs
const PUBLISHER_TABS: { key: TabKey; label: string }[] = [
  { key: "accepted", label: "Accepted" },
  { key: "scheduled", label: "Scheduled" },
  { key: "published", label: "Published" },
  { key: "paid", label: "Paid" },
  { key: "declined", label: "Declined" },
  { key: "expired", label: "Expired" },
]

// Sponsor tabs
const SPONSOR_TABS: { key: TabKey; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "scheduled", label: "Scheduled" },
  { key: "published", label: "Published" },
  { key: "paid", label: "Paid" },
  { key: "declined", label: "Declined" },
  { key: "expired", label: "Expired" },
]

export function RequestsContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "publisher"

  // Sheet state
  const [selectedRequest, setSelectedRequest] = useState<PromotionRequest | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [statusOverrides, setStatusOverrides] = useState<Record<string, RequestStatus>>({})

  // Filter requests by role, then apply status overrides
  const requests = useMemo(() => {
    const filtered =
      role === "publisher"
        ? promotionRequests.filter((r) => r.publisherId === currentUser.id)
        : role === "sponsor"
          ? promotionRequests.filter((r) => r.sponsorId === currentUser.id)
          : promotionRequests.filter(
              (r) => r.publisherId === currentUser.id || r.sponsorId === currentUser.id
            )
    return filtered.map((r) => ({
      ...r,
      status: statusOverrides[r.id] || r.status,
    }))
  }, [role, statusOverrides])

  function openSheet(request: PromotionRequest) {
    setSelectedRequest(request)
    setSheetOpen(true)
  }

  function handleStatusChange(requestId: string, newStatus: RequestStatus) {
    setStatusOverrides((prev) => ({ ...prev, [requestId]: newStatus }))
  }

  // Pick tabs based on role
  const tabs = role === "sponsor" ? SPONSOR_TABS : PUBLISHER_TABS

  // Find first tab with data, default to "scheduled"
  const defaultTab = useMemo(() => {
    for (const tab of tabs) {
      if (requests.some((r) => r.status === tab.key)) return tab.key
    }
    return "scheduled"
  }, [tabs, requests])

  // ── Table columns ──
  const columns = useMemo<ColumnDef<PromotionRequest>[]>(
    () => [
      {
        accessorKey: "sponsorId",
        header: role === "publisher" ? "Sponsor" : "Publisher",
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
          <PayoutBadge amount={row.original.proposedFee} />
        ),
      },
      {
        id: "schedule",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {getWeekRange(row.original.proposedDate)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={() => openSheet(row.original)}>
              View
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [role]
  )

  const effectiveStatus = selectedRequest
    ? (statusOverrides[selectedRequest.id] || selectedRequest.status)
    : null

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-medium tracking-tight">Promotions</h1>
        <p className="text-sm text-muted-foreground">
          Manage your promotion requests and track their progress.
        </p>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList variant="line">
          {tabs.map((tab) => {
            const count = requests.filter((r) => r.status === tab.key).length
            return (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.label}
                {count > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-4.5 px-1.5 py-0 text-[10px] tabular-nums text-foreground"
                  >
                    {count}
                  </Badge>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="mt-6">
            <DataTable
              columns={columns}
              data={requests.filter((r) => r.status === tab.key)}
            />
          </TabsContent>
        ))}
      </Tabs>

      <PromotionSheet
        request={selectedRequest}
        status={effectiveStatus}
        role={role}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
