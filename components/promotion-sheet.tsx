"use client"

import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { PayoutBadge } from "@/components/payout-badge"
import { WorkspaceStepIndicator } from "@/components/workspace-step-indicator"
import { CalendarBlank, Timer, X, Check, CheckCircle, Clock, PencilLine } from "@phosphor-icons/react"
import {
  type RequestStatus,
  type WorkspaceStep,
  type PromotionRequest,
  getHero,
  formatCurrency,
  getStatusColor,
  STATUS_LABELS,
  WORKSPACE_STEP_LABELS,
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
type AcceptPhase = "idle" | "loading" | "success" | "transitioning"

interface PromotionSheetProps {
  request: PromotionRequest | null
  /** The effective status to display (allows parent to override the request's own status) */
  status?: RequestStatus | null
  /** Current role viewing this request */
  role?: string
  /** Current workspace step (for accepted requests) */
  workspaceStep?: WorkspaceStep | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called when the user dismisses or schedules, passing the new status */
  onStatusChange?: (requestId: string, newStatus: RequestStatus) => void
  /** Called when workspace step changes */
  onWorkspaceStepChange?: (requestId: string, newStep: WorkspaceStep) => void
}

export function PromotionSheet({
  request,
  status,
  role = "publisher",
  workspaceStep: workspaceStepProp,
  open,
  onOpenChange,
  onStatusChange,
  onWorkspaceStepChange,
}: PromotionSheetProps) {
  // Form state
  const [editedHeadline, setEditedHeadline] = useState("")
  const [editedBody, setEditedBody] = useState("")
  const [editedCta, setEditedCta] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")

  // Accept animation
  const [acceptPhase, setAcceptPhase] = useState<AcceptPhase>("idle")

  // Content cross-fade: controls what's actually rendered after the accept animation
  const [showWorkspace, setShowWorkspace] = useState(false)
  const [bodyVisible, setBodyVisible] = useState(true)

  // Publish success state
  const [publishSuccess, setPublishSuccess] = useState(false)

  // Sponsor feedback note (for "Request Changes")
  const [feedbackNote, setFeedbackNote] = useState("")

  const effectiveStatus = status ?? request?.status ?? null
  const effectiveWorkspaceStep = workspaceStepProp ?? request?.workspaceStep ?? null

  // Reset state when a new request opens
  function handleOpen(nextOpen: boolean) {
    if (nextOpen && request) {
      setEditedHeadline(request.adHeadline)
      setEditedBody(request.adBody)
      setEditedCta(request.adCta)
      setScheduledDate(request.proposedDate)
      setAcceptPhase("idle")
      setShowWorkspace(false)
      setBodyVisible(true)
      setPublishSuccess(false)
      setFeedbackNote("")
    }
    onOpenChange(nextOpen)
  }

  function handleDismiss() {
    if (request) {
      onStatusChange?.(request.id, "expired")
    }
    onOpenChange(false)
  }

  // ── Accept animation chain ──
  // Phase 1: loading (1.2s) → Phase 2: success (1s) → Phase 3: cross-fade
  const handleAccept = useCallback(() => {
    if (!request) return

    // Phase 1: loading
    setAcceptPhase("loading")

    setTimeout(() => {
      // Phase 2: success
      setAcceptPhase("success")

      setTimeout(() => {
        // Phase 3: fade out brief, swap content, fade in workspace
        setAcceptPhase("transitioning")
        setBodyVisible(false) // start fade-out

        setTimeout(() => {
          // Swap content while invisible
          setShowWorkspace(true)
          // Update parent state
          onStatusChange?.(request.id, "accepted")
          onWorkspaceStepChange?.(request.id, "edit")

          // Fade in after a tick
          requestAnimationFrame(() => {
            setBodyVisible(true)
          })
        }, 300) // wait for fade-out
      }, 1000) // success visible for 1s
    }, 1200) // loading for 1.2s
  }, [request, onStatusChange, onWorkspaceStepChange])

  // ── Workspace step handlers ──
  function handleSubmitForReview() {
    if (!request) return
    onWorkspaceStepChange?.(request.id, "in-review")
  }

  function handleSponsorApprove() {
    if (!request) return
    onWorkspaceStepChange?.(request.id, "approved")
  }

  function handleSponsorRequestChanges() {
    if (!request) return
    // Set notes on the request (in a real app this would persist)
    // For the prototype, the parent tracks the step change
    onWorkspaceStepChange?.(request.id, "changes-requested")
  }

  function handlePublish() {
    if (!request) return
    setPublishSuccess(true)
    setTimeout(() => {
      onStatusChange?.(request.id, "published")
      onOpenChange(false)
    }, 1500)
  }

  // Determine what to render
  const isInbox = effectiveStatus === "inbox" && !showWorkspace
  const isAcceptedWorkspace = effectiveStatus === "accepted" || showWorkspace
  const isSponsorReviewing =
    role === "sponsor" &&
    effectiveStatus === "accepted" &&
    (effectiveWorkspaceStep === "in-review" || effectiveWorkspaceStep === "edit")

  return (
    <Sheet open={open} onOpenChange={handleOpen}>
      <SheetContent className="sm:max-w-2xl">
        {/* ── Inbox: Brief with accept animation ── */}
        {request && isInbox && (
          <BriefStep
            request={request}
            acceptPhase={acceptPhase}
            bodyVisible={bodyVisible}
            onDismiss={handleDismiss}
            onAccept={handleAccept}
          />
        )}

        {/* ── Accepted: Workspace (publisher view) ── */}
        {request && isAcceptedWorkspace && !isSponsorReviewing && !publishSuccess && (
          <WorkspaceView
            request={request}
            workspaceStep={effectiveWorkspaceStep ?? "edit"}
            bodyVisible={bodyVisible}
            headline={editedHeadline}
            body={editedBody}
            cta={editedCta}
            scheduledDate={scheduledDate}
            onHeadlineChange={setEditedHeadline}
            onBodyChange={setEditedBody}
            onCtaChange={setEditedCta}
            onDateChange={setScheduledDate}
            onSubmitForReview={handleSubmitForReview}
            onGoToEdit={() => request && onWorkspaceStepChange?.(request.id, "edit")}
            onPublish={handlePublish}
          />
        )}

        {/* ── Accepted: Sponsor review view ── */}
        {request && isSponsorReviewing && !publishSuccess && (
          <SponsorReviewStep
            request={request}
            feedbackNote={feedbackNote}
            onFeedbackNoteChange={setFeedbackNote}
            onApprove={handleSponsorApprove}
            onRequestChanges={handleSponsorRequestChanges}
          />
        )}

        {/* ── Publish success ── */}
        {request && publishSuccess && (
          <PublishSuccessView />
        )}

        {/* ── Published (read-only) ── */}
        {request && effectiveStatus === "published" && !publishSuccess && !showWorkspace && (
          <PublishedView request={request} />
        )}

        {/* ── Expired (read-only) ── */}
        {request && effectiveStatus === "expired" && (
          <ExpiredView request={request} />
        )}
      </SheetContent>
    </Sheet>
  )
}

// ─────────────────────────────────────────────────────────────
// Brief Step (inbox) — with accept animation
// ─────────────────────────────────────────────────────────────

function BriefStep({
  request,
  acceptPhase,
  bodyVisible,
  onDismiss,
  onAccept,
}: {
  request: PromotionRequest
  acceptPhase: AcceptPhase
  bodyVisible: boolean
  onDismiss: () => void
  onAccept: () => void
}) {
  const sponsor = getHero(request.sponsorId)
  const publisher = getHero(request.publisherId)
  const initials = sponsor ? sponsor.name.charAt(0) : "?"
  const isInbound = request.initiatedBy === "sponsor"

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
          {isInbound && (
            <Badge className={BADGE_COLORS.blue}>Inbound request</Badge>
          )}
          <SheetClose asChild>
            <Button variant="outline" size="icon-sm">
              <X />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <div
        className="transition-opacity duration-300"
        style={{ opacity: bodyVisible ? 1 : 0 }}
      >
        <SheetBody className="space-y-4">
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
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Expires</p>
              <Badge className={BADGE_COLORS.gold}>
                <Timer className="size-3" />
                {getDaysRemaining(request.id)} days
              </Badge>
            </div>
          </div>
        </SheetBody>
      </div>

      <SheetFooter>
        <Button
          variant="outline"
          onClick={onDismiss}
          disabled={acceptPhase !== "idle"}
        >
          Dismiss
        </Button>
        <AcceptButton phase={acceptPhase} onClick={onAccept} />
      </SheetFooter>
    </>
  )
}

// ── Accept button with animation states ──

function AcceptButton({ phase, onClick }: { phase: AcceptPhase; onClick: () => void }) {
  if (phase === "success" || phase === "transitioning") {
    return (
      <Button className="bg-emerald-600 hover:bg-emerald-600 text-white" disabled>
        <Check weight="bold" className="size-4" />
        Accepted
      </Button>
    )
  }

  return (
    <Button loading={phase === "loading"} onClick={onClick}>
      {phase === "loading" ? "Accepting..." : "Accept & Review"}
    </Button>
  )
}

// ─────────────────────────────────────────────────────────────
// Workspace View (accepted, publisher side)
// ─────────────────────────────────────────────────────────────

function WorkspaceView({
  request,
  workspaceStep,
  bodyVisible,
  headline,
  body,
  cta,
  scheduledDate,
  onHeadlineChange,
  onBodyChange,
  onCtaChange,
  onDateChange,
  onSubmitForReview,
  onGoToEdit,
  onPublish,
}: {
  request: PromotionRequest
  workspaceStep: WorkspaceStep
  bodyVisible: boolean
  headline: string
  body: string
  cta: string
  scheduledDate: string
  onHeadlineChange: (v: string) => void
  onBodyChange: (v: string) => void
  onCtaChange: (v: string) => void
  onDateChange: (v: string) => void
  onSubmitForReview: () => void
  onGoToEdit: () => void
  onPublish: () => void
}) {
  const sponsor = getHero(request.sponsorId)
  const sponsorName = sponsor?.name ?? "Sponsor"

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <SheetTitle className="flex-1 text-lg">
            {workspaceStep === "edit" || workspaceStep === "changes-requested"
              ? "Edit Copy"
              : workspaceStep === "in-review"
                ? "In Review"
                : workspaceStep === "approved"
                  ? "Schedule"
                  : "Ready to Publish"}
          </SheetTitle>
          <SheetClose asChild>
            <Button variant="outline" size="icon-sm">
              <X />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>
        <WorkspaceStepIndicator currentStep={workspaceStep} />
      </SheetHeader>

      <div
        className="flex-1 overflow-hidden transition-opacity duration-300"
        style={{ opacity: bodyVisible ? 1 : 0 }}
      >
        {/* Step 1: Edit Copy */}
        {(workspaceStep === "edit" || workspaceStep === "changes-requested") && (
          <WorkspaceEditStep
            request={request}
            workspaceStep={workspaceStep}
            headline={headline}
            body={body}
            cta={cta}
            onHeadlineChange={onHeadlineChange}
            onBodyChange={onBodyChange}
            onCtaChange={onCtaChange}
            onSubmitForReview={onSubmitForReview}
          />
        )}

        {/* Step 2: In Review */}
        {workspaceStep === "in-review" && (
          <WorkspaceReviewStep
            sponsorName={sponsorName}
            request={request}
            onGoToEdit={onGoToEdit}
          />
        )}

        {/* Step 3: Approved → Schedule */}
        {workspaceStep === "approved" && (
          <WorkspaceScheduleStep
            request={request}
            sponsorName={sponsorName}
            scheduledDate={scheduledDate}
            onDateChange={onDateChange}
            onGoToEdit={onGoToEdit}
            onPublish={onPublish}
          />
        )}

        {/* Step 4: Scheduled (waiting to go live) */}
        {workspaceStep === "scheduled" && (
          <WorkspaceScheduledStep
            request={request}
            scheduledDate={scheduledDate}
            onPublish={onPublish}
          />
        )}
      </div>
    </>
  )
}

// ── Step 1: Edit Copy ──

function WorkspaceEditStep({
  request,
  workspaceStep,
  headline,
  body,
  cta,
  onHeadlineChange,
  onBodyChange,
  onCtaChange,
  onSubmitForReview,
}: {
  request: PromotionRequest
  workspaceStep: "edit" | "changes-requested"
  headline: string
  body: string
  cta: string
  onHeadlineChange: (v: string) => void
  onBodyChange: (v: string) => void
  onCtaChange: (v: string) => void
  onSubmitForReview: () => void
}) {
  const sponsor = getHero(request.sponsorId)
  const sponsorName = sponsor?.name ?? "Sponsor"

  return (
    <>
      <SheetBody className="space-y-4">
        {/* Changes requested feedback */}
        {workspaceStep === "changes-requested" && request.notes && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/50">
            <div className="flex items-start gap-2">
              <PencilLine className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                  {sponsorName} requested changes
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  {request.notes}
                </p>
              </div>
            </div>
          </div>
        )}

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

        {/* Live preview */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Preview</p>
          <EmailBlockPreview
            headline={headline}
            body={body}
            cta={cta}
          />
        </div>
      </SheetBody>

      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Back to Brief</Button>
        </SheetClose>
        <Button onClick={onSubmitForReview}>
          Submit for Review
        </Button>
      </SheetFooter>
    </>
  )
}

// ── Step 2: In Review (publisher waiting) ──

function WorkspaceReviewStep({
  sponsorName,
  request,
  onGoToEdit,
}: {
  sponsorName: string
  request: PromotionRequest
  onGoToEdit: () => void
}) {
  return (
    <>
      <SheetBody className="space-y-4">
        {/* Status card */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex size-8 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-amber-400/30" />
              <div className="relative size-3 rounded-full bg-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Waiting for {sponsorName} to review</p>
              <p className="text-xs text-muted-foreground">
                You&apos;ll be notified when they respond
              </p>
            </div>
          </div>
        </div>

        {/* Read-only preview of submitted copy */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Submitted copy</p>
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
        </div>
      </SheetBody>

      <SheetFooter>
        <Button variant="outline" onClick={onGoToEdit}>
          Edit Copy
        </Button>
      </SheetFooter>
    </>
  )
}

// ── Step 3: Approved → Schedule ──

function WorkspaceScheduleStep({
  request,
  sponsorName,
  scheduledDate,
  onDateChange,
  onGoToEdit,
  onPublish,
}: {
  request: PromotionRequest
  sponsorName: string
  scheduledDate: string
  onDateChange: (v: string) => void
  onGoToEdit: () => void
  onPublish: () => void
}) {
  return (
    <>
      <SheetBody className="space-y-4">
        {/* Approval success message */}
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/50">
          <div className="flex items-center gap-2">
            <CheckCircle weight="fill" className="size-5 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
              {sponsorName} approved your copy
            </p>
          </div>
        </div>

        {/* Finalized ad preview */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Finalized ad</p>
          <EmailBlockPreview
            headline={request.adHeadline}
            body={request.adBody}
            cta={request.adCta}
          />
        </div>

        {/* Date picker */}
        <div className="space-y-2">
          <label className="text-xs font-medium">Send date</label>
          <Input
            type="date"
            value={scheduledDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>

        {/* Deal details */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Payout</p>
            <PayoutBadge amount={request.proposedFee} />
          </div>
        </div>
      </SheetBody>

      <SheetFooter>
        <Button variant="outline" onClick={onGoToEdit}>
          Back
        </Button>
        <Button onClick={onPublish}>
          Publish
        </Button>
      </SheetFooter>
    </>
  )
}

// ── Step 4: Scheduled (ready to publish) ──

function WorkspaceScheduledStep({
  request,
  scheduledDate,
  onPublish,
}: {
  request: PromotionRequest
  scheduledDate: string
  onPublish: () => void
}) {
  return (
    <>
      <SheetBody className="space-y-4">
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <Clock className="size-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Scheduled for {formatDate(scheduledDate || request.proposedDate)}</p>
              <p className="text-xs text-muted-foreground">Ready to go live</p>
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
        </div>
      </SheetBody>

      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
        <Button onClick={onPublish}>
          Publish Now
        </Button>
      </SheetFooter>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Sponsor Review Step
// ─────────────────────────────────────────────────────────────

function SponsorReviewStep({
  request,
  feedbackNote,
  onFeedbackNoteChange,
  onApprove,
  onRequestChanges,
}: {
  request: PromotionRequest
  feedbackNote: string
  onFeedbackNoteChange: (v: string) => void
  onApprove: () => void
  onRequestChanges: () => void
}) {
  const publisher = getHero(request.publisherId)
  const publisherName = publisher?.name ?? "Publisher"
  const [showFeedbackInput, setShowFeedbackInput] = useState(false)

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <SheetTitle className="flex-1 text-lg">Review Copy</SheetTitle>
          <SheetClose asChild>
            <Button variant="outline" size="icon-sm">
              <X />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>
        <SheetDescription>
          {publisherName} submitted copy for your review
        </SheetDescription>
      </SheetHeader>

      <SheetBody className="space-y-4">
        {/* Submitted copy preview */}
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Submitted ad copy</p>
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
        </div>

        {/* Feedback textarea (shown when "Request Changes" is clicked) */}
        {showFeedbackInput && (
          <div className="space-y-2">
            <label className="text-xs font-medium">
              What changes would you like?
            </label>
            <Textarea
              value={feedbackNote}
              onChange={(e) => onFeedbackNoteChange(e.target.value)}
              placeholder="Describe the changes you'd like to see..."
              rows={3}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFeedbackInput(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={onRequestChanges}
                disabled={!feedbackNote.trim()}
              >
                Send Feedback
              </Button>
            </div>
          </div>
        )}
      </SheetBody>

      {!showFeedbackInput && (
        <SheetFooter>
          <Button variant="outline" onClick={() => setShowFeedbackInput(true)}>
            Request Changes
          </Button>
          <Button onClick={onApprove}>
            Approve
          </Button>
        </SheetFooter>
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Publish Success
// ─────────────────────────────────────────────────────────────

function PublishSuccessView() {
  return (
    <>
      <SheetHeader>
        <SheetTitle className="sr-only">Published</SheetTitle>
      </SheetHeader>
      <SheetBody className="flex flex-col items-center justify-center py-16">
        <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
          <CheckCircle weight="fill" className="size-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <p className="mt-4 text-lg font-medium">Published!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The promotion has been scheduled and is ready to go live.
        </p>
      </SheetBody>
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Read-only views (published, expired)
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

function ExpiredView({ request }: { request: PromotionRequest }) {
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
          <Badge variant="secondary" className={getStatusColor("expired")}>
            {STATUS_LABELS.expired}
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
