import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PayoutBadge } from "@/components/payout-badge"
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
    <div role="button" tabIndex={0} onClick={onClick} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick?.() }} className="h-full w-full cursor-pointer text-left">
      <Card size="sm" className="h-full transition-colors hover:border-foreground/50">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Avatar className="size-9">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <p className="font-medium leading-tight">{hero.name}</p>
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {hero.bio}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {niche && (
              <Badge variant="secondary" className="h-9 shrink-0 border-0 px-3 text-sm">
                {niche}
              </Badge>
            )}
            <PayoutBadge amount={hero.recommendedFee} className="h-9 shrink-0 px-3 text-sm" />
            <Button variant="outline" size="sm" className="ml-auto shrink-0 cursor-pointer">
              View
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
