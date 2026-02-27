"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
import { PromotionSheet, type ReviewAction } from "@/components/promotion-sheet"
import { PageHeader } from "@/components/page-header"
import { PayoutBadge } from "@/components/payout-badge"
import { CaretRight } from "@phosphor-icons/react"
import {
  type RequestStatus,
  type PromotionRequest,
  promotionRequests,
  getHero,
  getStatusColor,
  formatCurrency,
  STATUS_LABELS,
  getActiveUser,
  getRoleForPersona,
} from "@/lib/mock-data"

type TabKey = RequestStatus | "requested"

const TABS: { key: TabKey; label: string }[] = [
  { key: "requested", label: "Requested" },
  { key: "in_review", label: "In Review" },
  { key: "accepted", label: "Accepted" },
  { key: "scheduled", label: "Scheduled" },
  { key: "published", label: "Published" },
  { key: "declined", label: "Declined" },
]

export function RequestsContent() {
  const searchParams = useSearchParams()
  const persona = searchParams.get("persona") || "sarah"
  const activeUser = getActiveUser(persona)
  const role = getRoleForPersona(persona)

  // Sheet state
  const [selectedRequest, setSelectedRequest] = useState<PromotionRequest | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [statusOverrides, setStatusOverrides] = useState<Record<string, RequestStatus>>({})
  const [reviewOverrides, setReviewOverrides] = useState<Record<string, {
    reviewTurn?: "sponsor" | "publisher"
    proposedEdits?: { adHeadline: string; adBody: string; adCta: string; adCtaUrl: string }
    revisionNotes?: string
  }>>({})

  // Filter requests by role, then apply status overrides
  const requests = useMemo(() => {
    const filtered =
      role === "publisher"
        ? promotionRequests.filter((r) => r.publisherId === activeUser.id)
        : promotionRequests.filter((r) => r.sponsorId === activeUser.id)
    return filtered.map((r) => ({
      ...r,
      status: statusOverrides[r.id] || r.status,
      ...(reviewOverrides[r.id] ? {
        reviewTurn: reviewOverrides[r.id].reviewTurn ?? r.reviewTurn,
        proposedEdits: reviewOverrides[r.id].proposedEdits ?? r.proposedEdits,
        revisionNotes: reviewOverrides[r.id].revisionNotes ?? r.revisionNotes,
      } : {}),
    }))
  }, [role, activeUser, statusOverrides, reviewOverrides])

  function openSheet(request: PromotionRequest) {
    setSelectedRequest(request)
    setSheetOpen(true)
  }

  function handleStatusChange(requestId: string, newStatus: RequestStatus) {
    setStatusOverrides((prev) => ({ ...prev, [requestId]: newStatus }))
  }

  function handleReviewAction(requestId: string, action: ReviewAction) {
    switch (action.type) {
      case "suggest_changes":
        // Publisher suggests edits → status becomes in_review, sponsor's turn
        setStatusOverrides((prev) => ({ ...prev, [requestId]: "in_review" }))
        setReviewOverrides((prev) => ({
          ...prev,
          [requestId]: {
            ...prev[requestId],
            reviewTurn: "sponsor",
            proposedEdits: action.proposedEdits,
          },
        }))
        break
      case "approve_edits":
        // Sponsor approves → status returns to accepted
        setStatusOverrides((prev) => ({ ...prev, [requestId]: "accepted" }))
        setReviewOverrides((prev) => ({
          ...prev,
          [requestId]: { ...prev[requestId], reviewTurn: undefined },
        }))
        break
      case "request_revision":
        // Sponsor requests revision → stays in_review, publisher's turn
        setReviewOverrides((prev) => ({
          ...prev,
          [requestId]: {
            ...prev[requestId],
            reviewTurn: "publisher",
            revisionNotes: action.revisionNotes,
          },
        }))
        break
    }
  }

  const tabs = TABS

  // Filter helper: "requested" tab shows pending requests the current user initiated
  const filterByTab = (r: PromotionRequest, tabKey: TabKey) => {
    if (tabKey === "requested") {
      if (r.status !== "pending") return false
      if (role === "sponsor") return r.initiatedBy === "sponsor"
      return r.initiatedBy === "publisher"
    }
    // Declined tab also catches expired
    if (tabKey === "declined") return r.status === "declined" || r.status === "expired"
    // Published tab also catches paid
    if (tabKey === "published") return r.status === "published" || r.status === "paid"
    return r.status === tabKey
  }

  // Find first tab with data, default to "accepted" (Approved)
  const defaultTab = useMemo(() => {
    for (const tab of tabs) {
      if (requests.some((r) => filterByTab(r, tab.key))) return tab.key
    }
    return "accepted"
  }, [tabs, requests])

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
        id: "payout",
        header: "Payout",
        cell: ({ row }) => (
          <PayoutBadge amount={row.original.proposedFee} />
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

  // Merge overrides into the selected request so the sheet always has fresh data
  const effectiveRequest = useMemo(() => {
    if (!selectedRequest) return null
    const id = selectedRequest.id
    return {
      ...selectedRequest,
      status: statusOverrides[id] || selectedRequest.status,
      ...(reviewOverrides[id] ? {
        reviewTurn: reviewOverrides[id].reviewTurn ?? selectedRequest.reviewTurn,
        proposedEdits: reviewOverrides[id].proposedEdits ?? selectedRequest.proposedEdits,
        revisionNotes: reviewOverrides[id].revisionNotes ?? selectedRequest.revisionNotes,
      } : {}),
    }
  }, [selectedRequest, statusOverrides, reviewOverrides])

  return (
    <div className="space-y-10">
      <PageHeader
        title="Promotions"
        description="Track and manage your promotion partnerships."
      />

      <Tabs defaultValue={defaultTab}>
        <TabsList variant="line">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => {
          const tabData = requests.filter((r) => filterByTab(r, tab.key))
          return (
            <TabsContent key={tab.key} value={tab.key} className="mt-8">
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
                      <button
                        key={req.id}
                        className="flex w-full items-center gap-3 rounded-lg border p-3 text-left"
                        onClick={() => openSheet(req)}
                      >
                        <Avatar className="size-8 shrink-0">
                          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{otherHero?.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{req.adHeadline}</p>
                        </div>
                        <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                          {formatCurrency(req.proposedFee)}
                        </span>
                        <CaretRight className="size-4 shrink-0 text-muted-foreground" />
                      </button>
                    )
                  })
                )}
              </div>
            </TabsContent>
          )
        })}
      </Tabs>

      <PromotionSheet
        request={effectiveRequest}
        role={role}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onStatusChange={handleStatusChange}
        onReviewAction={handleReviewAction}
      />
    </div>
  )
}
