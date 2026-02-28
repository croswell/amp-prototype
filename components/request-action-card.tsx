"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { PromotionRequest, RequestStatus, Hero } from "@/lib/mock-data"
import {
  Check,
  X,
  PencilSimple,
  Broadcast,
  Clock,
  Lock,
  HourglassMedium,
} from "@phosphor-icons/react"

interface RequestActionCardProps {
  request: PromotionRequest
  viewerRole: "publisher" | "sponsor"
  whoseTurn: "sponsor" | "publisher" | null
  copyLocked: boolean
  revisionRound: number
  onAcceptAndBroadcast?: () => void
  onAcceptAndSuggestChanges?: () => void
  onDecline?: () => void
  onApproveCopy?: () => void
  onCreateBroadcast?: () => void
  publisher?: Hero
}

export function RequestActionCard({
  request,
  viewerRole,
  whoseTurn,
  copyLocked,
  revisionRound,
  onAcceptAndBroadcast,
  onAcceptAndSuggestChanges,
  onDecline,
  onApproveCopy,
  onCreateBroadcast,
  publisher,
}: RequestActionCardProps) {
  const status = request.status

  // Scheduled — show View Broadcast button for publishers
  if (status === "scheduled") {
    const scheduledText = request.scheduledAt
      ? `Broadcast scheduled for ${new Date(request.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
      : "Broadcast scheduled"

    return (
      <Card>
        <CardContent>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-foreground" />
              <p className="text-sm text-muted-foreground">{scheduledText}</p>
            </div>
            {viewerRole === "publisher" && (
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => {}}
              >
                View Broadcast
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Published — show stats
  if (status === "published") {
    const subs = publisher?.subscriberCount ?? 0
    const openRate = publisher?.openRate ?? 0
    const clickRate = publisher?.clickRate ?? 0

    return (
      <Card>
        <CardContent>
          <p className="text-base font-medium">Email sent</p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Subscribers</p>
              <p className="mt-1 text-lg font-semibold">{subs.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Open rate</p>
              <p className="mt-1 text-lg font-semibold">{openRate}%</p>
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Click rate</p>
              <p className="mt-1 text-lg font-semibold">{clickRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Read-only states
  if (
    status === "declined" ||
    status === "expired"
  ) {
    const messages: Record<string, { icon: React.ReactNode; text: string }> = {
      declined: {
        icon: <X className="size-4 text-muted-foreground" />,
        text: "This request was declined",
      },
      expired: {
        icon: <Clock className="size-4 text-muted-foreground" />,
        text: "This request expired",
      },
    }

    const msg = messages[status]
    if (!msg) return null

    return (
      <Card>
        <CardContent>
          <div className="flex items-center gap-2">
            {msg.icon}
            <p className="text-sm text-muted-foreground">{msg.text}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Pending — the receiving party can accept or decline
  if (status === "pending") {
    const isMyTurn = whoseTurn === viewerRole

    if (!isMyTurn) {
      return (
        <Card>
          <CardContent>
            <div className="flex items-center gap-2">
              <HourglassMedium className="size-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {viewerRole === "sponsor"
                  ? "Waiting for publisher to review"
                  : "Waiting for sponsor to review"}
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardContent>
          <div className="space-y-4">
            <p className="text-base font-medium">Review proposal</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <Button size="sm" className="w-full sm:w-auto" onClick={onAcceptAndBroadcast}>
                <Check className="size-3.5" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={onAcceptAndSuggestChanges}
              >
                <PencilSimple className="size-3.5" />
                Request Changes
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="w-full sm:ml-auto sm:w-auto"
                onClick={onDecline}
              >
                <X className="size-3.5" />
                Decline
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Accepted with copy locked — publisher creates broadcast
  if (status === "accepted" && copyLocked) {
    if (viewerRole === "publisher") {
      return (
        <Card>
          <CardContent>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p className="text-base font-medium">Proposal approved</p>
              <Button size="sm" className="w-full sm:w-auto" onClick={onCreateBroadcast}>
                <Broadcast className="size-3.5" />
                Create Broadcast
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    // Sponsor view when copy is locked
    return (
      <Card>
        <CardContent>
          <p className="text-base font-medium">Proposal approved</p>
          <p className="mt-1 text-sm text-muted-foreground">Awaiting publisher to schedule the broadcast.</p>
        </CardContent>
      </Card>
    )
  }

  // Accepted without copy locked (accepted without edits)
  if (status === "accepted") {
    if (viewerRole === "publisher") {
      return (
        <Card>
          <CardContent>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p className="text-base font-medium">Proposal approved</p>
              <Button size="sm" className="w-full sm:w-auto" onClick={onCreateBroadcast}>
                <Broadcast className="size-3.5" />
                Create Broadcast
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardContent>
          <p className="text-base font-medium">Proposal approved</p>
          <p className="mt-1 text-sm text-muted-foreground">Awaiting publisher to schedule the broadcast.</p>
        </CardContent>
      </Card>
    )
  }

  // In review — depends on whose turn it is
  if (status === "in_review") {
    const isMyTurn = whoseTurn === viewerRole

    if (!isMyTurn) {
      return (
        <Card>
          <CardContent>
            <div className="flex items-center gap-2">
              <HourglassMedium className="size-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {viewerRole === "publisher"
                  ? "Waiting for sponsor to review"
                  : "Waiting for publisher to review"}
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }

    // Sponsor's turn to approve
    if (viewerRole === "sponsor") {
      return (
        <Card>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <p className="text-base font-medium">Review proposal</p>
              <Button size="sm" onClick={onApproveCopy}>
                <Check className="size-3.5" />
                Accept
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    // Publisher's turn to suggest changes
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <p className="text-base font-medium">Changes requested</p>
            <Button size="sm" onClick={onAcceptAndSuggestChanges}>
              <PencilSimple className="size-3.5" />
              Respond to Request
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
