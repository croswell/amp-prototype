"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { EmailBlockPreview } from "@/components/email-block-preview"
import type { TimelineEvent, CopySnapshot, Hero, PayoutEstimate } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/mock-data"
import {
  EnvelopeSimple,
  Check,
  X,
  PencilSimple,
  ArrowsClockwise,
  Lock,
  Broadcast,
  Clock,
  Timer,
  CaretDown,
} from "@phosphor-icons/react"

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function formatTimestampFull(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EVENT_ICONS: Record<string, React.ElementType> = {
  proposal_sent: EnvelopeSimple,
  accepted: Check,
  declined: X,
  copy_suggested: PencilSimple,
  revision_requested: ArrowsClockwise,
  copy_locked: Lock,
  broadcast_created: Broadcast,
  scheduled: Clock,
  published: Check,
  expired: Timer,
}

function CopyDiff({
  before,
  after,
}: {
  before: CopySnapshot
  after: CopySnapshot
}) {
  const [showBefore, setShowBefore] = useState(false)

  return (
    <div className="mt-3 space-y-2">
      {/* Updated version — always visible */}
      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground">Updated</p>
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="text-sm font-medium">{after.adHeadline}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {after.adBody}
          </p>
          <p className="mt-2 text-xs font-medium text-muted-foreground">
            {after.adCta}
          </p>
        </div>
      </div>

      {/* Collapsible previous version */}
      <div>
        <button
          type="button"
          onClick={() => setShowBefore(!showBefore)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <CaretDown
            className={`size-3 transition-transform ${showBefore ? "" : "-rotate-90"}`}
          />
          Show before
        </button>
        {showBefore && (
          <div className="mt-1.5 rounded-lg border border-dashed bg-muted/30 p-3">
            <p className="text-sm font-medium">{before.adHeadline}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {before.adBody}
            </p>
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {before.adCta}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function RevisionForm({ onSubmit }: { onSubmit: (note: string) => void }) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState("")

  if (!open) {
    return (
      <div className="mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <ArrowsClockwise className="size-3.5" />
          Request Revision
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-3 space-y-2">
      <Textarea
        placeholder="What changes would you like?"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        autoFocus
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => {
            onSubmit(note)
            setOpen(false)
            setNote("")
          }}
          disabled={!note.trim()}
        >
          Send
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setOpen(false)
            setNote("")
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

// "Rich" events get full card treatment (proposal, copy_suggested, revision_requested)
function RichEvent({
  event,
  actor,
  isLast,
  payout,
  onRequestRevision,
  showRevisionButton,
  sponsorId,
}: {
  event: TimelineEvent
  actor: Hero
  isLast: boolean
  payout?: PayoutEstimate | null
  onRequestRevision?: (eventId: string, note: string) => void
  showRevisionButton?: boolean
  sponsorId?: string
}) {
  const initials = actor.name.charAt(0)
  const Icon = EVENT_ICONS[event.type]

  // If the actor is the sponsor, it's a "sponsorship request"; if publisher, "promotion request"
  const proposalLabel =
    sponsorId && event.actorId !== sponsorId
      ? "sent a promotion request"
      : "sent a sponsorship request"

  const labels: Record<string, string> = {
    proposal_sent: proposalLabel,
    copy_suggested: "suggested copy changes",
    revision_requested: "requested a revision",
  }

  const isProposal = event.type === "proposal_sent"

  return (
    <div className="relative flex items-start gap-3">
      {/* Vertical connector line */}
      {!isLast && (
        <div className="absolute top-12 bottom-0 left-[19px] w-px bg-border" />
      )}

      {/* Avatar */}
      <div className="relative z-10 shrink-0">
        <Avatar size="lg">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>

      {/* Content card */}
      <div className="min-w-0 flex-1 pb-6">
        <div className="overflow-hidden rounded-lg border bg-card">
          {/* Header — bordered row on all rich cards */}
          <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
            <p className="text-sm">
              <span className="font-medium">{actor.name}</span>{" "}
              <span className="text-muted-foreground">
                {labels[event.type] || event.type}
              </span>
            </p>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatTimestamp(event.timestamp)}
            </span>
          </div>

          {/* Body */}
          <div className="space-y-4 p-4">
            {event.note && (
              <p className="text-sm leading-relaxed">
                &ldquo;{event.note}&rdquo;
              </p>
            )}

            {/* Proposal: show the proposed ad copy */}
            {isProposal && event.copyAfter && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Ad preview</p>
                <EmailBlockPreview
                  headline={event.copyAfter.adHeadline}
                  body={event.copyAfter.adBody}
                  cta={event.copyAfter.adCta}
                />
              </div>
            )}

            {/* Payout breakdown on proposal cards */}
            {isProposal && payout && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Proposal</p>
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
              </div>
            )}

            {/* Copy suggested: show before/after diff */}
            {event.type === "copy_suggested" &&
              event.copyBefore &&
              event.copyAfter && (
                <CopyDiff before={event.copyBefore} after={event.copyAfter} />
              )}

            {/* Request revision — inline expandable form */}
            {event.type === "copy_suggested" &&
              showRevisionButton &&
              onRequestRevision && (
                <RevisionForm onSubmit={(note) => onRequestRevision(event.id, note)} />
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Events that show the actor's avatar instead of an icon circle
const AVATAR_EVENTS = new Set(["accepted", "declined"])

// "Simple" events are inline text with an icon (accepted, declined, copy_locked, etc.)
function SimpleEvent({
  event,
  actor,
  isLast,
  payout,
}: {
  event: TimelineEvent
  actor: Hero
  isLast: boolean
  payout?: PayoutEstimate | null
}) {
  const Icon = EVENT_ICONS[event.type]
  const useAvatar = AVATAR_EVENTS.has(event.type)
  const initials = actor.name.charAt(0)

  const labels: Record<string, React.ReactNode> = {
    accepted: (
      <>
        <span className="font-medium text-foreground">{actor.name}</span>{" "}
        accepted the proposal{" "}
        <Check className="inline size-3.5 text-emerald-500" weight="bold" />
      </>
    ),
    declined: (
      <>
        <span className="font-medium text-foreground">{actor.name}</span>{" "}
        declined the proposal
      </>
    ),
    copy_locked: "Copy approved and locked",
    broadcast_created: `${actor.name} created the broadcast`,
    scheduled: event.metadata?.scheduledAt
      ? `Broadcast scheduled for ${formatTimestampFull(event.metadata.scheduledAt)}`
      : "Broadcast scheduled",
    published: "Email sent",
    expired: "Request expired",
  }

  return (
    <div className="relative flex items-start gap-3">
      {/* Vertical connector line */}
      {!isLast && (
        <div className="absolute top-10 bottom-0 left-[19px] w-px bg-border" />
      )}

      {/* Avatar or icon circle — sized to match the lg avatar width (40px) */}
      {useAvatar ? (
        <div className="relative z-10 shrink-0">
          <Avatar size="lg">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border bg-muted">
          {Icon && <Icon className="size-4 text-muted-foreground" />}
        </div>
      )}

      {/* Label */}
      <div className="flex min-w-0 flex-1 items-start justify-between gap-2 pb-6 pt-2.5">
        <p className="text-sm text-muted-foreground">
          {labels[event.type] || event.type}
        </p>
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatTimestamp(event.timestamp)}
        </span>
      </div>
    </div>
  )
}

const RICH_EVENTS = new Set(["proposal_sent", "copy_suggested", "revision_requested"])

/** Inline edit card that appears at the end of the timeline */
function InlineEditCard({
  actor,
  currentCopy,
  onSubmit,
  onCancel,
}: {
  actor: Hero
  currentCopy: CopySnapshot
  onSubmit: (copyAfter: CopySnapshot, note?: string) => void
  onCancel: () => void
}) {
  const initials = actor.name.charAt(0)
  const [headline, setHeadline] = useState(currentCopy.adHeadline)
  const [body, setBody] = useState(currentCopy.adBody)
  const [cta, setCta] = useState(currentCopy.adCta)
  const [note, setNote] = useState("")

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
    <div className="relative flex items-start gap-3">
      <div className="relative z-10 shrink-0">
        <Avatar size="lg">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
      <div className="min-w-0 flex-1 pb-6">
        <div className="overflow-hidden rounded-lg border border-primary/50 bg-card">
          <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
            <p className="text-sm">
              <span className="font-medium">{actor.name}</span>{" "}
              <span className="text-muted-foreground">suggesting copy changes</span>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3 p-4">
            <div className="space-y-1.5">
              <Label htmlFor="inline-headline" className="text-xs">Headline</Label>
              <Input
                id="inline-headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inline-body" className="text-xs">Body</Label>
              <Textarea
                id="inline-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inline-cta" className="text-xs">CTA button text</Label>
              <Input
                id="inline-cta"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="inline-note" className="text-xs">
                Message{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="inline-note"
                placeholder="Explain what you changed and why..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm">
                Submit Changes
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

interface TimelineProps {
  events: TimelineEvent[]
  getActor: (id: string) => Hero
  payout?: PayoutEstimate | null
  onRequestRevision?: (eventId: string, note: string) => void
  /** Show "Request Revision" on the latest copy_suggested event */
  canRequestRevision?: boolean
  /** Used to determine if proposal was sent by sponsor or publisher */
  sponsorId?: string
  /** When true, show an inline edit form at the end of the timeline */
  inlineEditing?: boolean
  /** The active user for the inline edit card */
  inlineEditActor?: Hero
  /** Current copy to prefill the inline edit form */
  inlineEditCopy?: CopySnapshot
  /** Called when the inline edit form is submitted */
  onInlineEditSubmit?: (copyAfter: CopySnapshot, note?: string) => void
  /** Called when the inline edit form is cancelled */
  onInlineEditCancel?: () => void
}

export function Timeline({
  events,
  getActor,
  payout,
  onRequestRevision,
  canRequestRevision,
  sponsorId,
  inlineEditing,
  inlineEditActor,
  inlineEditCopy,
  onInlineEditSubmit,
  onInlineEditCancel,
}: TimelineProps) {
  // Show revision button only on the last copy_suggested if nothing came after it
  const lastEvent = events[events.length - 1]
  const latestCopySuggestedId =
    canRequestRevision && !inlineEditing && lastEvent?.type === "copy_suggested"
      ? lastEvent.id
      : null

  return (
    <div>
      {events.map((event, i) => {
        const actor = getActor(event.actorId)
        const isLast = i === events.length - 1 && !inlineEditing

        if (RICH_EVENTS.has(event.type)) {
          return (
            <RichEvent
              key={event.id}
              event={event}
              actor={actor}
              isLast={isLast}
              payout={payout}
              onRequestRevision={onRequestRevision}
              showRevisionButton={event.id === latestCopySuggestedId}
              sponsorId={sponsorId}
            />
          )
        }

        return (
          <SimpleEvent
            key={event.id}
            event={event}
            actor={actor}
            isLast={isLast}
            payout={payout}
          />
        )
      })}
      {inlineEditing && inlineEditActor && inlineEditCopy && onInlineEditSubmit && onInlineEditCancel && (
        <InlineEditCard
          actor={inlineEditActor}
          currentCopy={inlineEditCopy}
          onSubmit={onInlineEditSubmit}
          onCancel={onInlineEditCancel}
        />
      )}
    </div>
  )
}
