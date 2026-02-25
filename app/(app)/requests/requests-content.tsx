"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DataTable } from "@/components/ui/data-table"
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
import { X, CalendarBlank, Timer } from "@phosphor-icons/react"
import {
  type RequestStatus,
  type PromotionRequest,
  promotionRequests,
  getHero,
  currentUser,
  formatCurrency,
  getStatusColor,
  STATUS_LABELS,
} from "@/lib/mock-data"

type TabKey = RequestStatus
type DialogStep = "brief" | "edit"

const TABS: { key: TabKey; label: string }[] = [
  { key: "inbox", label: "Inbox" },
  { key: "accepted", label: "Accepted" },
  { key: "published", label: "Published" },
  { key: "expired", label: "Expired" },
]

// Palette color pairs: light palette color as bg tint, darkened text for contrast
const BADGE_COLORS = {
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
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function RequestsContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "publisher"

  // Dialog state
  const [selectedRequest, setSelectedRequest] = useState<PromotionRequest | null>(null)
  const [dialogStep, setDialogStep] = useState<DialogStep>("brief")
  const [dialogOpen, setDialogOpen] = useState(false)

  // Editable copy state (for the edit step)
  const [editedHeadline, setEditedHeadline] = useState("")
  const [editedBody, setEditedBody] = useState("")
  const [editedCta, setEditedCta] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")

  // Status overrides for demo (simulating state changes within the session)
  const [statusOverrides, setStatusOverrides] = useState<Record<string, RequestStatus>>({})

  // Filter requests by role, then apply any local status overrides
  const requests = useMemo(() => {
    const filtered =
      role === "publisher"
        ? promotionRequests.filter((r) => r.publisherId === currentUser.id)
        : promotionRequests.filter((r) => r.sponsorId === currentUser.id)
    return filtered.map((r) => ({
      ...r,
      status: statusOverrides[r.id] || r.status,
    }))
  }, [role, statusOverrides])

  // Get the effective status for a request (with overrides applied)
  function getEffectiveStatus(req: PromotionRequest): RequestStatus {
    return statusOverrides[req.id] || req.status
  }

  function openDialog(request: PromotionRequest) {
    setSelectedRequest(request)
    setEditedHeadline(request.adHeadline)
    setEditedBody(request.adBody)
    setEditedCta(request.adCta)
    setScheduledDate(request.proposedDate)
    // Inbox items start on the brief step; everything else goes straight to a view
    setDialogStep("brief")
    setDialogOpen(true)
  }

  function handleDismiss() {
    if (selectedRequest) {
      setStatusOverrides((prev) => ({ ...prev, [selectedRequest.id]: "expired" }))
    }
    setDialogOpen(false)
  }

  function handleDismissFromTable(requestId: string) {
    setStatusOverrides((prev) => ({ ...prev, [requestId]: "expired" }))
  }

  function handleAcceptAndReview() {
    setDialogStep("edit")
  }

  function handleSchedule() {
    if (selectedRequest) {
      setStatusOverrides((prev) => ({ ...prev, [selectedRequest.id]: "accepted" }))
    }
    setDialogOpen(false)
  }

  // ── Table columns ──

  const inboxColumns = useMemo<ColumnDef<PromotionRequest>[]>(
    () => [
      {
        accessorKey: "sponsorId",
        header: "Sponsor",
        cell: ({ row }) => {
          const req = row.original
          const isIncoming = req.publisherId === currentUser.id
          const otherHero = getHero(isIncoming ? req.sponsorId : req.publisherId)
          const initials = otherHero ? otherHero.name.charAt(0) : "?"
          return (
            <button
              onClick={() => openDialog(req)}
              className="flex items-center gap-3 cursor-pointer text-left"
            >
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{otherHero?.name}</span>
            </button>
          )
        },
      },
      {
        accessorKey: "adHeadline",
        header: "Promotion",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.adHeadline}</span>
        ),
      },
      {
        id: "fee",
        header: "Payout",
        cell: ({ row }) => (
          <Badge variant="outline" className={`${BADGE_COLORS.greenOutline} tabular-nums`}>
            {formatCurrency(row.original.proposedFee)}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end gap-1.5">
            <Button size="sm" onClick={() => openDialog(row.original)}>
              View
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              onClick={() => handleDismissFromTable(row.original.id)}
            >
              <X className="size-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const defaultColumns = useMemo<ColumnDef<PromotionRequest>[]>(
    () => [
      {
        accessorKey: "sponsorId",
        header: "Sponsor",
        cell: ({ row }) => {
          const req = row.original
          const isIncoming = req.publisherId === currentUser.id
          const otherHero = getHero(isIncoming ? req.sponsorId : req.publisherId)
          const initials = otherHero ? otherHero.name.charAt(0) : "?"
          return (
            <button
              onClick={() => openDialog(req)}
              className="flex items-center gap-3 cursor-pointer text-left"
            >
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{otherHero?.name}</span>
            </button>
          )
        },
      },
      {
        accessorKey: "adHeadline",
        header: "Promotion",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.adHeadline}</span>
        ),
      },
      {
        id: "fee",
        header: "Payout",
        cell: ({ row }) => (
          <Badge variant="outline" className={`${BADGE_COLORS.greenOutline} tabular-nums`}>
            {formatCurrency(row.original.proposedFee)}
          </Badge>
        ),
      },
      {
        id: "date",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {formatDate(row.original.proposedDate)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button size="sm" onClick={() => openDialog(row.original)}>
              View
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // ── Dialog content ──

  const sponsor = selectedRequest
    ? getHero(selectedRequest.sponsorId)
    : null
  const effectiveStatus = selectedRequest
    ? getEffectiveStatus(selectedRequest)
    : null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-medium tracking-tight">Promotions</h1>

      <Tabs defaultValue="inbox">
        <TabsList variant="line">
          {TABS.map((tab) => {
            const count = requests.filter((r) => r.status === tab.key).length
            return (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.label}
                {tab.key === "inbox" && (
                  <Badge
                    variant="secondary"
                    className="ml-1.5 px-1.5 py-0 text-[10px] tabular-nums text-muted-foreground"
                  >
                    {count}
                  </Badge>
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>
        {TABS.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="mt-6">
            <DataTable
              columns={tab.key === "inbox" ? inboxColumns : defaultColumns}
              data={requests.filter((r) => r.status === tab.key)}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* ── Request dialog ── */}
      <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          {selectedRequest && effectiveStatus === "inbox" && dialogStep === "brief" && (
            <BriefStep
              request={selectedRequest}
              onDismiss={handleDismiss}
              onAccept={handleAcceptAndReview}
            />
          )}
          {selectedRequest && effectiveStatus === "inbox" && dialogStep === "edit" && (
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
          {selectedRequest && effectiveStatus === "accepted" && (
            <AcceptedView request={selectedRequest} />
          )}
          {selectedRequest && effectiveStatus === "published" && (
            <PublishedView request={selectedRequest} />
          )}
          {selectedRequest && effectiveStatus === "expired" && (
            <ExpiredView request={selectedRequest} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Dialog step components
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
