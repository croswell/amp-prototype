"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { EmailBlockPreview } from "@/components/email-block-preview"
import { EmailBuilderMockup } from "@/components/email-builder-mockup"
import {
  type RequestStatus,
  type PromotionRequest,
  type Hero,
  REQUEST_STEPS,
  getStatusIndex,
} from "@/lib/mock-data"
interface RequestTimelineProps {
  currentStatus: RequestStatus
  request: PromotionRequest
  publisher: Hero | undefined
  advertiser: Hero | undefined
  role: string
  onAdvance?: (nextStatus: RequestStatus) => void
}

interface CopyVersion {
  headline: string
  body: string
  cta: string
  label: string
}

// Timestamps for each step (mock data for the prototype)
const STEP_TIMESTAMPS: Record<RequestStatus, string> = {
  pending: "Feb 20, 2025",
  reviewing: "Feb 21, 2025",
  "copy-review": "Feb 22, 2025",
  scheduling: "Feb 23, 2025",
  locked: "Feb 24, 2025",
}

export function RequestTimeline({
  currentStatus,
  request,
  publisher,
  advertiser,
  role,
  onAdvance,
}: RequestTimelineProps) {
  const currentIndex = getStatusIndex(currentStatus)

  // Copy editing state (for copy-review step)
  const [isEditing, setIsEditing] = useState(false)
  const [editedHeadline, setEditedHeadline] = useState(request.adHeadline)
  const [editedBody, setEditedBody] = useState(request.adBody)
  const [editedCta, setEditedCta] = useState(request.adCta)
  const [versions, setVersions] = useState<CopyVersion[]>([
    {
      headline: request.adHeadline,
      body: request.adBody,
      cta: request.adCta,
      label: "v1 (original)",
    },
  ])

  const currentCopy = versions[versions.length - 1]

  function handleSaveDraft() {
    const newVersion: CopyVersion = {
      headline: editedHeadline,
      body: editedBody,
      cta: editedCta,
      label: `v${versions.length + 1} (edited by ${publisher?.name || "Publisher"}, ${STEP_TIMESTAMPS["copy-review"]})`,
    }
    setVersions([...versions, newVersion])
    setIsEditing(false)
  }

  function handleCancelEdit() {
    setEditedHeadline(currentCopy.headline)
    setEditedBody(currentCopy.body)
    setEditedCta(currentCopy.cta)
    setIsEditing(false)
  }

  return (
    <div className="space-y-0">
      {REQUEST_STEPS.map((step, i) => {
        const isPast = i < currentIndex
        const isCurrent = i === currentIndex
        const isFuture = i > currentIndex
        const isLast = i === REQUEST_STEPS.length - 1

        return (
          <div key={step.key} className="relative pl-6">
            {/* Dot */}
            <div
              className={`absolute left-0 top-[5px] size-3 rounded-full ${
                isPast
                  ? "bg-foreground"
                  : isCurrent
                    ? "bg-foreground ring-2 ring-foreground/20"
                    : "border-2 border-muted-foreground/30 bg-background"
              }`}
            />

            {/* Connecting line */}
            {!isLast && (
              <div
                className={`absolute left-[5.5px] top-[17px] bottom-0 w-px ${
                  isPast ? "bg-foreground" : "border-l border-dashed border-muted-foreground/30"
                }`}
              />
            )}

            {/* Content */}
            <div className={`pb-8 ${isFuture ? "opacity-50" : ""}`}>
              <div className="flex items-baseline justify-between gap-4">
                <p className={`text-sm font-medium ${isFuture ? "text-muted-foreground" : ""}`}>
                  {step.label}
                </p>
                {(isPast || isCurrent) && (
                  <p className="shrink-0 text-xs text-muted-foreground">
                    {STEP_TIMESTAMPS[step.key]}
                  </p>
                )}
              </div>

              {/* Past steps: collapsed summary */}
              {isPast && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {step.key === "pending" && `Request from ${advertiser?.name} accepted`}
                  {step.key === "reviewing" && `${publisher?.name} approved the request`}
                  {step.key === "copy-review" && "Copy reviewed and approved"}
                  {step.key === "scheduling" && `Scheduled for ${request.proposedDate}`}
                </p>
              )}

              {/* Current step: full content */}
              {isCurrent && (
                <div className="mt-3 space-y-4">
                  {/* ── Pending ── */}
                  {step.key === "pending" && (
                    <>
                      {/* Message from advertiser */}
                      <div className="space-y-3 rounded-lg border bg-muted/40 p-4">
                        <p className="text-sm text-muted-foreground">
                          {advertiser?.name} wants to promote in {publisher?.name}&apos;s newsletter
                        </p>

                        {request.notes && (
                          <p className="text-sm leading-relaxed">
                            {request.notes}
                          </p>
                        )}

                        {/* Promotion preview card */}
                        <EmailBlockPreview
                          headline={request.adHeadline}
                          body={request.adBody}
                          cta={request.adCta}
                          publisherName={publisher?.name}
                          className="bg-background"
                        />
                      </div>

                      {role === "publisher" ? (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => onAdvance?.("reviewing")}>Accept Request</Button>
                          <Button size="sm" variant="outline">
                            Decline
                          </Button>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          Waiting for {publisher?.name} to respond
                        </p>
                      )}
                    </>
                  )}

                  {/* ── Reviewing ── */}
                  {step.key === "reviewing" && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {publisher?.name} is evaluating audience fit
                      </p>
                      <div className="rounded-sm border bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">
                          Publishers typically review requests within 48 hours.
                          They consider audience alignment, product quality, and brand fit.
                        </p>
                      </div>
                      {role === "publisher" ? (
                        <Button size="sm" onClick={() => onAdvance?.("copy-review")}>
                          Approve &amp; Continue to Copy Review
                        </Button>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          Under review
                        </p>
                      )}
                    </>
                  )}

                  {/* ── Copy Review ── */}
                  {step.key === "copy-review" && (
                    <>
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <label className="text-xs font-medium">Headline</label>
                            <Input
                              value={editedHeadline}
                              onChange={(e) => setEditedHeadline(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium">Body</label>
                            <Textarea
                              value={editedBody}
                              onChange={(e) => setEditedBody(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium">CTA</label>
                            <Input
                              value={editedCta}
                              onChange={(e) => setEditedCta(e.target.value)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveDraft}>
                              Save Draft
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <EmailBlockPreview
                            headline={currentCopy.headline}
                            body={currentCopy.body}
                            cta={currentCopy.cta}
                            publisherName={publisher?.name}
                          />

                          {role === "publisher" ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditedHeadline(currentCopy.headline)
                                  setEditedBody(currentCopy.body)
                                  setEditedCta(currentCopy.cta)
                                  setIsEditing(true)
                                }}
                              >
                                Edit Copy
                              </Button>
                              <Button size="sm" onClick={() => onAdvance?.("scheduling")}>Approve Copy</Button>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">
                              Copy is under review by {publisher?.name}
                            </p>
                          )}
                        </>
                      )}

                      {/* Version history */}
                      {versions.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            Version history
                          </p>
                          {versions.map((v, vi) => (
                            <p key={vi} className="text-xs text-muted-foreground">
                              {v.label}
                            </p>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* ── Scheduling ── */}
                  {step.key === "scheduling" && (
                    <>
                      <EmailBlockPreview
                        headline={currentCopy.headline}
                        body={currentCopy.body}
                        cta={currentCopy.cta}
                        publisherName={publisher?.name}
                      />

                      <div className="rounded-sm border bg-muted/50 p-3">
                        <p className="text-xs">
                          Scheduled for{" "}
                          <span className="font-medium text-foreground">
                            {request.proposedDate}
                          </span>
                        </p>
                      </div>

                      {role === "publisher" ? (
                        <Button size="sm" onClick={() => onAdvance?.("locked")}>Confirm &amp; Lock</Button>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">
                          Scheduled for {request.proposedDate}
                        </p>
                      )}
                    </>
                  )}

                  {/* ── Locked ── */}
                  {step.key === "locked" && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        This promotion is locked and will auto-fill on{" "}
                        {request.proposedDate}
                      </p>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Preview in {publisher?.name}&apos;s email template
                        </p>
                        <EmailBuilderMockup
                          state="filled"
                          headline={currentCopy.headline}
                          body={currentCopy.body}
                          cta={currentCopy.cta}
                          publisherName={publisher?.name}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
