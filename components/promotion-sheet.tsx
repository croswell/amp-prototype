"use client"

import { useState, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { EmailBlockPreview } from "@/components/email-block-preview"
import { PayoutBadge } from "@/components/payout-badge"
import { CalendarBlank, Timer, X, Check, CheckCircle, Clock } from "@phosphor-icons/react"
import {
  type RequestStatus,
  type PromotionRequest,
  getHero,
  getStatusColor,
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
  // Date picker for scheduling
  const [scheduledDate, setScheduledDate] = useState("")

  const effectiveStatus = status ?? request?.status ?? null

  // Reset state when a new request opens
  function handleOpen(nextOpen: boolean) {
    if (nextOpen && request) {
      setAcceptPhase("idle")
      setScheduledDate(request.proposedDate)
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

  // ── Publisher picks a date and schedules ──
  function handleSchedule() {
    if (!request) return
    onStatusChange?.(request.id, "scheduled")
    onOpenChange(false)
  }

  // ── Sponsor approves a publisher's scheduled request ──
  function handleSponsorApprove() {
    if (!request) return
    onStatusChange?.(request.id, "scheduled")
    onOpenChange(false)
  }

  // ── Sponsor declines ──
  function handleSponsorDecline() {
    if (!request) return
    onStatusChange?.(request.id, "declined")
    onOpenChange(false)
  }

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

        {/* ── Accepted: pick schedule date ── */}
        {request && effectiveStatus === "accepted" && (
          <AcceptedView
            request={request}
            role={role}
            scheduledDate={scheduledDate}
            onDateChange={setScheduledDate}
            onSchedule={handleSchedule}
            onSponsorApprove={handleSponsorApprove}
            onSponsorDecline={handleSponsorDecline}
          />
        )}

        {/* ── Scheduled: date set, waiting to go live ── */}
        {request && effectiveStatus === "scheduled" && (
          <ScheduledView request={request} role={role} />
        )}

        {/* ── Published (read-only) ── */}
        {request && effectiveStatus === "published" && (
          <PublishedView request={request} />
        )}

        {/* ── Paid (read-only) ── */}
        {request && effectiveStatus === "paid" && (
          <PaidView request={request} />
        )}

        {/* ── Declined (read-only) ── */}
        {request && effectiveStatus === "declined" && (
          <ClosedView request={request} statusKey="declined" />
        )}

        {/* ── Expired (read-only) ── */}
        {request && effectiveStatus === "expired" && (
          <ClosedView request={request} statusKey="expired" />
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

  // Publisher sees the sponsor's campaign and can accept/decline
  // Sponsor sees "waiting on publisher" read-only
  const needsAction =
    (isPublisherRole && request.initiatedBy === "sponsor") ||
    (!isPublisherRole && request.initiatedBy === "publisher")

  const otherHero = needsAction
    ? (request.initiatedBy === "sponsor" ? sponsor : publisher)
    : (request.initiatedBy === "sponsor" ? publisher : sponsor)
  const initials = sponsor ? sponsor.name.charAt(0) : "?"

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <SheetTitle className="text-lg">{sponsor?.name}</SheetTitle>
          </div>
          <Badge className={BADGE_COLORS.blue}>
            {request.initiatedBy === "sponsor" ? "Inbound" : "Outbound"}
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
        {/* If you're waiting (sponsor sent it, you're the sponsor viewing) */}
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
          <p className="text-xs font-medium text-muted-foreground">Brief</p>
          <p className="text-sm leading-relaxed">{request.brief}</p>
        </div>

        {/* Ad preview */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Ad preview</p>
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
      </SheetBody>

      {needsAction && (
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
              Accepted
            </Button>
          ) : (
            <Button loading={acceptPhase === "loading"} onClick={onAccept}>
              {acceptPhase === "loading" ? "Accepting..." : "Accept"}
            </Button>
          )}
        </SheetFooter>
      )}

      {!needsAction && (
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
  scheduledDate,
  onDateChange,
  onSchedule,
  onSponsorApprove,
  onSponsorDecline,
}: {
  request: PromotionRequest
  role: string
  scheduledDate: string
  onDateChange: (v: string) => void
  onSchedule: () => void
  onSponsorApprove: () => void
  onSponsorDecline: () => void
}) {
  const sponsor = getHero(request.sponsorId)
  const publisher = getHero(request.publisherId)
  const isPublisherRole = role === "publisher" || role === "both"
  const initials = sponsor ? sponsor.name.charAt(0) : "?"

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <SheetTitle className="flex-1 text-lg">{sponsor?.name}</SheetTitle>
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
        {/* Success banner */}
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/50">
          <div className="flex items-center gap-2">
            <CheckCircle weight="fill" className="size-5 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              {isPublisherRole ? "You accepted this campaign" : `${publisher?.name ?? "Publisher"} accepted your campaign`}
            </p>
          </div>
        </div>

        {/* Ad preview */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Ad</p>
          <EmailBlockPreview
            headline={request.adHeadline}
            body={request.adBody}
            cta={request.adCta}
          />
        </div>

        {/* Publisher picks a date */}
        {isPublisherRole && (
          <div className="space-y-2">
            <label className="text-xs font-medium">Pick a send date</label>
            <Input
              type="date"
              value={scheduledDate}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>
        )}

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
        </div>
      </SheetBody>

      {/* Publisher: schedule it */}
      {isPublisherRole && (
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
          <Button onClick={onSchedule}>
            Schedule
          </Button>
        </SheetFooter>
      )}

      {/* Sponsor: approve/decline the publisher's acceptance */}
      {!isPublisherRole && (
        <SheetFooter>
          <Button variant="outline" onClick={onSponsorDecline}>
            Decline
          </Button>
          <Button onClick={onSponsorApprove}>
            Approve
          </Button>
        </SheetFooter>
      )}
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
  const sponsor = getHero(request.sponsorId)
  const initials = sponsor ? sponsor.name.charAt(0) : "?"

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <SheetTitle className="flex-1 text-lg">{sponsor?.name}</SheetTitle>
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

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Payout</p>
            <PayoutBadge amount={request.proposedFee} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Send date</p>
            <Badge className={BADGE_COLORS.blue}>
              <CalendarBlank className="size-3" />
              {formatDate(request.proposedDate)}
            </Badge>
          </div>
        </div>
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

function PublishedView({ request }: { request: PromotionRequest }) {
  const sponsor = getHero(request.sponsorId)
  const initials = sponsor ? sponsor.name.charAt(0) : "?"

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <SheetTitle className="flex-1 text-lg">{sponsor?.name}</SheetTitle>
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
        <EmailBlockPreview
          headline={request.adHeadline}
          body={request.adBody}
          cta={request.adCta}
        />

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Payout</p>
            <PayoutBadge amount={request.proposedFee} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Published on</p>
            <Badge className={BADGE_COLORS.blue}>
              <CalendarBlank className="size-3" />
              {formatDate(request.proposedDate)}
            </Badge>
          </div>
        </div>
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

function PaidView({ request }: { request: PromotionRequest }) {
  const sponsor = getHero(request.sponsorId)
  const initials = sponsor ? sponsor.name.charAt(0) : "?"

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <SheetTitle className="flex-1 text-lg">{sponsor?.name}</SheetTitle>
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

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Payout</p>
            <PayoutBadge amount={request.proposedFee} />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Published on</p>
            <Badge className={BADGE_COLORS.blue}>
              <CalendarBlank className="size-3" />
              {formatDate(request.proposedDate)}
            </Badge>
          </div>
        </div>
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
  statusKey,
}: {
  request: PromotionRequest
  statusKey: "declined" | "expired"
}) {
  const sponsor = getHero(request.sponsorId)
  const initials = sponsor ? sponsor.name.charAt(0) : "?"

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <SheetTitle className="flex-1 text-lg">{sponsor?.name}</SheetTitle>
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
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Original brief</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{request.brief}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Proposed payout</p>
            <PayoutBadge amount={request.proposedFee} />
          </div>
        </div>
      </SheetBody>

      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}
