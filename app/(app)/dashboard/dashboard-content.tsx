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
import { PromotionSheet, BADGE_COLORS } from "@/components/promotion-sheet"
import {
  type PromotionRequest,
  currentUser,
  promotionRequests,
  getHero,
  formatCurrency,
  getStatusColor,
} from "@/lib/mock-data"
import { ArrowRight } from "@phosphor-icons/react"

export function DashboardContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "both"

  // Sheet state
  const [selectedRequest, setSelectedRequest] = useState<PromotionRequest | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  function openSheet(request: PromotionRequest) {
    setSelectedRequest(request)
    setSheetOpen(true)
  }

  const incoming = promotionRequests.filter(
    (r) => r.publisherId === currentUser.id
  )
  const outgoing = promotionRequests.filter(
    (r) => r.sponsorId === currentUser.id
  )
  // Show only the requests relevant to the current role
  const relevantRequests =
    role === "publisher"
      ? incoming
      : role === "sponsor"
        ? outgoing
        : [...incoming, ...outgoing]

  const monthlyRevenue = currentUser.recommendedFee * 2
  const yearlyRevenue = monthlyRevenue * 12

  const activePromotions = relevantRequests.filter(
    (r) => r.status === "accepted"
  )
  const completedPromotions = relevantRequests.filter(
    (r) => r.status === "published"
  )
  const totalSpend = outgoing.reduce((sum, r) => sum + r.proposedFee, 0)

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
          <Badge variant="outline" className={`${BADGE_COLORS.greenOutline} tabular-nums`}>
            {formatCurrency(row.original.proposedFee)}
          </Badge>
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
            <Button size="sm" onClick={() => openSheet(row.original)}>
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
              <p className="text-sm text-muted-foreground">
                Ad Revenue
              </p>
              <p className="mt-1 text-2xl font-medium tracking-tight tabular-nums">
                {formatCurrency(yearlyRevenue)}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                last 30 days
              </p>
            </CardContent>
          </Card>
        )}
        {(role === "sponsor" || role === "both") && (
          <Card size="sm">
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Total Spend
              </p>
              <p className="mt-1 text-2xl font-medium tracking-tight tabular-nums">
                {formatCurrency(totalSpend)}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                across {outgoing.length} promotion{outgoing.length !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        )}
        {role === "publisher" && (
          <Card size="sm">
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Incoming Requests
              </p>
              <p className="mt-1 text-2xl font-medium tracking-tight tabular-nums">
                {incoming.filter((r) => r.status === "inbox").length}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                from sponsors
              </p>
            </CardContent>
          </Card>
        )}
        {role === "sponsor" && (
          <Card size="sm">
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Campaigns Sent
              </p>
              <p className="mt-1 text-2xl font-medium tracking-tight tabular-nums">
                {outgoing.length}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                to publishers
              </p>
            </CardContent>
          </Card>
        )}
        <Card size="sm">
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Active Promotions
            </p>
            <p className="mt-1 text-2xl font-medium tracking-tight tabular-nums">
              {activePromotions.length}
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              in progress
            </p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Completed
            </p>
            <p className="mt-1 text-2xl font-medium tracking-tight tabular-nums">
              {completedPromotions.length}
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              delivered &amp; locked
            </p>
          </CardContent>
        </Card>
      </div>

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
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}
