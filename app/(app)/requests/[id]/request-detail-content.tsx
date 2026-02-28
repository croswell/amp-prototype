"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EmailBlockPreview } from "@/components/email-block-preview"
import { Timeline } from "@/components/timeline-event"
import { RequestSidebar } from "@/components/request-sidebar"
import { RequestActionCard } from "@/components/request-action-card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  getRequest,
  getHero,
  getActiveUser,
  getRoleForPersona,
  getStatusColor,
  STATUS_LABELS,
  deriveRequestState,
  calculatePayout,
  formatCurrency,
  type Hero,
  type PromotionRequest,
  type PayoutEstimate,
  type TimelineEvent,
  type RequestStatus,
  type CopySnapshot,
} from "@/lib/mock-data"
import { CaretLeft, ArrowRight, Broadcast, CheckCircle } from "@phosphor-icons/react"
import { toast } from "sonner"

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function PayoutBreakdown({ payout }: { payout: PayoutEstimate }) {
  return (
    <div className="overflow-hidden rounded-lg border text-sm">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-muted-foreground">Sponsor rate</span>
        <span>{formatCurrency(payout.ratePerK)}/1k subs</span>
      </div>
      {payout.maxPayout && (
        <div className="flex items-center justify-between border-t px-3 py-2">
          <span className="text-muted-foreground">Max payout</span>
          <span>{formatCurrency(payout.maxPayout)}</span>
        </div>
      )}
      <div className="flex items-center justify-between border-t px-3 py-2">
        <span className="text-muted-foreground">Publisher audience</span>
        <span>{payout.audienceSize.toLocaleString()} subs</span>
      </div>
      <div className="flex items-center justify-between border-t bg-muted/50 px-3 py-2 font-medium">
        <span>Payout</span>
        <span>{formatCurrency(payout.amount)}</span>
      </div>
    </div>
  )
}

/** Shows the initial proposal as a timeline entry for requests without timeline data */
function FallbackTimeline({
  request,
  initiator,
  payout,
}: {
  request: PromotionRequest
  initiator: Hero
  payout: PayoutEstimate | null
}) {
  const initials = initiator.name.charAt(0)
  return (
    <div className="relative flex items-start gap-3">
      <div className="relative z-10 shrink-0">
        <Avatar size="lg">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
      <div className="min-w-0 flex-1 pb-6">
        <div className="overflow-hidden rounded-lg border bg-card">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
            <p className="text-sm">
              <span className="font-medium">{initiator.name}</span>{" "}
              <span className="text-muted-foreground">sent a sponsorship request</span>
            </p>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatDate(request.createdAt)}
            </span>
          </div>
          {/* Body */}
          <div className="space-y-4 p-4">
            {request.brief && (
              <p className="text-sm leading-relaxed">
                &ldquo;{request.brief}&rdquo;
              </p>
            )}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Ad preview</p>
              <EmailBlockPreview
                headline={request.adHeadline}
                body={request.adBody}
                cta={request.adCta}
              />
            </div>
            {payout && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Proposal</p>
                <PayoutBreakdown payout={payout} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Dialog with a pre-filled copy edit form for requesting changes */
function RequestChangesDialog({
  open,
  onOpenChange,
  currentCopy,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentCopy: CopySnapshot
  onSubmit: (copyAfter: CopySnapshot, note?: string) => void
}) {
  const [headline, setHeadline] = useState(currentCopy.adHeadline)
  const [body, setBody] = useState(currentCopy.adBody)
  const [cta, setCta] = useState(currentCopy.adCta)
  const [note, setNote] = useState("")

  // Reset form fields when dialog opens with new copy
  const handleOpenChange = (next: boolean) => {
    if (next) {
      setHeadline(currentCopy.adHeadline)
      setBody(currentCopy.adBody)
      setCta(currentCopy.adCta)
      setNote("")
    }
    onOpenChange(next)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(
      {
        adHeadline: headline,
        adBody: body,
        adCta: cta,
        adCtaUrl: currentCopy.adCtaUrl,
      },
      note || undefined
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Suggest copy changes</DialogTitle>
          <DialogDescription>
            Edit the ad copy below. The sponsor will see a before/after
            comparison.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Body</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta">CTA button text</Label>
            <Input
              id="cta"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">
              Message{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Textarea
              id="note"
              placeholder="Explain what you changed and why..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Submit Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function RequestDetailContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const persona = searchParams.get("persona")
  const personaParam = persona ? `?persona=${persona}` : ""

  const request = getRequest(params.id as string)
  if (!request) {
    notFound()
  }

  const activeUser = getActiveUser(persona)
  const viewerRole = getRoleForPersona(persona) as "publisher" | "sponsor"

  // ── Local state so actions update the page in real time ──
  const [localStatus, setLocalStatus] = useState<RequestStatus>(request.status)

  // If the request has no timeline, seed one with a proposal_sent event
  // so the original proposal card stays visible when we append new events.
  const initialTimeline: TimelineEvent[] = request.timeline?.length
    ? request.timeline
    : [
        {
          id: `evt-proposal-${request.id}`,
          type: "proposal_sent",
          actorId:
            request.initiatedBy === "sponsor"
              ? request.sponsorId
              : request.publisherId,
          timestamp: request.createdAt,
          ...(request.brief ? { note: request.brief } : {}),
          copyAfter: {
            adHeadline: request.adHeadline,
            adBody: request.adBody,
            adCta: request.adCta,
            adCtaUrl: request.adCtaUrl,
          },
        },
      ]

  const [localTimeline, setLocalTimeline] =
    useState<TimelineEvent[]>(initialTimeline)

  // Dialog open states
  const [declineOpen, setDeclineOpen] = useState(false)
  const [approveOpen, setApproveOpen] = useState(false)
  const [changesOpen, setChangesOpen] = useState(false)

  // Merge local state with the original request so all JSX reads from one object
  const liveRequest: PromotionRequest = {
    ...request,
    status: localStatus,
    timeline: localTimeline,
  }

  // Determine the "other party" for the sidebar
  const otherPartyId =
    viewerRole === "publisher" ? liveRequest.sponsorId : liveRequest.publisherId
  const otherParty = getHero(otherPartyId)

  const sponsor = getHero(liveRequest.sponsorId)
  const publisher = getHero(liveRequest.publisherId)

  if (!otherParty || !sponsor || !publisher) {
    notFound()
  }

  // Derive state from timeline
  const { currentCopy, copyLocked, revisionRound, whoseTurn } =
    deriveRequestState(liveRequest)

  // Calculate payout
  const payout = calculatePayout(sponsor, publisher)

  // Helper to resolve actor IDs to Hero objects for the timeline
  const getActor = (actorId: string): Hero => {
    return getHero(actorId) || activeUser
  }

  // Determine who can request revision on copy_suggested cards
  // Only the reviewing party (sponsor reviews publisher's suggestions, and vice versa)
  const canRequestRevision =
    liveRequest.status === "in_review" && whoseTurn === viewerRole

  // ── Action handlers ──

  const handleApprove = () => {
    // Update status and add timeline event
    setLocalStatus("accepted")
    setLocalTimeline((prev) => [
      ...prev,
      {
        id: `evt-approve-${Date.now()}`,
        type: "accepted" as const,
        actorId: activeUser.id,
        timestamp: new Date().toISOString(),
      },
    ])
    setApproveOpen(true)
  }

  const handleRequestChanges = () => {
    setChangesOpen(true)
  }

  const handleDecline = () => {
    setDeclineOpen(true)
  }

  const handleConfirmDecline = () => {
    setLocalStatus("declined")
    setDeclineOpen(false)
    toast("Request declined")
    router.push(`/requests${personaParam}`)
  }

  const handleSubmitChanges = (
    copyAfter: CopySnapshot,
    note?: string
  ) => {
    // Build before/after snapshots
    const copyBefore: CopySnapshot = { ...currentCopy }

    setLocalTimeline((prev) => [
      ...prev,
      {
        id: `evt-changes-${Date.now()}`,
        type: "copy_suggested" as const,
        actorId: activeUser.id,
        timestamp: new Date().toISOString(),
        copyBefore,
        copyAfter,
        ...(note ? { note } : {}),
      },
    ])

    // Transition pending → in_review
    if (localStatus === "pending") {
      setLocalStatus("in_review")
    }

    setChangesOpen(false)
    toast.success("Changes submitted")
  }

  const handleApproveCopy = () => {
    toast.success("Copy approved and locked!")
  }

  const handleCreateBroadcast = () => {
    toast.success("Redirecting to Kajabi broadcast setup...")
  }

  const handleRequestRevision = (eventId: string) => {
    toast("Revision requested — opening feedback form...")
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="outline" size="sm" asChild>
        <Link href={`/requests${personaParam}`}>
          <CaretLeft className="size-4" />
          Back
        </Link>
      </Button>

      {/* Header */}
      <div className="space-y-4 border-b pb-6">
        <h1 className="text-2xl font-semibold tracking-tight">{liveRequest.adHeadline}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge
            variant="secondary"
            className={
              liveRequest.status === "pending" && liveRequest.initiatedBy !== viewerRole
                ? "bg-[#CBD7CC]/50 text-[#2A3D35] dark:bg-[#405B50]/40 dark:text-[#CBD7CC]"
                : getStatusColor(liveRequest.status)
            }
          >
            {liveRequest.status === "pending" && liveRequest.initiatedBy !== viewerRole
              ? "New"
              : STATUS_LABELS[liveRequest.status]}
          </Badge>
          <span className="inline-flex items-center gap-1.5">
            {sponsor.name}
            <ArrowRight className="size-3 text-muted-foreground/50" />
            {publisher.name}
          </span>
          <span className="text-muted-foreground/50">&middot;</span>
          <span>{formatDate(liveRequest.createdAt)}</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 pt-4 lg:gap-10 lg:grid-cols-[1fr_320px]">
        {/* Main column: timeline + action card */}
        <div className="min-w-0">
          {/* Timeline */}
          <div className="border-b pb-6">
            {liveRequest.timeline && liveRequest.timeline.length > 0 ? (
              <Timeline
                events={liveRequest.timeline}
                getActor={getActor}
                payout={payout}
                onRequestRevision={handleRequestRevision}
                canRequestRevision={canRequestRevision}
                sponsorId={liveRequest.sponsorId}
              />
            ) : (
              <FallbackTimeline request={liveRequest} initiator={liveRequest.initiatedBy === "sponsor" ? sponsor : publisher} payout={payout} />
            )}
          </div>

          {/* Action card below the border, aligned with the proposal card */}
          <div className="pt-10 pl-[52px]">
            <RequestActionCard
              request={liveRequest}
              viewerRole={viewerRole}
              whoseTurn={whoseTurn}
              copyLocked={copyLocked}
              revisionRound={revisionRound}
              onAcceptAndBroadcast={handleApprove}
              onAcceptAndSuggestChanges={handleRequestChanges}
              onDecline={handleDecline}
              onApproveCopy={handleApproveCopy}
              onCreateBroadcast={handleCreateBroadcast}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <RequestSidebar
            request={liveRequest}
            otherParty={otherParty}
          />
        </div>
      </div>

      {/* ── Decline AlertDialog ── */}
      <AlertDialog open={declineOpen} onOpenChange={setDeclineOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline this proposal?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. The sponsor will be notified that you
              declined their request.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDecline}>
              Decline
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Approve Success Dialog ── */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          <DialogHeader className="text-left">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="size-5 text-foreground" weight="fill" />
              Proposal approved
            </DialogTitle>
            <DialogDescription>
              You&apos;ve accepted this sponsorship. Create a broadcast in
              Kajabi to schedule the sponsored email.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              onClick={() => {
                setApproveOpen(false)
                toast.success("Redirecting to Kajabi broadcast setup...")
              }}
            >
              <Broadcast className="size-4" />
              Create Broadcast
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Request Changes Dialog ── */}
      <RequestChangesDialog
        open={changesOpen}
        onOpenChange={setChangesOpen}
        currentCopy={currentCopy}
        onSubmit={handleSubmitChanges}
      />
    </div>
  )
}
