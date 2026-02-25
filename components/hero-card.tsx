import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  type Hero,
  formatNumber,
  getEngagementColor,
} from "@/lib/mock-data"

interface HeroCardProps {
  hero: Hero
  roleParam: string
}

export function HeroCard({ hero, roleParam }: HeroCardProps) {
  const initials = hero.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <Link href={`/profile/${hero.id}?role=${roleParam}`}>
      <Card size="sm" className="h-full transition-colors hover:bg-muted/50">
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
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs">
              <div>
                <span className="font-medium tabular-nums">
                  {formatNumber(hero.subscriberCount)}
                </span>{" "}
                <span className="text-muted-foreground">subscribers</span>
              </div>
              <div>
                <span className="font-medium tabular-nums">
                  {hero.openRate}%
                </span>{" "}
                <span className="text-muted-foreground">open rate</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Badge
                variant="secondary"
                className={getEngagementColor(hero.engagementTier)}
              >
                {hero.engagementTier} engagement
              </Badge>
              {hero.role === "both" ? (
                <>
                  <Badge variant="secondary">Publisher</Badge>
                  <Badge variant="secondary">Advertiser</Badge>
                </>
              ) : (
                <Badge variant="secondary" className="capitalize">
                  {hero.role}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {hero.verticals.map((v) => (
                <Badge key={v} variant="outline" className="text-[10px]">
                  {v}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
