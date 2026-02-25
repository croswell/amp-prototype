"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
// Progress component no longer needed — using segmented bars instead
import { Badge } from "@/components/ui/badge"
import { VerticalPicker } from "@/components/vertical-picker"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import type { Role, Vertical } from "@/lib/mock-data"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ArrowRight,
  Newspaper,
  Megaphone,
  CircleNotch,
  Globe,
  LinkSimple,
  GoogleLogo,
} from "@phosphor-icons/react"

// ── Step definitions ─────────────────────────────────────────
// Steps branch after "niches" based on role selection.
// Publishers get a revenue reveal step. Sponsors get an ad setup step.

type Step =
  | "signup"
  | "otp"
  | "role"
  | "links"
  | "niches"
  | "publisher-setup"
  | "sponsor-setup"
  | "generating"
  | "profile"

// Segmented progress — 4 visible steps after signup/otp
const progressSteps: Step[] = ["role", "links", "niches"]
// The 4th segment is role-dependent (added dynamically)

function getFilledSegments(step: Step, role: Role | null): number {
  const steps = [...progressSteps, role === "sponsor" ? "sponsor-setup" : "publisher-setup"]
  const index = steps.indexOf(step)
  if (index === -1) return steps.length // generating/profile = all filled
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
  const [step, setStep] = useState<Step>("signup")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [role, setRole] = useState<Role | null>(null)
  const [website, setWebsite] = useState("")
  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    instagram: "",
    linkedin: "",
  })
  const [verticals, setVerticals] = useState<Vertical[]>([])

  // Publisher-specific state — pre-filled for the prototype
  const [audienceSize, setAudienceSize] = useState("10,000")
  const [sendFee, setSendFee] = useState("250")
  const [promotionsPerMonth, setPromotionsPerMonth] = useState(2)

  // Sponsor-specific state
  const [adHeadline, setAdHeadline] = useState("")
  const [adBody, setAdBody] = useState("")
  const [destinationUrl, setDestinationUrl] = useState("")
  const [maxBudget, setMaxBudget] = useState("")

  // OTP input refs for auto-focus between boxes
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

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

  // After "generating" spinner, show the profile preview
  useEffect(() => {
    if (step !== "generating") return
    const timer = setTimeout(() => setStep("profile"), 2500)
    return () => clearTimeout(timer)
  }, [step])

  // ── Helpers ──────────────────────────────────────────────

  const canContinueSignup =
    name.trim().length > 0 && email.trim().length > 0
  const canContinueOtp = otp.length === 6
  const canContinuePublisher = audienceNum >= 1000 && feeNum > 0
  const canContinueSponsor =
    adHeadline.trim().length > 0 &&
    adBody.trim().length > 0 &&
    destinationUrl.trim().length > 0

  // Handle typing in individual OTP boxes.
  function handleOtpChange(index: number, value: string) {
    if (value.length > 1) value = value.slice(-1)
    if (value && !/^\d$/.test(value)) return

    const digits = otp.split("")
    while (digits.length < 6) digits.push("")
    digits[index] = value
    setOtp(digits.join(""))

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  function handleOtpKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  // After niches, branch by role
  function handleNichesContinue() {
    if (role === "publisher") {
      setStep("publisher-setup")
    } else {
      setStep("sponsor-setup")
    }
  }

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
    step !== "signup" &&
    step !== "otp" &&
    step !== "generating" &&
    step !== "profile"

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-8">
        {showProgress && (
          <div className="flex w-full max-w-[200px] gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  i < getFilledSegments(step, role)
                    ? "bg-foreground"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        )}

        {/* ── Step 1: Sign Up ─────────────────────────────── */}
        {step === "signup" && (
          <div className="mx-auto max-w-sm space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-medium tracking-tight">
                Welcome to Amplify
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Sign up or sign in to get started.
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setStep("role")}
            >
              <GoogleLogo weight="bold" className="size-4" />
              Continue with Google
            </Button>

            {/* Separator */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your name</Label>
                <Input
                  id="name"
                  placeholder="Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <Button
              className="w-full"
              disabled={!canContinueSignup}
              onClick={() => setStep("otp")}
            >
              Continue with email
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        )}

        {/* ── Step 2: OTP Verification ────────────────────── */}
        {step === "otp" && (
          <div className="mx-auto max-w-sm space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-medium tracking-tight">
                Check your email
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-foreground">{email}</span>.
                Enter it below.
              </p>
            </div>

            <div className="grid grid-cols-6 gap-1.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[i] || ""}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="h-10 w-full rounded-sm border border-border bg-background text-center text-sm font-medium focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
                />
              ))}
            </div>

            <Button
              className="w-full"
              disabled={!canContinueOtp}
              onClick={() => setStep("role")}
            >
              Verify
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Didn&apos;t receive a code?{" "}
              <button className="font-medium text-foreground underline underline-offset-2">
                Resend
              </button>
            </p>
          </div>
        )}

        {/* ── Step 3: Choose Role ─────────────────────────── */}
        {/* Single role only — pitch says "one role, one focused experience" */}
        {step === "role" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-medium tracking-tight">
                How will you use Amplify?
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Choose the role that best describes you.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRole("publisher")}
                className={`flex flex-col items-center gap-3 rounded-sm border-2 p-6 text-center transition-colors ${
                  role === "publisher"
                    ? "border-foreground"
                    : "border-border hover:bg-muted"
                }`}
              >
                <Newspaper className="size-6" />
                <div>
                  <p className="text-sm font-medium">Publisher</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Earn by promoting others in your email broadcasts
                  </p>
                </div>
              </button>

              <button
                onClick={() => setRole("sponsor")}
                className={`flex flex-col items-center gap-3 rounded-sm border-2 p-6 text-center transition-colors ${
                  role === "sponsor"
                    ? "border-foreground"
                    : "border-border hover:bg-muted"
                }`}
              >
                <Megaphone className="size-6" />
                <div>
                  <p className="text-sm font-medium">Sponsor</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Pay to get promoted to engaged audiences
                  </p>
                </div>
              </button>
            </div>

            <Button
              className="w-full"
              disabled={role === null}
              onClick={() => setStep("links")}
            >
              Continue
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        )}

        {/* ── Step 4: Add Links ───────────────────────────── */}
        {step === "links" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-medium tracking-tight">
                Add your links
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                Help others vet you before partnering. All fields are
                optional.
              </p>
            </div>

            <div className="space-y-4">
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
                onClick={() => setStep("niches")}
              >
                Skip
              </Button>
              <Button className="flex-1" onClick={() => setStep("niches")}>
                Continue
                <ArrowRight data-icon="inline-end" className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 5: Select Niches ───────────────────────── */}
        {step === "niches" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-medium tracking-tight">
                {role === "publisher"
                  ? "What verticals will you promote?"
                  : "What verticals describe your product?"}
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                {role === "publisher"
                  ? "Select the niches that match your audience. This helps us find the right sponsors for you."
                  : "Select the verticals that describe your product. This helps us match you with the right publishers."}
              </p>
            </div>

            <VerticalPicker selected={verticals} onChange={setVerticals} />

            <Button
              className="w-full"
              disabled={verticals.length === 0}
              onClick={handleNichesContinue}
            >
              Continue
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        )}

        {/* ── Step 6a: Publisher Setup — Revenue Reveal ──── */}
        {/* This is the "aha moment" from the pitch. The hero sees what
            their audience is actually worth in promotion revenue. */}
        {step === "publisher-setup" && (
          <div className="space-y-6">
            <div className="space-y-2">
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
              onClick={() => setStep("generating")}
            >
              Continue
              <ArrowRight data-icon="inline-end" className="size-4" />
            </Button>
          </div>
        )}

        {/* ── Step 6b: Sponsor Setup — Ad Details ────── */}
        {/* One promotion. No campaign management, no multiple creatives. */}
        {step === "sponsor-setup" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-medium tracking-tight">
                Create your promotion
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                This is the ad that publishers will include in their email
                broadcasts. Keep it concise and compelling.
              </p>
            </div>

            <div className="space-y-4">
              {/* Headline */}
              <div className="space-y-2">
                <Label htmlFor="ad-headline">Headline</Label>
                <Input
                  id="ad-headline"
                  placeholder="e.g. Create Your First Online Course in 30 Days"
                  value={adHeadline}
                  onChange={(e) => setAdHeadline(e.target.value)}
                />
              </div>

              {/* Body */}
              <div className="space-y-2">
                <Label htmlFor="ad-body">Body</Label>
                <Textarea
                  id="ad-body"
                  placeholder="2-3 sentences about your product or offer. What makes it valuable? Why should someone click?"
                  value={adBody}
                  onChange={(e) => setAdBody(e.target.value)}
                  className="min-h-24"
                />
              </div>

              {/* Destination URL */}
              <div className="space-y-2">
                <Label htmlFor="destination-url">Destination URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="destination-url"
                    placeholder="https://yoursite.com/offer"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Where people land when they click your promotion.
                </p>
              </div>

              {/* Max budget per send */}
              <div className="space-y-2">
                <Label htmlFor="max-budget">
                  Maximum budget per send
                </Label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="max-budget"
                    inputMode="numeric"
                    placeholder="0"
                    value={maxBudget}
                    onChange={(e) =>
                      setMaxBudget(e.target.value.replace(/\D/g, ""))
                    }
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>per send</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <p className="text-xs text-muted-foreground">
                  The most you&apos;re willing to pay a publisher for one
                  email broadcast.
                </p>
              </div>
            </div>

            <Button
              className="w-full"
              disabled={!canContinueSponsor}
              onClick={() => setStep("generating")}
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
                {role === "publisher"
                  ? "Setting up your publisher profile"
                  : "Setting up your promotion"}
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
            <div className="space-y-2">
              <h1 className="text-2xl font-medium tracking-tight">
                {role === "publisher"
                  ? "Your publisher profile is ready"
                  : "Your promotion is ready"}
              </h1>
              <p className="text-pretty text-sm text-muted-foreground">
                {role === "publisher"
                  ? "Here's how you'll appear to sponsors in the network."
                  : "Here's a summary of your setup. You can edit this anytime."}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 rounded-sm border p-8">
              <Avatar className="size-16">
                <AvatarFallback className="text-lg">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1 text-center">
                <p className="text-lg font-medium">{name}</p>
                <p className="text-pretty text-sm text-muted-foreground">
                  {role === "publisher" ? "Publisher" : "Sponsor"}
                </p>
              </div>

              {/* Publisher-specific preview */}
              {role === "publisher" && (
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
              )}

              {/* Sponsor-specific preview */}
              {role === "sponsor" && (
                <div className="flex w-full flex-col gap-3">
                  <div className="border-t pt-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Your promotion
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {adHeadline}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {adBody.length > 120
                        ? adBody.slice(0, 120) + "..."
                        : adBody}
                    </p>
                  </div>
                  {maxBudget && (
                    <div className="flex items-center justify-between border-t pt-3 text-sm">
                      <span className="text-muted-foreground">
                        Max budget
                      </span>
                      <span className="font-medium">
                        {formatCurrency(parseInt(maxBudget))}/send
                      </span>
                    </div>
                  )}
                </div>
              )}

              {verticals.length > 0 && (
                <div className="flex w-full flex-wrap gap-1.5 border-t pt-3">
                  {verticals.map((v) => (
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
                router.push(`/dashboard?role=${role || "publisher"}`)
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
