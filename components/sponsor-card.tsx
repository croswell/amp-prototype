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
interface SponsorCardProps {
  hero: Hero
  onAccept?: (heroId: string) => void
  onDismiss?: (heroId: string) => void
}

export function SponsorCard({ hero, onAccept, onDismiss }: SponsorCardProps) {
  const initials = hero.name.charAt(0)

  const budget = hero.recommendedFee

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
          {/* Budget */}
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-muted-foreground">Budget per send</span>
            <span className="text-sm font-semibold tabular-nums">
              {formatCurrency(budget)}
            </span>
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
