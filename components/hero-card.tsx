import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { PayoutBadge } from "@/components/payout-badge"
import { EngagementBadge } from "@/components/engagement-badge"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  type Hero,
  formatNumber,
} from "@/lib/mock-data"

// Reusable avatar + name + niche block
export function HeroIdentity({ hero, showEngagement }: { hero: Hero; showEngagement?: boolean }) {
  return (
    <div className="flex items-center gap-3.5">
      <Avatar className="size-13">
        <AvatarFallback>{hero.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-base font-medium leading-tight">{hero.name}</p>
        {hero.verticals[0] && (
          <p className="mt-1.5 text-xs text-muted-foreground">{hero.verticals[0]}</p>
        )}
      </div>
      {showEngagement && (
        <EngagementBadge tier={hero.engagementTier} className="shrink-0" />
      )}
    </div>
  )
}

interface HeroCardProps {
  hero: Hero
  onClick?: () => void
  showPublisherStats?: boolean
  children?: React.ReactNode
}

export function HeroCard({ hero, onClick, showPublisherStats, children }: HeroCardProps) {
  return (
    <button type="button" onClick={onClick} className="h-full w-full cursor-pointer text-left">
      <Card className="h-full transition-colors hover:border-foreground/15">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3.5">
            <HeroIdentity hero={hero} />
            <span aria-hidden="true" className={buttonVariants({ variant: "outline", size: "sm", className: "ml-auto hidden shrink-0 sm:inline-flex" })}>
              View
            </span>
          </div>
          {showPublisherStats && (
            <p className="text-sm text-foreground">
              {formatNumber(hero.subscriberCount)} subscribers · {hero.openRate}% open · {hero.clickRate}% click
            </p>
          )}
          <p className="line-clamp-2 text-pretty text-sm leading-relaxed text-muted-foreground">
            {hero.bio.length > 160 ? hero.bio.slice(0, 160).trimEnd() + "…" : hero.bio}
          </p>
        </CardHeader>
        <CardContent>
          {showPublisherStats ? (
            <div className="flex flex-wrap items-center gap-2">
              <EngagementBadge tier={hero.engagementTier} />
              <PayoutBadge amount={hero.recommendedFee} label="" variant="filled" suffix="/Send" />
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <PayoutBadge amount={hero.budgetPerThousand ?? hero.recommendedFee} label="" variant="filled" suffix="/1k" />
              {hero.maxBudget && (
                <PayoutBadge amount={hero.maxBudget} label="" variant="outline" suffix=" max" />
              )}
            </div>
          )}
          {children}
        </CardContent>
      </Card>
    </button>
  )
}
