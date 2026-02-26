"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DataTable } from "@/components/ui/data-table"
import { PromotionSheet } from "@/components/promotion-sheet"
import { PayoutBadge } from "@/components/payout-badge"
import {
  type RequestStatus,
  type WorkspaceStep,
  type PromotionRequest,
  currentUser,
  promotionRequests,
  getHero,
  formatCurrency,
  getStatusColor,
} from "@/lib/mock-data"
import {
  ArrowRight,
  CurrencyDollar,
  Tray,
  Lightning,
  PaperPlaneTilt,
  CheckCircle,
  PencilLine,
  CalendarBlank,
  X,
} from "@phosphor-icons/react"

// ── Action banner type ──
interface ActionBanner {
  id: string
  icon: React.ReactNode
  text: string
  ctaLabel: string
  request?: PromotionRequest
  href?: string
}

export function DashboardContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "both"

  // Sheet state
  const [selectedRequest, setSelectedRequest] = useState<PromotionRequest | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Status + workspace step overrides
  const [statusOverrides, setStatusOverrides] = useState<Record<string, RequestStatus>>({})
  const [workspaceStepOverrides, setWorkspaceStepOverrides] = useState<Record<string, WorkspaceStep>>({})

  // Dismissed banners (session only)
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set())

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

  // Apply overrides to requests
  const allRequests = useMemo(
    () =>
      promotionRequests.map((r) => ({
        ...r,
        status: statusOverrides[r.id] || r.status,
        workspaceStep: workspaceStepOverrides[r.id] || r.workspaceStep,
      })),
    [statusOverrides, workspaceStepOverrides]
  )

  const incoming = allRequests.filter((r) => r.publisherId === currentUser.id)
  const outgoing = allRequests.filter((r) => r.sponsorId === currentUser.id)
  const relevantRequests =
    role === "publisher"
      ? incoming
      : role === "sponsor"
        ? outgoing
        : [...incoming, ...outgoing]

  const monthlyRevenue = currentUser.recommendedFee * 2
  const yearlyRevenue = monthlyRevenue * 12

  const activePromotions = relevantRequests.filter((r) => r.status === "accepted")
  const completedPromotions = relevantRequests.filter((r) => r.status === "published")
  const totalSpend = outgoing.reduce((sum, r) => sum + r.proposedFee, 0)

  // ── Compute action banners ──
  const banners = useMemo<ActionBanner[]>(() => {
    const result: ActionBanner[] = []

    if (role === "publisher" || role === "both") {
      // Inbox requests waiting
      const inboxCount = incoming.filter((r) => r.status === "inbox").length
      if (inboxCount > 0) {
        result.push({
          id: "publisher-inbox",
          icon: <Tray className="size-5" />,
          text: `You have ${inboxCount} new promotion request${inboxCount !== 1 ? "s" : ""}`,
          ctaLabel: "Review requests",
          href: `/requests?role=publisher`,
        })
      }

      // Copy approved, ready to schedule
      const approved = incoming.filter(
        (r) => r.status === "accepted" && r.workspaceStep === "approved"
      )
      for (const req of approved) {
        const sponsor = getHero(req.sponsorId)
        result.push({
          id: `publisher-approved-${req.id}`,
          icon: <CheckCircle className="size-5" />,
          text: `${sponsor?.name ?? "Sponsor"} approved your copy for "${req.adHeadline}"`,
          ctaLabel: "Schedule now",
          request: req,
        })
      }
    }

    if (role === "sponsor" || role === "both") {
      // Copy submitted for review
      const inReview = outgoing.filter(
        (r) => r.status === "accepted" && r.workspaceStep === "in-review"
      )
      for (const req of inReview) {
        const publisher = getHero(req.publisherId)
        result.push({
          id: `sponsor-review-${req.id}`,
          icon: <PencilLine className="size-5" />,
          text: `${publisher?.name ?? "Publisher"} submitted copy for your review`,
          ctaLabel: "Review copy",
          request: req,
        })
      }

      // Publisher-initiated requests in sponsor's inbox
      const publisherRequests = outgoing.filter(
        (r) => r.status === "inbox" && r.initiatedBy === "publisher"
      )
      for (const req of publisherRequests) {
        const publisher = getHero(req.publisherId)
        result.push({
          id: `sponsor-request-${req.id}`,
          icon: <Tray className="size-5" />,
          text: `${publisher?.name ?? "Publisher"} wants to promote with you`,
          ctaLabel: "Review request",
          request: req,
        })
      }
    }

    return result.filter((b) => !dismissedBanners.has(b.id))
  }, [role, incoming, outgoing, dismissedBanners])

  // Activity table columns
  const activityColumns = useMemo<ColumnDef<PromotionRequest>[]>(
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
        header: "Promotion",
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
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const s = row.original.status
          const label = s.charAt(0).toUpperCase() + s.slice(1)
          return (
            <Badge variant="secondary" className={getStatusColor(s)}>
              {label}
            </Badge>
          )
        },
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

  // Pick greeting based on local time of day
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  const effectiveStatus = selectedRequest
    ? (statusOverrides[selectedRequest.id] || selectedRequest.status)
    : null

  const effectiveWorkspaceStep = selectedRequest
    ? (workspaceStepOverrides[selectedRequest.id] || selectedRequest.workspaceStep)
    : null

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-medium tracking-tight">
        {greeting}, {currentUser.name.split(" ")[0]}
      </h1>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(role === "publisher" || role === "both") && (
          <Card size="sm">
            <CardContent>
              <p className="flex items-center justify-between text-sm text-muted-foreground">
                Ad Revenue
                <CurrencyDollar className="size-4" />
              </p>
              <p className="mt-2 text-2xl font-medium tracking-tight tabular-nums">
                {formatCurrency(yearlyRevenue)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                last 30 days
              </p>
            </CardContent>
          </Card>
        )}
        {(role === "sponsor" || role === "both") && (
          <Card size="sm">
            <CardContent>
              <p className="flex items-center justify-between text-sm text-muted-foreground">
                Total Spend
                <CurrencyDollar className="size-4" />
              </p>
              <p className="mt-2 text-2xl font-medium tracking-tight tabular-nums">
                {formatCurrency(totalSpend)}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                across {outgoing.length} promotion{outgoing.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        )}
        {role === "publisher" && (
          <Card size="sm">
            <CardContent>
              <p className="flex items-center justify-between text-sm text-muted-foreground">
                Incoming Requests
                <Tray className="size-4" />
              </p>
              <p className="mt-2 text-2xl font-medium tracking-tight tabular-nums">
                {incoming.filter((r) => r.status === "inbox").length}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                from sponsors
              </p>
            </CardContent>
          </Card>
        )}
        {role === "sponsor" && (
          <Card size="sm">
            <CardContent>
              <p className="flex items-center justify-between text-sm text-muted-foreground">
                Campaigns Sent
                <PaperPlaneTilt className="size-4" />
              </p>
              <p className="mt-2 text-2xl font-medium tracking-tight tabular-nums">
                {outgoing.length}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                to publishers
              </p>
            </CardContent>
          </Card>
        )}
        <Card size="sm">
          <CardContent>
            <p className="flex items-center justify-between text-sm text-muted-foreground">
              Active Promotions
              <Lightning className="size-4" />
            </p>
            <p className="mt-2 text-2xl font-medium tracking-tight tabular-nums">
              {activePromotions.length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              in progress
            </p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent>
            <p className="flex items-center justify-between text-sm text-muted-foreground">
              Completed
              <CheckCircle className="size-4" />
            </p>
            <p className="mt-2 text-2xl font-medium tracking-tight tabular-nums">
              {completedPromotions.length}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              delivered &amp; locked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action banners */}
      {banners.length > 0 && (
        <div className="space-y-3">
          {banners.slice(0, 3).map((banner) => (
            <div
              key={banner.id}
              className="flex items-center gap-3 rounded-lg border border-l-4 border-l-primary bg-card p-3"
            >
              <div className="text-primary">{banner.icon}</div>
              <p className="flex-1 text-sm">{banner.text}</p>
              {banner.request ? (
                <Button size="sm" onClick={() => openSheet(banner.request!)}>
                  {banner.ctaLabel}
                </Button>
              ) : banner.href ? (
                <Button size="sm" asChild>
                  <Link href={banner.href}>{banner.ctaLabel}</Link>
                </Button>
              ) : null}
              <button
                onClick={() =>
                  setDismissedBanners((prev) => new Set([...prev, banner.id]))
                }
                className="rounded-sm p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          {banners.length > 3 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/requests?role=${role}`}>
                View all {banners.length} notifications
                <ArrowRight data-icon="inline-end" className="size-4" />
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Recent activity */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent Activity</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/requests?role=${role}`}>
              View All
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Link>
          </Button>
        </div>

        <DataTable
          columns={activityColumns}
          data={relevantRequests}
          pageSize={10}
          hidePagination
        />
      </div>

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
