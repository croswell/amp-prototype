"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { RequestTimeline } from "@/components/request-timeline"
import {
  type RequestStatus,
  REQUEST_STEPS,
  getRequest,
  getHero,
  formatCurrency,
  getStatusColor,
} from "@/lib/mock-data"
import { ArrowLeft, GearSix } from "@phosphor-icons/react"

export function RequestDetailContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const rawRole = searchParams.get("role") || "publisher"
  const role = rawRole === "both" ? "publisher" : rawRole
  const request = getRequest(params.id as string)

  // Allow presenters to jump to any step
  const [overrideStatus, setOverrideStatus] = useState<RequestStatus | null>(null)

  if (!request) {
    notFound()
  }

  const status = overrideStatus || request.status
  const publisher = getHero(request.publisherId)
  const advertiser = getHero(request.advertiserId)

  const publisherInitials = publisher
    ? publisher.name.split(" ").map((n) => n[0]).join("")
    : "?"
  const advertiserInitials = advertiser
    ? advertiser.name.split(" ").map((n) => n[0]).join("")
    : "?"

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Request header with back button inline */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="-ml-2 size-8" asChild>
              <Link href={`/requests?role=${role}`}>
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <h1 className="flex-1 text-lg font-medium tracking-tight">
              {request.adHeadline}
            </h1>
            <Badge
              variant="secondary"
              className={getStatusColor(status)}
            >
              {status}
            </Badge>
          </div>

          <Separator />

          {/* Vertical timeline */}
          <RequestTimeline
            currentStatus={status}
            request={request}
            publisher={publisher}
            advertiser={advertiser}
            role={role}
            onAdvance={setOverrideStatus}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Participants */}
          <Card size="sm">
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Publisher
                  </p>
                  <Link
                    href={`/profile/${request.publisherId}?role=${role}`}
                    className="flex items-center gap-2 hover:opacity-80"
                  >
                    <Avatar size="sm">
                      <AvatarFallback>{publisherInitials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {publisher?.name}
                    </span>
                  </Link>
                </div>
                <Separator />
                <div>
                  <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Advertiser
                  </p>
                  <Link
                    href={`/profile/${request.advertiserId}?role=${role}`}
                    className="flex items-center gap-2 hover:opacity-80"
                  >
                    <Avatar size="sm">
                      <AvatarFallback>{advertiserInitials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {advertiser?.name}
                    </span>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deal details */}
          <Card size="sm">
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Fee</span>
                  <span className="text-sm font-medium tabular-nums">
                    {formatCurrency(request.proposedFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Send Date
                  </span>
                  <span className="text-sm">{request.proposedDate}</span>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Note from advertiser
                  </p>
                  <p className="mt-1 text-xs leading-relaxed">
                    {request.notes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating dev tool for switching states */}
      <DevToolBubble
        status={status}
        onStatusChange={setOverrideStatus}
      />
    </div>
  )
}

/* ─── Draggable dev-tool bubble (like Next.js dev indicator) ─── */

function DevToolBubble({
  status,
  onStatusChange,
}: {
  status: RequestStatus
  onStatusChange: (s: RequestStatus) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const dragRef = useRef<{
    startX: number
    startY: number
    offsetX: number
    offsetY: number
    moved: boolean
  } | null>(null)

  // Wait for browser to be ready (Next.js renders on server first)
  useEffect(() => {
    setPos({ x: 24, y: window.innerHeight - 64 })
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  function handlePointerDown(e: React.PointerEvent) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - pos.x,
      offsetY: e.clientY - pos.y,
      moved: false,
    }
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return
    const dx = Math.abs(e.clientX - dragRef.current.startX)
    const dy = Math.abs(e.clientY - dragRef.current.startY)
    if (dx > 3 || dy > 3) dragRef.current.moved = true
    setPos({
      x: e.clientX - dragRef.current.offsetX,
      y: e.clientY - dragRef.current.offsetY,
    })
  }

  function handlePointerUp() {
    if (dragRef.current && !dragRef.current.moved) {
      setIsOpen((o) => !o)
    }
    dragRef.current = null
  }

  return (
    <div className="fixed z-50" style={{ left: pos.x, top: pos.y }}>
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 min-w-[140px] rounded-lg border bg-background p-1.5 shadow-lg">
          <p className="px-2 py-1 text-[10px] font-medium text-muted-foreground">
            Jump to step
          </p>
          {REQUEST_STEPS.map((step) => (
            <button
              key={step.key}
              onClick={() => {
                onStatusChange(step.key)
                setIsOpen(false)
              }}
              className={`block w-full rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
                status === step.key
                  ? "bg-foreground text-background"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>
      )}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="flex h-10 w-10 cursor-grab items-center justify-center rounded-full bg-foreground text-background shadow-lg select-none touch-none active:cursor-grabbing"
      >
        <GearSix className="size-5" weight="fill" />
      </div>
    </div>
  )
}
