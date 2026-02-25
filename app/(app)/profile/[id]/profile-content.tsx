"use client"

import { use } from "react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { EmailBlockPreview } from "@/components/email-block-preview"
import {
  type Role,
  getHero,
  formatNumber,
  formatCurrency,
  getEngagementColor,
} from "@/lib/mock-data"
import {
  ArrowLeft,
  Globe,
  Star,
  EnvelopeSimple,
} from "@phosphor-icons/react"

export function ProfileContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const role = (searchParams.get("role") || "both") as Role
  const hero = getHero(params.id as string)

  if (!hero) {
    notFound()
  }

  const initials = hero.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  const canSendRequest =
    role === "advertiser" || role === "both"
      ? hero.role === "publisher" || hero.role === "both"
      : false

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/directory?role=${role}`}>
          <ArrowLeft data-icon="inline-start" className="size-4" />
          Back to Directory
        </Link>
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main profile */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar size="lg">
                  <AvatarFallback className="text-base">{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h1 className="text-lg font-medium">{hero.name}</h1>
                      <p className="text-sm text-muted-foreground">
                        {hero.tagline}
                      </p>
                    </div>
                    {canSendRequest && (
                      <Button size="sm" asChild>
                        <Link href={`/requests?role=${role}&action=new&to=${hero.id}`}>
                          <EnvelopeSimple data-icon="inline-start" className="size-4" />
                          Send Request
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {hero.bio}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {hero.verticals.map((v) => (
                    <Badge key={v} variant="outline">
                      {v}
                    </Badge>
                  ))}
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Subscribers</p>
                    <p className="text-lg font-medium tabular-nums">
                      {formatNumber(hero.subscriberCount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Open Rate</p>
                    <p className="text-lg font-medium tabular-nums">
                      {hero.openRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Click Rate</p>
                    <p className="text-lg font-medium tabular-nums">
                      {hero.clickRate}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Promotions</p>
                    <p className="text-lg font-medium tabular-nums">
                      {hero.promotionsCompleted}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample promotion preview */}
          <Card>
            <CardHeader>
              <CardTitle>Sample Promotion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-xs text-muted-foreground">
                This is what a promotion looks like in {hero.name}&apos;s email:
              </p>
              <EmailBlockPreview
                headline={`Recommended by ${hero.name.split(" ")[0]}`}
                body={`${hero.name} hand-picks every promotion they share. Their audience trusts their recommendations because they only endorse products they believe in.`}
                cta="Learn More"
                publisherName={hero.name}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card size="sm">
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Engagement
                  </span>
                  <Badge
                    variant="secondary"
                    className={getEngagementColor(hero.engagementTier)}
                  >
                    {hero.engagementTier}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Recommended Fee
                  </span>
                  <span className="text-sm font-medium">
                    {formatCurrency(hero.recommendedFee)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Rating</span>
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <Star className="size-3.5" weight="fill" />
                    {hero.rating}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Role</span>
                  <Badge variant="secondary" className="capitalize">
                    {hero.role}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card size="sm">
            <CardContent>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Links
                </p>
                <a
                  href={hero.website}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Globe className="size-3.5" />
                  Website
                </a>
                {hero.socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    className="flex items-center gap-2 text-sm capitalize text-muted-foreground hover:text-foreground"
                  >
                    <Globe className="size-3.5" />
                    {link.platform}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
