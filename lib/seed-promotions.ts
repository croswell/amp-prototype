import type { PromotionRequest } from "./mock-data"

// ============================================================
// Curated promotion requests between Sarah (hero-1, publisher)
// and Jake (hero-4, sponsor) — each with a full timeline history.
// ============================================================

export const seedPromotions: PromotionRequest[] = [
  // ────────────────────────────────────────────────────────────
  // SPONSOR-INITIATED FLOW
  // ────────────────────────────────────────────────────────────


  // 6. Scheduled — broadcast created and scheduled
  {
    id: "seed-si-scheduled",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "scheduled",
    initiatedBy: "sponsor",
    brief:
      "Promoting the Course Launch Playbook — a comprehensive guide to launching and marketing an online course.",
    adHeadline: "Your Course Launch Playbook Is Ready",
    adBody:
      "Jake Morrison's 47-page playbook covers everything from pre-launch to post-launch. Email sequences, pricing strategies, and the exact timeline that's generated $2M+ in course sales.",
    adCta: "Download Free",
    adCtaUrl: "https://jakemorrison.io/playbook",
    proposedFee: 350,
    notes: "",
    scheduledAt: "2025-03-05T09:00:00Z",
    createdAt: "2025-01-20",
    updatedAt: "2025-02-18",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2025-01-20T10:00:00Z",
        note: "Promoting the Course Launch Playbook — a comprehensive guide to launching and marketing an online course.",
        copyAfter: {
          adHeadline: "Your Course Launch Playbook Is Ready",
          adBody:
            "Jake Morrison's 47-page playbook covers everything from pre-launch to post-launch. Email sequences, pricing strategies, and the exact timeline that's generated $2M+ in course sales.",
          adCta: "Download Free",
          adCtaUrl: "https://jakemorrison.io/playbook",
        },
      },
      {
        id: "evt-2",
        type: "copy_locked",
        actorId: "hero-4",
        timestamp: "2025-01-23T14:00:00Z",
      },
      {
        id: "evt-3",
        type: "broadcast_created",
        actorId: "hero-1",
        timestamp: "2025-02-15T11:00:00Z",
      },
      {
        id: "evt-4",
        type: "scheduled",
        actorId: "hero-1",
        timestamp: "2025-02-18T09:00:00Z",
        metadata: { scheduledAt: "2025-03-05T09:00:00Z" },
      },
    ],
  },

  // 7. Published — email sent
  {
    id: "seed-si-published",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "published",
    initiatedBy: "sponsor",
    brief:
      "Promoting the Creator Community membership — a private community for course creators to share strategies and get feedback.",
    adHeadline: "Join 500+ Course Creators Who Share What Works",
    adBody:
      "The Creator Community is where serious course creators compare notes, share launch results, and get feedback from peers who get it. No fluff, no gurus — just creators helping creators.",
    adCta: "Join the Community",
    adCtaUrl: "https://jakemorrison.io/community",
    proposedFee: 325,
    notes: "",
    createdAt: "2025-01-10",
    updatedAt: "2025-02-10",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2025-01-10T10:00:00Z",
        note: "Promoting the Creator Community membership — a private community for course creators.",
        copyAfter: {
          adHeadline: "Join 500+ Course Creators Who Share What Works",
          adBody:
            "The Creator Community is where serious course creators compare notes, share launch results, and get feedback from peers who get it. No fluff, no gurus — just creators helping creators.",
          adCta: "Join the Community",
          adCtaUrl: "https://jakemorrison.io/community",
        },
      },
      {
        id: "evt-2",
        type: "copy_locked",
        actorId: "hero-4",
        timestamp: "2025-01-13T11:00:00Z",
      },
      {
        id: "evt-3",
        type: "broadcast_created",
        actorId: "hero-1",
        timestamp: "2025-01-28T09:00:00Z",
      },
      {
        id: "evt-4",
        type: "scheduled",
        actorId: "hero-1",
        timestamp: "2025-01-28T09:30:00Z",
        metadata: { scheduledAt: "2025-02-05T09:00:00Z" },
      },
      {
        id: "evt-5",
        type: "published",
        actorId: "hero-1",
        timestamp: "2025-02-05T09:00:00Z",
      },
    ],
  },


  // 9. Declined — Sarah declined
  {
    id: "seed-si-declined",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "declined",
    initiatedBy: "sponsor",
    brief:
      "Promoting a new AI writing tool for course creators. It generates sales pages, email sequences, and module outlines from a brief description.",
    adHeadline: "Write Your Entire Course Sales Page in 10 Minutes",
    adBody:
      "CourseWriter AI generates complete sales pages, email sequences, and even module outlines — all from a brief description of your course. Early access pricing for the next 100 signups.",
    adCta: "Get Early Access",
    adCtaUrl: "https://jakemorrison.io/coursewriter",
    proposedFee: 400,
    notes: "",
    createdAt: "2025-02-01",
    updatedAt: "2025-02-03",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2025-02-01T10:00:00Z",
        note: "Promoting a new AI writing tool for course creators. It generates sales pages, email sequences, and module outlines.",
        copyAfter: {
          adHeadline: "Write Your Entire Course Sales Page in 10 Minutes",
          adBody:
            "CourseWriter AI generates complete sales pages, email sequences, and even module outlines — all from a brief description of your course. Early access pricing for the next 100 signups.",
          adCta: "Get Early Access",
          adCtaUrl: "https://jakemorrison.io/coursewriter",
        },
      },
      {
        id: "evt-2",
        type: "declined",
        actorId: "hero-1",
        timestamp: "2025-02-03T08:30:00Z",
        note: "Thanks for the offer Jake, but AI writing tools aren't something I want to promote to my audience right now. My readers value authentic, human-written content and this doesn't align with my brand.",
      },
    ],
  },

  // 10. Expired — no response, timed out
  {
    id: "seed-si-expired",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "expired",
    initiatedBy: "sponsor",
    brief:
      "Promoting a limited-time bundle of course creation tools at a steep discount.",
    adHeadline: "The Creator Bundle: 12 Tools for the Price of 1",
    adBody:
      "For one week only, get Jake Morrison's complete suite of course creation tools — Idea Validator, Revenue Calculator, Launch Playbook, and 9 more — for 90% off.",
    adCta: "Grab the Bundle",
    adCtaUrl: "https://jakemorrison.io/bundle",
    proposedFee: 275,
    notes: "",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-15",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2025-01-01T10:00:00Z",
        note: "Promoting a limited-time bundle of course creation tools at a steep discount.",
        copyAfter: {
          adHeadline: "The Creator Bundle: 12 Tools for the Price of 1",
          adBody:
            "For one week only, get Jake Morrison's complete suite of course creation tools — Idea Validator, Revenue Calculator, Launch Playbook, and 9 more — for 90% off.",
          adCta: "Grab the Bundle",
          adCtaUrl: "https://jakemorrison.io/bundle",
        },
      },
      {
        id: "evt-2",
        type: "expired",
        actorId: "hero-4",
        timestamp: "2025-01-15T00:00:00Z",
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  // PUBLISHER-INITIATED FLOW
  // ────────────────────────────────────────────────────────────


  // 16. Scheduled (publisher-initiated)
  {
    id: "seed-pi-scheduled",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "scheduled",
    initiatedBy: "publisher",
    brief:
      "Featuring Jake's Email Course Funnel Guide — a 5-email sequence template for turning subscribers into course buyers.",
    adHeadline: "Turn Your Email List into Course Sales (5-Email Template)",
    adBody:
      "Jake Morrison's 5-email funnel template has generated $500K+ in course sales for creators. It's free, it's proven, and it takes 30 minutes to set up. Your subscribers are ready — are you?",
    adCta: "Get the Free Template",
    adCtaUrl: "https://jakemorrison.io/email-funnel",
    proposedFee: 325,
    notes: "",
    scheduledAt: "2025-03-01T09:00:00Z",
    createdAt: "2025-01-25",
    updatedAt: "2025-02-20",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-1",
        timestamp: "2025-01-25T10:00:00Z",
        note: "Featuring Jake's Email Course Funnel Guide — a 5-email sequence template.",
        copyAfter: {
          adHeadline: "Turn Your Email List into Course Sales (5-Email Template)",
          adBody:
            "Jake Morrison's 5-email funnel template has generated $500K+ in course sales for creators. It's free, it's proven, and it takes 30 minutes to set up. Your subscribers are ready — are you?",
          adCta: "Get the Free Template",
          adCtaUrl: "https://jakemorrison.io/email-funnel",
        },
      },
      {
        id: "evt-2",
        type: "copy_locked",
        actorId: "hero-4",
        timestamp: "2025-01-28T09:00:00Z",
      },
      {
        id: "evt-3",
        type: "broadcast_created",
        actorId: "hero-1",
        timestamp: "2025-02-15T14:00:00Z",
      },
      {
        id: "evt-4",
        type: "scheduled",
        actorId: "hero-1",
        timestamp: "2025-02-20T10:00:00Z",
        metadata: { scheduledAt: "2025-03-01T09:00:00Z" },
      },
    ],
  },

  // 17. Published (publisher-initiated)
  {
    id: "seed-pi-published",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "published",
    initiatedBy: "publisher",
    brief:
      "Featuring Jake's free course outline generator tool for coaches.",
    adHeadline: "Outline Your Entire Course in 15 Minutes",
    adBody:
      "Jake Morrison's Course Outline Generator turns your topic and expertise level into a complete, structured course plan. It even suggests lesson formats and assignments. Free for coaches.",
    adCta: "Try It Free",
    adCtaUrl: "https://jakemorrison.io/outline",
    proposedFee: 300,
    notes: "",
    createdAt: "2025-01-05",
    updatedAt: "2025-02-05",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-1",
        timestamp: "2025-01-05T10:00:00Z",
        note: "Featuring Jake's free course outline generator tool.",
        copyAfter: {
          adHeadline: "Outline Your Entire Course in 15 Minutes",
          adBody:
            "Jake Morrison's Course Outline Generator turns your topic and expertise level into a complete, structured course plan. It even suggests lesson formats and assignments. Free for coaches.",
          adCta: "Try It Free",
          adCtaUrl: "https://jakemorrison.io/outline",
        },
      },
      {
        id: "evt-2",
        type: "copy_locked",
        actorId: "hero-4",
        timestamp: "2025-01-08T11:00:00Z",
      },
      {
        id: "evt-3",
        type: "broadcast_created",
        actorId: "hero-1",
        timestamp: "2025-01-20T09:00:00Z",
      },
      {
        id: "evt-4",
        type: "scheduled",
        actorId: "hero-1",
        timestamp: "2025-01-20T09:30:00Z",
        metadata: { scheduledAt: "2025-02-01T09:00:00Z" },
      },
      {
        id: "evt-5",
        type: "published",
        actorId: "hero-1",
        timestamp: "2025-02-01T09:00:00Z",
      },
    ],
  },


  // 19. Declined (publisher-initiated) — Jake declined
  {
    id: "seed-pi-declined",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "declined",
    initiatedBy: "publisher",
    brief:
      "Proposing a sponsored segment about Jake's advanced course analytics dashboard. My audience is growing more data-savvy and I think this would resonate.",
    adHeadline: "See Exactly Where Students Drop Off in Your Course",
    adBody:
      "Jake Morrison's Course Analytics Dashboard shows you completion rates, engagement hotspots, and dropout points — lesson by lesson. Know what's working and fix what isn't.",
    adCta: "Try the Dashboard",
    adCtaUrl: "https://jakemorrison.io/analytics",
    proposedFee: 375,
    notes: "",
    createdAt: "2025-02-05",
    updatedAt: "2025-02-08",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-1",
        timestamp: "2025-02-05T16:00:00Z",
        note: "Proposing a sponsored segment about Jake's advanced course analytics dashboard. My audience is growing more data-savvy and I think this would resonate.",
        copyAfter: {
          adHeadline: "See Exactly Where Students Drop Off in Your Course",
          adBody:
            "Jake Morrison's Course Analytics Dashboard shows you completion rates, engagement hotspots, and dropout points — lesson by lesson. Know what's working and fix what isn't.",
          adCta: "Try the Dashboard",
          adCtaUrl: "https://jakemorrison.io/analytics",
        },
      },
      {
        id: "evt-2",
        type: "declined",
        actorId: "hero-4",
        timestamp: "2025-02-08T10:00:00Z",
        note: "Hey Sarah, appreciate the offer! The analytics dashboard is actually still in beta and not ready for a big push yet. Let's revisit this in a month or two when it's more polished.",
      },
    ],
  },
]
