"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { EmailBlockPreview } from "@/components/email-block-preview"
import { EngagementBadge } from "@/components/engagement-badge"
import { StatCard } from "@/components/stat-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HeroCard } from "@/components/hero-card"
import { currentUser, formatNumber } from "@/lib/mock-data"
import type { Role, Vertical } from "@/lib/mock-data"

import {
  ArrowRight,
  CircleNotch,
  Broadcast,
  Megaphone,
  PencilSimple,
} from "@phosphor-icons/react"

// ── Step definitions ─────────────────────────────────────────

type Step =
  | "kajabi-signin"
  | "connecting"
  | "edit-profile"
  | "role-select"
  // Publisher path
  | "publisher-setup"
  | "profile"
  // Sponsor path
  | "sponsor-campaign"
  | "sponsor-profile"

// Progress segments per path
const publisherSteps: Step[] = ["role-select", "publisher-setup", "profile"]
const sponsorSteps: Step[] = ["role-select", "sponsor-campaign", "sponsor-profile"]

function getFilledSegments(step: Step, role: Role): number {
  const steps = role === "sponsor" ? sponsorSteps : publisherSteps
  const index = steps.indexOf(step)
  if (index === -1) return steps.length
  return index + 1
}

function getSegmentCount(role: Role): number {
  return role === "sponsor" ? sponsorSteps.length : publisherSteps.length
}

// ── Revenue calculation ──────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// ── Page component ───────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()

  // Shared state
  const [step, setStep] = useState<Step>("kajabi-signin")
  const [role, setRole] = useState<Role>("publisher")
  const [selectedRole, setSelectedRole] = useState<Role>("publisher")

  // Publisher profile state (pre-filled from Kajabi)
  const [profileName, setProfileName] = useState(currentUser.name)
  const [profileBio, setProfileBio] = useState(currentUser.bio)
  const [profileNiche, setProfileNiche] = useState<Vertical>(currentUser.verticals[0])

  // Publisher-specific state
  const [sendAudience, setSendAudience] = useState("")
  const [sendFee, setSendFee] = useState("")
  const [promotionsPerMonth, setPromotionsPerMonth] = useState(2)

  const feeNum = parseInt(sendFee) || 0
  const annualRevenue = feeNum * promotionsPerMonth * 12

  // Sponsor campaign state
  const [campaignName, setCampaignName] = useState("")
  const [campaignHeadline, setCampaignHeadline] = useState("")
  const [campaignBody, setCampaignBody] = useState("")
  const [campaignCta, setCampaignCta] = useState("Learn More")
  const [campaignBudgetPerK, setCampaignBudgetPerK] = useState("")
  const [campaignMaxBudget, setCampaignMaxBudget] = useState("")

  // "Connecting to Kajabi…" spinner
  useEffect(() => {
    if (step !== "connecting") return
    const timer = setTimeout(() => {
      setStep("edit-profile")
    }, 2000)
    return () => clearTimeout(timer)
  }, [step])

  // ── Helpers ──────────────────────────────────────────────

  const canContinueCampaign = campaignHeadline.trim() !== "" && campaignBody.trim() !== ""

  // ── Show/hide progress bar ─────────────────────────────────
  const showProgress =
    step === "role-select" ||
    step === "publisher-setup" ||
    step === "profile" ||
    step === "sponsor-campaign" ||
    step === "sponsor-profile"

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-card px-4 py-16">
      <div className="w-full max-w-lg space-y-8">
        {showProgress && (
          <div
            role="progressbar"
            aria-valuenow={getFilledSegments(step, role)}
            aria-valuemin={1}
            aria-valuemax={getSegmentCount(role)}
            aria-label="Onboarding progress"
            className="mx-auto flex w-full max-w-[120px] gap-1.5"
          >
            {Array.from({ length: getSegmentCount(role) }).map((_, i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                  i < getFilledSegments(step, role)
                    ? "bg-foreground"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        )}

        {/* ── Step 1: Sign in with Kajabi ──────────────────── */}
        {step === "kajabi-signin" && (
          <div className="mx-auto max-w-sm space-y-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <img src="/icon-black.svg" alt="Amplify" className="size-12 rounded-md dark:hidden" />
              <img src="/icon-white.svg" alt="Amplify" className="size-12 rounded-md hidden dark:block" />
              <h1 className="text-balance text-2xl font-medium tracking-tight">
                Welcome to Amplify
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Amplify connects Kajabi experts for cross-promotion. Sign in to
                import your audience data and get started.
              </p>
            </div>

            <Button
              className="w-full"
              onClick={() => setStep("connecting")}
            >
              Sign in with Kajabi
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        )}

        {/* ── Step 2: Connecting to Kajabi ──────────────────── */}
        {step === "connecting" && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <CircleNotch className="size-8 animate-spin text-muted-foreground" />
            <div className="space-y-2">
              <h1 className="text-balance text-2xl font-medium tracking-tight">
                Connecting to Kajabi&hellip;
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Importing your profile and audience data.
              </p>
            </div>
          </div>
        )}

        {/* ── Step 3: Edit Profile ────────────────────────── */}
        {step === "edit-profile" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-balance text-2xl font-medium tracking-tight">
                Set up your profile
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                We&apos;ve filled this in from your Kajabi account. Edit anything that needs updating.
              </p>
            </div>

            <div className="rounded-lg border p-6 space-y-4">
              <div className="flex justify-center">
                <button type="button" aria-label="Change profile photo" className="group relative cursor-pointer">
                  <Avatar className="size-16">
                    <AvatarFallback className="text-lg">
                      {profileName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <PencilSimple className="size-5 text-white" />
                  </div>
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-name">Name</Label>
                <Input
                  id="profile-name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-bio">Bio</Label>
                <Textarea
                  id="profile-bio"
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  className="min-h-24"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="niche-select">Niche</Label>
                <Select value={profileNiche} onValueChange={(v) => setProfileNiche(v as Vertical)}>
                  <SelectTrigger id="niche-select" className="w-full">
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
              </div>
            </div>

            <Button
              className="w-full"
              disabled={profileName.trim() === ""}
              onClick={() => setStep("role-select")}
            >
              Continue
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        )}

        {/* ── Step 4: Role Selection ───────────────────────── */}
        {step === "role-select" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-balance text-2xl font-medium tracking-tight">
                How do you want to get started?
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                You can always switch or do both later.
              </p>
            </div>

            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("publisher")}
                className={`flex items-start gap-4 rounded-lg p-5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  selectedRole === "publisher"
                    ? "border border-border ring-2 ring-primary"
                    : "border border-border"
                }`}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Broadcast className="size-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Publisher</p>
                  <p className="text-sm text-muted-foreground">
                    Run sponsored ads in your email broadcasts and get paid per send.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("sponsor")}
                className={`flex items-start gap-4 rounded-lg p-5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  selectedRole === "sponsor"
                    ? "border border-border ring-2 ring-primary"
                    : "border border-border"
                }`}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Megaphone className="size-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Sponsor</p>
                  <p className="text-sm text-muted-foreground">
                    Promote your product in other creators&apos; newsletters to reach new audiences.
                  </p>
                </div>
              </button>
            </div>

            <Button
              className="w-full"
              disabled={!selectedRole}
              onClick={() => {
                if (selectedRole === "publisher") {
                  setRole("publisher")
                  setStep("publisher-setup")
                } else {
                  setRole("sponsor")
                  setStep("sponsor-campaign")
                }
              }}
            >
              Continue
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        )}

        {/* ── Publisher: Revenue Reveal ────────────────────── */}
        {step === "publisher-setup" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-balance text-2xl font-medium tracking-tight">
                See your earning potential
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Based on your email stats, here&apos;s what you could earn with Amplify.
              </p>
            </div>

            {/* Email stats */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Subscribers" value={formatNumber(currentUser.subscriberCount)} />
              <StatCard label="Open Rate" value={`${currentUser.openRate}%`} />
              <StatCard label="Click Rate" value={`${currentUser.clickRate}%`} />
            </div>

            <EngagementBadge tier={currentUser.engagementTier} />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="send-audience">How many subscribers will you send ads to?</Label>
                <InputGroup>
                  <InputGroupInput
                    id="send-audience"
                    inputMode="numeric"
                    placeholder="0"
                    value={sendAudience}
                    onChange={(e) =>
                      setSendAudience(e.target.value.replace(/[^\d,]/g, ""))
                    }
                  />
                </InputGroup>
                <p className="text-xs text-muted-foreground">
                  You can send to all or a portion of your subscribers
                </p>
              </div>

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
                      className={`flex h-9 flex-1 items-center justify-center rounded-sm border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
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
            </div>

            <div className="rounded-sm border bg-muted/50 p-6">
              <p className="text-sm font-medium text-muted-foreground">
                Your projected annual revenue
              </p>
              <p className="mt-1 text-4xl font-semibold tracking-tight">
                {formatCurrency(annualRevenue)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatCurrency(feeNum)}/send
                {sendAudience && ` to ${parseInt(sendAudience.replace(/,/g, "")).toLocaleString("en-US")} subscribers`}
                {" "}&times; {promotionsPerMonth}/month &times; 12 months
              </p>
            </div>

            <Button
              className="w-full"
              disabled={feeNum <= 0}
              onClick={() => setStep("profile")}
            >
              Continue
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        )}

        {/* ── Publisher: Profile Preview ───────────────────── */}
        {step === "profile" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-balance text-2xl font-medium tracking-tight">
                Your publisher profile is ready
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Here&apos;s how you&apos;ll appear to sponsors in the network.
              </p>
            </div>

            <HeroCard hero={{ ...currentUser, name: profileName, bio: profileBio, verticals: [profileNiche, ...currentUser.verticals.filter(v => v !== profileNiche)], recommendedFee: parseInt(sendFee) || 0 }} showPublisherStats />

            <Button
              className="w-full"
              onClick={() => router.push("/home?role=publisher&new=true")}
            >
              Continue to Home
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        )}

        {/* ── Sponsor: Profile + Campaign Preview ─────────── */}
        {step === "sponsor-profile" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-balance text-2xl font-medium tracking-tight">
                You&apos;re all set
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Here&apos;s your sponsor profile and a preview of your ad.
              </p>
            </div>

            <HeroCard hero={{ ...currentUser, name: profileName, bio: profileBio, verticals: [profileNiche, ...currentUser.verticals.filter(v => v !== profileNiche)] }} />

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Ad preview</p>
              <EmailBlockPreview
                headline={campaignHeadline || "Your headline here"}
                body={campaignBody || "Your ad body will appear here..."}
                cta={campaignCta || "Learn More"}
              />
            </div>

            <Button
              className="w-full"
              onClick={() => router.push("/home?role=sponsor&new=true")}
            >
              Continue to Dashboard
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        )}

        {/* ── Sponsor: Create First Campaign ──────────────── */}
        {step === "sponsor-campaign" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-balance text-2xl font-medium tracking-tight">
                Create your first campaign
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                This is the promotion publishers will feature in their newsletters. You can edit this later.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign name</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g. Spring Product Launch"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Internal name — publishers won&apos;t see this.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-headline">Headline</Label>
                <Input
                  id="campaign-headline"
                  placeholder="The headline publishers will show"
                  value={campaignHeadline}
                  onChange={(e) => setCampaignHeadline(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-body">Body</Label>
                <Textarea
                  id="campaign-body"
                  placeholder="2–3 sentences about your offer"
                  value={campaignBody}
                  onChange={(e) => setCampaignBody(e.target.value)}
                  className="min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-cta">Call to action</Label>
                <Input
                  id="campaign-cta"
                  placeholder="e.g. Learn More"
                  value={campaignCta}
                  onChange={(e) => setCampaignCta(e.target.value)}
                />
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-budget-per-k">Budget per 1,000 emails</Label>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="campaign-budget-per-k"
                      inputMode="numeric"
                      placeholder="0"
                      value={campaignBudgetPerK}
                      onChange={(e) =>
                        setCampaignBudgetPerK(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </InputGroup>
                  <p className="text-xs text-muted-foreground">
                    How much you&apos;ll pay for every 1,000 subscribers reached
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-max-budget">Max budget</Label>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="campaign-max-budget"
                      inputMode="numeric"
                      placeholder="0"
                      value={campaignMaxBudget}
                      onChange={(e) =>
                        setCampaignMaxBudget(e.target.value.replace(/\D/g, ""))
                      }
                    />
                  </InputGroup>
                  <p className="text-xs text-muted-foreground">
                    The most you&apos;ll spend on a single send
                  </p>
                </div>
              </div>
            </div>

            {/* Live preview — always visible */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Preview</p>
              <EmailBlockPreview
                headline={campaignHeadline || "Your headline here"}
                body={campaignBody || "Your ad body will appear here..."}
                cta={campaignCta || "Learn More"}
              />
            </div>

            <Button
              className="w-full"
              disabled={!canContinueCampaign}
              onClick={() => setStep("sponsor-profile")}
            >
              Continue
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

