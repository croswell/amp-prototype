"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { EmailBlockPreview } from "@/components/email-block-preview"
import { CalendarBlank, Timer } from "@phosphor-icons/react"
import {
  type RequestStatus,
  type PromotionRequest,
  getHero,
  formatCurrency,
  getStatusColor,
  STATUS_LABELS,
} from "@/lib/mock-data"

// Palette color pairs: light palette color as bg tint, darkened text for contrast
export const BADGE_COLORS = {
  green: "bg-[#CBD7CC]/50 text-[#2A3D35] dark:bg-[#405B50]/40 dark:text-[#CBD7CC]",
  greenOutline: "text-[#405B50] dark:text-[#CBD7CC]",
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

type DialogStep = "brief" | "edit"

interface PromotionSheetProps {
  request: PromotionRequest | null
  /** The effective status to display (allows parent to override the request's own status) */
  status?: RequestStatus | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called when the user dismisses or schedules, passing the new status */
  onStatusChange?: (requestId: string, newStatus: RequestStatus) => void
}

export function PromotionSheet({
  request,
  status,
  open,
  onOpenChange,
  onStatusChange,
}: PromotionSheetProps) {
  const [dialogStep, setDialogStep] = useState<DialogStep>("brief")
  const [editedHeadline, setEditedHeadline] = useState("")
  const [editedBody, setEditedBody] = useState("")
  const [editedCta, setEditedCta] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")

  // Reset editable state when a new request opens
  const effectiveStatus = status ?? request?.status ?? null

  function handleOpen(nextOpen: boolean) {
    if (nextOpen && request) {
      setEditedHeadline(request.adHeadline)
      setEditedBody(request.adBody)
      setEditedCta(request.adCta)
      setScheduledDate(request.proposedDate)
      setDialogStep("brief")
    }
    onOpenChange(nextOpen)
  }

  function handleDismiss() {
    if (request) {
      onStatusChange?.(request.id, "expired")
    }
    onOpenChange(false)
  }

  function handleSchedule() {
    if (request) {
      onStatusChange?.(request.id, "accepted")
    }
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto p-6">
        {request && effectiveStatus === "inbox" && dialogStep === "brief" && (
          <BriefStep
            request={request}
            onDismiss={handleDismiss}
            onAccept={() => setDialogStep("edit")}
          />
        )}
        {request && effectiveStatus === "inbox" && dialogStep === "edit" && (
          <EditStep
            headline={editedHeadline}
            body={editedBody}
            cta={editedCta}
            scheduledDate={scheduledDate}
            onHeadlineChange={setEditedHeadline}
            onBodyChange={setEditedBody}
            onCtaChange={setEditedCta}
            onDateChange={setScheduledDate}
            onBack={() => setDialogStep("brief")}
            onSchedule={handleSchedule}
          />
        )}
        {request && effectiveStatus === "accepted" && (
          <AcceptedView request={request} />
        )}
        {request && effectiveStatus === "published" && (
          <PublishedView request={request} />
        )}
        {request && effectiveStatus === "expired" && (
          <ExpiredView request={request} />
        )}
      </SheetContent>
    </Sheet>
  )
}

// ─────────────────────────────────────────────────────────────
// Sheet step components
// ─────────────────────────────────────────────────────────────

function BriefStep({
  request,
  onDismiss,
  onAccept,
}: {
  request: PromotionRequest
  onDismiss: () => void
  onAccept: () => void
}) {
  const sponsor = getHero(request.sponsorId)
  const initials = sponsor
    ? sponsor.name.split(" ").map((n) => n[0]).join("")
    : "?"

  return (
    <>
      <SheetHeader>
        <SheetTitle>{request.adHeadline}</SheetTitle>
        <SheetDescription>Review this sponsorship request</SheetDescription>
      </SheetHeader>

      <div className="space-y-4">
        {/* Sponsor info */}
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{sponsor?.name}</p>
            <p className="text-xs text-muted-foreground">{sponsor?.tagline}</p>
          </div>
        </div>

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

        <Separator />

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
            <Badge variant="outline" className={`${BADGE_COLORS.greenOutline} tabular-nums`}>
              {formatCurrency(request.proposedFee)}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Preferred date</p>
            <Badge className={BADGE_COLORS.blue}>
              <CalendarBlank className="size-3" />
              {formatDate(request.proposedDate)}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Expires</p>
            <Badge className={BADGE_COLORS.gold}>
              <Timer className="size-3" />
              {getDaysRemaining(request.id)} days
            </Badge>
          </div>
        </div>
      </div>

      <SheetFooter>
        <Button variant="outline" onClick={onDismiss}>
          Dismiss
        </Button>
        <Button onClick={onAccept}>
          Accept & Review
        </Button>
      </SheetFooter>
    </>
  )
}

function EditStep({
  headline,
  body,
  cta,
  scheduledDate,
  onHeadlineChange,
  onBodyChange,
  onCtaChange,
  onDateChange,
  onBack,
  onSchedule,
}: {
  headline: string
  body: string
  cta: string
  scheduledDate: string
  onHeadlineChange: (v: string) => void
  onBodyChange: (v: string) => void
  onCtaChange: (v: string) => void
  onDateChange: (v: string) => void
  onBack: () => void
  onSchedule: () => void
}) {
  return (
    <>
      <SheetHeader>
        <SheetTitle>Edit & Schedule</SheetTitle>
        <SheetDescription>
          Adjust the ad copy and pick a send date for your newsletter.
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium">Headline</label>
          <Input
            value={headline}
            onChange={(e) => onHeadlineChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium">Body</label>
          <Textarea
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium">Call to action</label>
          <Input
            value={cta}
            onChange={(e) => onCtaChange(e.target.value)}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <label className="text-xs font-medium">Send date</label>
          <Input
            type="date"
            value={scheduledDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </div>

      <SheetFooter>
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onSchedule}>
          Schedule
        </Button>
      </SheetFooter>
    </>
  )
}

function AcceptedView({ request }: { request: PromotionRequest }) {
  const sponsor = getHero(request.sponsorId)
  const initials = sponsor
    ? sponsor.name.split(" ").map((n) => n[0]).join("")
    : "?"

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-2">
          <SheetTitle className="flex-1">{request.adHeadline}</SheetTitle>
          <Badge variant="secondary" className={getStatusColor("accepted")}>
            {STATUS_LABELS.accepted}
          </Badge>
        </div>
      </SheetHeader>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <p className="text-sm font-medium">{sponsor?.name}</p>
        </div>

        <EmailBlockPreview
          headline={request.adHeadline}
          body={request.adBody}
          cta={request.adCta}
        />

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Payout</p>
            <Badge variant="outline" className={`${BADGE_COLORS.greenOutline} tabular-nums`}>
              {formatCurrency(request.proposedFee)}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Scheduled for</p>
            <Badge className={BADGE_COLORS.blue}>
              <CalendarBlank className="size-3" />
              {formatDate(request.proposedDate)}
            </Badge>
          </div>
        </div>
      </div>

      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}

function PublishedView({ request }: { request: PromotionRequest }) {
  const sponsor = getHero(request.sponsorId)
  const initials = sponsor
    ? sponsor.name.split(" ").map((n) => n[0]).join("")
    : "?"

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-2">
          <SheetTitle className="flex-1">{request.adHeadline}</SheetTitle>
          <Badge variant="secondary" className={getStatusColor("published")}>
            {STATUS_LABELS.published}
          </Badge>
        </div>
      </SheetHeader>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <p className="text-sm font-medium">{sponsor?.name}</p>
        </div>

        <EmailBlockPreview
          headline={request.adHeadline}
          body={request.adBody}
          cta={request.adCta}
        />

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Payout</p>
            <Badge variant="outline" className={`${BADGE_COLORS.greenOutline} tabular-nums`}>
              {formatCurrency(request.proposedFee)}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Published on</p>
            <Badge className={BADGE_COLORS.blue}>
              <CalendarBlank className="size-3" />
              {formatDate(request.proposedDate)}
            </Badge>
          </div>
        </div>
      </div>

      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}

function ExpiredView({ request }: { request: PromotionRequest }) {
  const sponsor = getHero(request.sponsorId)
  const initials = sponsor
    ? sponsor.name.split(" ").map((n) => n[0]).join("")
    : "?"

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-2">
          <SheetTitle className="flex-1">{request.adHeadline}</SheetTitle>
          <Badge variant="secondary" className={getStatusColor("expired")}>
            {STATUS_LABELS.expired}
          </Badge>
        </div>
      </SheetHeader>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{sponsor?.name}</p>
            <p className="text-xs text-muted-foreground">{sponsor?.tagline}</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Original brief</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{request.brief}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Proposed payout</p>
            <Badge variant="outline" className={`${BADGE_COLORS.greenOutline} tabular-nums`}>
              {formatCurrency(request.proposedFee)}
            </Badge>
          </div>
        </div>
      </div>

      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </>
  )
}
