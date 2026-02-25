"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  type Hero,
  formatCurrency,
} from "@/lib/mock-data"
import { CalendarBlank, Timer } from "@phosphor-icons/react"

interface SponsorCardProps {
  hero: Hero
  onAccept?: (heroId: string) => void
  onDismiss?: (heroId: string) => void
}

// Generate a deterministic "preferred week" based on the hero ID.
// This gives each sponsor a consistent timeframe without adding to the data model.
function getPreferredWeek(heroId: string): string {
  const hash = heroId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const dayOffset = (hash % 4) * 7 + 7 // 1–4 weeks from now
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  // Round to the nearest Monday
  const day = date.getDay()
  const diff = day === 0 ? 1 : day === 1 ? 0 : 8 - day
  date.setDate(date.getDate() + diff)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// Deterministic days remaining (1–6) based on hero ID
function getDaysRemaining(heroId: string): number {
  const hash = heroId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return (hash % 6) + 1
}

export function SponsorCard({ hero, onAccept, onDismiss }: SponsorCardProps) {
  const initials = hero.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  const budget = hero.recommendedFee
  const preferredWeek = getPreferredWeek(hero.id)
  const daysRemaining = getDaysRemaining(hero.id)

  return (
    <Card size="sm" className="h-full">
      <CardHeader>
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-tight">{hero.name}</p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {hero.tagline}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Budget + details */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">Budget per send</span>
              <span className="text-sm font-semibold tabular-nums">
                {formatCurrency(budget)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarBlank className="size-3.5" />
                Week of {preferredWeek}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Timer className="size-3.5" />
                {daysRemaining}d left
              </span>
            </div>
          </div>

          {/* Vertical badges */}
          <div className="flex flex-wrap gap-1.5">
            {hero.verticals.map((v) => (
              <Badge
                key={v}
                variant="outline"
                className="h-auto px-2.5 py-0.5"
              >
                {v}
              </Badge>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault()
                onDismiss?.(hero.id)
              }}
            >
              Dismiss
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault()
                onAccept?.(hero.id)
              }}
            >
              Accept
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
