"use client"

import { useState, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { EmailBlockPreview } from "@/components/email-block-preview"
import { HeroIdentity } from "@/components/hero-card"
import { SocialIcon } from "@/components/social-icon"
import { PayoutBadge } from "@/components/payout-badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { CalendarBlank, Timer, X, Check, CheckCircle, Clock, Globe, FileText, ArrowSquareOut, Broadcast } from "@phosphor-icons/react"
import {
  type RequestStatus,
  type PromotionRequest,
  type Hero,
  getHero,
  getStatusColor,
  formatCurrency,
  formatNumber,
  STATUS_LABELS,
} from "@/lib/mock-data"

// Palette color pairs: light palette color as bg tint, darkened text for contrast
export const BADGE_COLORS = {
  green: "bg-[#CBD7CC]/50 text-[#2A3D35] dark:bg-[#405B50]/40 dark:text-[#CBD7CC]",
  greenOutline: "text-[#405B50] dark:text-[#86CEAC]",
  blue: "bg-[#9FC2CC]/50 text-[#1E3A4D] dark:bg-[#3A6278]/40 dark:text-[#9FC2CC]",
  gold: "bg-[#EFD3A9]/50 text-[#6B4A15] dark:bg-[#D6A151]/30 dark:text-[#EFD3A9]",
  terracotta: "bg-[#AD715C]/30 text-[#4A2318] dark:bg-[#733725]/40 dark:text-[#AD715C]",
  lavender: "bg-[#D7CBD5]/50 text-[#352938] dark:bg-[#52405B]/40 dark:text-[#D7CBD5]",
} as const

// Deterministic days remaining based on request ID
function getDaysRemaining(id: string): number {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return (hash % 7) + 1
}

// Format a date string to a readable format
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Section title for sheet content blocks
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-base font-medium">{children}</p>
}

// ─────────────────────────────────────────────────────────────
// Shared ProfileTab — renders the other party's profile info
// ─────────────────────────────────────────────────────────────

function ProfileTab({ hero, heroType }: { hero: Hero; heroType: "publisher" | "sponsor" }) {
  if (heroType === "publisher") {
    return (
      <>
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

        <div className="space-y-2">
          <SectionTitle>Bio</SectionTitle>
          <p className="text-sm leading-relaxed">{hero.bio}</p>
        </div>

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
      </>
    )
  }

  // Sponsor profile
  return (
    <>
      <div className="space-y-2">
        <SectionTitle>Bio</SectionTitle>
        <p className="text-sm leading-relaxed">{hero.bio}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {hero.verticals.map((v) => (
          <Badge key={v} variant="outline" className="text-xs">
            {v}
          </Badge>
        ))}
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
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Shared DealTermsTable — renders deal terms in a bordered table
// ─────────────────────────────────────────────────────────────

function DealTermsTable({
  request,
  dateLabel = "Schedule",
  payoutLabel = "Payout per send",
}: {
  request: PromotionRequest
  dateLabel?: string
  payoutLabel?: string
}) {
  const totalCost = request.proposedFee * request.numberOfSends
  const endDate = new Date(request.proposedDate + "T00:00:00")
  endDate.setDate(endDate.getDate() + request.numberOfSends * 7)
  const endDateStr = endDate.toISOString().split("T")[0]

  return (
    <div className="rounded-lg border">
      <Table>
        <TableBody>
          <TableRow className="hover:bg-transparent">
            <TableCell className="text-muted-foreground">{payoutLabel}</TableCell>
            <TableCell className="text-right font-medium tabular-nums">{formatCurrency(request.proposedFee)}</TableCell>
          </TableRow>
          <TableRow className="hover:bg-transparent">
            <TableCell className="text-muted-foreground">Number of sends</TableCell>
            <TableCell className="text-right">{request.numberOfSends}</TableCell>
          </TableRow>
          <TableRow className="hover:bg-transparent">
            <TableCell className="text-muted-foreground">{dateLabel}</TableCell>
            <TableCell className="text-right">{formatDate(request.proposedDate)} – {formatDate(endDateStr)}</TableCell>
          </TableRow>
          <TableRow className="border-0 bg-muted/50 hover:bg-muted/50">
            <TableCell className="text-muted-foreground">Total</TableCell>
            <TableCell className="text-right font-medium tabular-nums">{formatCurrency(totalCost)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

// Accept animation phases
type AcceptPhase = "idle" | "loading" | "success"

interface PromotionSheetProps {
  request: PromotionRequest | null
  /** The effective status to display (allows parent to override the request's own status) */
  status?: RequestStatus | null
  /** Current role viewing this request */
  role?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called when the user accepts, declines, approves, etc. */
  onStatusChange?: (requestId: string, newStatus: RequestStatus) => void
}

export function PromotionSheet({
  request,
  status,
  role = "publisher",
  open,
  onOpenChange,
  onStatusChange,
}: PromotionSheetProps) {
  // Accept animation
  const [acceptPhase, setAcceptPhase] = useState<AcceptPhase>("idle")
  const effectiveStatus = status ?? request?.status ?? null

  // Reset state when a new request opens
  function handleOpen(nextOpen: boolean) {
    if (nextOpen && request) {
      setAcceptPhase("idle")
    }
    onOpenChange(nextOpen)
  }

  function handleDecline() {
    if (request) {
      onStatusChange?.(request.id, "declined")
    }
    onOpenChange(false)
  }

  // ── Publisher accepts a pending request ──
  const handleAccept = useCallback(() => {
    if (!request) return
    setAcceptPhase("loading")
    setTimeout(() => {
      setAcceptPhase("success")
      onStatusChange?.(request.id, "accepted")
      setTimeout(() => {
        onOpenChange(false)
      }, 1000)
    }, 1200)
  }, [request, onStatusChange, onOpenChange])


  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetContent className="sm:max-w-2xl">
        {/* ── Pending: waiting on action ── */}
        {request && effectiveStatus === "pending" && (
          <PendingView
            request={request}
            role={role}
            acceptPhase={acceptPhase}
            onDecline={handleDecline}
            onAccept={handleAccept}
          />
        )}

        {/* ── Accepted: create broadcast (publisher) or waiting (sponsor) ── */}
        {request && effectiveStatus === "accepted" && (
          <AcceptedView
            request={request}
            role={role}
            onCreateBroadcast={() => {
              if (request) {
                onStatusChange?.(request.id, "scheduled")
                onOpenChange(false)
              }
            }}
          />
        )}

        {/* ── Scheduled: date set, waiting to go live ── */}
        {request && effectiveStatus === "scheduled" && (
          <ScheduledView request={request} role={role} />
        )}

        {/* ── Published (read-only) ── */}
        {request && effectiveStatus === "published" && (
          <PublishedView request={request} role={role} />
        )}

        {/* ── Paid (read-only) ── */}
        {request && effectiveStatus === "paid" && (
          <PaidView request={request} role={role} />
        )}

        {/* ── Declined (read-only) ── */}
        {request && effectiveStatus === "declined" && (
          <ClosedView request={request} role={role} statusKey="declined" />
        )}

        {/* ── Expired (read-only) ── */}
        {request && effectiveStatus === "expired" && (
          <ClosedView request={request} role={role} statusKey="expired" />
        )}
      </SheetContent>
    </Sheet>
  )
}

// ─────────────────────────────────────────────────────────────
// Pending View — request sent, waiting on the other party
// ─────────────────────────────────────────────────────────────

function PendingView({
  request,
  role,
  acceptPhase,
  onDecline,
  onAccept,
}: {
  request: PromotionRequest
  role: string
  acceptPhase: AcceptPhase
  onDecline: () => void
  onAccept: () => void
}) {
  const sponsor = getHero(request.sponsorId)
  const publisher = getHero(request.publisherId)
  const isPublisherRole = role === "publisher" || role === "both"
  const isSponsorRole = role === "sponsor"

  // Publisher sees the sponsor's campaign and can accept/decline
  // Sponsor sees publisher-initiated requests and can approve/decline
  const needsAction =
    (isPublisherRole && request.initiatedBy === "sponsor") ||
    (isSponsorRole && request.initiatedBy === "publisher")

  // Sponsor reviewing a publisher-initiated request gets the full publisher profile
  const isSponsorReviewing = isSponsorRole && request.initiatedBy === "publisher"
  // Publisher reviewing a sponsor-initiated request gets the full sponsor profile
  const isPublisherReviewing = isPublisherRole && request.initiatedBy === "sponsor"

  const totalCost = request.proposedFee * request.numberOfSends

  // End date for schedule range
  const endDate = new Date(request.proposedDate + "T00:00:00")
  endDate.setDate(endDate.getDate() + request.numberOfSends * 7)
  const endDateStr = endDate.toISOString().split("T")[0]

  // For sponsor reviewing: show the publisher. For publisher reviewing: show the sponsor.
  const headerHero = isSponsorReviewing ? publisher : sponsor
  const initials = headerHero ? headerHero.name.charAt(0) : "?"

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          {!isSponsorReviewing && !isPublisherReviewing && (
            <Avatar size="lg">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1">
            <SheetTitle className="text-lg">
              {isPublisherReviewing ? "Sponsorship request" : isSponsorReviewing ? "Promotion request" : headerHero?.name}
            </SheetTitle>
            {isSponsorReviewing && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <FileText className="size-3.5 shrink-0" />
                {request.adHeadline}
              </p>
            )}
          </div>
          {!isSponsorReviewing && !isPublisherReviewing && (
            <Badge className={BADGE_COLORS.blue}>
              {request.initiatedBy === "sponsor" ? "Inbound" : "Outbound"}
            </Badge>
          )}
          <SheetClose asChild>
            <Button variant="outline" size="icon-sm">
              <X />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <SheetBody className="space-y-4">
        {/* ── Sponsor reviewing: tabbed layout ── */}
        {isSponsorReviewing && publisher && (
          <>
            <HeroIdentity hero={publisher} showEngagement />

            <Tabs defaultValue="proposal">
              <TabsList variant="line">
                <TabsTrigger value="proposal">Proposal</TabsTrigger>
                <TabsTrigger value="about">Profile</TabsTrigger>
              </TabsList>

            <TabsContent value="proposal" className="space-y-4 pt-2">
              {/* Message from publisher */}
              <div className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center">
                  <p className="text-xs text-muted-foreground">From {publisher.name.split(" ")[0]}</p>
                  <p className="ml-auto text-xs text-muted-foreground">{formatDate(request.proposedDate)}</p>
                </div>
                <p className="text-sm leading-relaxed">{request.brief}</p>
              </div>

              {/* Deal summary */}
              <div className="rounded-lg border">
                <Table>
                  <TableBody>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="text-muted-foreground">Price per send</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{formatCurrency(request.proposedFee)}</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="text-muted-foreground">Frequency</TableCell>
                      <TableCell className="text-right">1x / week</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="text-muted-foreground">Schedule</TableCell>
                      <TableCell className="text-right">{formatDate(request.proposedDate)} – {formatDate(endDateStr)}</TableCell>
                    </TableRow>
                    <TableRow className="border-0 bg-muted/50 hover:bg-muted/50">
                      <TableCell className="text-muted-foreground">Total</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{formatCurrency(totalCost)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="about" className="space-y-6 pt-2">
              {/* Audience stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Subscribers</p>
                  <p className="text-lg font-medium tabular-nums">{formatNumber(publisher.subscriberCount)}</p>
                </div>
                <div className="rounded-lg border p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Open Rate</p>
                  <p className="text-lg font-medium tabular-nums">{publisher.openRate}%</p>
                </div>
                <div className="rounded-lg border p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Click Rate</p>
                  <p className="text-lg font-medium tabular-nums">{publisher.clickRate}%</p>
                </div>
              </div>

              <Separator />

              {/* Bio */}
              <div className="space-y-2">
                <SectionTitle>Bio</SectionTitle>
                <p className="text-sm leading-relaxed">{publisher.bio}</p>
              </div>

              {/* Links row */}
              <div className="flex flex-wrap gap-2">
                {publisher.website && (
                  <Badge variant="outline" className="text-xs">
                    <Globe className="size-3" />
                    {publisher.website.replace(/^https?:\/\//, "")}
                  </Badge>
                )}
                {publisher.socialLinks.map((link) => (
                  <Badge key={link.platform} variant="outline" className="text-xs capitalize">
                    <SocialIcon platform={link.platform} className="size-3" />
                    {link.platform}
                  </Badge>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          </>
        )}

        {/* ── Publisher reviewing: tabbed layout ── */}
        {isPublisherReviewing && sponsor && (
          <>
            <HeroIdentity hero={sponsor} />

            <Tabs defaultValue="proposal">
              <TabsList variant="line">
                <TabsTrigger value="proposal">Proposal</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="proposal" className="space-y-6 pt-2">
                {/* Message from sponsor */}
                <div className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center">
                    <p className="text-xs text-muted-foreground">From {sponsor.name.split(" ")[0]}</p>
                    <p className="ml-auto text-xs text-muted-foreground">{formatDate(request.proposedDate)}</p>
                  </div>
                  <p className="text-sm leading-relaxed">{request.brief}</p>
                </div>

                <Separator />

                {/* Ad preview */}
                <div className="space-y-2">
                  <SectionTitle>Ad preview</SectionTitle>
                  <EmailBlockPreview
                    headline={request.adHeadline}
                    body={request.adBody}
                    cta={request.adCta}
                  />
                </div>

                <Separator />

                {/* Budget */}
                <div className="space-y-2">
                  <SectionTitle>Budget</SectionTitle>
                  <div className="rounded-lg border">
                    <Table>
                      <TableBody>
                        <TableRow className="hover:bg-transparent">
                          <TableCell className="text-muted-foreground">Payout per send</TableCell>
                          <TableCell className="text-right font-medium tabular-nums">{formatCurrency(request.proposedFee)}</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-transparent">
                          <TableCell className="text-muted-foreground">Number of sends</TableCell>
                          <TableCell className="text-right">{request.numberOfSends}</TableCell>
                        </TableRow>
                        <TableRow className="hover:bg-transparent">
                          <TableCell className="text-muted-foreground">Schedule</TableCell>
                          <TableCell className="text-right">{formatDate(request.proposedDate)} – {formatDate(endDateStr)}</TableCell>
                        </TableRow>
                        <TableRow className="border-0 bg-muted/50 hover:bg-muted/50">
                          <TableCell className="text-muted-foreground">Total payout</TableCell>
                          <TableCell className="text-right font-medium tabular-nums">{formatCurrency(totalCost)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="profile" className="space-y-6 pt-2">
                {/* Bio */}
                <div className="space-y-2">
                  <SectionTitle>Bio</SectionTitle>
                  <p className="text-sm leading-relaxed">{sponsor.bio}</p>
                </div>

                {/* Niche + Links — single inline row */}
                <div className="flex flex-wrap items-center gap-2">
                  {sponsor.verticals[0] && (
                    <Badge variant="outline" className="text-xs">
                      {sponsor.verticals[0]}
                    </Badge>
                  )}
                  {sponsor.website && (
                    <Badge variant="outline" className="text-xs">
                      <Globe className="size-3" />
                      {sponsor.website.replace(/^https?:\/\//, "")}
                    </Badge>
                  )}
                  {sponsor.socialLinks.map((link) => (
                    <Badge key={link.platform} variant="outline" className="text-xs capitalize">
                      <SocialIcon platform={link.platform} className="size-3" />
                      {link.platform}
                    </Badge>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* ── Waiting view (no action needed) ── */}
        {!isSponsorReviewing && !isPublisherReviewing && (
          <>
            {/* Other party identity */}
            {headerHero && <HeroIdentity hero={headerHero} />}

            {!needsAction && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex size-8 items-center justify-center">
                    <div className="absolute inset-0 animate-ping rounded-full bg-amber-400/30" />
                    <div className="relative size-3 rounded-full bg-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Waiting for response</p>
                    <p className="text-xs text-muted-foreground">
                      You&apos;ll be notified when they respond
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Verticals */}
            {sponsor && sponsor.verticals.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {sponsor.verticals.map((v) => (
                  <Badge key={v} className={`text-xs ${BADGE_COLORS.terracotta}`}>
                    {v}
                  </Badge>
                ))}
              </div>
            )}

            {/* Brief */}
            <div className="space-y-1.5">
              <SectionTitle>Brief</SectionTitle>
              <p className="text-sm leading-relaxed">{request.brief}</p>
            </div>

            {/* Ad preview */}
            <div className="space-y-1.5">
              <SectionTitle>Ad preview</SectionTitle>
              <EmailBlockPreview
                headline={request.adHeadline}
                body={request.adBody}
                cta={request.adCta}
              />
            </div>

            {/* Deal details */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Payout</p>
                <PayoutBadge amount={request.proposedFee} />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Preferred date</p>
                <Badge className={BADGE_COLORS.blue}>
                  <CalendarBlank className="size-3" />
                  {formatDate(request.proposedDate)}
                </Badge>
              </div>
              {needsAction && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Expires</p>
                  <Badge className={BADGE_COLORS.gold}>
                    <Timer className="size-3" />
                    {getDaysRemaining(request.id)} days
                  </Badge>
                </div>
              )}
            </div>
          </>
        )}
      </SheetBody>

      {/* Sponsor reviewing: Decline / Approve · $X */}
      {isSponsorReviewing && (
        <SheetFooter>
          <Button
            variant="outline"
            onClick={onDecline}
            disabled={acceptPhase !== "idle"}
          >
            Decline
          </Button>
          {acceptPhase === "success" ? (
            <Button className="bg-emerald-600 hover:bg-emerald-600 text-white" disabled>
              <Check weight="bold" className="size-4" />
              Approved
            </Button>
          ) : (
            <Button loading={acceptPhase === "loading"} onClick={onAccept}>
              {acceptPhase === "loading" ? "Approving..." : "Approve"}
            </Button>
          )}
        </SheetFooter>
      )}

      {/* Publisher needs to act: Accept/Decline */}
      {needsAction && !isSponsorReviewing && (
        <SheetFooter>
          <Button
            variant="outline"
            onClick={onDecline}
            disabled={acceptPhase !== "idle"}
          >
            Decline
          </Button>
          {acceptPhase === "success" ? (
            <Button className="bg-emerald-600 hover:bg-emerald-600 text-white" disabled>
              <Check weight="bold" className="size-4" />
              Approved
            </Button>
          ) : (
            <Button loading={acceptPhase === "loading"} onClick={onAccept}>
              {acceptPhase === "loading" ? "Accepting..." : "Accept"}
            </Button>
          )}
        </SheetFooter>
      )}

      {/* No action needed (read-only) */}
      {!needsAction && !isSponsorReviewing && (
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Accepted View — publisher picks date, or sponsor approves
// ─────────────────────────────────────────────────────────────

function AcceptedView({
  request,
  role,
  onCreateBroadcast,
}: {
  request: PromotionRequest
  role: string
  onCreateBroadcast: () => void
}) {
  const [showBroadcastDialog, setShowBroadcastDialog] = useState(false)
  const sponsor = getHero(request.sponsorId)
  const publisher = getHero(request.publisherId)
  const isPublisherRole = role === "publisher" || role === "both"
  const isSponsorRole = !isPublisherRole
  const totalCost = request.proposedFee * request.numberOfSends

  // End date for schedule range
  const endDate = new Date(request.proposedDate + "T00:00:00")
  endDate.setDate(endDate.getDate() + request.numberOfSends * 7)
  const endDateStr = endDate.toISOString().split("T")[0]

  // Other party: publisher sees sponsor, sponsor sees publisher
  const otherHero = isPublisherRole ? sponsor : publisher

  // Success banner copy depends on flow
  const bannerCopy = isPublisherRole
    ? "You accepted this campaign"
    : request.initiatedBy === "sponsor"
      ? `${publisher?.name} accepted your request`
      : `You approved ${publisher?.name}'s proposal`

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SheetTitle className="text-lg">
              {isPublisherRole ? "Create broadcast" : "Deal accepted"}
            </SheetTitle>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <FileText className="size-3.5 shrink-0" />
              {request.adHeadline}
            </p>
          </div>
          <Badge variant="secondary" className={getStatusColor("accepted")}>
            {STATUS_LABELS.accepted}
          </Badge>
          <SheetClose asChild>
            <Button variant="outline" size="icon-sm">
              <X />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <SheetBody className="space-y-4">
        {otherHero && <HeroIdentity hero={otherHero} showEngagement={isSponsorRole} />}

        {/* ── Sponsor view: tabbed layout with waiting state ── */}
        {isSponsorRole && publisher ? (
          <Tabs defaultValue="details">
            <TabsList variant="line">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 pt-2">
              {/* Success banner */}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/50">
                <div className="flex items-center gap-2">
                  <CheckCircle weight="fill" className="size-5 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    {bannerCopy}
                  </p>
                </div>
              </div>

              {/* Waiting indicator */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="relative flex size-8 items-center justify-center">
                    <div className="absolute inset-0 animate-ping rounded-full bg-amber-400/30" />
                    <div className="relative size-3 rounded-full bg-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Waiting for {publisher.name.split(" ")[0]} to create the broadcast</p>
                    <p className="text-xs text-muted-foreground">
                      You&apos;ll be notified when it&apos;s scheduled
                    </p>
                  </div>
                </div>
              </div>

              {/* Ad preview */}
              <EmailBlockPreview
                headline={request.adHeadline}
                body={request.adBody}
                cta={request.adCta}
              />

              {/* Deal terms table */}
              <div className="rounded-lg border">
                <Table>
                  <TableBody>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="text-muted-foreground">Payout per send</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{formatCurrency(request.proposedFee)}</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="text-muted-foreground">Number of sends</TableCell>
                      <TableCell className="text-right">{request.numberOfSends}</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell className="text-muted-foreground">Schedule</TableCell>
                      <TableCell className="text-right">{formatDate(request.proposedDate)} – {formatDate(endDateStr)}</TableCell>
                    </TableRow>
                    <TableRow className="border-0 bg-muted/50 hover:bg-muted/50">
                      <TableCell className="text-muted-foreground">Total</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">{formatCurrency(totalCost)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6 pt-2">
              <ProfileTab hero={publisher} heroType="publisher" />
            </TabsContent>
          </Tabs>
        ) : (
          <>
            {/* ── Publisher view: Create Broadcast flow ── */}
            {/* Success banner */}
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/50">
              <div className="flex items-center gap-2">
                <CheckCircle weight="fill" className="size-5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                  {bannerCopy}
                </p>
              </div>
            </div>

            {/* Ad preview */}
            <EmailBlockPreview
              headline={request.adHeadline}
              body={request.adBody}
              cta={request.adCta}
            />

            {/* Deal terms table */}
            <div className="rounded-lg border">
              <Table>
                <TableBody>
                  <TableRow className="hover:bg-transparent">
                    <TableCell className="text-muted-foreground">Payout per send</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{formatCurrency(request.proposedFee)}</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableCell className="text-muted-foreground">Number of sends</TableCell>
                    <TableCell className="text-right">{request.numberOfSends}</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent">
                    <TableCell className="text-muted-foreground">Schedule</TableCell>
                    <TableCell className="text-right">{formatDate(request.proposedDate)} – {formatDate(endDateStr)}</TableCell>
                  </TableRow>
                  <TableRow className="border-0 bg-muted/50 hover:bg-muted/50">
                    <TableCell className="text-muted-foreground">Total payout</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{formatCurrency(totalCost)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </SheetBody>

      {/* Publisher: Create Broadcast CTA */}
      {isPublisherRole && (
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
          <Button onClick={() => setShowBroadcastDialog(true)}>
            <Broadcast className="size-4" />
            Create Broadcast
          </Button>
        </SheetFooter>
      )}

      {/* Sponsor: just close */}
      {isSponsorRole && (
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      )}

      {/* Create Broadcast dialog */}
      <Dialog open={showBroadcastDialog} onOpenChange={setShowBroadcastDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create your broadcast</DialogTitle>
            <DialogDescription>
              We&apos;ll open a new email broadcast in your Kajabi account. Your template is ready with the <span className="font-medium text-foreground">{request.adHeadline}</span> ad already placed, and the send schedule is synced. All you need to do is write your email.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBroadcastDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setShowBroadcastDialog(false)
              onCreateBroadcast()
            }}>
              <ArrowSquareOut className="size-4" />
              Go to Kajabi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Scheduled View — date is set, waiting to go live
// ─────────────────────────────────────────────────────────────

function ScheduledView({
  request,
  role,
}: {
  request: PromotionRequest
  role: string
}) {
  const isPublisherRole = role === "publisher" || role === "both"
  const otherHero = isPublisherRole
    ? getHero(request.sponsorId)
    : getHero(request.publisherId)
  const heroType = isPublisherRole ? "sponsor" : "publisher"

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SheetTitle className="text-lg">Scheduled</SheetTitle>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <FileText className="size-3.5 shrink-0" />
              {request.adHeadline}
            </p>
          </div>
          <Badge variant="secondary" className={getStatusColor("scheduled")}>
            {STATUS_LABELS.scheduled}
          </Badge>
          <SheetClose asChild>
            <Button variant="outline" size="icon-sm">
              <X />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <SheetBody className="space-y-4">
        {otherHero && <HeroIdentity hero={otherHero} showEngagement={heroType === "publisher"} />}

        <Tabs defaultValue="details">
          <TabsList variant="line">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-2">
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <Clock className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    Scheduled for {formatDate(request.proposedDate)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Approved and ready to go live
                  </p>
                </div>
              </div>
            </div>

            <EmailBlockPreview
              headline={request.adHeadline}
              body={request.adBody}
              cta={request.adCta}
            />

            <DealTermsTable request={request} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 pt-2">
            {otherHero && <ProfileTab hero={otherHero} heroType={heroType} />}
          </TabsContent>
        </Tabs>
      </SheetBody>

      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Published View (read-only)
// ─────────────────────────────────────────────────────────────

function PublishedView({ request, role }: { request: PromotionRequest; role: string }) {
  const isPublisherRole = role === "publisher" || role === "both"
  const otherHero = isPublisherRole
    ? getHero(request.sponsorId)
    : getHero(request.publisherId)
  const heroType = isPublisherRole ? "sponsor" : "publisher"

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SheetTitle className="text-lg">Published</SheetTitle>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <FileText className="size-3.5 shrink-0" />
              {request.adHeadline}
            </p>
          </div>
          <Badge variant="secondary" className={getStatusColor("published")}>
            {STATUS_LABELS.published}
          </Badge>
          <SheetClose asChild>
            <Button variant="outline" size="icon-sm">
              <X />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <SheetBody className="space-y-4">
        {otherHero && <HeroIdentity hero={otherHero} showEngagement={heroType === "publisher"} />}

        <Tabs defaultValue="details">
          <TabsList variant="line">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-2">
            <EmailBlockPreview
              headline={request.adHeadline}
              body={request.adBody}
              cta={request.adCta}
            />

            <DealTermsTable request={request} dateLabel="Published on" />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 pt-2">
            {otherHero && <ProfileTab hero={otherHero} heroType={heroType} />}
          </TabsContent>
        </Tabs>
      </SheetBody>

      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Paid View (read-only)
// ─────────────────────────────────────────────────────────────

function PaidView({ request, role }: { request: PromotionRequest; role: string }) {
  const isPublisherRole = role === "publisher" || role === "both"
  const otherHero = isPublisherRole
    ? getHero(request.sponsorId)
    : getHero(request.publisherId)
  const heroType = isPublisherRole ? "sponsor" : "publisher"

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SheetTitle className="text-lg">Paid</SheetTitle>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <FileText className="size-3.5 shrink-0" />
              {request.adHeadline}
            </p>
          </div>
          <Badge variant="secondary" className={getStatusColor("paid")}>
            {STATUS_LABELS.paid}
          </Badge>
          <SheetClose asChild>
            <Button variant="outline" size="icon-sm">
              <X />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <SheetBody className="space-y-4">
        {otherHero && <HeroIdentity hero={otherHero} showEngagement={heroType === "publisher"} />}

        <Tabs defaultValue="details">
          <TabsList variant="line">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-2">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/50">
              <div className="flex items-center gap-2">
                <CheckCircle weight="fill" className="size-5 text-emerald-600 dark:text-emerald-400" />
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                  Payment cleared
                </p>
              </div>
            </div>

            <EmailBlockPreview
              headline={request.adHeadline}
              body={request.adBody}
              cta={request.adCta}
            />

            <DealTermsTable request={request} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 pt-2">
            {otherHero && <ProfileTab hero={otherHero} heroType={heroType} />}
          </TabsContent>
        </Tabs>
      </SheetBody>

      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Closed View (declined / expired — read-only)
// ─────────────────────────────────────────────────────────────

function ClosedView({
  request,
  role,
  statusKey,
}: {
  request: PromotionRequest
  role: string
  statusKey: "declined" | "expired"
}) {
  const isPublisherRole = role === "publisher" || role === "both"
  const otherHero = isPublisherRole
    ? getHero(request.sponsorId)
    : getHero(request.publisherId)
  const heroType = isPublisherRole ? "sponsor" : "publisher"

  const bannerCopy = statusKey === "declined"
    ? "This request was declined"
    : "This request has expired"

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <SheetTitle className="text-lg">{STATUS_LABELS[statusKey]}</SheetTitle>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <FileText className="size-3.5 shrink-0" />
              {request.adHeadline}
            </p>
          </div>
          <Badge variant="secondary" className={getStatusColor(statusKey)}>
            {STATUS_LABELS[statusKey]}
          </Badge>
          <SheetClose asChild>
            <Button variant="outline" size="icon-sm">
              <X />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <SheetBody className="space-y-4">
        {otherHero && <HeroIdentity hero={otherHero} showEngagement={heroType === "publisher"} />}

        <Tabs defaultValue="details">
          <TabsList variant="line">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-2">
            {/* Status banner */}
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">{bannerCopy}</p>
            </div>

            <EmailBlockPreview
              headline={request.adHeadline}
              body={request.adBody}
              cta={request.adCta}
            />

            <DealTermsTable request={request} payoutLabel="Proposed payout" />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6 pt-2">
            {otherHero && <ProfileTab hero={otherHero} heroType={heroType} />}
          </TabsContent>
        </Tabs>
      </SheetBody>

      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}
