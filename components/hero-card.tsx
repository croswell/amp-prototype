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
      {showEngagement && hero.engagementTier === "high" && (
        <Badge variant="secondary" className="shrink-0 gap-1 text-xs bg-[#EFD3A9]/50 text-[#6B4A15] dark:bg-[#D6A151]/30 dark:text-[#EFD3A9]">
          <CaretDoubleUp className="size-3" />
          High Engagement
        </Badge>
      )}
    </div>
  )
}

interface HeroCardProps {
  hero: Hero
  onClick?: () => void
  showPublisherStats?: boolean
}

export function HeroCard({ hero, onClick, showPublisherStats }: HeroCardProps) {
  return (
    <div role="button" tabIndex={0} onClick={onClick} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick?.() }} className="h-full w-full cursor-pointer text-left">
      <Card className="h-full transition-colors hover:border-foreground/15">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-3.5">
            <HeroIdentity hero={hero} />
            <Button variant="outline" size="sm" className="ml-auto hidden shrink-0 cursor-pointer sm:inline-flex">
              View
            </Button>
          </div>
          {showPublisherStats && (
            <p className="text-sm text-foreground">
              {formatNumber(hero.subscriberCount)} subscribers · {hero.openRate}% open rate · {hero.sendSchedule}
            </p>
          )}
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {hero.bio.length > 160 ? hero.bio.slice(0, 160).trimEnd() + "…" : hero.bio}
          </p>
        </CardHeader>
        <CardContent>
          {showPublisherStats ? (
            <div className="flex flex-wrap items-center gap-2">
              {hero.engagementTier === "high" && (
                <Badge variant="secondary" className="gap-1 text-xs bg-[#EFD3A9]/50 text-[#6B4A15] dark:bg-[#D6A151]/30 dark:text-[#EFD3A9]">
                  <CaretDoubleUp className="size-3" />
                  High Engagement
                </Badge>
              )}
              <PayoutBadge amount={hero.recommendedFee} label="" variant="filled" suffix="/Send" />
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2">
              <PayoutBadge amount={hero.recommendedFee} label="" variant="filled" suffix="/Send" />
              <Badge variant="outline" className="text-xs tabular-nums">
                {hero.sendSchedule}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
