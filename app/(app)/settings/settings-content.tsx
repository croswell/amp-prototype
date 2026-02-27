"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/page-header"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EmailBlockPreview } from "@/components/email-block-preview"
import { currentUser, formatCurrency, formatNumber, getEngagementColor } from "@/lib/mock-data"
import type { Vertical } from "@/lib/mock-data"
import { Globe, LinkSimple, SignOut } from "@phosphor-icons/react"

// ── Campaign mock data ───────────────────────────────────────

const INITIAL_CAMPAIGN = {
  headline: "The Course Creator Accelerator",
  body: "Build and launch a 6-figure online course in 12 weeks. Alex Johnson's proven system has generated over $2M in student revenue. Limited spots available for the spring cohort.",
  cta: "Apply Now",
  ctaUrl: "https://alexjohnson.co/accelerator",
  budgetPerSend: "500",
}

// ── Main component ───────────────────────────────────────────

export function SettingsContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "publisher"

  const isPublisher = role === "publisher" || role === "both"
  const isSponsor = role === "sponsor" || role === "both"

  // ── Profile state ──────────────────────────────────────────
  const [name, setName] = useState(currentUser.name)
  const [tagline, setTagline] = useState(currentUser.tagline)
  const [bio, setBio] = useState(currentUser.bio)
  const [website, setWebsite] = useState(currentUser.website)
  const [twitter, setTwitter] = useState(
    currentUser.socialLinks.find((l) => l.platform === "twitter")?.url || ""
  )
  const [instagram, setInstagram] = useState(
    currentUser.socialLinks.find((l) => l.platform === "instagram")?.url || ""
  )
  const [linkedin, setLinkedin] = useState(
    currentUser.socialLinks.find((l) => l.platform === "linkedin")?.url || ""
  )
  const [vertical, setVertical] = useState<Vertical>(currentUser.verticals[0])

  // ── Publisher state ────────────────────────────────────────
  const [audienceSize, setAudienceSize] = useState(
    currentUser.subscriberCount.toLocaleString("en-US")
  )
  const [sendFee, setSendFee] = useState(
    currentUser.recommendedFee.toString()
  )
  const [promotionsPerMonth, setPromotionsPerMonth] = useState(2)

  const audienceNum = parseInt(audienceSize.replace(/,/g, "")) || 0

  function handleAudienceChange(value: string) {
    const raw = value.replace(/,/g, "").replace(/\D/g, "")
    if (raw === "") {
      setAudienceSize("")
      return
    }
    setAudienceSize(parseInt(raw).toLocaleString("en-US"))
  }

  // ── Sponsor spend limit state ──────────────────────────────
  const [spendLimit, setSpendLimit] = useState(
    currentUser.spendLimit?.toString() || "3000"
  )

  // ── Campaign state ─────────────────────────────────────────
  const [campHeadline, setCampHeadline] = useState(INITIAL_CAMPAIGN.headline)
  const [campBody, setCampBody] = useState(INITIAL_CAMPAIGN.body)
  const [campCta, setCampCta] = useState(INITIAL_CAMPAIGN.cta)
  const [campCtaUrl, setCampCtaUrl] = useState(INITIAL_CAMPAIGN.ctaUrl)
  const [campBudget, setCampBudget] = useState(INITIAL_CAMPAIGN.budgetPerSend)

  // ── Account data ───────────────────────────────────────────
  const joinedDate = new Date(currentUser.joinedDate)
  const memberSince = joinedDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  // ── Which tab is default ───────────────────────────────────
  const defaultTab = "profile"

  return (
    <div className="space-y-10">
      <PageHeader
        title="Settings"
        description="Manage your profile, campaigns, and account."
      />

      <Tabs defaultValue={defaultTab} orientation="vertical" className="gap-8">
        <TabsList className="w-48 shrink-0 flex-col items-stretch bg-transparent p-0 gap-1.5">
          <TabsTrigger value="profile" className="justify-start rounded-md border-0 px-3 py-2 text-sm font-medium text-muted-foreground !shadow-none data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=active]:!shadow-none after:hidden hover:text-foreground">Profile</TabsTrigger>
          {isPublisher && (
            <TabsTrigger value="publisher" className="justify-start rounded-md border-0 px-3 py-2 text-sm font-medium text-muted-foreground !shadow-none data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=active]:!shadow-none after:hidden hover:text-foreground">Pricing & Availability</TabsTrigger>
          )}
          {isSponsor && (
            <TabsTrigger value="campaigns" className="justify-start rounded-md border-0 px-3 py-2 text-sm font-medium text-muted-foreground !shadow-none data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=active]:!shadow-none after:hidden hover:text-foreground">Campaigns</TabsTrigger>
          )}
          <TabsTrigger value="account" className="justify-start rounded-md border-0 px-3 py-2 text-sm font-medium text-muted-foreground !shadow-none data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=active]:!shadow-none after:hidden hover:text-foreground">Account</TabsTrigger>
        </TabsList>

        {/* ── Profile Tab ────────────────────────────────────── */}
        <TabsContent value="profile" className="space-y-8">
          {/* Details + Verticals */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>
                How you appear to other creators in the network.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-24"
                />
              </div>

              <div className="space-y-2">
                <Label>Niche</Label>
                <Select value={vertical} onValueChange={(v) => setVertical(v as Vertical)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose your niche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Health & Fitness">Health & Fitness</SelectItem>
                    <SelectItem value="Business & Marketing">Business & Marketing</SelectItem>
                    <SelectItem value="Personal Development">Personal Development</SelectItem>
                    <SelectItem value="Creative Arts">Creative Arts</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Parenting">Parenting</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Your primary industry category. This is shown on your profile.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
              <CardDescription>
                Your website and social profiles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="website"
                    placeholder="https://yoursite.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Social links</Label>
                <div className="space-y-2">
                  <div className="relative">
                    <LinkSimple className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Twitter URL"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="relative">
                    <LinkSimple className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Instagram URL"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="relative">
                    <LinkSimple className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="LinkedIn URL"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Publisher Settings Tab ──────────────────────────── */}
        {isPublisher && (
          <TabsContent value="publisher" className="space-y-8">
            {/* Engagement tier */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Tier</CardTitle>
                <CardDescription>
                  Your tier is based on your audience size and open rate. Higher engagement unlocks better sponsorship rates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={getEngagementColor(currentUser.engagementTier)}
                  >
                    {currentUser.engagementTier.charAt(0).toUpperCase() + currentUser.engagementTier.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Subscribers</p>
                    <p className="text-lg font-medium tabular-nums">
                      {formatNumber(currentUser.subscriberCount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Open rate</p>
                    <p className="text-lg font-medium tabular-nums">
                      {currentUser.openRate}%
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience-size">Broadcast audience size</Label>
                  <Input
                    id="audience-size"
                    inputMode="numeric"
                    placeholder="e.g. 10,000"
                    value={audienceSize}
                    onChange={(e) => handleAudienceChange(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Update this if your subscriber count has changed.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & availability */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Availability</CardTitle>
                <CardDescription>
                  Set your rate and how many promotions you'll accept per month.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="send-fee">Your send fee</Label>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="send-fee"
                      inputMode="numeric"
                      placeholder="0"
                      value={sendFee}
                      onChange={(e) =>
                        setSendFee(e.target.value.replace(/\D/g, ""))
                      }
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>per send</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </div>

                <div className="space-y-2">
                  <Label>Promotions per month</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setPromotionsPerMonth(n)}
                        className={`flex h-9 flex-1 items-center justify-center rounded-sm border text-sm font-medium transition-colors ${
                          promotionsPerMonth === n
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* ── Campaigns Tab ──────────────────────────────────── */}
        {isSponsor && (
          <TabsContent value="campaigns" className="space-y-8">
            {/* Spend limit */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Spend Limit</CardTitle>
                <CardDescription>
                  Set a monthly budget cap for all your promotions combined.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="spend-limit">Monthly budget</Label>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="spend-limit"
                      inputMode="numeric"
                      placeholder="0"
                      value={spendLimit}
                      onChange={(e) =>
                        setSpendLimit(e.target.value.replace(/\D/g, ""))
                      }
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>/ month</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              </CardContent>
            </Card>

            {/* Your campaign */}
            <Card>
              <CardHeader>
                <CardTitle>Your Campaign</CardTitle>
                <CardDescription>
                  This is the ad that publishers will see and run in their newsletters.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="camp-headline">Headline</Label>
                  <Input
                    id="camp-headline"
                    value={campHeadline}
                    onChange={(e) => setCampHeadline(e.target.value)}
                    placeholder="e.g. The Course Creator Accelerator"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="camp-body">Body</Label>
                  <Textarea
                    id="camp-body"
                    value={campBody}
                    onChange={(e) => setCampBody(e.target.value)}
                    className="min-h-24"
                    placeholder="2-3 sentences about your offer"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="camp-cta">Call to action</Label>
                    <Input
                      id="camp-cta"
                      value={campCta}
                      onChange={(e) => setCampCta(e.target.value)}
                      placeholder="e.g. Learn More"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="camp-budget">Budget per send</Label>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>$</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="camp-budget"
                        inputMode="numeric"
                        placeholder="0"
                        value={campBudget}
                        onChange={(e) =>
                          setCampBudget(e.target.value.replace(/\D/g, ""))
                        }
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupText>per send</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="camp-url">Destination URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="camp-url"
                      value={campCtaUrl}
                      onChange={(e) => setCampCtaUrl(e.target.value)}
                      placeholder="https://yoursite.com/offer"
                      className="pl-9"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Preview</Label>
                  <EmailBlockPreview
                    headline={campHeadline || "Your headline here"}
                    body={campBody || "Your ad body will appear here..."}
                    cta={campCta || "Learn More"}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* ── Account Tab ────────────────────────────────────── */}
        <TabsContent value="account" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Email</span>
                <span>alex@example.com</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Member since</span>
                <span>{memberSince}</span>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <Button variant="outline" asChild>
            <Link href="/">
              <SignOut className="size-4" />
              Sign Out
            </Link>
          </Button>
        </TabsContent>
      </Tabs>

    </div>
  )
}
