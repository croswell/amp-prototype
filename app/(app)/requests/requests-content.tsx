"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  type RequestStatus,
  promotionRequests,
  getHero,
  currentUser,
  formatCurrency,
  getStatusColor,
} from "@/lib/mock-data"

type TabKey = "active" | "completed"

const STATUS_TABS: { key: TabKey; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
]

function matchesTab(status: RequestStatus, tab: TabKey): boolean {
  if (tab === "completed") return status === "locked"
  // active = everything that isn't locked
  return status !== "locked"
}

export function RequestsContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "publisher"

  // Filter requests by role
  const requests =
    role === "publisher"
      ? promotionRequests.filter((r) => r.publisherId === currentUser.id)
      : promotionRequests.filter((r) => r.advertiserId === currentUser.id)

  const perspective: "publisher" | "advertiser" =
    role === "advertiser" ? "advertiser" : "publisher"

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-medium tracking-tight">Promotions</h1>

      <Tabs defaultValue="active">
        <TabsList variant="line">
          {STATUS_TABS.map((tab) => {
            const count = requests.filter((r) => matchesTab(r.status, tab.key)).length
            return (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.label}
                <Badge
                  variant="secondary"
                  className="ml-1.5 px-1.5 py-0 text-[10px] tabular-nums"
                >
                  {count}
                </Badge>
              </TabsTrigger>
            )
          })}
        </TabsList>
        {STATUS_TABS.map((tab) => (
          <TabsContent key={tab.key} value={tab.key}>
            <RequestList
              requests={requests.filter((r) => matchesTab(r.status, tab.key))}
              perspective={perspective}
              role={role}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function RequestList({
  requests,
  perspective,
  role,
}: {
  requests: typeof promotionRequests
  perspective: "publisher" | "advertiser"
  role: string
}) {
  if (requests.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-muted-foreground">No promotions yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-md border">
      {requests.map((req) => {
        const isIncoming = req.publisherId === currentUser.id
        const otherHeroId = isIncoming ? req.advertiserId : req.publisherId
        const otherHero = getHero(otherHeroId)

        const initials = otherHero
          ? otherHero.name
              .split(" ")
              .map((n) => n[0])
              .join("")
          : "?"

        return (
          <Link
            key={req.id}
            href={`/requests/${req.id}?role=${role}`}
            className="flex items-center gap-3 border-b px-4 py-3 transition-colors last:border-b-0 hover:bg-muted/50"
          >
            <Avatar size="sm">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {req.adHeadline}
              </p>
              <p className="text-xs text-muted-foreground">
                {otherHero?.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium tabular-nums">
                {formatCurrency(req.proposedFee)}
              </span>
              <Badge
                variant="secondary"
                className={getStatusColor(req.status)}
              >
                {req.status}
              </Badge>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
