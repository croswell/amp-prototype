"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { PromotionRequest, RequestStatus } from "@/lib/mock-data"
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
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-foreground" />
              <p className="text-sm text-muted-foreground">{scheduledText}</p>
            </div>
            {viewerRole === "publisher" && (
              <Button
                variant="outline"
                size="sm"
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

  // Read-only states
  if (
    status === "published" ||
    status === "paid" ||
    status === "declined" ||
    status === "expired"
  ) {
    const messages: Record<string, { icon: React.ReactNode; text: string }> = {
      published: {
        icon: <Check className="size-4 text-emerald-500" />,
        text: "Email sent successfully",
      },
      paid: {
        icon: <Check className="size-4 text-emerald-500" />,
        text: "Payment cleared — promotion complete",
      },
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
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" onClick={onAcceptAndBroadcast}>
                <Check className="size-3.5" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onAcceptAndSuggestChanges}
              >
                <PencilSimple className="size-3.5" />
                Request Changes
              </Button>
              <Button
                variant="link"
                size="sm"
                className="ml-auto text-muted-foreground"
                onClick={onDecline}
              >
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
            <div className="flex items-center justify-between gap-4">
              <p className="text-base font-medium">Proposal accepted</p>
              <Button size="sm" onClick={onCreateBroadcast}>
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
          <p className="text-base font-medium">Proposal accepted</p>
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
            <div className="flex items-center justify-between gap-4">
              <p className="text-base font-medium">Proposal accepted</p>
              <Button size="sm" onClick={onCreateBroadcast}>
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
          <p className="text-base font-medium">Proposal accepted</p>
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
              <p className="text-sm text-muted-foreground">Waiting for the other party to review</p>
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
            <div className="space-y-3">
              <p className="text-sm font-medium">
                {revisionRound > 0 ? `Copy review · Round ${revisionRound} · ` : ""}
                Your turn
              </p>
              <Button size="sm" onClick={onApproveCopy}>
                <Check className="size-3.5" />
                Approve Copy
              </Button>
              <p className="text-xs text-muted-foreground">
                Or use &ldquo;Request Revision&rdquo; on the copy above to send
                feedback
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }

    // Publisher's turn to suggest changes
    return (
      <Card>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm font-medium">
              {revisionRound > 0 ? `Round ${revisionRound} · ` : ""}
              Your turn to revise
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onAcceptAndSuggestChanges}
            >
              <PencilSimple className="size-3.5" />
              Suggest Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
