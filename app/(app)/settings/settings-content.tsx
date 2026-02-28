"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
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
  CardFooter,
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
import { StatCard } from "@/components/stat-card"
import { EngagementBadge } from "@/components/engagement-badge"
import { currentUser, formatCurrency, formatNumber, getActiveUser, getRoleForPersona, getActiveViewRole } from "@/lib/mock-data"
import type { Vertical } from "@/lib/mock-data"
import { Globe, LinkSimple, SignOut } from "@phosphor-icons/react"

// ── Campaign mock data ───────────────────────────────────────

const INITIAL_CAMPAIGN = {
  headline: "The Course Creator Accelerator",
  body: "Build and launch a 6-figure online course in 12 weeks. Alex Johnson's proven system has generated over $2M in student revenue. Limited spots available for the spring cohort.",
  cta: "Apply Now",
  ctaUrl: "https://alexjohnson.co/accelerator",
  budgetPerThousand: "25",
  maxBudget: "1500",
}

// ── Main component ───────────────────────────────────────────

const SETTINGS_TABS = ["profile", "publisher", "campaigns", "account"] as const

export function SettingsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const persona = searchParams.get("role") || "publisher"
  const view = searchParams.get("view")
  const activeUser = getActiveUser(persona)
  const role = getRoleForPersona(persona)
  const activeViewRole = getActiveViewRole(role, view)

  const isPublisher = activeViewRole === "publisher"
  const isSponsor = activeViewRole === "sponsor"

  // ── Profile state ──────────────────────────────────────────
  const [name, setName] = useState(activeUser.name)
  const [tagline, setTagline] = useState(activeUser.tagline)
  const [bio, setBio] = useState(activeUser.bio)
  const [website, setWebsite] = useState(activeUser.website)
  const [twitter, setTwitter] = useState(
    activeUser.socialLinks.find((l) => l.platform === "twitter")?.url || ""
  )
  const [instagram, setInstagram] = useState(
    activeUser.socialLinks.find((l) => l.platform === "instagram")?.url || ""
  )
  const [linkedin, setLinkedin] = useState(
    activeUser.socialLinks.find((l) => l.platform === "linkedin")?.url || ""
  )
  const [vertical, setVertical] = useState<Vertical>(activeUser.verticals[0])

  // ── Publisher state ────────────────────────────────────────
  const [sendFee, setSendFee] = useState(
    activeUser.recommendedFee.toString()
  )
  const [audienceSize, setAudienceSize] = useState(
    activeUser.subscriberCount.toLocaleString("en-US")
  )

  // ── Campaign state ─────────────────────────────────────────
  const [campHeadline, setCampHeadline] = useState(INITIAL_CAMPAIGN.headline)
  const [campBody, setCampBody] = useState(INITIAL_CAMPAIGN.body)
  const [campCta, setCampCta] = useState(INITIAL_CAMPAIGN.cta)
  const [campCtaUrl, setCampCtaUrl] = useState(INITIAL_CAMPAIGN.ctaUrl)
  const [campBudgetPerK, setCampBudgetPerK] = useState(INITIAL_CAMPAIGN.budgetPerThousand)
  const [campMaxBudget, setCampMaxBudget] = useState(INITIAL_CAMPAIGN.maxBudget)

  // ── Account data ───────────────────────────────────────────
  const joinedDate = new Date(activeUser.joinedDate)
  const memberSince = joinedDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  // ── Change detection ─────────────────────────────────────
  const initialTwitter = activeUser.socialLinks.find((l) => l.platform === "twitter")?.url || ""
  const initialInstagram = activeUser.socialLinks.find((l) => l.platform === "instagram")?.url || ""
  const initialLinkedin = activeUser.socialLinks.find((l) => l.platform === "linkedin")?.url || ""

  const detailsChanged =
    name !== activeUser.name ||
    tagline !== activeUser.tagline ||
    bio !== activeUser.bio ||
    vertical !== activeUser.verticals[0]

  const linksChanged =
    website !== activeUser.website ||
    twitter !== initialTwitter ||
    instagram !== initialInstagram ||
    linkedin !== initialLinkedin

  const pricingChanged =
    sendFee !== activeUser.recommendedFee.toString() ||
    audienceSize !== activeUser.subscriberCount.toLocaleString("en-US")

  const campaignChanged =
    campHeadline !== INITIAL_CAMPAIGN.headline ||
    campBody !== INITIAL_CAMPAIGN.body ||
    campCta !== INITIAL_CAMPAIGN.cta ||
    campCtaUrl !== INITIAL_CAMPAIGN.ctaUrl ||
    campBudgetPerK !== INITIAL_CAMPAIGN.budgetPerThousand ||
    campMaxBudget !== INITIAL_CAMPAIGN.maxBudget

  // ── Which tab is default ───────────────────────────────────
  const tabFromUrl = searchParams.get("tab")
  const defaultTab =
    tabFromUrl && (SETTINGS_TABS as readonly string[]).includes(tabFromUrl)
      ? tabFromUrl
      : "profile"

  const handleTabChange = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams.toString())
      if (value === "profile") {
        next.delete("tab")
      } else {
        next.set("tab", value)
      }
      router.replace(`?${next.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )

  return (
    <div className="space-y-10">
      <PageHeader
        title="Settings"
        description="Manage your profile, campaigns, and account."
      />

      <Tabs value={defaultTab} onValueChange={handleTabChange} orientation="vertical" className="flex-col gap-6 sm:flex-row sm:gap-8">
        {/* Mobile: select dropdown */}
        <div className="sm:hidden">
          <Select value={defaultTab} onValueChange={handleTabChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="profile">Profile</SelectItem>
              {isPublisher && <SelectItem value="publisher">Pricing</SelectItem>}
              {isSponsor && <SelectItem value="campaigns">Ad Campaign</SelectItem>}
              <SelectItem value="account">Account</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Desktop: vertical tab list */}
        <TabsList className="hidden w-48 shrink-0 flex-col items-stretch bg-transparent p-0 gap-1.5 sm:flex">
          <TabsTrigger value="profile" className="justify-start rounded-md border-0 px-3 py-2 text-sm font-medium text-muted-foreground !shadow-none data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=active]:!shadow-none after:hidden hover:text-foreground">Profile</TabsTrigger>
          {isPublisher && (
            <TabsTrigger value="publisher" className="justify-start rounded-md border-0 px-3 py-2 text-sm font-medium text-muted-foreground !shadow-none data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=active]:!shadow-none after:hidden hover:text-foreground">Pricing</TabsTrigger>
          )}
          {isSponsor && (
            <TabsTrigger value="campaigns" className="justify-start rounded-md border-0 px-3 py-2 text-sm font-medium text-muted-foreground !shadow-none data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:font-medium data-[state=active]:!shadow-none after:hidden hover:text-foreground">Ad Campaign</TabsTrigger>
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
                  autoComplete="name"
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
            <CardFooter className="justify-end border-t px-6 pt-4">
              <Button disabled={!detailsChanged}>Save</Button>
            </CardFooter>
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
                    autoComplete="url"
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
                      autoComplete="url"
                      className="pl-9"
                    />
                  </div>
                  <div className="relative">
                    <LinkSimple className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Instagram URL"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      autoComplete="url"
                      className="pl-9"
                    />
                  </div>
                  <div className="relative">
                    <LinkSimple className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="LinkedIn URL"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      autoComplete="url"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end border-t px-6 pt-4">
              <Button disabled={!linksChanged}>Save</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ── Publisher Pricing Tab ──────────────────────────── */}
        {isPublisher && (
          <TabsContent value="publisher" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>
                  Set the rate you charge sponsors for each email send.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Engagement stats */}
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="Subscribers" value={formatNumber(activeUser.subscriberCount)} />
                  <StatCard label="Open Rate" value={`${activeUser.openRate}%`} />
                  <StatCard label="Click Rate" value={`${activeUser.clickRate}%`} />
                </div>

                <EngagementBadge tier={activeUser.engagementTier} />

                <Separator />

                {/* Audience size */}
                <div className="space-y-2">
                  <Label htmlFor="audience-size">Audience size</Label>
                  <Input
                    id="audience-size"
                    inputMode="numeric"
                    placeholder="0"
                    value={audienceSize}
                    onChange={(e) =>
                      setAudienceSize(e.target.value.replace(/[^\d,]/g, ""))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Set the audience size you&apos;ll send promotions to.
                  </p>
                </div>

                {/* Send fee */}
                <div className="space-y-2">
                  <Label htmlFor="send-fee">Send fee</Label>
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
                  <p className="text-xs text-muted-foreground">
                    Based on your engagement, we recommend {formatCurrency(activeUser.recommendedFee)} per send.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t px-6 pt-4">
                <Button disabled={!pricingChanged}>Save</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        )}

        {/* ── Campaigns Tab ──────────────────────────────────── */}
        {isSponsor && (
          <TabsContent value="campaigns" className="space-y-8">
            {/* Your campaign */}
            <Card>
              <CardHeader>
                <CardTitle>Ad Campaign</CardTitle>
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

                <div className="space-y-2">
                  <Label htmlFor="camp-cta">Call to action</Label>
                  <Input
                    id="camp-cta"
                    value={campCta}
                    onChange={(e) => setCampCta(e.target.value)}
                    placeholder="e.g. Learn More"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="camp-budget-per-k">Budget per 1,000 emails</Label>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>$</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="camp-budget-per-k"
                        inputMode="numeric"
                        placeholder="0"
                        value={campBudgetPerK}
                        onChange={(e) =>
                          setCampBudgetPerK(e.target.value.replace(/\D/g, ""))
                        }
                      />
                    </InputGroup>
                    <p className="text-xs text-muted-foreground">
                      How much you&apos;ll pay for every 1,000 subscribers reached
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="camp-max-budget">Max budget</Label>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <InputGroupText>$</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        id="camp-max-budget"
                        inputMode="numeric"
                        placeholder="0"
                        value={campMaxBudget}
                        onChange={(e) =>
                          setCampMaxBudget(e.target.value.replace(/\D/g, ""))
                        }
                      />
                    </InputGroup>
                    <p className="text-xs text-muted-foreground">
                      The most you&apos;ll spend on a single send
                    </p>
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
              <CardFooter className="justify-end border-t px-6 pt-4">
                <Button disabled={!campaignChanged}>Save</Button>
              </CardFooter>
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
