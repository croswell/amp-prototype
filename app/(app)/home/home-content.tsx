"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PayoutBadge } from "@/components/payout-badge"
import { EmailBlockPreview } from "@/components/email-block-preview"
import { Separator } from "@/components/ui/separator"
import { HeroCard, HeroIdentity } from "@/components/hero-card"
import { EngagementBadge } from "@/components/engagement-badge"
import { StatCard } from "@/components/stat-card"
import { SocialIcon } from "@/components/social-icon"
// Simple heading helper (was imported from deleted promotion-sheet.tsx)
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-base font-medium">{children}</p>
}
import { buildPersonaParams, stripProtocol } from "@/lib/utils"
import {
  type RequestStatus,
  type PromotionRequest,
  type Hero,
  promotionRequests,
  getHero,
  formatCurrency,
  formatNumber,
  getDisplayStatus,
  getRecommendedHeroes,
  getActiveUser,
  getRoleForPersona,
  getActiveViewRole,
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
  CaretLeft,
  Users,
  CreditCard,
} from "@phosphor-icons/react"

export function HomeContent() {
  const searchParams = useSearchParams()
  const persona = searchParams.get("role") || "publisher"
  const view = searchParams.get("view")
  const activeUser = getActiveUser(persona)
  const role = getRoleForPersona(persona)
  const activeViewRole = getActiveViewRole(role, view)

  const isNewAccount = searchParams.get("new") === "true"
  const isPublisher = activeViewRole === "publisher"
  const isSponsor = activeViewRole === "sponsor"

  const personaParam = buildPersonaParams(persona, view, role)

  // Profile sheet state
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null)
  const selectedHero = selectedHeroId ? getHero(selectedHeroId) ?? null : null

  // Carousel state
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeCardIndex, setActiveCardIndex] = useState(0)

  const incoming = promotionRequests.filter((r) => r.publisherId === activeUser.id)
  const outgoing = promotionRequests.filter((r) => r.sponsorId === activeUser.id)

  // ── Stats ──
  const publisherRevenue = incoming
    .filter((r) => r.status === "published")
    .reduce((sum, r) => sum + r.proposedFee, 0)
  const sponsorSpend = outgoing
    .filter((r) => r.status === "published")
    .reduce((sum, r) => sum + r.proposedFee, 0)
  const activeCount = [...incoming, ...outgoing].filter(
    (r) => r.status === "accepted" || r.status === "scheduled"
  ).length
  const completedCount = [...incoming, ...outgoing].filter(
    (r) => r.status === "published"
  ).length
  const pendingApprovals = outgoing.filter(
    (r) => r.status === "pending"
  ).length

  // ── Stat cards array (for carousel + grid) ──
  const statCards = useMemo(() => {
    const cards: { key: string; content: React.ReactNode }[] = []

    // Money metric first
    if (isPublisher) {
      cards.push({
        key: "ad-revenue",
        content: (
          <Card className="py-5">
            <CardContent className="flex h-full flex-col">
              <p className="flex items-center justify-between text-sm text-muted-foreground">
                Ad Revenue
                <CurrencyDollar className="size-4" />
              </p>
              <p className="mt-3 text-2xl font-medium tracking-tight tabular-nums">
                {formatCurrency(isNewAccount ? 0 : publisherRevenue)}
              </p>
              <p className="mt-auto pt-3 text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        ),
      })
    }
    if (isSponsor) {
      cards.push({
        key: "ad-spend",
        content: (
          <Card className="py-5">
            <CardContent className="flex h-full flex-col">
              <p className="flex items-center justify-between text-sm text-muted-foreground">
                Ad Spend
                <CurrencyDollar className="size-4" />
              </p>
              <p className="mt-3 text-2xl font-medium tracking-tight tabular-nums">
                {formatCurrency(isNewAccount ? 0 : sponsorSpend)}
              </p>
              <p className="mt-auto pt-3 text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        ),
      })
    }

    // Active promotions (always)
    cards.push({
      key: "active",
      content: (
        <Card className="py-5">
          <CardContent className="flex h-full flex-col">
            <p className="flex items-center justify-between text-sm text-muted-foreground">
              Active Promotions
              <Lightning className="size-4" />
            </p>
            <p className="mt-3 text-2xl font-medium tracking-tight tabular-nums">
              {isNewAccount ? 0 : activeCount}
            </p>
            <p className="mt-auto pt-3 text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      ),
    })

    // Completed (always)
    cards.push({
      key: "completed",
      content: (
        <Card className="py-5">
          <CardContent className="flex h-full flex-col">
            <p className="flex items-center justify-between text-sm text-muted-foreground">
              Completed
              <CheckCircle className="size-4" />
            </p>
            <p className="mt-3 text-2xl font-medium tracking-tight tabular-nums">
              {isNewAccount ? 0 : completedCount}
            </p>
            <p className="mt-auto pt-3 text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      ),
    })

    // Pending approvals (sponsor-only, non-publisher)
    if (isSponsor && !isPublisher) {
      cards.push({
        key: "pending",
        content: (
          <Card className="py-5">
            <CardContent className="flex h-full flex-col">
              <p className="flex items-center justify-between text-sm text-muted-foreground">
                Pending Approvals
                <Clock className="size-4" />
              </p>
              <p className="mt-3 text-2xl font-medium tracking-tight tabular-nums">
                {isNewAccount ? 0 : pendingApprovals}
              </p>
              <p className="mt-auto pt-3 text-xs text-muted-foreground">
                Last 30 days
              </p>
            </CardContent>
          </Card>
        ),
      })
    }

    // Audience (publisher) — engagement card at the end
    if (isPublisher) {
      cards.push({
        key: "audience",
        content: (
          <Card className="py-5">
            <CardContent className="flex h-full flex-col">
              <p className="flex items-center justify-between text-sm text-muted-foreground">
                Audience
                <Users className="size-4" />
              </p>
              <div className="mt-3">
                <EngagementBadge tier={activeUser.engagementTier} />
              </div>
              <p className="mt-auto pt-3 text-xs text-muted-foreground">
                {formatNumber(activeUser.subscriberCount)} subscribers · {activeUser.openRate}% open rate
              </p>
            </CardContent>
          </Card>
        ),
      })
    }

    return cards
  }, [isPublisher, isSponsor, isNewAccount, publisherRevenue, sponsorSpend, activeCount, completedCount, pendingApprovals, activeUser])

  // ── Carousel IntersectionObserver ──
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    // Reset scroll position and index when card count changes (persona switch)
    container.scrollTo({ left: 0 })
    setActiveCardIndex(0)

    const cards = container.querySelectorAll<HTMLElement>("[data-carousel-card]")
    if (cards.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index)
            if (!Number.isNaN(index)) setActiveCardIndex(index)
          }
        }
      },
      { root: container, threshold: 0.5 }
    )

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [statCards.length])

  // ── Recent activity: 3 most recent open items (needing action) ──
  const OPEN_STATUSES: RequestStatus[] = ["pending", "in_review", "accepted"]
  const recentActivity = useMemo(() => {
    const myRequests = [...incoming, ...outgoing]
    return myRequests
      .filter((r) => OPEN_STATUSES.includes(r.status))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3)
  }, [incoming, outgoing])


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

  return (
    <div className="space-y-10">
      <div className="relative space-y-8 pb-2 after:absolute after:bottom-0 after:left-1/2 after:w-screen after:-translate-x-1/2 after:border-b after:border-border sm:pb-10">
      <h1 className="text-balance text-2xl font-medium tracking-tight">
        {greeting}, {activeUser.name.split(" ")[0]}
      </h1>

      {/* ── Stripe connection callout (new accounts only) ── */}
      {isNewAccount && (
        <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 sm:flex-1 sm:gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
              <CreditCard className="size-5 text-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                Connect Stripe to {isPublisher ? "receive payments" : "fund campaigns"}
              </p>
              <p className="text-xs text-muted-foreground">
                {isPublisher
                  ? "Link your Stripe account so sponsors can pay you directly."
                  : "Add a payment method to start sending promotion requests."}
              </p>
            </div>
          </div>
          <Button size="sm" className="w-full shrink-0 sm:w-auto">
            Connect Stripe
          </Button>
        </div>
      )}

      {/* ── Stat cards: mobile carousel ── */}
      <div className="space-y-3 sm:hidden">
        <div
          ref={scrollRef}
          className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2"
        >
          {statCards.map((card, i) => (
            <div
              key={card.key}
              className="w-full shrink-0 snap-center"
              data-carousel-card
              data-index={i}
            >
              {card.content}
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        {statCards.length > 1 && (
          <div
            role="tablist"
            aria-label="Stat cards"
            className="mx-auto flex w-full max-w-[120px] gap-1.5"
          >
            {statCards.map((card, i) => (
              <button
                key={card.key}
                role="tab"
                aria-selected={i === activeCardIndex}
                aria-label={`Go to card ${i + 1}`}
                className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                  i === activeCardIndex ? "bg-foreground" : "bg-muted-foreground/40"
                }`}
                onClick={() => {
                  const container = scrollRef.current
                  if (!container) return
                  const target = container.querySelector<HTMLElement>(`[data-index="${i}"]`)
                  target?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Stat cards: desktop grid ── */}
      <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.key}>{card.content}</div>
        ))}
      </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-balance text-lg font-medium">Recent Activity</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/requests${personaParam}`}>
              View all
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Link>
          </Button>
        </div>

        {!isNewAccount && recentActivity.length > 0 ? (
          <div className="rounded-lg border bg-card">
            {recentActivity.map((req, index) => {
              const isIncoming = req.publisherId === activeUser.id
              const otherHero = getHero(isIncoming ? req.sponsorId : req.publisherId)
              const initials = otherHero ? otherHero.name.charAt(0) : "?"
              const { label: statusLabel, color: statusColor } = getDisplayStatus(req, activeViewRole)

              return (
                <Link
                  key={req.id}
                  href={`/requests/${req.id}${personaParam}`}
                  className={`flex items-center gap-4 p-4${index < recentActivity.length - 1 ? " border-b" : ""}`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3 sm:w-48 sm:flex-none">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm font-medium">{otherHero?.name}</span>
                  </div>
                  <p className="hidden min-w-0 flex-1 truncate text-sm text-muted-foreground sm:block">
                    {req.adHeadline}
                  </p>
                  <Badge variant="secondary" className={`shrink-0 ${statusColor}`}>
                    {statusLabel}
                  </Badge>
                  <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
                    <span>View</span>
                  </Button>
                  <CaretRight className="size-5 shrink-0 text-muted-foreground sm:hidden" />
                </Link>
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
        <h2 className="text-balance text-lg font-medium">
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

      {/* ── Hero profile Dialog ── */}
      <Dialog open={!!selectedHero} onOpenChange={(open) => !open && setSelectedHeroId(null)}>
        <DialogContent showCloseButton={false} className="sm:max-w-lg gap-0 p-0">
          {selectedHero && (selectedHero.role === "sponsor" || (selectedHero.role === "both" && activeViewRole === "publisher")) && (
            <SponsorProfileDialog hero={selectedHero} activeUser={activeUser} personaParam={personaParam} />
          )}
          {selectedHero && (selectedHero.role === "publisher" || (selectedHero.role === "both" && activeViewRole !== "publisher")) && (
            <PublisherProfileDialog hero={selectedHero} activeUser={activeUser} personaParam={personaParam} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Profile sheets (reused from directory — simplified here)
// ─────────────────────────────────────────────────────────────

function SponsorProfileDialog({
  hero,
  activeUser,
  personaParam,
}: {
  hero: Hero
  activeUser: Hero
  personaParam: string
}) {
  const router = useRouter()
  const [phase, setPhase] = useState<"idle" | "composing" | "loading" | "success">("idle")
  const [message, setMessage] = useState("")

  // Editable ad copy — pre-filled from the sponsor's profile
  const [adHeadline, setAdHeadline] = useState(hero.tagline)
  const [adBody, setAdBody] = useState(hero.bio)
  const [adCta, setAdCta] = useState("Learn More")
  const adCtaUrl = hero.website || ""

  const handleSendProposal = useCallback(() => {
    setPhase("loading")

    const newId = `req-new-${Date.now()}`
    const now = new Date().toISOString().split("T")[0]
    promotionRequests.push({
      id: newId,
      sponsorId: hero.id,
      publisherId: activeUser.id,
      status: "pending",
      initiatedBy: "publisher",
      brief: message,
      adHeadline,
      adBody,
      adCta,
      adCtaUrl,
      proposedFee: hero.recommendedFee,
      notes: "",
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: "tl-1",
          type: "proposal_sent",
          actorId: activeUser.id,
          timestamp: new Date().toISOString(),
          note: message || undefined,
          copyAfter: {
            adHeadline,
            adBody,
            adCta,
            adCtaUrl,
          },
        },
      ],
    })

    setTimeout(() => {
      setPhase("success")
      setTimeout(() => {
        router.push(`/requests/${newId}${personaParam}`)
      }, 600)
    }, 1200)
  }, [activeUser.id, hero.id, hero.recommendedFee, adHeadline, adBody, adCta, adCtaUrl, message, personaParam, router])

  // ── Composing phase: proposal form ──
  if (phase === "composing" || phase === "loading" || phase === "success") {
    return (
      <>
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-6 py-4">
          <Button variant="outline" size="icon-sm" onClick={() => phase === "composing" && setPhase("idle")}>
            <CaretLeft />
            <span className="sr-only">Back</span>
          </Button>
          <DialogTitle className="sr-only">Send proposal to {hero.name}</DialogTitle>
          <h2 className="flex-1 text-lg font-medium leading-none">Send proposal to {hero.name}</h2>
          <DialogClose asChild>
            <Button variant="outline" size="icon-sm">
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-6 space-y-6" style={{ maxHeight: "60vh" }}>
          {/* Editable ad copy */}
          <div className="space-y-3">
            <SectionTitle>Ad copy</SectionTitle>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="ad-headline" className="text-xs text-muted-foreground">Headline</label>
                <Input
                  id="ad-headline"
                  value={adHeadline}
                  onChange={(e) => setAdHeadline(e.target.value)}
                  disabled={phase !== "composing"}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="ad-body" className="text-xs text-muted-foreground">Body</label>
                <Textarea
                  id="ad-body"
                  value={adBody}
                  onChange={(e) => setAdBody(e.target.value)}
                  rows={3}
                  disabled={phase !== "composing"}
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="ad-cta" className="text-xs text-muted-foreground">Call to action</label>
                <Input
                  id="ad-cta"
                  value={adCta}
                  onChange={(e) => setAdCta(e.target.value)}
                  disabled={phase !== "composing"}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Custom message */}
          <div className="space-y-3">
            <SectionTitle>Custom message <span className="font-normal text-muted-foreground">(optional)</span></SectionTitle>
            <Textarea
              placeholder={`Tell ${hero.name.split(" ")[0]} why your newsletter is a great fit for their brand...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              disabled={phase !== "composing"}
            />
          </div>

        </div>

        {/* Sticky footer */}
        <div className="flex justify-end gap-2 border-t px-6 py-4">
          {phase === "composing" ? (
            <>
              <Button variant="outline" onClick={() => setPhase("idle")}>Back</Button>
              <Button onClick={handleSendProposal}>Send</Button>
            </>
          ) : phase === "success" ? (
            <Button className="bg-emerald-600 hover:bg-emerald-600 text-white" disabled>
              <Check weight="bold" className="size-4" />
              Sent
            </Button>
          ) : (
            <Button loading disabled>Sending...</Button>
          )}
        </div>
      </>
    )
  }

  // ── Idle phase: sponsor profile ──
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <DialogTitle className="sr-only">Recommended sponsor</DialogTitle>
        <h2 className="flex-1 text-lg font-medium leading-none">Recommended sponsor</h2>
        <DialogClose asChild>
          <Button variant="outline" size="icon-sm">
            <XIcon />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>
      </div>

      {/* Scrollable body */}
      <div className="overflow-y-auto px-6 py-6 space-y-6" style={{ maxHeight: "60vh" }}>
        <HeroIdentity hero={hero} />

        {/* Bio */}
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{hero.bio}</p>

        {/* Niche + Links — single inline row */}
        <div className="flex flex-wrap items-center gap-2">
          {hero.verticals[0] && (
            <Badge variant="outline" className="text-xs">{hero.verticals[0]}</Badge>
          )}
          {hero.website && (
            <Badge variant="outline" className="text-xs">
              <Globe className="size-3" />
              {stripProtocol(hero.website)}
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
              <TableRow className="hover:bg-transparent">
                <TableCell className="text-muted-foreground">Budget per 1,000 emails</TableCell>
                <TableCell className="text-right font-medium text-foreground">
                  {formatCurrency(hero.budgetPerThousand ?? hero.recommendedFee)}
                </TableCell>
              </TableRow>
              {hero.maxBudget && (
                <TableRow className="border-0 hover:bg-transparent">
                  <TableCell className="text-muted-foreground">Max budget</TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {formatCurrency(hero.maxBudget)}
                  </TableCell>
                </TableRow>
              )}
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
      </div>

      {/* Sticky footer */}
      <div className="flex justify-end gap-2 border-t px-6 py-4">
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
        <Button onClick={() => setPhase("composing")}>Send Proposal</Button>
      </div>
    </>
  )
}

function PublisherProfileDialog({
  hero,
  activeUser,
  personaParam,
}: {
  hero: Hero
  activeUser: Hero
  personaParam: string
}) {
  const router = useRouter()
  const [phase, setPhase] = useState<"idle" | "composing" | "loading" | "success">("idle")

  // Sponsor's pre-configured ad (from settings)
  const sponsorAd = {
    headline: "Create Your First Online Course in 30 Days",
    body: "Jake Morrison's step-by-step framework has helped 500+ creators launch profitable courses. Get his free Course Launch Blueprint and start building your course today.",
    cta: "Get the Free Blueprint",
    ctaUrl: "https://jakemorrison.io/blueprint",
  }

  const [message, setMessage] = useState("")

  const handleSendRequest = useCallback(() => {
    setPhase("loading")

    const newId = `req-new-${Date.now()}`
    const now = new Date().toISOString().split("T")[0]
    promotionRequests.push({
      id: newId,
      sponsorId: activeUser.id,
      publisherId: hero.id,
      status: "pending",
      initiatedBy: "sponsor",
      brief: message,
      adHeadline: sponsorAd.headline,
      adBody: sponsorAd.body,
      adCta: sponsorAd.cta,
      adCtaUrl: sponsorAd.ctaUrl,
      proposedFee: hero.recommendedFee,
      notes: "",
      createdAt: now,
      updatedAt: now,
      timeline: [
        {
          id: "tl-1",
          type: "proposal_sent",
          actorId: activeUser.id,
          timestamp: new Date().toISOString(),
          note: message || undefined,
          copyAfter: {
            adHeadline: sponsorAd.headline,
            adBody: sponsorAd.body,
            adCta: sponsorAd.cta,
            adCtaUrl: sponsorAd.ctaUrl,
          },
        },
      ],
    })

    setTimeout(() => {
      setPhase("success")
      setTimeout(() => {
        router.push(`/requests/${newId}${personaParam}`)
      }, 600)
    }, 1200)
  }, [activeUser.id, hero.id, hero.recommendedFee, sponsorAd, message, personaParam, router])

  // ── Composing phase: proposal form ──
  if (phase === "composing" || phase === "loading" || phase === "success") {
    return (
      <>
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-6 py-4">
          <Button variant="outline" size="icon-sm" onClick={() => phase === "composing" && setPhase("idle")}>
            <CaretLeft />
            <span className="sr-only">Back</span>
          </Button>
          <DialogTitle className="sr-only">Send request to {hero.name}</DialogTitle>
          <h2 className="flex-1 text-lg font-medium leading-none">Send request to {hero.name}</h2>
          <DialogClose asChild>
            <Button variant="outline" size="icon-sm">
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-6 space-y-6" style={{ maxHeight: "60vh" }}>
          {/* Ad preview (from sponsor settings) */}
          <div className="space-y-3">
            <SectionTitle>Ad preview</SectionTitle>
            <EmailBlockPreview
              headline={sponsorAd.headline}
              body={sponsorAd.body}
              cta={sponsorAd.cta}
            />
          </div>

          <Separator />

          {/* Custom message */}
          <div className="space-y-3">
            <SectionTitle>Custom message <span className="font-normal text-muted-foreground">(optional)</span></SectionTitle>
            <Textarea
              placeholder={`Tell ${hero.name.split(" ")[0]} why you'd be a great fit for their audience...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              disabled={phase !== "composing"}
            />
          </div>

        </div>

        {/* Sticky footer */}
        <div className="flex justify-end gap-2 border-t px-6 py-4">
          {phase === "composing" ? (
            <>
              <Button variant="outline" onClick={() => setPhase("idle")}>Back</Button>
              <Button onClick={handleSendRequest}>Send</Button>
            </>
          ) : phase === "success" ? (
            <Button className="bg-emerald-600 hover:bg-emerald-600 text-white" disabled>
              <Check weight="bold" className="size-4" />
              Sent
            </Button>
          ) : (
            <Button loading disabled>Sending...</Button>
          )}
        </div>
      </>
    )
  }

  // ── Idle phase: publisher profile ──
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <DialogTitle className="sr-only">Recommended publisher</DialogTitle>
        <h2 className="flex-1 text-lg font-medium leading-none">Recommended publisher</h2>
        <DialogClose asChild>
          <Button variant="outline" size="icon-sm">
            <XIcon />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>
      </div>

      {/* Scrollable body */}
      <div className="overflow-y-auto px-6 py-6 space-y-6" style={{ maxHeight: "60vh" }}>
        <HeroIdentity hero={hero} showEngagement />

        {/* Audience stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Subscribers" value={formatNumber(hero.subscriberCount)} />
          <StatCard label="Open Rate" value={`${hero.openRate}%`} />
          <StatCard label="Click Rate" value={`${hero.clickRate}%`} />
        </div>

        <Separator />

        {/* Bio */}
        <div className="space-y-2">
          <SectionTitle>Bio</SectionTitle>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{hero.bio}</p>
        </div>

        {/* Links row */}
        <div className="flex flex-wrap gap-2">
          {hero.website && (
            <Badge variant="outline" className="text-xs">
              <Globe className="size-3" />
              {stripProtocol(hero.website)}
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
      </div>

      {/* Sticky footer */}
      <div className="flex justify-end gap-2 border-t px-6 py-4">
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
        <Button onClick={() => setPhase("composing")}>Send Request</Button>
      </div>
    </>
  )
}
