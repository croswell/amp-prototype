import type { PromotionRequest } from "./mock-data"

// ============================================================
// Curated promotion requests between Sarah (hero-1, publisher)
// and Jake (hero-4, sponsor) — each with a full timeline history.
// ============================================================

export const seedPromotions: PromotionRequest[] = [
  // ────────────────────────────────────────────────────────────
  // SPONSOR-INITIATED FLOW
  // ────────────────────────────────────────────────────────────

  // 1. Pending — Jake sent proposal, Sarah hasn't responded
  {
    id: "seed-si-pending",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "pending",
    initiatedBy: "sponsor",
    brief:
      "I teach creators how to package their knowledge into profitable online courses. My Course Launch Blueprint has helped 500+ creators launch their first course. Your coaching audience is sitting on expertise they haven't monetized yet — this is a perfect fit.",
    adHeadline: "Create Your First Online Course in 30 Days",
    adBody:
      "Jake Morrison's step-by-step framework has helped 500+ creators launch profitable courses. Get his free Course Launch Blueprint and start building your course today.",
    adCta: "Get the Free Blueprint",
    adCtaUrl: "https://jakemorrison.io/blueprint",
    proposedFee: 350,
    notes: "",
    createdAt: "2025-02-20",
    updatedAt: "2025-02-20",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2025-02-20T10:00:00Z",
        note: "I teach creators how to package their knowledge into profitable online courses. My Course Launch Blueprint has helped 500+ creators launch their first course. Your coaching audience is sitting on expertise they haven't monetized yet — this is a perfect fit.",
        copyAfter: {
          adHeadline: "Create Your First Online Course in 30 Days",
          adBody:
            "Jake Morrison's step-by-step framework has helped 500+ creators launch profitable courses. Get his free Course Launch Blueprint and start building your course today.",
          adCta: "Get the Free Blueprint",
          adCtaUrl: "https://jakemorrison.io/blueprint",
        },
      },
    ],
  },

  // 2. In Review (Round 1) — Sarah accepted & suggested edits, Jake's turn
  {
    id: "seed-si-review-r1",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "in_review",
    initiatedBy: "sponsor",
    brief:
      "Promoting the Weekend Course Sprint. Many coaches want a quick way to create their first course without spending months on it.",
    adHeadline: "Launch Your Course in a Weekend",
    adBody:
      "Jake Morrison's Weekend Course Sprint has helped 200+ creators go from idea to live course in 48 hours. No tech skills required.",
    adCta: "Join the Sprint",
    adCtaUrl: "https://jakemorrison.io/sprint",
    proposedFee: 300,
    notes: "",
    reviewTurn: "sponsor",
    proposedEdits: {
      adHeadline: "From Expert to Course Creator in 48 Hours",
      adBody:
        "You've built coaching expertise others would pay to learn. Jake Morrison's Weekend Course Sprint helps you package that knowledge into a course — no tech skills needed. 200+ creators have already done it.",
      adCta: "Reserve Your Spot",
      adCtaUrl: "https://jakemorrison.io/sprint",
    },
    createdAt: "2025-02-15",
    updatedAt: "2025-02-19",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2025-02-15T09:30:00Z",
        note: "Promoting the Weekend Course Sprint. Many coaches want a quick way to create their first course without spending months on it.",
        copyAfter: {
          adHeadline: "Launch Your Course in a Weekend",
          adBody:
            "Jake Morrison's Weekend Course Sprint has helped 200+ creators go from idea to live course in 48 hours. No tech skills required.",
          adCta: "Join the Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
      },
      {
        id: "evt-2",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-02-19T14:15:00Z",
        note: "Love the Sprint concept! I tweaked the headline and body to speak more directly to my coaching audience — they respond better when we acknowledge their existing expertise.",
        copyBefore: {
          adHeadline: "Launch Your Course in a Weekend",
          adBody:
            "Jake Morrison's Weekend Course Sprint has helped 200+ creators go from idea to live course in 48 hours. No tech skills required.",
          adCta: "Join the Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
        copyAfter: {
          adHeadline: "From Expert to Course Creator in 48 Hours",
          adBody:
            "You've built coaching expertise others would pay to learn. Jake Morrison's Weekend Course Sprint helps you package that knowledge into a course — no tech skills needed. 200+ creators have already done it.",
          adCta: "Reserve Your Spot",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
      },
    ],
  },

  // 3. In Review (Round 2) — Jake sent revision notes, Sarah's turn
  {
    id: "seed-si-review-r2",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "in_review",
    initiatedBy: "sponsor",
    brief:
      "Promoting the Course Pricing Masterclass — a free workshop on how to price digital products for maximum revenue.",
    adHeadline: "Stop Undercharging for Your Knowledge",
    adBody:
      "Most creators leave 60% of revenue on the table with bad pricing. Jake Morrison's free Pricing Masterclass shows you exactly how to price your courses and coaching for maximum profit.",
    adCta: "Watch the Masterclass",
    adCtaUrl: "https://jakemorrison.io/pricing",
    proposedFee: 350,
    notes: "",
    reviewTurn: "publisher",
    revisionNotes:
      "Great edits overall! But I'd love to keep 'Stop Undercharging' in the headline — it tested really well with our audience. The body copy you wrote is perfect though.",
    createdAt: "2025-02-10",
    updatedAt: "2025-02-16",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2025-02-10T11:00:00Z",
        note: "Promoting the Course Pricing Masterclass — a free workshop on how to price digital products for maximum revenue.",
        copyAfter: {
          adHeadline: "Stop Undercharging for Your Knowledge",
          adBody:
            "Most creators leave 60% of revenue on the table with bad pricing. Jake Morrison's free Pricing Masterclass shows you exactly how to price your courses and coaching for maximum profit.",
          adCta: "Watch the Masterclass",
          adCtaUrl: "https://jakemorrison.io/pricing",
        },
      },
      {
        id: "evt-2",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-02-13T16:00:00Z",
        note: "This is great for my audience! I softened the headline a bit and made the body more conversational to match my newsletter tone.",
        copyBefore: {
          adHeadline: "Stop Undercharging for Your Knowledge",
          adBody:
            "Most creators leave 60% of revenue on the table with bad pricing. Jake Morrison's free Pricing Masterclass shows you exactly how to price your courses and coaching for maximum profit.",
          adCta: "Watch the Masterclass",
          adCtaUrl: "https://jakemorrison.io/pricing",
        },
        copyAfter: {
          adHeadline: "Are You Pricing Your Coaching Right?",
          adBody:
            "Most coaches leave money on the table because pricing feels uncomfortable. Jake Morrison breaks down exactly how to price with confidence in this free masterclass — including the psychology behind why your clients will happily pay more.",
          adCta: "Watch Free",
          adCtaUrl: "https://jakemorrison.io/pricing",
        },
      },
      {
        id: "evt-3",
        type: "revision_requested",
        actorId: "hero-4",
        timestamp: "2025-02-16T09:45:00Z",
        note: "Great edits overall! But I'd love to keep 'Stop Undercharging' in the headline — it tested really well with our audience. The body copy you wrote is perfect though.",
      },
    ],
  },

  // 4. In Review (Round 3) — Sarah re-submitted, Jake's turn again
  {
    id: "seed-si-review-r3",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "in_review",
    initiatedBy: "sponsor",
    brief:
      "Promoting the Creator Revenue Calculator — a free tool that estimates how much creators should be earning based on their audience size and engagement.",
    adHeadline: "How Much Should You Be Earning?",
    adBody:
      "Most coaches have no idea what their audience is really worth. Jake Morrison built a free calculator that shows your revenue potential based on your subscriber count and engagement. Takes 30 seconds.",
    adCta: "Calculate Your Revenue",
    adCtaUrl: "https://jakemorrison.io/calculator",
    proposedFee: 325,
    notes: "",
    reviewTurn: "sponsor",
    proposedEdits: {
      adHeadline: "Stop Leaving Money on the Table",
      adBody:
        "You've built an audience that trusts you — but are you monetizing it to its full potential? Jake Morrison's free revenue calculator shows exactly what your coaching business should be earning. It takes 30 seconds and the results might surprise you.",
      adCta: "See Your Number",
      adCtaUrl: "https://jakemorrison.io/calculator",
    },
    createdAt: "2025-02-05",
    updatedAt: "2025-02-14",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2025-02-05T10:00:00Z",
        note: "Promoting the Creator Revenue Calculator — a free tool that estimates how much creators should be earning based on their audience size and engagement.",
        copyAfter: {
          adHeadline: "How Much Should You Be Earning?",
          adBody:
            "Most coaches have no idea what their audience is really worth. Jake Morrison built a free calculator that shows your revenue potential based on your subscriber count and engagement. Takes 30 seconds.",
          adCta: "Calculate Your Revenue",
          adCtaUrl: "https://jakemorrison.io/calculator",
        },
      },
      {
        id: "evt-2",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-02-08T13:20:00Z",
        note: "Love this concept! I changed the angle slightly to focus on the gap between what they earn and what they could earn — that's what motivates my audience.",
        copyBefore: {
          adHeadline: "How Much Should You Be Earning?",
          adBody:
            "Most coaches have no idea what their audience is really worth. Jake Morrison built a free calculator that shows your revenue potential based on your subscriber count and engagement. Takes 30 seconds.",
          adCta: "Calculate Your Revenue",
          adCtaUrl: "https://jakemorrison.io/calculator",
        },
        copyAfter: {
          adHeadline: "The Revenue Gap Most Coaches Don't See",
          adBody:
            "Your audience trusts you — but most coaches only monetize a fraction of what they could. Jake Morrison's free calculator reveals exactly how much you're leaving on the table. 30 seconds to an eye-opening number.",
          adCta: "Find Your Gap",
          adCtaUrl: "https://jakemorrison.io/calculator",
        },
      },
      {
        id: "evt-3",
        type: "revision_requested",
        actorId: "hero-4",
        timestamp: "2025-02-10T08:30:00Z",
        note: "Great angle! Can we make the headline a bit more action-oriented? 'The Revenue Gap' is interesting but I want something that creates more urgency. Body is great.",
      },
      {
        id: "evt-4",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-02-14T11:00:00Z",
        note: "Done! Went with something more direct. Kept the body copy you liked.",
        copyBefore: {
          adHeadline: "The Revenue Gap Most Coaches Don't See",
          adBody:
            "Your audience trusts you — but most coaches only monetize a fraction of what they could. Jake Morrison's free calculator reveals exactly how much you're leaving on the table. 30 seconds to an eye-opening number.",
          adCta: "Find Your Gap",
          adCtaUrl: "https://jakemorrison.io/calculator",
        },
        copyAfter: {
          adHeadline: "Stop Leaving Money on the Table",
          adBody:
            "You've built an audience that trusts you — but are you monetizing it to its full potential? Jake Morrison's free revenue calculator shows exactly what your coaching business should be earning. It takes 30 seconds and the results might surprise you.",
          adCta: "See Your Number",
          adCtaUrl: "https://jakemorrison.io/calculator",
        },
      },
    ],
  },

  // 5. Copy locked — approved after edits, ready for broadcast
  {
    id: "seed-si-locked",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "accepted",
    initiatedBy: "sponsor",
    brief:
      "Promoting the Creator's Toolkit — a curated set of tools and templates for building and selling online courses.",
    adHeadline: "The Only Toolkit You Need to Launch Your Course",
    adBody:
      "Stop piecing together random tools. Jake Morrison's Creator's Toolkit gives you everything — templates, scripts, tech setup guides, and a launch checklist. Used by 1,000+ creators.",
    adCta: "Get the Toolkit",
    adCtaUrl: "https://jakemorrison.io/toolkit",
    proposedFee: 350,
    notes: "",
    createdAt: "2025-02-01",
    updatedAt: "2025-02-12",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2025-02-01T09:00:00Z",
        note: "Promoting the Creator's Toolkit — a curated set of tools and templates for building and selling online courses.",
        copyAfter: {
          adHeadline: "The Only Toolkit You Need to Launch Your Course",
          adBody:
            "Stop piecing together random tools. Jake Morrison's Creator's Toolkit gives you everything — templates, scripts, tech setup guides, and a launch checklist. Used by 1,000+ creators.",
          adCta: "Get the Toolkit",
          adCtaUrl: "https://jakemorrison.io/toolkit",
        },
      },
      {
        id: "evt-2",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-02-04T15:30:00Z",
        note: "This is perfect for my audience — coaches always ask me about tech setup. Small tweak to the headline to emphasize speed.",
        copyBefore: {
          adHeadline: "The Only Toolkit You Need to Launch Your Course",
          adBody:
            "Stop piecing together random tools. Jake Morrison's Creator's Toolkit gives you everything — templates, scripts, tech setup guides, and a launch checklist. Used by 1,000+ creators.",
          adCta: "Get the Toolkit",
          adCtaUrl: "https://jakemorrison.io/toolkit",
        },
        copyAfter: {
          adHeadline: "Launch Your Course This Month — Here's Everything You Need",
          adBody:
            "Stop piecing together random tools. Jake Morrison's Creator's Toolkit gives you templates, scripts, tech setup guides, and a launch checklist — everything 1,000+ creators used to go from idea to income.",
          adCta: "Get the Toolkit",
          adCtaUrl: "https://jakemorrison.io/toolkit",
        },
      },
      {
        id: "evt-3",
        type: "copy_locked",
        actorId: "hero-4",
        timestamp: "2025-02-06T10:00:00Z",
        note: "Love it — approved!",
      },
    ],
  },

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

  // 8. Paid — payment cleared
  {
    id: "seed-si-paid",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "paid",
    initiatedBy: "sponsor",
    brief:
      "Promoting the Course Idea Validator — a free tool to help creators validate their course idea before building it.",
    adHeadline: "Validate Your Course Idea Before You Build It",
    adBody:
      "80% of courses fail because creators skip validation. Jake Morrison's free Idea Validator walks you through the exact 5-step process that's saved 300+ creators from building courses nobody wants.",
    adCta: "Validate My Idea",
    adCtaUrl: "https://jakemorrison.io/validate",
    proposedFee: 350,
    notes: "",
    createdAt: "2024-12-15",
    updatedAt: "2025-01-25",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2024-12-15T10:00:00Z",
        note: "Promoting the Course Idea Validator — a free tool to help creators validate their course idea before building it.",
        copyAfter: {
          adHeadline: "Validate Your Course Idea Before You Build It",
          adBody:
            "80% of courses fail because creators skip validation. Jake Morrison's free Idea Validator walks you through the exact 5-step process that's saved 300+ creators from building courses nobody wants.",
          adCta: "Validate My Idea",
          adCtaUrl: "https://jakemorrison.io/validate",
        },
      },
      {
        id: "evt-2",
        type: "copy_locked",
        actorId: "hero-4",
        timestamp: "2024-12-18T09:00:00Z",
      },
      {
        id: "evt-3",
        type: "broadcast_created",
        actorId: "hero-1",
        timestamp: "2025-01-05T11:00:00Z",
      },
      {
        id: "evt-4",
        type: "scheduled",
        actorId: "hero-1",
        timestamp: "2025-01-05T11:30:00Z",
        metadata: { scheduledAt: "2025-01-15T09:00:00Z" },
      },
      {
        id: "evt-5",
        type: "published",
        actorId: "hero-1",
        timestamp: "2025-01-15T09:00:00Z",
      },
      {
        id: "evt-6",
        type: "payment_sent",
        actorId: "hero-4",
        timestamp: "2025-01-25T14:00:00Z",
        metadata: { amount: "350" },
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

  // 11. Pending — Sarah sent proposal, Jake hasn't responded
  {
    id: "seed-pi-pending",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "pending",
    initiatedBy: "publisher",
    brief:
      "Hi Jake! I noticed your Creator's Toolkit would be a great fit for my audience. My newsletter reaches 45K coaches who are actively looking for tools to build their online businesses. I'd love to feature it as a sponsored segment.",
    adHeadline: "Build & Sell Your First Online Course",
    adBody:
      "Jake Morrison has helped 500+ creators turn their expertise into profitable online courses. His Creator's Toolkit includes everything you need — templates, tech guides, and a proven launch checklist.",
    adCta: "Explore the Toolkit",
    adCtaUrl: "https://jakemorrison.io/toolkit",
    proposedFee: 350,
    notes: "",
    createdAt: "2025-02-22",
    updatedAt: "2025-02-22",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-1",
        timestamp: "2025-02-22T14:00:00Z",
        note: "Hi Jake! I noticed your Creator's Toolkit would be a great fit for my audience. My newsletter reaches 45K coaches who are actively looking for tools to build their online businesses. I'd love to feature it as a sponsored segment.",
        copyAfter: {
          adHeadline: "Build & Sell Your First Online Course",
          adBody:
            "Jake Morrison has helped 500+ creators turn their expertise into profitable online courses. His Creator's Toolkit includes everything you need — templates, tech guides, and a proven launch checklist.",
          adCta: "Explore the Toolkit",
          adCtaUrl: "https://jakemorrison.io/toolkit",
        },
      },
    ],
  },

  // 12. Accepted (no edits) — Jake accepted, copy good as-is
  {
    id: "seed-pi-accepted",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "accepted",
    initiatedBy: "publisher",
    brief:
      "Featuring Jake's Course Pricing Workshop as a sponsored segment. My audience of coaches regularly asks me about pricing, so this is a natural fit.",
    adHeadline: "How to Price Your Coaching Packages for Maximum Revenue",
    adBody:
      "Stop guessing what to charge. Jake Morrison's free pricing workshop breaks down the psychology of pricing and gives you a formula that works. Over 400 coaches have used it to raise their rates confidently.",
    adCta: "Watch the Workshop",
    adCtaUrl: "https://jakemorrison.io/pricing-workshop",
    proposedFee: 325,
    notes: "",
    createdAt: "2025-02-18",
    updatedAt: "2025-02-20",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-1",
        timestamp: "2025-02-18T10:00:00Z",
        note: "Featuring Jake's Course Pricing Workshop. My audience regularly asks about pricing, so this is a natural fit.",
        copyAfter: {
          adHeadline: "How to Price Your Coaching Packages for Maximum Revenue",
          adBody:
            "Stop guessing what to charge. Jake Morrison's free pricing workshop breaks down the psychology of pricing and gives you a formula that works. Over 400 coaches have used it to raise their rates confidently.",
          adCta: "Watch the Workshop",
          adCtaUrl: "https://jakemorrison.io/pricing-workshop",
        },
      },
      {
        id: "evt-2",
        type: "copy_locked",
        actorId: "hero-4",
        timestamp: "2025-02-20T09:00:00Z",
        note: "Copy looks great — my audience will love the pricing angle. Let's go!",
      },
    ],
  },

  // 13. In Review — Jake suggested changes, Sarah's turn
  {
    id: "seed-pi-review-r1",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "in_review",
    initiatedBy: "publisher",
    brief:
      "Promoting Jake's Student Success Stories collection — real case studies of creators who went from zero to profitable courses.",
    adHeadline: "Real Stories: From Zero to Profitable Course Creator",
    adBody:
      "Meet 12 creators who turned their expertise into income using Jake Morrison's methods. From a yoga teacher making $8K/month to a copywriter pulling $15K — these aren't theory. They're receipts.",
    adCta: "Read the Stories",
    adCtaUrl: "https://jakemorrison.io/stories",
    proposedFee: 300,
    notes: "",
    reviewTurn: "publisher",
    revisionNotes:
      "Love the concept! But can we lead with the most impressive result instead of the generic 'Real Stories' angle? Something like the $15K copywriter — that's attention-grabbing.",
    createdAt: "2025-02-12",
    updatedAt: "2025-02-17",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-1",
        timestamp: "2025-02-12T11:00:00Z",
        note: "Promoting Jake's Student Success Stories — real case studies of creators who went from zero to profitable courses.",
        copyAfter: {
          adHeadline: "Real Stories: From Zero to Profitable Course Creator",
          adBody:
            "Meet 12 creators who turned their expertise into income using Jake Morrison's methods. From a yoga teacher making $8K/month to a copywriter pulling $15K — these aren't theory. They're receipts.",
          adCta: "Read the Stories",
          adCtaUrl: "https://jakemorrison.io/stories",
        },
      },
      {
        id: "evt-2",
        type: "revision_requested",
        actorId: "hero-4",
        timestamp: "2025-02-17T09:30:00Z",
        note: "Love the concept! But can we lead with the most impressive result instead of the generic 'Real Stories' angle? Something like the $15K copywriter — that's attention-grabbing.",
      },
    ],
  },

  // 14. In Review — Sarah revised, Jake's turn
  {
    id: "seed-pi-review-r2",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "in_review",
    initiatedBy: "publisher",
    brief:
      "Featuring Jake's free webinar on building a course waitlist before you create the course.",
    adHeadline: "Sell Your Course Before You Build It",
    adBody:
      "What if you could validate demand AND get paid before creating a single lesson? Jake Morrison's waitlist strategy has helped 150+ creators pre-sell their courses. Join his free live training to learn how.",
    adCta: "Save Your Seat",
    adCtaUrl: "https://jakemorrison.io/waitlist-training",
    proposedFee: 350,
    notes: "",
    reviewTurn: "sponsor",
    proposedEdits: {
      adHeadline: "Get Paid Before You Build: The Course Pre-Sell Method",
      adBody:
        "What if you could validate demand AND collect revenue before recording a single lesson? Jake Morrison's waitlist strategy has helped 150+ creators pre-sell their courses — and he's teaching it live for free.",
      adCta: "Save Your Seat",
      adCtaUrl: "https://jakemorrison.io/waitlist-training",
    },
    createdAt: "2025-02-08",
    updatedAt: "2025-02-16",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-1",
        timestamp: "2025-02-08T14:00:00Z",
        note: "Featuring Jake's free webinar on building a course waitlist before you create the course.",
        copyAfter: {
          adHeadline: "Sell Your Course Before You Build It",
          adBody:
            "What if you could validate demand AND get paid before creating a single lesson? Jake Morrison's waitlist strategy has helped 150+ creators pre-sell their courses. Join his free live training to learn how.",
          adCta: "Save Your Seat",
          adCtaUrl: "https://jakemorrison.io/waitlist-training",
        },
      },
      {
        id: "evt-2",
        type: "revision_requested",
        actorId: "hero-4",
        timestamp: "2025-02-11T08:45:00Z",
        note: "Love the angle but the headline could be stronger. Can we make the pre-sell concept more explicit? Also 'get paid' is stronger than 'validate demand' — lead with that.",
      },
      {
        id: "evt-3",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-02-16T10:00:00Z",
        note: "Revised! Made the headline more specific about the pre-sell angle.",
        copyBefore: {
          adHeadline: "Sell Your Course Before You Build It",
          adBody:
            "What if you could validate demand AND get paid before creating a single lesson? Jake Morrison's waitlist strategy has helped 150+ creators pre-sell their courses. Join his free live training to learn how.",
          adCta: "Save Your Seat",
          adCtaUrl: "https://jakemorrison.io/waitlist-training",
        },
        copyAfter: {
          adHeadline: "Get Paid Before You Build: The Course Pre-Sell Method",
          adBody:
            "What if you could validate demand AND collect revenue before recording a single lesson? Jake Morrison's waitlist strategy has helped 150+ creators pre-sell their courses — and he's teaching it live for free.",
          adCta: "Save Your Seat",
          adCtaUrl: "https://jakemorrison.io/waitlist-training",
        },
      },
    ],
  },

  // 15. Copy locked (publisher-initiated)
  {
    id: "seed-pi-locked",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "accepted",
    initiatedBy: "publisher",
    brief:
      "Featuring Jake's Course Design Templates — Notion templates that help creators structure their courses professionally.",
    adHeadline: "The Notion Templates That 800+ Course Creators Swear By",
    adBody:
      "Stop staring at a blank page. Jake Morrison's Course Design Templates give you the exact structure for modules, lessons, and assignments — all in Notion. Copy, customize, and start teaching.",
    adCta: "Get the Templates",
    adCtaUrl: "https://jakemorrison.io/notion-templates",
    proposedFee: 300,
    notes: "",
    createdAt: "2025-02-03",
    updatedAt: "2025-02-10",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-1",
        timestamp: "2025-02-03T11:00:00Z",
        note: "Featuring Jake's Course Design Templates — Notion templates for structuring courses professionally.",
        copyAfter: {
          adHeadline: "The Notion Templates That 800+ Course Creators Swear By",
          adBody:
            "Stop staring at a blank page. Jake Morrison's Course Design Templates give you the exact structure for modules, lessons, and assignments — all in Notion. Copy, customize, and start teaching.",
          adCta: "Get the Templates",
          adCtaUrl: "https://jakemorrison.io/notion-templates",
        },
      },
      {
        id: "evt-2",
        type: "copy_locked",
        actorId: "hero-4",
        timestamp: "2025-02-06T08:00:00Z",
        note: "This is perfect — no changes needed. Let's run it!",
      },
    ],
  },

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

  // 18. Paid (publisher-initiated)
  {
    id: "seed-pi-paid",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "paid",
    initiatedBy: "publisher",
    brief:
      "Featuring Jake's Creator Monetization Report — annual data on how creators are earning.",
    adHeadline: "How Are Creators Actually Making Money in 2025?",
    adBody:
      "Jake Morrison surveyed 1,200+ course creators to find out. The 2025 Creator Monetization Report reveals what's working, what's not, and where the biggest opportunities are. Spoiler: email is still king.",
    adCta: "Read the Report",
    adCtaUrl: "https://jakemorrison.io/report-2025",
    proposedFee: 350,
    notes: "",
    createdAt: "2024-12-01",
    updatedAt: "2025-01-20",
    timeline: [
      {
        id: "evt-1",
        type: "proposal_sent",
        actorId: "hero-1",
        timestamp: "2024-12-01T10:00:00Z",
        note: "Featuring Jake's Creator Monetization Report — annual data on how creators are earning.",
        copyAfter: {
          adHeadline: "How Are Creators Actually Making Money in 2025?",
          adBody:
            "Jake Morrison surveyed 1,200+ course creators to find out. The 2025 Creator Monetization Report reveals what's working, what's not, and where the biggest opportunities are. Spoiler: email is still king.",
          adCta: "Read the Report",
          adCtaUrl: "https://jakemorrison.io/report-2025",
        },
      },
      {
        id: "evt-2",
        type: "copy_locked",
        actorId: "hero-4",
        timestamp: "2024-12-04T09:00:00Z",
      },
      {
        id: "evt-3",
        type: "broadcast_created",
        actorId: "hero-1",
        timestamp: "2024-12-20T11:00:00Z",
      },
      {
        id: "evt-4",
        type: "scheduled",
        actorId: "hero-1",
        timestamp: "2024-12-20T11:30:00Z",
        metadata: { scheduledAt: "2025-01-06T09:00:00Z" },
      },
      {
        id: "evt-5",
        type: "published",
        actorId: "hero-1",
        timestamp: "2025-01-06T09:00:00Z",
      },
      {
        id: "evt-6",
        type: "payment_sent",
        actorId: "hero-4",
        timestamp: "2025-01-20T14:00:00Z",
        metadata: { amount: "350" },
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
