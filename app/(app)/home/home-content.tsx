"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { EmailBlockPreview } from "@/components/email-block-preview"
import { HeroCard } from "@/components/hero-card"
import { PromotionSheet } from "@/components/promotion-sheet"
import { PayoutBadge } from "@/components/payout-badge"
import {
  type RequestStatus,
  type PromotionRequest,
  type Hero,
  currentUser,
  promotionRequests,
  heroes,
  getHero,
  formatCurrency,
  formatNumber,
  getStatusColor,
  getEngagementColor,
  getRecommendedHeroes,
} from "@/lib/mock-data"
import {
  CurrencyDollar,
  Lightning,
  CheckCircle,
  Clock,
  Tray,
  ArrowRight,
  CalendarBlank,
  Check,
  X as XIcon,
  Globe,
  Megaphone,
  CaretRight,
  CaretDoubleUp,
  Users,
} from "@phosphor-icons/react"
import { formatDate, BADGE_COLORS } from "@/components/promotion-sheet"

export function HomeContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "publisher"

  const isPublisher = role === "publisher" || role === "both"
  const isSponsor = role === "sponsor" || role === "both"

  // Promotion sheet state
  const [selectedRequest, setSelectedRequest] = useState<PromotionRequest | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [statusOverrides, setStatusOverrides] = useState<Record<string, RequestStatus>>({})

  // Profile sheet state
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null)
  const selectedHero = selectedHeroId ? getHero(selectedHeroId) ?? null : null

  function openPromotionSheet(request: PromotionRequest) {
    setSelectedRequest(request)
    setSheetOpen(true)
  }

  function handleStatusChange(requestId: string, newStatus: RequestStatus) {
    setStatusOverrides((prev) => ({ ...prev, [requestId]: newStatus }))
  }

  // Apply overrides
  const allRequests = useMemo(
    () =>
      promotionRequests.map((r) => ({
        ...r,
        status: statusOverrides[r.id] || r.status,
      })),
    [statusOverrides]
  )

  const incoming = allRequests.filter((r) => r.publisherId === currentUser.id)
  const outgoing = allRequests.filter((r) => r.sponsorId === currentUser.id)

  // ── Stats ──
  const publisherRevenue = incoming
    .filter((r) => r.status === "published" || r.status === "paid")
    .reduce((sum, r) => sum + r.proposedFee, 0)
  const sponsorSpend = outgoing
    .filter((r) => r.status === "published" || r.status === "paid")
    .reduce((sum, r) => sum + r.proposedFee, 0)
  const activeCount = [...incoming, ...outgoing].filter(
    (r) => r.status === "accepted" || r.status === "scheduled"
  ).length
  const completedCount = [...incoming, ...outgoing].filter(
    (r) => r.status === "published" || r.status === "paid"
  ).length
  const pendingApprovals = outgoing.filter(
    (r) => r.status === "pending"
  ).length

  // ── Inbox items: things needing the current user's action ──
  const inboxItems = useMemo(() => {
    const items: { request: PromotionRequest; type: "publisher" | "sponsor"; label: string }[] = []

    if (isPublisher) {
      // Publisher sees pending requests FROM sponsors (sponsor initiated, publisher needs to accept)
      incoming
        .filter((r) => r.status === "pending" && r.initiatedBy === "sponsor")
        .forEach((r) => {
          const sponsor = getHero(r.sponsorId)
          items.push({
            request: r,
            type: "publisher",
            label: `${sponsor?.name ?? "Sponsor"} wants you to run their ad`,
          })
        })
    }

    if (isSponsor) {
      // Sponsor sees accepted requests waiting for their approval (publisher accepted, sponsor needs to approve)
      outgoing
        .filter((r) => r.status === "accepted")
        .forEach((r) => {
          const publisher = getHero(r.publisherId)
          items.push({
            request: r,
            type: "sponsor",
            label: `${publisher?.name ?? "Publisher"} accepted your campaign`,
          })
        })
    }

    return items
  }, [isPublisher, isSponsor, incoming, outgoing])

  // ── Recommended heroes ──
  const recommendedSponsors = useMemo(
    () => getRecommendedHeroes("publisher").slice(0, 4),
    []
  )
  const recommendedPublishers = useMemo(
    () => getRecommendedHeroes("sponsor").slice(0, 4),
    []
  )

  // Greeting
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  const effectiveStatus = selectedRequest
    ? (statusOverrides[selectedRequest.id] || selectedRequest.status)
    : null

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-medium tracking-tight">
        {greeting}, {currentUser.name.split(" ")[0]}
      </h1>

      {/* ── Stat cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isPublisher && (
          <Card className="py-4">
            <CardContent>
              <p className="flex items-center justify-between text-sm text-muted-foreground">
                Audience
                <Users className="size-4" />
              </p>
              <div className="mt-5">
                <Badge
                  variant="secondary"
                  className="gap-1 text-sm font-medium bg-[#EFD3A9]/50 text-[#6B4A15] dark:bg-[#D6A151]/30 dark:text-[#EFD3A9]"
                >
                  <CaretDoubleUp className="size-3" />
                  High Engagement
                </Badge>
              </div>
              <p className="mt-5 text-xs text-muted-foreground">
                {formatNumber(currentUser.subscriberCount)} subscribers · {currentUser.openRate}% open rate
              </p>
            </CardContent>
          </Card>
        )}
        {isPublisher && (
          <Card className="py-4">
            <CardContent>
              <p className="flex items-center justify-between text-sm text-muted-foreground">
                Ad Revenue
                <CurrencyDollar className="size-4" />
              </p>
              <p className="mt-5 text-2xl font-medium tracking-tight tabular-nums">
                {formatCurrency(publisherRevenue)}
              </p>
              <p className="mt-5 text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        )}
        {isSponsor && (
          <Card className="py-4">
            <CardContent>
              <p className="flex items-center justify-between text-sm text-muted-foreground">
                Ad Spend
                <CurrencyDollar className="size-4" />
              </p>
              <p className="mt-5 text-2xl font-medium tracking-tight tabular-nums">
                {formatCurrency(sponsorSpend)}
              </p>
              {currentUser.spendLimit && (
                <p className="mt-5 text-xs text-muted-foreground">
                  / {formatCurrency(currentUser.spendLimit)} monthly budget
                </p>
              )}
            </CardContent>
          </Card>
        )}
        <Card className="py-4">
          <CardContent>
            <p className="flex items-center justify-between text-sm text-muted-foreground">
              Active Promotions
              <Lightning className="size-4" />
            </p>
            <p className="mt-3 text-2xl font-medium tracking-tight tabular-nums">
              {activeCount}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        <Card className="py-4">
          <CardContent>
            <p className="flex items-center justify-between text-sm text-muted-foreground">
              Completed
              <CheckCircle className="size-4" />
            </p>
            <p className="mt-3 text-2xl font-medium tracking-tight tabular-nums">
              {completedCount}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        {isSponsor && !isPublisher && (
          <Card className="py-4">
            <CardContent>
              <p className="flex items-center justify-between text-sm text-muted-foreground">
                Pending Approvals
                <Clock className="size-4" />
              </p>
              <p className="mt-5 text-2xl font-medium tracking-tight tabular-nums">
                {pendingApprovals}
              </p>
              <p className="mt-5 text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── No campaign banner (sponsor without campaign) ── */}
      {/* For prototype purposes, we don't track this state — could add a toggle later */}

      {/* ── Inbox section ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">
            Inbox
            {inboxItems.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 h-5 px-1.5 py-0 text-[10px] tabular-nums text-foreground"
              >
                {inboxItems.length}
              </Badge>
            )}
          </h2>
        </div>

        {inboxItems.length > 0 ? (
          <div className="rounded-lg border bg-card">
            {inboxItems.slice(0, 5).map((item, index) => {
              const otherHero = getHero(
                item.type === "publisher"
                  ? item.request.sponsorId
                  : item.request.publisherId
              )
              const initials = otherHero ? otherHero.name.charAt(0) : "?"
              const date = new Date(item.request.proposedDate + "T00:00:00")
              const endDate = new Date(date)
              endDate.setDate(endDate.getDate() + 7)
              const fmt = (d: Date) =>
                d.toLocaleDateString("en-US", { month: "short", day: "numeric" })

              return (
                <div
                  key={item.request.id}
                  className={`flex items-center gap-4 px-4 py-3${index < inboxItems.slice(0, 5).length - 1 ? " border-b" : ""}`}
                >
                  <div className="flex min-w-0 items-center gap-3 w-48 shrink-0">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm font-medium">{otherHero?.name}</span>
                  </div>
                  <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                    {item.request.adHeadline}
                  </p>
                  <span className="shrink-0 text-sm tabular-nums">
                    {formatCurrency(item.request.proposedFee)}
                  </span>
                  <span className="shrink-0 text-sm text-muted-foreground w-32">
                    {fmt(date)} – {fmt(endDate)}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => openPromotionSheet(item.request)}
                  >
                    Review
                  </Button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-sm border border-dashed py-12 text-center">
            <div className="flex items-center justify-center rounded-sm border p-2">
              <Tray className="size-6 text-muted-foreground" />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              You have no new messages
            </p>
          </div>
        )}

        {inboxItems.length > 5 && (
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/requests?role=${role}`}>
              View all {inboxItems.length} items
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* ── Recommended sections ── */}
      {role === "both" ? (
        // Both role: side by side grids
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Recommended Sponsors</h2>
            <div className="grid gap-4">
              {recommendedSponsors.map((hero) => (
                <HeroCard
                  key={hero.id}
                  hero={hero}
                  onClick={() => setSelectedHeroId(hero.id)}
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Recommended Publishers</h2>
            <div className="grid gap-4">
              {recommendedPublishers.map((hero) => (
                <HeroCard
                  key={hero.id}
                  hero={hero}
                  showPublisherStats
                  onClick={() => setSelectedHeroId(hero.id)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-medium">
            {isPublisher ? "Recommended Sponsors" : "Recommended Publishers"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {(isPublisher ? recommendedSponsors : recommendedPublishers).map(
              (hero) => (
                <HeroCard
                  key={hero.id}
                  hero={hero}
                  showPublisherStats={isSponsor}
                  onClick={() => setSelectedHeroId(hero.id)}
                />
              )
            )}
          </div>
        </div>
      )}

      {/* ── Promotion Sheet ── */}
      <PromotionSheet
        request={selectedRequest}
        status={effectiveStatus}
        role={role}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onStatusChange={handleStatusChange}
      />

      {/* ── Hero profile Sheet ── */}
      <Sheet open={!!selectedHero} onOpenChange={(open) => !open && setSelectedHeroId(null)}>
        <SheetContent className="sm:max-w-lg">
          {selectedHero && (selectedHero.role === "sponsor" || (selectedHero.role === "both" && role === "publisher")) && (
            <SponsorProfileSheet hero={selectedHero} />
          )}
          {selectedHero && (selectedHero.role === "publisher" || (selectedHero.role === "both" && role !== "publisher")) && (
            <PublisherProfileSheet hero={selectedHero} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Profile sheets (reused from directory — simplified here)
// ─────────────────────────────────────────────────────────────

function SponsorProfileSheet({ hero }: { hero: Hero }) {
  const [phase, setPhase] = useState<"idle" | "loading" | "success">("idle")

  const handleAccept = useCallback(() => {
    setPhase("loading")
    setTimeout(() => setPhase("success"), 1200)
  }, [])

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <SheetTitle className="flex-1 text-lg">{hero.name}</SheetTitle>
          <SheetClose asChild>
            <Button variant="outline" size="icon-sm">
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <SheetBody className="space-y-4">
        {phase === "success" && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/50">
            <div className="flex items-center gap-2">
              <CheckCircle weight="fill" className="size-5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                Request sent to {hero.name}
              </p>
            </div>
          </div>
        )}

        <p className="text-sm leading-relaxed text-muted-foreground">{hero.bio}</p>

        <div className="flex flex-wrap gap-1.5">
          {hero.verticals.map((v) => (
            <Badge key={v} variant="outline">{v}</Badge>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Promotion</p>
          <EmailBlockPreview
            headline={hero.tagline}
            body={hero.bio}
            cta="Learn More"
          />
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Payout per send</p>
          <p className="text-lg font-medium tabular-nums">{formatCurrency(hero.recommendedFee)}</p>
        </div>
      </SheetBody>

      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Decline</Button>
        </SheetClose>
        {phase === "success" ? (
          <Button className="bg-emerald-600 hover:bg-emerald-600 text-white" disabled>
            <Check weight="bold" className="size-4" />
            Sent
          </Button>
        ) : (
          <Button loading={phase === "loading"} onClick={handleAccept}>
            {phase === "loading" ? "Accepting..." : "Accept"}
          </Button>
        )}
      </SheetFooter>
    </>
  )
}

function PublisherProfileSheet({ hero }: { hero: Hero }) {
  const [phase, setPhase] = useState<"idle" | "loading" | "success">("idle")

  const handleSendRequest = useCallback(() => {
    setPhase("loading")
    setTimeout(() => setPhase("success"), 1200)
  }, [])

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <SheetTitle className="flex-1 text-lg">{hero.name}</SheetTitle>
          <SheetClose asChild>
            <Button variant="outline" size="icon-sm">
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <SheetBody className="space-y-4">
        {phase === "success" && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/50">
            <div className="flex items-center gap-2">
              <CheckCircle weight="fill" className="size-5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                Request sent to {hero.name}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Subscribers</p>
            <p className="text-lg font-medium tabular-nums">{formatNumber(hero.subscriberCount)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Open Rate</p>
            <p className="text-lg font-medium tabular-nums">{hero.openRate}%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Click Rate</p>
            <p className="text-lg font-medium tabular-nums">{hero.clickRate}%</p>
          </div>
        </div>

        <Badge variant="secondary" className={getEngagementColor(hero.engagementTier)}>
          {hero.engagementTier} engagement
        </Badge>

        <div>
          <p className="text-xs text-muted-foreground">Recommended Fee</p>
          <p className="text-lg font-medium tabular-nums">{formatCurrency(hero.recommendedFee)}</p>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Sample Promotion</p>
          <EmailBlockPreview
            headline={`Recommended by ${hero.name.split(" ")[0]}`}
            body={`${hero.name} hand-picks every promotion they share. Their audience trusts their recommendations because they only endorse products they believe in.`}
            cta="Learn More"
            publisherName={hero.name}
          />
        </div>
      </SheetBody>

      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
        {phase === "success" ? (
          <Button className="bg-emerald-600 hover:bg-emerald-600 text-white" disabled>
            <Check weight="bold" className="size-4" />
            Sent
          </Button>
        ) : (
          <Button loading={phase === "loading"} onClick={handleSendRequest}>
            {phase === "loading" ? "Sending..." : "Send Request"}
          </Button>
        )}
      </SheetFooter>
    </>
  )
}
