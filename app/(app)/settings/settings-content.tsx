"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { type ColumnDef } from "@tanstack/react-table"
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
import { DataTable } from "@/components/ui/data-table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { VerticalPicker } from "@/components/vertical-picker"
import { EmailBlockPreview } from "@/components/email-block-preview"
import { currentUser, formatCurrency } from "@/lib/mock-data"
import type { Vertical } from "@/lib/mock-data"
import { Globe, LinkSimple, SignOut, Plus, PencilSimple } from "@phosphor-icons/react"

// ── Campaign mock data ───────────────────────────────────────
// Prototype-only data — defined here to keep mock-data.ts clean

type CampaignStatus = "active" | "scheduled" | "ended" | "draft"

interface Campaign {
  id: string
  name: string
  headline: string
  body: string
  cta: string
  ctaUrl: string
  maxBudget: number
  status: CampaignStatus
  startDate: string
  endDate?: string
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-1",
    name: "Course Creator Accelerator — Spring",
    headline: "The Course Creator Accelerator",
    body: "Build and launch a 6-figure online course in 12 weeks. Alex Johnson's proven system has generated over $2M in student revenue. Limited spots available for the spring cohort.",
    cta: "Apply Now",
    ctaUrl: "https://alexjohnson.co/accelerator",
    maxBudget: 500,
    status: "active",
    startDate: "2025-02-01",
    endDate: "2025-04-30",
  },
  {
    id: "camp-2",
    name: "Summer Intensive Launch",
    headline: "Scale Your Knowledge Business",
    body: "Alex Johnson's Course Creator Accelerator has helped 200+ entrepreneurs package their expertise into profitable online courses. Join the next cohort and build your course with expert guidance.",
    cta: "Learn More",
    ctaUrl: "https://alexjohnson.co/accelerator",
    maxBudget: 400,
    status: "scheduled",
    startDate: "2025-05-01",
    endDate: "2025-07-31",
  },
  {
    id: "camp-3",
    name: "Free Masterclass Series",
    headline: "Build a Knowledge Business From Scratch",
    body: "Join Alex Johnson's free 3-part masterclass and learn the framework behind a $2M+ course business. Replay available for 48 hours.",
    cta: "Watch Free",
    ctaUrl: "https://alexjohnson.co/masterclass",
    maxBudget: 300,
    status: "ended",
    startDate: "2024-11-01",
    endDate: "2025-01-31",
  },
  {
    id: "camp-4",
    name: "Workshop Bundle Promo",
    headline: "The Creator Workshop Bundle",
    body: "Get access to 5 hands-on workshops covering course creation, email marketing, sales funnels, community building, and launch strategy.",
    cta: "Get the Bundle",
    ctaUrl: "https://alexjohnson.co/bundle",
    maxBudget: 350,
    status: "draft",
    startDate: "",
  },
]

function getCampaignStatusColor(status: CampaignStatus): string {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
    case "scheduled":
      return "bg-[#9FC2CC]/50 text-[#1E3A4D] dark:bg-[#3A6278]/40 dark:text-[#9FC2CC]"
    case "ended":
      return "bg-[#D7CBD5]/50 text-[#352938] dark:bg-[#52405B]/40 dark:text-[#D7CBD5]"
    case "draft":
      return "bg-muted text-muted-foreground"
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—"
  const date = new Date(dateStr + "T00:00:00")
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// ── Main component ───────────────────────────────────────────

export function SettingsContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "both"

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
  const [verticals, setVerticals] = useState<Vertical[]>(currentUser.verticals)

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

  // ── Campaign state ─────────────────────────────────────────
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Sheet form fields
  const [editName, setEditName] = useState("")
  const [editHeadline, setEditHeadline] = useState("")
  const [editBody, setEditBody] = useState("")
  const [editCta, setEditCta] = useState("")
  const [editCtaUrl, setEditCtaUrl] = useState("")
  const [editMaxBudget, setEditMaxBudget] = useState("")

  const activeCampaign = campaigns.find((c) => c.status === "active")

  function openEditSheet(campaign: Campaign) {
    setEditingCampaign(campaign)
    setIsCreating(false)
    setEditName(campaign.name)
    setEditHeadline(campaign.headline)
    setEditBody(campaign.body)
    setEditCta(campaign.cta)
    setEditCtaUrl(campaign.ctaUrl)
    setEditMaxBudget(campaign.maxBudget.toString())
    setSheetOpen(true)
  }

  function openCreateSheet() {
    setEditingCampaign(null)
    setIsCreating(true)
    setEditName("")
    setEditHeadline("")
    setEditBody("")
    setEditCta("Learn More")
    setEditCtaUrl("")
    setEditMaxBudget("")
    setSheetOpen(true)
  }

  function handleSaveCampaign() {
    if (isCreating) {
      // Add new draft campaign
      const newCampaign: Campaign = {
        id: `camp-${Date.now()}`,
        name: editName || "Untitled Campaign",
        headline: editHeadline,
        body: editBody,
        cta: editCta,
        ctaUrl: editCtaUrl,
        maxBudget: parseInt(editMaxBudget) || 0,
        status: "draft",
        startDate: "",
      }
      setCampaigns((prev) => [...prev, newCampaign])
    } else if (editingCampaign) {
      // Update existing campaign
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === editingCampaign.id
            ? {
                ...c,
                name: editName,
                headline: editHeadline,
                body: editBody,
                cta: editCta,
                ctaUrl: editCtaUrl,
                maxBudget: parseInt(editMaxBudget) || 0,
              }
            : c
        )
      )
    }
    setSheetOpen(false)
  }

  function handleSetActive(campaignId: string) {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) return { ...c, status: "active" as const }
        if (c.status === "active") return { ...c, status: "ended" as const }
        return c
      })
    )
  }

  function handleSchedule(campaignId: string) {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId ? { ...c, status: "scheduled" as const } : c
      )
    )
  }

  // ── Campaign table columns ─────────────────────────────────
  const campaignColumns = useMemo<ColumnDef<Campaign>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Campaign",
        cell: ({ row }) => (
          <button
            onClick={() => openEditSheet(row.original)}
            className="text-left font-medium cursor-pointer"
          >
            {row.original.name}
          </button>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
          const s = row.original.status
          const label = s.charAt(0).toUpperCase() + s.slice(1)
          return (
            <Badge variant="secondary" className={getCampaignStatusColor(s)}>
              {label}
            </Badge>
          )
        },
      },
      {
        id: "budget",
        header: "Budget",
        cell: ({ row }) => (
          <span className="tabular-nums text-muted-foreground">
            {formatCurrency(row.original.maxBudget)}/send
          </span>
        ),
      },
      {
        id: "dates",
        header: "Dates",
        cell: ({ row }) => {
          const c = row.original
          if (!c.startDate) return <span className="text-muted-foreground">—</span>
          return (
            <span className="text-xs text-muted-foreground">
              {formatDate(c.startDate)}
              {c.endDate ? ` – ${formatDate(c.endDate)}` : ""}
            </span>
          )
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const c = row.original
          return (
            <div className="flex justify-end gap-1.5">
              {(c.status === "draft" || c.status === "ended") && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSchedule(c.id)}
                  >
                    Schedule
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSetActive(c.id)}
                  >
                    Set Active
                  </Button>
                </>
              )}
              {c.status === "scheduled" && (
                <Button
                  size="sm"
                  onClick={() => handleSetActive(c.id)}
                >
                  Set Active
                </Button>
              )}
              {c.status === "active" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditSheet(c)}
                >
                  Edit
                </Button>
              )}
            </div>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [campaigns]
  )

  // ── Account data ───────────────────────────────────────────
  const joinedDate = new Date(currentUser.joinedDate)
  const memberSince = joinedDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  // ── Which tab is default ───────────────────────────────────
  const defaultTab = "profile"

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile, campaigns, and account.
        </p>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList variant="line">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {isPublisher && (
            <TabsTrigger value="publisher">Publisher Settings</TabsTrigger>
          )}
          {isSponsor && (
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          )}
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* ── Profile Tab ────────────────────────────────────── */}
        <TabsContent value="profile" className="mt-6 space-y-8">
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
                <Label>Verticals</Label>
                <VerticalPicker selected={verticals} onChange={setVerticals} />
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
          <TabsContent value="publisher" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    The number of subscribers on your email broadcast list.
                  </p>
                </div>

                {audienceNum >= 1000 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      Engagement tier:
                    </span>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-50 text-emerald-700"
                    >
                      High
                    </Badge>
                  </div>
                )}

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
          <TabsContent value="campaigns" className="mt-6 space-y-8">
            {/* Active campaign card */}
            {activeCampaign ? (
              <Card>
                <CardHeader>
                  <CardTitle>Active Campaign</CardTitle>
                  <CardDescription>
                    This is the promotion currently being sent to publishers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <p className="font-medium">{activeCampaign.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(activeCampaign.startDate)}
                        {activeCampaign.endDate
                          ? ` – ${formatDate(activeCampaign.endDate)}`
                          : ""}
                        {" · "}
                        {formatCurrency(activeCampaign.maxBudget)}/send
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditSheet(activeCampaign)}
                    >
                      <PencilSimple className="size-3.5" />
                      Edit
                    </Button>
                  </div>

                  <EmailBlockPreview
                    headline={activeCampaign.headline}
                    body={activeCampaign.body}
                    cta={activeCampaign.cta}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No active campaign. Set one active from the list below.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Campaign history table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">All Campaigns</h2>
                <Button size="sm" onClick={openCreateSheet}>
                  <Plus className="size-3.5" />
                  New Campaign
                </Button>
              </div>

              <DataTable
                columns={campaignColumns}
                data={campaigns}
                pageSize={10}
              />
            </div>
          </TabsContent>
        )}

        {/* ── Account Tab ────────────────────────────────────── */}
        <TabsContent value="account" className="mt-6 space-y-8">
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

      {/* ── Campaign edit/create sheet ─────────────────────── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              {isCreating ? "New Campaign" : "Edit Campaign"}
            </SheetTitle>
            <SheetDescription>
              {isCreating
                ? "Set up a new promotion to send to publishers."
                : "Update your campaign details. Changes apply immediately."}
            </SheetDescription>
          </SheetHeader>

          <SheetBody className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium">Campaign name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. Spring Product Launch"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-xs font-medium">Headline</label>
              <Input
                value={editHeadline}
                onChange={(e) => setEditHeadline(e.target.value)}
                placeholder="The headline publishers will see"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium">Body</label>
              <Textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="min-h-24"
                placeholder="2-3 sentences about your offer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium">Call to action</label>
              <Input
                value={editCta}
                onChange={(e) => setEditCta(e.target.value)}
                placeholder="e.g. Learn More"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium">Destination URL</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={editCtaUrl}
                  onChange={(e) => setEditCtaUrl(e.target.value)}
                  placeholder="https://yoursite.com/offer"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium">
                Maximum budget per send
              </label>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <InputGroupText>$</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  inputMode="numeric"
                  placeholder="0"
                  value={editMaxBudget}
                  onChange={(e) =>
                    setEditMaxBudget(e.target.value.replace(/\D/g, ""))
                  }
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>per send</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <Separator />

            {/* Live preview */}
            <div className="space-y-2">
              <label className="text-xs font-medium">Preview</label>
              <EmailBlockPreview
                headline={editHeadline || "Your headline here"}
                body={editBody || "Your ad body will appear here..."}
                cta={editCta || "Learn More"}
              />
            </div>
          </SheetBody>

          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={handleSaveCampaign}>
              {isCreating ? "Create Campaign" : "Save Changes"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
