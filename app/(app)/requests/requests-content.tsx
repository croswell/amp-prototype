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
import { X } from "@phosphor-icons/react"
import {
  type RequestStatus,
  type WorkspaceStep,
  type PromotionRequest,
  promotionRequests,
  getHero,
  currentUser,
  formatCurrency,
  WORKSPACE_STEP_LABELS,
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

// Badge color for workspace steps
function getWorkspaceStepColor(step: WorkspaceStep): string {
  switch (step) {
    case "edit":
    case "changes-requested":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
    case "in-review":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
    case "approved":
    case "scheduled":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
  }
}

export function RequestsContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "publisher"

  // Sheet state
  const [selectedRequest, setSelectedRequest] = useState<PromotionRequest | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Status overrides for demo (simulating state changes within the session)
  const [statusOverrides, setStatusOverrides] = useState<Record<string, RequestStatus>>({})
  // Workspace step overrides (parallel to status overrides)
  const [workspaceStepOverrides, setWorkspaceStepOverrides] = useState<Record<string, WorkspaceStep>>({})

  // Filter requests by role, then apply any local status overrides
  const requests = useMemo(() => {
    const filtered =
      role === "publisher"
        ? promotionRequests.filter((r) => r.publisherId === currentUser.id)
        : promotionRequests.filter((r) => r.sponsorId === currentUser.id)
    return filtered.map((r) => ({
      ...r,
      status: statusOverrides[r.id] || r.status,
      workspaceStep: workspaceStepOverrides[r.id] || r.workspaceStep,
    }))
  }, [role, statusOverrides, workspaceStepOverrides])

  function getEffectiveStatus(req: PromotionRequest): RequestStatus {
    return statusOverrides[req.id] || req.status
  }

  function getEffectiveWorkspaceStep(req: PromotionRequest): WorkspaceStep | undefined {
    return workspaceStepOverrides[req.id] || req.workspaceStep
  }

  function openSheet(request: PromotionRequest) {
    setSelectedRequest(request)
    setSheetOpen(true)
  }

  function handleStatusChange(requestId: string, newStatus: RequestStatus) {
    setStatusOverrides((prev) => ({ ...prev, [requestId]: newStatus }))
  }

  function handleWorkspaceStepChange(requestId: string, newStep: WorkspaceStep) {
    setWorkspaceStepOverrides((prev) => ({ ...prev, [requestId]: newStep }))
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
          <PayoutBadge amount={row.original.proposedFee} />
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
              Review
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const acceptedColumns = useMemo<ColumnDef<PromotionRequest>[]>(
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
          <PayoutBadge amount={row.original.proposedFee} />
        ),
      },
      {
        id: "step",
        header: "Step",
        cell: ({ row }) => {
          const step = row.original.workspaceStep
          if (!step) return null
          return (
            <Badge
              variant="secondary"
              className={`text-[10px] ${getWorkspaceStepColor(step)}`}
            >
              {WORKSPACE_STEP_LABELS[step]}
            </Badge>
          )
        },
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
          <PayoutBadge amount={row.original.proposedFee} />
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
            <Button variant="outline" size="sm" onClick={() => openSheet(row.original)}>
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

  const effectiveWorkspaceStep = selectedRequest
    ? getEffectiveWorkspaceStep(selectedRequest)
    : null

  function getColumnsForTab(tabKey: TabKey) {
    if (tabKey === "inbox") return inboxColumns
    if (tabKey === "accepted") return acceptedColumns
    return defaultColumns
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-medium tracking-tight">Promotions</h1>
        <p className="text-sm text-muted-foreground">
          Manage your promotion requests and track their progress.
        </p>
      </div>

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
                    className="ml-1 h-4.5 px-1.5 py-0 text-[10px] tabular-nums text-foreground"
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
              columns={getColumnsForTab(tab.key)}
              data={requests.filter((r) => r.status === tab.key)}
            />
          </TabsContent>
        ))}
      </Tabs>

      <PromotionSheet
        request={selectedRequest}
        status={effectiveStatus}
        role={role}
        workspaceStep={effectiveWorkspaceStep}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onStatusChange={handleStatusChange}
        onWorkspaceStepChange={handleWorkspaceStepChange}
      />
    </div>
  )
}
