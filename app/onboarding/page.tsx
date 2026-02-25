"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { EmailBlockPreview } from "@/components/email-block-preview"
import { currentUser } from "@/lib/mock-data"
import type { Role } from "@/lib/mock-data"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowRight,
  CircleNotch,
  Globe,
  LinkSimple,
  Broadcast,
  Megaphone,
} from "@phosphor-icons/react"

// ── Step definitions ─────────────────────────────────────────

type Step =
  | "kajabi-signin"
  | "connecting"
  | "role-select"
  // Publisher path
  | "profile-confirm"
  | "publisher-setup"
  | "links"
  | "generating"
  | "profile"
  // Sponsor path
  | "sponsor-links"
  | "sponsor-generating"
  | "sponsor-profile"
  | "sponsor-campaign"

// Progress segments per path
const publisherSteps: Step[] = ["role-select", "profile-confirm", "publisher-setup", "links", "profile"]
const sponsorSteps: Step[] = ["role-select", "sponsor-links", "sponsor-profile", "sponsor-campaign"]

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

function calculateRecommendedFee(subscribers: number): number {
  const fee = subscribers * 0.025
  return Math.round(fee / 25) * 25
}

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
  const [website, setWebsite] = useState("")
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    instagram: "",
    linkedin: "",
  })

  // Publisher-specific state
  const [audienceSize, setAudienceSize] = useState("")
  const [sendFee, setSendFee] = useState("")
  const [promotionsPerMonth, setPromotionsPerMonth] = useState(2)

  const audienceNum = parseInt(audienceSize.replace(/,/g, "")) || 0
  const recommendedFee = calculateRecommendedFee(audienceNum)

  useEffect(() => {
    if (audienceNum > 0 && sendFee === "") {
      setSendFee(recommendedFee.toString())
    }
  }, [audienceNum, recommendedFee, sendFee])

  const feeNum = parseInt(sendFee) || 0
  const annualRevenue = feeNum * promotionsPerMonth * 12

  // Sponsor campaign state
  const [campaignName, setCampaignName] = useState("")
  const [campaignHeadline, setCampaignHeadline] = useState("")
  const [campaignBody, setCampaignBody] = useState("")
  const [campaignCta, setCampaignCta] = useState("Learn More")
  const [campaignBudget, setCampaignBudget] = useState("")

  // "Connecting to Kajabi…" spinner
  useEffect(() => {
    if (step !== "connecting") return
    const timer = setTimeout(() => {
      setAudienceSize(currentUser.subscriberCount.toLocaleString("en-US"))
      setSendFee(currentUser.recommendedFee.toString())
      setStep("role-select")
    }, 2000)
    return () => clearTimeout(timer)
  }, [step])

  // Publisher "generating" spinner
  useEffect(() => {
    if (step !== "generating") return
    const timer = setTimeout(() => setStep("profile"), 2500)
    return () => clearTimeout(timer)
  }, [step])

  // Sponsor "generating" spinner
  useEffect(() => {
    if (step !== "sponsor-generating") return
    const timer = setTimeout(() => setStep("sponsor-profile"), 2500)
    return () => clearTimeout(timer)
  }, [step])

  // ── Helpers ──────────────────────────────────────────────

  const canContinuePublisher = audienceNum >= 1000 && feeNum > 0
  const canContinueCampaign = campaignHeadline.trim() !== "" && campaignBody.trim() !== ""

  function handleAudienceChange(value: string) {
    const raw = value.replace(/,/g, "").replace(/\D/g, "")
    if (raw === "") {
      setAudienceSize("")
      setSendFee("")
      return
    }
    const formatted = parseInt(raw).toLocaleString("en-US")
    setAudienceSize(formatted)
    setSendFee("")
  }

  // ── Show/hide progress bar ─────────────────────────────────
  const showProgress =
    step === "role-select" ||
    step === "profile-confirm" ||
    step === "publisher-setup" ||
    step === "links" ||
    step === "profile" ||
    step === "sponsor-links" ||
    step === "sponsor-profile" ||
    step === "sponsor-campaign"

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-8">
        {showProgress && (
          <div className="mx-auto flex w-full max-w-[120px] gap-1.5">
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
              <img src="/icon-black.svg" alt="Amplify" className="size-12 rounded-md" />
              <h1 className="text-2xl font-medium tracking-tight">
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
              <h1 className="text-2xl font-medium tracking-tight">
                Connecting to Kajabi&hellip;
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Importing your profile and audience data.
              </p>
            </div>
          </div>
        )}

        {/* ── Step 3: Role Selection ───────────────────────── */}
        {step === "role-select" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-medium tracking-tight">
                How will you use Amplify?
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Choose how you want to get started. You can always do both later.
              </p>
            </div>

            <div className="grid gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("publisher")}
                className={`flex items-start gap-4 rounded-lg p-5 text-left transition-colors hover:bg-muted/50 ${
                  selectedRole === "publisher"
                    ? "border border-border ring-2 ring-primary"
                    : "border border-border"
                }`}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Broadcast className="size-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">I want to earn from promotions</p>
                  <p className="text-sm text-muted-foreground">
                    Monetize your email list by featuring curated sponsor content in your broadcasts.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("sponsor")}
                className={`flex items-start gap-4 rounded-lg p-5 text-left transition-colors hover:bg-muted/50 ${
                  selectedRole === "sponsor"
                    ? "border border-border ring-2 ring-primary"
                    : "border border-border"
                }`}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                  <Megaphone className="size-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">I want to promote my product</p>
                  <p className="text-sm text-muted-foreground">
                    Reach new audiences by sponsoring promotions in other creators' newsletters.
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
                  setStep("profile-confirm")
                } else {
                  setRole("sponsor")
                  setStep("sponsor-links")
                }
              }}
            >
              Continue
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        )}

        {/* ── Publisher: Profile Confirmation ──────────────── */}
        {step === "profile-confirm" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-medium tracking-tight">
                We found your account
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Here&apos;s your profile and email stats from Kajabi.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-sm border p-8">
              <Avatar className="size-16">
                <AvatarFallback className="text-lg">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 text-center">
                <p className="text-lg font-medium">{currentUser.name}</p>
                <p className="text-pretty text-sm text-muted-foreground">
                  {currentUser.tagline}
                </p>
              </div>

              <div className="flex w-full flex-col gap-3">
                <div className="flex items-center justify-between border-t pt-3 text-sm">
                  <span className="text-muted-foreground">Subscribers</span>
                  <span className="font-medium">
                    {currentUser.subscriberCount.toLocaleString("en-US")}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-3 text-sm">
                  <span className="text-muted-foreground">Open rate</span>
                  <span className="font-medium">{currentUser.openRate}%</span>
                </div>
                <div className="flex items-center justify-between border-t pt-3 text-sm">
                  <span className="text-muted-foreground">Click rate</span>
                  <span className="font-medium">{currentUser.clickRate}%</span>
                </div>
                <div className="flex w-full flex-wrap gap-1.5 border-t pt-3">
                  {currentUser.verticals.map((v) => (
                    <Badge key={v} variant="secondary">
                      {v}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={() => setStep("publisher-setup")}>
              Continue
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        )}

        {/* ── Publisher: Revenue Reveal ────────────────────── */}
        {step === "publisher-setup" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-medium tracking-tight">
                See your earning potential
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Tell us about your broadcast audience and we&apos;ll show you
                what you could earn with Amplify.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="audience-size">
                  Broadcast audience size
                </Label>
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
                  <span className="text-xs text-muted-foreground">
                    Based on your last quarter of broadcast performance
                  </span>
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
                {audienceNum >= 1000 && (
                  <p className="text-xs text-muted-foreground">
                    Recommended:{" "}
                    <button
                      type="button"
                      className="font-medium text-foreground underline underline-offset-2"
                      onClick={() =>
                        setSendFee(recommendedFee.toString())
                      }
                    >
                      {formatCurrency(recommendedFee)}
                    </button>{" "}
                    based on your audience size and engagement
                  </p>
                )}
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
            </div>

            <div className="rounded-sm border bg-muted/50 p-6">
              <p className="text-sm font-medium text-muted-foreground">
                Your projected annual revenue
              </p>
              <p className="mt-1 text-4xl font-semibold tracking-tight">
                {formatCurrency(annualRevenue)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {formatCurrency(feeNum)}/send &times;{" "}
                {promotionsPerMonth}/month &times; 12 months
              </p>
            </div>

            <Button
              className="w-full"
              disabled={!canContinuePublisher}
              onClick={() => setStep("links")}
            >
              Continue
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        )}

        {/* ── Publisher: Add Links ─────────────────────────── */}
        {step === "links" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-medium tracking-tight">
                Add your links
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Help others vet you before partnering. All fields are
                optional.
              </p>
            </div>

            <LinksForm
              website={website}
              setWebsite={setWebsite}
              socialLinks={socialLinks}
              setSocialLinks={setSocialLinks}
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("generating")}
              >
                Skip
              </Button>
              <Button
                className="flex-1"
                onClick={() => setStep("generating")}
              >
                Continue
                <ArrowRight data-icon="inline-end" className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Publisher: Generating ────────────────────────── */}
        {step === "generating" && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <CircleNotch className="size-8 animate-spin text-muted-foreground" />
            <div className="space-y-2">
              <h1 className="text-2xl font-medium tracking-tight">
                Setting up your publisher profile
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Hang tight — we&apos;re getting everything ready.
              </p>
            </div>
          </div>
        )}

        {/* ── Publisher: Profile Preview ───────────────────── */}
        {step === "profile" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-medium tracking-tight">
                Your publisher profile is ready
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Here&apos;s how you&apos;ll appear to sponsors in the network.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-sm border p-8">
              <Avatar className="size-16">
                <AvatarFallback className="text-lg">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 text-center">
                <p className="text-lg font-medium">{currentUser.name}</p>
                <p className="text-pretty text-sm text-muted-foreground">
                  Publisher
                </p>
              </div>

              <div className="flex w-full flex-col gap-3">
                <div className="flex items-center justify-between border-t pt-3 text-sm">
                  <span className="text-muted-foreground">Audience</span>
                  <span className="font-medium">
                    {audienceSize} subscribers
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-3 text-sm">
                  <span className="text-muted-foreground">Engagement</span>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-700"
                  >
                    High
                  </Badge>
                </div>
                <div className="flex items-center justify-between border-t pt-3 text-sm">
                  <span className="text-muted-foreground">Send fee</span>
                  <span className="font-medium">
                    {formatCurrency(feeNum)}
                  </span>
                </div>
              </div>

              {currentUser.verticals.length > 0 && (
                <div className="flex w-full flex-wrap gap-1.5 border-t pt-3">
                  {currentUser.verticals.map((v) => (
                    <Badge key={v} variant="secondary">
                      {v}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button
              className="w-full"
              onClick={() => router.push("/dashboard?role=publisher")}
            >
              Continue to Dashboard
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        )}

        {/* ── Sponsor: Add Links ──────────────────────────── */}
        {step === "sponsor-links" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-medium tracking-tight">
                Add your links
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Publishers will check these before accepting your promotions.
                All fields are optional.
              </p>
            </div>

            <LinksForm
              website={website}
              setWebsite={setWebsite}
              socialLinks={socialLinks}
              setSocialLinks={setSocialLinks}
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("sponsor-generating")}
              >
                Skip
              </Button>
              <Button
                className="flex-1"
                onClick={() => setStep("sponsor-generating")}
              >
                Continue
                <ArrowRight data-icon="inline-end" className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Sponsor: Generating ─────────────────────────── */}
        {step === "sponsor-generating" && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <CircleNotch className="size-8 animate-spin text-muted-foreground" />
            <div className="space-y-2">
              <h1 className="text-2xl font-medium tracking-tight">
                Setting up your sponsor profile
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Hang tight — we&apos;re getting everything ready.
              </p>
            </div>
          </div>
        )}

        {/* ── Sponsor: Profile Preview ────────────────────── */}
        {step === "sponsor-profile" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-medium tracking-tight">
                Your sponsor profile is ready
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Here&apos;s how you&apos;ll appear to publishers in the network.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-sm border p-8">
              <Avatar className="size-16">
                <AvatarFallback className="text-lg">
                  {currentUser.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 text-center">
                <p className="text-lg font-medium">{currentUser.name}</p>
                <p className="text-pretty text-sm text-muted-foreground">
                  {currentUser.tagline}
                </p>
              </div>

              {currentUser.verticals.length > 0 && (
                <div className="flex w-full flex-wrap gap-1.5 border-t pt-3">
                  {currentUser.verticals.map((v) => (
                    <Badge key={v} variant="secondary">
                      {v}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button
              className="w-full"
              onClick={() => setStep("sponsor-campaign")}
            >
              Create your first campaign
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        )}

        {/* ── Sponsor: Create First Campaign ──────────────── */}
        {step === "sponsor-campaign" && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-medium tracking-tight">
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

              <div className="space-y-2">
                <Label htmlFor="campaign-budget">Budget per send</Label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="campaign-budget"
                    inputMode="numeric"
                    placeholder="0"
                    value={campaignBudget}
                    onChange={(e) =>
                      setCampaignBudget(e.target.value.replace(/\D/g, ""))
                    }
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>per send</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </div>
            </div>

            {/* Live preview */}
            {campaignHeadline && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Preview</p>
                <EmailBlockPreview
                  headline={campaignHeadline}
                  body={campaignBody || "Your ad body will appear here..."}
                  cta={campaignCta || "Learn More"}
                />
              </div>
            )}

            <Button
              className="w-full"
              disabled={!canContinueCampaign}
              onClick={() => router.push("/dashboard?role=sponsor")}
            >
              Continue to Dashboard
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Shared Links Form ────────────────────────────────────────

function LinksForm({
  website,
  setWebsite,
  socialLinks,
  setSocialLinks,
}: {
  website: string
  setWebsite: (v: string) => void
  socialLinks: { twitter: string; instagram: string; linkedin: string }
  setSocialLinks: (v: { twitter: string; instagram: string; linkedin: string }) => void
}) {
  return (
    <div className="space-y-4 rounded-sm border p-6">
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
        <Label htmlFor="twitter">X / Twitter</Label>
        <div className="relative">
          <LinkSimple className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="twitter"
            placeholder="https://x.com/username"
            value={socialLinks.twitter}
            onChange={(e) =>
              setSocialLinks({ ...socialLinks, twitter: e.target.value })
            }
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instagram">Instagram</Label>
        <div className="relative">
          <LinkSimple className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="instagram"
            placeholder="https://instagram.com/username"
            value={socialLinks.instagram}
            onChange={(e) =>
              setSocialLinks({ ...socialLinks, instagram: e.target.value })
            }
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn</Label>
        <div className="relative">
          <LinkSimple className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="linkedin"
            placeholder="https://linkedin.com/in/username"
            value={socialLinks.linkedin}
            onChange={(e) =>
              setSocialLinks({ ...socialLinks, linkedin: e.target.value })
            }
            className="pl-9"
          />
        </div>
      </div>
    </div>
  )
}
