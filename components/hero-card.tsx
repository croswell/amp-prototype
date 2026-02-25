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

interface HeroCardProps {
  hero: Hero
  onClick?: () => void
}

export function HeroCard({ hero, onClick }: HeroCardProps) {
  const initials = hero.name.charAt(0)
  const niche = hero.verticals[0]

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
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {niche && (
              <Badge variant="outline" className="shrink-0">
                {niche}
              </Badge>
            )}
            <span className="text-sm font-medium tabular-nums">
              {formatCurrency(hero.recommendedFee)}
            </span>
          </div>
          {onClick && (
            <Button variant="outline" size="sm" onClick={onClick}>
              View
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
