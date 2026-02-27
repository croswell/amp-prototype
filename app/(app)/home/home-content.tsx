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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { PayoutBadge } from "@/components/payout-badge"
import { EmailBlockPreview } from "@/components/email-block-preview"
import { Separator } from "@/components/ui/separator"
import { HeroCard, HeroIdentity } from "@/components/hero-card"
import { SocialIcon } from "@/components/social-icon"
import { PromotionSheet, type ReviewAction } from "@/components/promotion-sheet"
import {
  type RequestStatus,
  type PromotionRequest,
  type Hero,
  promotionRequests,
  heroes,
  getHero,
  formatCurrency,
  formatNumber,
  getStatusColor,
  STATUS_LABELS,
  getRecommendedHeroes,
  getActiveUser,
  getRoleForPersona,
} from "@/lib/mock-data"
import {
  CurrencyDollar,
  Lightning,
  CheckCircle,
  Clock,
  Tray,
  ArrowRight,
  Check,
  X as XIcon,
  Globe,
  CaretRight,
  CaretDoubleUp,
  Users,
} from "@phosphor-icons/react"
import { SectionTitle } from "@/components/promotion-sheet"

export function HomeContent() {
  const searchParams = useSearchParams()
  const persona = searchParams.get("persona") || "sarah"
  const activeUser = getActiveUser(persona)
  const role = getRoleForPersona(persona)

  const isPublisher = role === "publisher"
  const isSponsor = role === "sponsor"

  // Promotion sheet state
  const [selectedRequest, setSelectedRequest] = useState<PromotionRequest | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [statusOverrides, setStatusOverrides] = useState<Record<string, RequestStatus>>({})
  const [reviewOverrides, setReviewOverrides] = useState<Record<string, {
    reviewTurn?: "sponsor" | "publisher"
    proposedEdits?: { adHeadline: string; adBody: string; adCta: string; adCtaUrl: string }
    revisionNotes?: string
  }>>({})

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

  function handleReviewAction(requestId: string, action: ReviewAction) {
    switch (action.type) {
      case "suggest_changes": {
        // If revision notes already exist, this is the second round — auto-complete
        const hasRevisionNotes = !!reviewOverrides[requestId]?.revisionNotes
        if (hasRevisionNotes) {
          setStatusOverrides((prev) => ({ ...prev, [requestId]: "accepted" }))
          setReviewOverrides((prev) => ({
            ...prev,
            [requestId]: { ...prev[requestId], reviewTurn: undefined, proposedEdits: action.proposedEdits },
          }))
        } else {
          setStatusOverrides((prev) => ({ ...prev, [requestId]: "in_review" }))
          setReviewOverrides((prev) => ({
            ...prev,
            [requestId]: {
              ...prev[requestId],
              reviewTurn: "sponsor",
              proposedEdits: action.proposedEdits,
            },
          }))
        }
        break
      }
      case "approve_edits":
        setStatusOverrides((prev) => ({ ...prev, [requestId]: "accepted" }))
        setReviewOverrides((prev) => ({
          ...prev,
          [requestId]: { ...prev[requestId], reviewTurn: undefined },
        }))
        break
      case "request_revision":
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

  // Apply overrides
  const allRequests = useMemo(
    () =>
      promotionRequests.map((r) => ({
        ...r,
        status: statusOverrides[r.id] || r.status,
        ...(reviewOverrides[r.id] ? {
          reviewTurn: reviewOverrides[r.id].reviewTurn ?? r.reviewTurn,
          proposedEdits: reviewOverrides[r.id].proposedEdits ?? r.proposedEdits,
          revisionNotes: reviewOverrides[r.id].revisionNotes ?? r.revisionNotes,
        } : {}),
      })),
    [statusOverrides, reviewOverrides]
  )

  const incoming = allRequests.filter((r) => r.publisherId === activeUser.id)
  const outgoing = allRequests.filter((r) => r.sponsorId === activeUser.id)

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

  // ── Recent activity: 3 most recent open items (needing action) ──
  const OPEN_STATUSES: RequestStatus[] = ["pending", "in_review", "accepted"]
  const recentActivity = useMemo(() => {
    const myRequests = [...incoming, ...outgoing]
    return myRequests
      .filter((r) => OPEN_STATUSES.includes(r.status))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3)
  }, [incoming, outgoing])

  // Direction-aware status label for pending items
  function getDisplayStatus(req: PromotionRequest): { label: string; color: string } {
    if (req.status === "pending") {
      const userInitiated =
        (isPublisher && req.initiatedBy === "publisher") ||
        (isSponsor && req.initiatedBy === "sponsor")
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

  // ── Recommended heroes ──
  const recommendedSponsors = useMemo(
    () => getRecommendedHeroes("publisher", activeUser).slice(0, 10),
    [activeUser]
  )
  const recommendedPublishers = useMemo(
    () => getRecommendedHeroes("sponsor", activeUser).slice(0, 10),
    [activeUser]
  )

  // Greeting
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

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
      <div className="relative space-y-8 pb-10 after:absolute after:bottom-0 after:left-1/2 after:w-screen after:-translate-x-1/2 after:border-b after:border-border">
      <h1 className="text-2xl font-medium tracking-tight">
        {greeting}, {activeUser.name.split(" ")[0]}
      </h1>

      {/* ── Stat cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isPublisher && (
          <Card className="py-5">
            <CardContent className="flex h-full flex-col">
              <p className="flex items-center justify-between text-sm text-muted-foreground">
                Audience
                <Users className="size-4" />
              </p>
              <div className="mt-3">
                <Badge
                  variant="secondary"
                  className="gap-1 text-xs bg-[#EFD3A9]/50 text-[#6B4A15] dark:bg-[#D6A151]/30 dark:text-[#EFD3A9]"
                >
                  <CaretDoubleUp className="size-3" />
                  High Engagement
                </Badge>
              </div>
              <p className="mt-auto pt-3 text-xs text-muted-foreground">
                {formatNumber(activeUser.subscriberCount)} subscribers · {activeUser.openRate}% open rate
              </p>
            </CardContent>
          </Card>
        )}
        {isPublisher && (
          <Card className="py-5">
            <CardContent className="flex h-full flex-col">
              <p className="flex items-center justify-between text-sm text-muted-foreground">
                Ad Revenue
                <CurrencyDollar className="size-4" />
              </p>
              <p className="mt-3 text-2xl font-medium tracking-tight tabular-nums">
                {formatCurrency(publisherRevenue)}
              </p>
              <p className="mt-auto pt-3 text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        )}
        {isSponsor && (
          <Card className="py-5">
            <CardContent className="flex h-full flex-col">
              <p className="flex items-center justify-between text-sm text-muted-foreground">
                Ad Spend
                <CurrencyDollar className="size-4" />
              </p>
              <p className="mt-3 text-2xl font-medium tracking-tight tabular-nums">
                {formatCurrency(sponsorSpend)}
              </p>
              <p className="mt-auto pt-3 text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        )}
        <Card className="py-5">
          <CardContent className="flex h-full flex-col">
            <p className="flex items-center justify-between text-sm text-muted-foreground">
              Active Promotions
              <Lightning className="size-4" />
            </p>
            <p className="mt-3 text-2xl font-medium tracking-tight tabular-nums">
              {activeCount}
            </p>
            <p className="mt-auto pt-3 text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        <Card className="py-5">
          <CardContent className="flex h-full flex-col">
            <p className="flex items-center justify-between text-sm text-muted-foreground">
              Completed
              <CheckCircle className="size-4" />
            </p>
            <p className="mt-3 text-2xl font-medium tracking-tight tabular-nums">
              {completedCount}
            </p>
            <p className="mt-auto pt-3 text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        {isSponsor && !isPublisher && (
          <Card className="py-5">
            <CardContent className="flex h-full flex-col">
              <p className="flex items-center justify-between text-sm text-muted-foreground">
                Pending Approvals
                <Clock className="size-4" />
              </p>
              <p className="mt-3 text-2xl font-medium tracking-tight tabular-nums">
                {pendingApprovals}
              </p>
              <p className="mt-auto pt-3 text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent Activity</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/requests${persona === "sarah" ? "" : `?persona=${persona}`}`}>
              View all
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Link>
          </Button>
        </div>

        {recentActivity.length > 0 ? (
          <div className="rounded-lg border bg-card">
            {recentActivity.map((req, index) => {
              const isIncoming = req.publisherId === activeUser.id
              const otherHero = getHero(isIncoming ? req.sponsorId : req.publisherId)
              const initials = otherHero ? otherHero.name.charAt(0) : "?"
              const { label: statusLabel, color: statusColor } = getDisplayStatus(req)

              return (
                <div
                  key={req.id}
                  className={`flex cursor-pointer items-center gap-4 p-4${index < recentActivity.length - 1 ? " border-b" : ""}`}
                  onClick={() => openPromotionSheet(req)}
                >
                  <div className="flex min-w-0 items-center gap-3 w-48 shrink-0">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm font-medium">{otherHero?.name}</span>
                  </div>
                  <p className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                    {req.adHeadline}
                  </p>
                  <Badge variant="secondary" className={`shrink-0 ${statusColor}`}>
                    {statusLabel}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => openPromotionSheet(req)}>
                    View
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
              No activity yet
            </p>
          </div>
        )}
      </div>

      {/* ── Recommended sections ── */}
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

      {/* ── Promotion Sheet ── */}
      <PromotionSheet
        request={effectiveRequest}
        role={role}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onStatusChange={handleStatusChange}
        onReviewAction={handleReviewAction}
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

  const handleSendProposal = useCallback(() => {
    setPhase("loading")
    setTimeout(() => setPhase("success"), 1200)
  }, [])

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <SheetTitle className="flex-1 text-lg">Recommended sponsor</SheetTitle>
          <SheetClose asChild>
            <Button variant="outline" size="icon-sm">
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <SheetBody className="space-y-6">
        {phase === "success" && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/50">
            <div className="flex items-center gap-2">
              <CheckCircle weight="fill" className="size-5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                Proposal sent to {hero.name}
              </p>
            </div>
          </div>
        )}

        <HeroIdentity hero={hero} />

        {/* Bio */}
        <p className="text-sm leading-relaxed text-muted-foreground">{hero.bio}</p>

        {/* Niche + Links — single inline row */}
        <div className="flex flex-wrap items-center gap-2">
          {hero.verticals[0] && (
            <Badge variant="outline" className="text-xs">{hero.verticals[0]}</Badge>
          )}
          {hero.website && (
            <Badge variant="outline" className="text-xs">
              <Globe className="size-3" />
              {hero.website.replace(/^https?:\/\//, "")}
            </Badge>
          )}
          {hero.socialLinks.map((link) => (
            <Badge key={link.platform} variant="outline" className="text-xs capitalize">
              <SocialIcon platform={link.platform} className="size-3" />
              {link.platform}
            </Badge>
          ))}
        </div>

        <Separator />

        <div className="rounded-lg border">
          <Table>
            <TableBody>
              <TableRow className="border-0 hover:bg-transparent">
                <TableCell className="text-muted-foreground">Payout per send</TableCell>
                <TableCell className="text-right">
                  <PayoutBadge amount={hero.recommendedFee} variant="filled" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <Separator />

        {/* Campaign preview */}
        <div className="space-y-2">
          <SectionTitle>Ad preview</SectionTitle>
          <EmailBlockPreview
            headline={hero.tagline}
            body={hero.bio}
            cta="Learn More"
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
          <Button loading={phase === "loading"} onClick={handleSendProposal}>
            {phase === "loading" ? "Sending..." : "Send Proposal"}
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
          <SheetTitle className="flex-1 text-lg">Recommended publisher</SheetTitle>
          <SheetClose asChild>
            <Button variant="outline" size="icon-sm">
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <SheetBody className="space-y-6">
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

        <HeroIdentity hero={hero} showEngagement />

        {/* Audience stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Subscribers</p>
            <p className="text-lg font-medium tabular-nums">{formatNumber(hero.subscriberCount)}</p>
          </div>
          <div className="rounded-lg border p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Open Rate</p>
            <p className="text-lg font-medium tabular-nums">{hero.openRate}%</p>
          </div>
          <div className="rounded-lg border p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Click Rate</p>
            <p className="text-lg font-medium tabular-nums">{hero.clickRate}%</p>
          </div>
        </div>

        <Separator />

        {/* Bio */}
        <div className="space-y-2">
          <SectionTitle>Bio</SectionTitle>
          <p className="text-sm leading-relaxed text-muted-foreground">{hero.bio}</p>
        </div>

        {/* Links row */}
        <div className="flex flex-wrap gap-2">
          {hero.website && (
            <Badge variant="outline" className="text-xs">
              <Globe className="size-3" />
              {hero.website.replace(/^https?:\/\//, "")}
            </Badge>
          )}
          {hero.socialLinks.map((link) => (
            <Badge key={link.platform} variant="outline" className="text-xs capitalize">
              <SocialIcon platform={link.platform} className="size-3" />
              {link.platform}
            </Badge>
          ))}
        </div>

        <Separator />

        <div className="rounded-lg border">
          <Table>
            <TableBody>
              <TableRow className="border-0 hover:bg-transparent">
                <TableCell className="text-muted-foreground">Price per send</TableCell>
                <TableCell className="text-right">
                  <PayoutBadge amount={hero.recommendedFee} variant="filled" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
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
