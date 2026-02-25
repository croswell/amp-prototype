"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  currentUser,
  promotionRequests,
  getHero,
  getRecommendedHeroes,
  formatCurrency,
  formatNumber,
  getStatusColor,
} from "@/lib/mock-data"
import { ArrowRight, Compass } from "@phosphor-icons/react"

export function DashboardContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "both"

  const incoming = promotionRequests.filter(
    (r) => r.publisherId === currentUser.id
  )
  const outgoing = promotionRequests.filter(
    (r) => r.advertiserId === currentUser.id
  )
  // Show only the requests relevant to the current role
  const relevantRequests =
    role === "publisher"
      ? incoming
      : role === "advertiser"
        ? outgoing
        : [...incoming, ...outgoing]

  const recommended = getRecommendedHeroes(role as "publisher" | "advertiser" | "both").slice(0, 4)

  const monthlyRevenue = currentUser.recommendedFee * 2
  const yearlyRevenue = monthlyRevenue * 12

  const activePromotions = relevantRequests.filter(
    (r) => r.status !== "pending" && r.status !== "locked"
  )
  const completedPromotions = relevantRequests.filter(
    (r) => r.status === "locked"
  )
  const totalSpend = outgoing.reduce((sum, r) => sum + r.proposedFee, 0)

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
              <p className="text-xs text-muted-foreground">
                Ad Revenue
              </p>
              <p className="mt-1 text-2xl font-medium tracking-tight tabular-nums">
                {formatCurrency(yearlyRevenue)}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                estimated yearly
              </p>
            </CardContent>
          </Card>
        )}
        {(role === "advertiser" || role === "both") && (
          <Card size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground">
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
              <p className="text-xs text-muted-foreground">
                Incoming Requests
              </p>
              <p className="mt-1 text-2xl font-medium tracking-tight tabular-nums">
                {incoming.length}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                from advertisers
              </p>
            </CardContent>
          </Card>
        )}
        {role === "advertiser" && (
          <Card size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground">
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
            <p className="text-xs text-muted-foreground">
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
            <p className="text-xs text-muted-foreground">
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

      {/* Recent promotions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent Promotions</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/requests?role=${role}`}>
              View All
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="overflow-hidden rounded-md border">
          {relevantRequests.slice(0, 3).map((req) => {
            const isIncoming = req.publisherId === currentUser.id
            const otherHero = getHero(
              isIncoming ? req.advertiserId : req.publisherId
            )
            const initials = otherHero
              ? otherHero.name.split(" ").map((n) => n[0]).join("")
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
      </div>

      {/* Recommended matches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {role === "publisher"
              ? "Recommended Advertisers"
              : role === "advertiser"
                ? "Recommended Publishers"
                : "Recommended for You"}
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/directory?role=${role}`}>
              <Compass data-icon="inline-start" className="size-4" />
              Browse Directory
            </Link>
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {recommended.map((hero) => {
            const initials = hero.name
              .split(" ")
              .map((n) => n[0])
              .join("")
            return (
              <Link
                key={hero.id}
                href={`/profile/${hero.id}?role=${role}`}
              >
                <Card
                  size="sm"
                  className="transition-colors hover:bg-muted/50"
                >
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{hero.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {hero.tagline}
                        </p>
                      </div>
                      <div className="text-right text-xs">
                        <p className="font-medium tabular-nums">
                          {formatNumber(hero.subscriberCount)}
                        </p>
                        <p className="text-muted-foreground">subscribers</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
