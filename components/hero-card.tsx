import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PayoutBadge } from "@/components/payout-badge"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { CaretDoubleUp } from "@phosphor-icons/react"
import {
  type Hero,
  formatCurrency,
  formatNumber,
} from "@/lib/mock-data"

interface HeroCardProps {
  hero: Hero
  onClick?: () => void
  showPublisherStats?: boolean
}

export function HeroCard({ hero, onClick, showPublisherStats }: HeroCardProps) {
  const initials = hero.name.charAt(0)
  const niche = hero.verticals[0]

  return (
    <div role="button" tabIndex={0} onClick={onClick} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick?.() }} className="h-full w-full cursor-pointer text-left">
      <Card className="h-full transition-colors hover:border-foreground/50">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3.5">
            <Avatar className="size-13">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-base font-medium leading-tight">{hero.name}</p>
              {niche && <p className="mt-1.5 text-xs text-muted-foreground">{niche}</p>}
            </div>
            <Button variant="outline" size="sm" className="ml-auto hidden shrink-0 cursor-pointer sm:inline-flex">
              View
            </Button>
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-foreground/80">
            {hero.bio}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            <PayoutBadge amount={hero.recommendedFee} label={showPublisherStats ? "Cost: " : "Payout: "} variant="filled" />
            {showPublisherStats && hero.engagementTier === "high" && (
              <Badge variant="secondary" className="gap-1 bg-[#EFD3A9]/50 text-[#6B4A15] dark:bg-[#D6A151]/30 dark:text-[#EFD3A9]">
                <CaretDoubleUp className="size-3" />
                High Engagement
              </Badge>
            )}
            {showPublisherStats && (
              <>
                <Badge variant="secondary">{formatNumber(hero.subscriberCount)} Subscribers</Badge>
                <Badge variant="secondary">{hero.openRate}% Open Rate</Badge>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
