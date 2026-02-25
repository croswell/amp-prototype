"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import { currentUser } from "@/lib/mock-data"
import type { Role } from "@/lib/mock-data"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowRight,
  CircleNotch,
  Globe,
  LinkSimple,
} from "@phosphor-icons/react"

// ── Step definitions ─────────────────────────────────────────
// "Sign in with Kajabi" replaces the old signup/OTP/links/niches flow.
// Kajabi data is "imported" automatically during the connecting step.

type Step =
  | "kajabi-signin"
  | "connecting"
  | "profile-confirm"
  | "publisher-setup"
  | "links"
  | "generating"
  | "profile"

// Segmented progress — 2 visible steps: calculator, links
const progressSteps: Step[] = ["profile-confirm", "publisher-setup", "links", "profile"]

function getFilledSegments(step: Step): number {
  const index = progressSteps.indexOf(step)
  if (index === -1) return progressSteps.length // generating/profile = all filled
  return index + 1
}

// ── Revenue calculation ──────────────────────────────────────
// Matches the pitch: 10K subs + high engagement → $250 recommended fee
// That's $25 per 1,000 subscribers at high engagement.

function calculateRecommendedFee(subscribers: number): number {
  const fee = subscribers * 0.025
  return Math.round(fee / 25) * 25 // Round to nearest $25
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

  // Shared form state
  const [step, setStep] = useState<Step>("kajabi-signin")
  const role: Role = "publisher"
  const [website, setWebsite] = useState("")
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    instagram: "",
    linkedin: "",
  })

  // Publisher-specific state — pre-filled from Kajabi data during "connecting"
  const [audienceSize, setAudienceSize] = useState("")
  const [sendFee, setSendFee] = useState("")
  const [promotionsPerMonth, setPromotionsPerMonth] = useState(2)

  // Auto-fill recommended fee when audience size changes
  const audienceNum = parseInt(audienceSize.replace(/,/g, "")) || 0
  const recommendedFee = calculateRecommendedFee(audienceNum)

  // When audience size is first entered, pre-fill the fee
  useEffect(() => {
    if (audienceNum > 0 && sendFee === "") {
      setSendFee(recommendedFee.toString())
    }
  }, [audienceNum, recommendedFee, sendFee])

  // Revenue projection
  const feeNum = parseInt(sendFee) || 0
  const annualRevenue = feeNum * promotionsPerMonth * 12

  // "Connecting to Kajabi…" spinner — 2s, then pre-fill and advance
  useEffect(() => {
    if (step !== "connecting") return
    const timer = setTimeout(() => {
      setAudienceSize(currentUser.subscriberCount.toLocaleString("en-US"))
      setSendFee(currentUser.recommendedFee.toString())
      setStep("profile-confirm")
    }, 2000)
    return () => clearTimeout(timer)
  }, [step])

  // After "generating" spinner, show the profile preview
  useEffect(() => {
    if (step !== "generating") return
    const timer = setTimeout(() => setStep("profile"), 2500)
    return () => clearTimeout(timer)
  }, [step])

  // ── Helpers ──────────────────────────────────────────────

  const canContinuePublisher = audienceNum >= 1000 && feeNum > 0

  // Format a number with commas as the user types (e.g. 10,000)
  function handleAudienceChange(value: string) {
    const raw = value.replace(/,/g, "").replace(/\D/g, "")
    if (raw === "") {
      setAudienceSize("")
      setSendFee("")
      return
    }
    const formatted = parseInt(raw).toLocaleString("en-US")
    setAudienceSize(formatted)
    // Reset fee so it auto-fills with new recommendation
    setSendFee("")
  }

  // ── Show/hide progress bar ─────────────────────────────────
  const showProgress =
    step === "profile-confirm" ||
    step === "publisher-setup" ||
    step === "links" ||
    step === "profile"

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-8">
        {showProgress && (
          <div className="mx-auto flex w-full max-w-[120px] gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${
                  i < getFilledSegments(step)
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
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-medium tracking-tight">
                Welcome to Amplify
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Amplify connects Kajabi creators for cross-promotion. Sign in to
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

        {/* ── Step 3: Profile Confirmation ──────────────────── */}
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
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
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

        {/* ── Step 5: Add Links ────────────────────────────── */}
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
                      setSocialLinks({
                        ...socialLinks,
                        twitter: e.target.value,
                      })
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
                      setSocialLinks({
                        ...socialLinks,
                        instagram: e.target.value,
                      })
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
                      setSocialLinks({
                        ...socialLinks,
                        linkedin: e.target.value,
                      })
                    }
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

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

        {/* ── Step 6a: Publisher Setup — Revenue Reveal ──── */}
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
              {/* Broadcast audience size */}
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

              {/* Engagement tier — auto-calculated in production */}
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

              {/* Send fee */}
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

              {/* Promotions per month */}
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

            {/* ── Revenue Projection — THE AHA MOMENT ──── */}
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

        {/* ── Generating ──────────────────────────────────── */}
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

        {/* ── Profile Preview ─────────────────────────────── */}
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
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
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
                  <span className="text-muted-foreground">
                    Audience
                  </span>
                  <span className="font-medium">
                    {audienceSize} subscribers
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-3 text-sm">
                  <span className="text-muted-foreground">
                    Engagement
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-700"
                  >
                    High
                  </Badge>
                </div>
                <div className="flex items-center justify-between border-t pt-3 text-sm">
                  <span className="text-muted-foreground">
                    Send fee
                  </span>
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
              onClick={() =>
                router.push("/dashboard?role=publisher")
              }
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
