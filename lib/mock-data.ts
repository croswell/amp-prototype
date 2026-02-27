import { generatedHeroes } from "./generated-heroes"

// ============================================================
// Types
// ============================================================

export type Role = "publisher" | "sponsor" | "both"
export type EngagementTier = "high" | "medium" | "low"
export type SendSchedule = "3x/Week" | "2x/Week" | "1x/Week" | "2x/Month" | "1x/Month"
export type RequestStatus =
  | "pending"
  | "accepted"
  | "scheduled"
  | "published"
  | "paid"
  | "declined"
  | "expired"

export type Vertical =
  | "Health & Fitness"
  | "Business & Marketing"
  | "Personal Development"
  | "Creative Arts"
  | "Finance"
  | "Parenting"
  | "Technology"
  | "Education"
  | "Lifestyle"

export interface Hero {
  id: string
  name: string
  avatar: string
  role: Role
  tagline: string
  verticals: Vertical[]
  subscriberCount: number
  engagementTier: EngagementTier
  openRate: number
  clickRate: number
  recommendedFee: number
  bio: string
  website: string
  socialLinks: { platform: string; url: string }[]
  promotionsCompleted: number
  rating: number
  joinedDate: string
  sendSchedule: SendSchedule
  spendLimit?: number
}

export interface PromotionRequest {
  id: string
  sponsorId: string
  publisherId: string
  status: RequestStatus
  initiatedBy: "sponsor" | "publisher"
  brief: string
  adHeadline: string
  adBody: string
  adCta: string
  adCtaUrl: string
  adImage?: string
  proposedFee: number
  numberOfSends: number
  proposedDate: string
  notes: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// Status labels for request flow
// ============================================================

export const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: "Pending",
  accepted: "Approved",
  scheduled: "Scheduled",
  published: "Published",
  paid: "Paid",
  declined: "Declined",
  expired: "Expired",
}

// ============================================================
// Mock Heroes
// ============================================================

export const heroes: Hero[] = [
  {
    id: "hero-1",
    name: "Sarah Chen",
    avatar: "/avatars/sarah.jpg",
    role: "publisher",
    tagline: "Helping coaches build 6-figure businesses",
    verticals: ["Business & Marketing", "Education"],
    subscriberCount: 45000,
    engagementTier: "high",
    openRate: 42,
    clickRate: 8.2,
    recommendedFee: 350,
    bio: "I've helped over 2,000 coaches launch and scale their online businesses. My weekly newsletter breaks down the exact strategies that work — no fluff, just results.",
    website: "https://sarahchen.co",
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/sarahchen" },
      { platform: "instagram", url: "https://instagram.com/sarahchen" },
    ],
    promotionsCompleted: 24,
    rating: 4.9,
    joinedDate: "2024-03-15",
    sendSchedule: "2x/Week",
  },
  {
    id: "hero-2",
    name: "Marcus Rivera",
    avatar: "/avatars/marcus.jpg",
    role: "publisher",
    tagline: "Fitness coaching for busy professionals",
    verticals: ["Health & Fitness", "Personal Development"],
    subscriberCount: 32000,
    engagementTier: "high",
    openRate: 38,
    clickRate: 6.5,
    recommendedFee: 275,
    bio: "Former D1 athlete turned online fitness coach. My audience trusts me because I only recommend products I've personally tested and believe in.",
    website: "https://marcusrivera.fit",
    socialLinks: [
      { platform: "youtube", url: "https://youtube.com/@marcusrivera" },
      { platform: "instagram", url: "https://instagram.com/marcusrivera" },
    ],
    promotionsCompleted: 18,
    rating: 4.8,
    joinedDate: "2024-05-20",
    sendSchedule: "1x/Week",
  },
  {
    id: "hero-3",
    name: "Priya Patel",
    avatar: "/avatars/priya.jpg",
    role: "both",
    tagline: "Personal development for ambitious women",
    verticals: ["Personal Development", "Lifestyle"],
    subscriberCount: 67000,
    engagementTier: "high",
    openRate: 45,
    clickRate: 9.1,
    recommendedFee: 500,
    bio: "Author, speaker, and community builder. I run a 5,000-member community for women in leadership. My subscribers are engaged, ambitious, and ready to invest in themselves.",
    website: "https://priyapatel.com",
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/priyapatel" },
      { platform: "twitter", url: "https://twitter.com/priyapatel" },
    ],
    promotionsCompleted: 31,
    rating: 5.0,
    joinedDate: "2024-01-10",
    sendSchedule: "2x/Week",
  },
  {
    id: "hero-4",
    name: "Jake Morrison",
    avatar: "/avatars/jake.jpg",
    role: "sponsor",
    tagline: "Online course creation made simple",
    verticals: ["Education", "Creative Arts"],
    subscriberCount: 12000,
    engagementTier: "medium",
    openRate: 28,
    clickRate: 4.2,
    recommendedFee: 150,
    bio: "I teach creators how to package their knowledge into profitable online courses. Looking to reach new audiences through trusted publisher recommendations.",
    website: "https://jakemorrison.io",
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/jakemorrison" },
    ],
    promotionsCompleted: 8,
    rating: 4.7,
    joinedDate: "2024-08-01",
    sendSchedule: "1x/Week",
    spendLimit: 2000,
  },
  {
    id: "hero-5",
    name: "Aisha Thompson",
    avatar: "/avatars/aisha.jpg",
    role: "publisher",
    tagline: "The money mindset newsletter",
    verticals: ["Finance", "Personal Development"],
    subscriberCount: 28000,
    engagementTier: "medium",
    openRate: 32,
    clickRate: 5.8,
    recommendedFee: 225,
    bio: "Helping everyday people build wealth through mindset shifts and practical strategies. My audience is hungry for quality financial tools and education.",
    website: "https://aishathompson.com",
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/aishathompson" },
      { platform: "tiktok", url: "https://tiktok.com/@aishathompson" },
    ],
    promotionsCompleted: 15,
    rating: 4.6,
    joinedDate: "2024-06-12",
    sendSchedule: "1x/Week",
  },
  {
    id: "hero-6",
    name: "David Kim",
    avatar: "/avatars/david.jpg",
    role: "sponsor",
    tagline: "Podcast growth accelerator",
    verticals: ["Technology", "Business & Marketing"],
    subscriberCount: 8500,
    engagementTier: "medium",
    openRate: 25,
    clickRate: 3.8,
    recommendedFee: 120,
    bio: "I run a SaaS tool that helps podcasters grow their audience. Looking to partner with publishers who have engaged, creator-focused audiences.",
    website: "https://podgrowth.co",
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/davidkim" },
      { platform: "linkedin", url: "https://linkedin.com/in/davidkim" },
    ],
    promotionsCompleted: 5,
    rating: 4.5,
    joinedDate: "2024-09-01",
    sendSchedule: "2x/Month",
    spendLimit: 1500,
  },
  {
    id: "hero-7",
    name: "Emma Nguyen",
    avatar: "/avatars/emma.jpg",
    role: "both",
    tagline: "Parenting in the digital age",
    verticals: ["Parenting", "Lifestyle"],
    subscriberCount: 41000,
    engagementTier: "high",
    openRate: 40,
    clickRate: 7.3,
    recommendedFee: 325,
    bio: "Mom of 3, author of 'Connected Parenting', and creator of the Mindful Moms community. My audience is deeply engaged and trusts my product recommendations.",
    website: "https://emmanguyen.com",
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/emmanguyen" },
      { platform: "youtube", url: "https://youtube.com/@emmanguyen" },
    ],
    promotionsCompleted: 22,
    rating: 4.9,
    joinedDate: "2024-02-28",
    sendSchedule: "2x/Week",
  },
  {
    id: "hero-8",
    name: "Carlos Mendez",
    avatar: "/avatars/carlos.jpg",
    role: "publisher",
    tagline: "Creative entrepreneurship weekly",
    verticals: ["Creative Arts", "Business & Marketing"],
    subscriberCount: 19000,
    engagementTier: "medium",
    openRate: 30,
    clickRate: 5.1,
    recommendedFee: 175,
    bio: "Designer turned business coach. I help creative professionals monetize their skills. My readers are freelancers, agency owners, and creative entrepreneurs.",
    website: "https://carlosmendez.design",
    socialLinks: [
      { platform: "dribbble", url: "https://dribbble.com/carlosmendez" },
      { platform: "twitter", url: "https://twitter.com/carlosmendez" },
    ],
    promotionsCompleted: 12,
    rating: 4.7,
    joinedDate: "2024-04-15",
    sendSchedule: "1x/Week",
  },
  {
    id: "hero-9",
    name: "Lisa Park",
    avatar: "/avatars/lisa.jpg",
    role: "sponsor",
    tagline: "Membership site mastery",
    verticals: ["Education", "Business & Marketing"],
    subscriberCount: 15000,
    engagementTier: "medium",
    openRate: 27,
    clickRate: 4.5,
    recommendedFee: 160,
    bio: "I built a 7-figure membership site and now teach others to do the same. Looking to reach engaged publisher audiences in the education and coaching space.",
    website: "https://lisapark.co",
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/lisapark" },
    ],
    promotionsCompleted: 10,
    rating: 4.8,
    joinedDate: "2024-07-10",
    sendSchedule: "2x/Month",
    spendLimit: 2500,
  },
  {
    id: "hero-10",
    name: "Ryan Brooks",
    avatar: "/avatars/ryan.jpg",
    role: "publisher",
    tagline: "No-BS marketing for solopreneurs",
    verticals: ["Business & Marketing", "Education"],
    subscriberCount: 53000,
    engagementTier: "high",
    openRate: 44,
    clickRate: 8.7,
    recommendedFee: 425,
    bio: "15 years in digital marketing distilled into actionable weekly advice. My audience is solopreneurs and small business owners who value substance over hype.",
    website: "https://ryanbrooks.com",
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/ryanbrooks" },
      { platform: "youtube", url: "https://youtube.com/@ryanbrooks" },
    ],
    promotionsCompleted: 28,
    rating: 4.9,
    joinedDate: "2024-01-05",
    sendSchedule: "3x/Week",
  },
  ...generatedHeroes,
]

// ============================================================
// Current demo user (the person demoing the prototype)
// ============================================================

export const currentUser: Hero = {
  id: "current-user",
  name: "Alex Johnson",
  avatar: "/avatars/alex.jpg",
  role: "both",
  tagline: "Scaling knowledge businesses",
  verticals: ["Education", "Business & Marketing", "Personal Development"],
  subscriberCount: 38000,
  engagementTier: "high",
  openRate: 39,
  clickRate: 7.5,
  recommendedFee: 300,
  bio: "I help knowledge entrepreneurs build scalable businesses. Publisher of a top-rated Kajabi newsletter and creator of the Course Creator Accelerator program.",
  website: "https://alexjohnson.co",
  socialLinks: [
    { platform: "twitter", url: "https://twitter.com/alexjohnson" },
    { platform: "linkedin", url: "https://linkedin.com/in/alexjohnson" },
  ],
  promotionsCompleted: 20,
  rating: 4.8,
  joinedDate: "2024-02-01",
  sendSchedule: "2x/Week",
  spendLimit: 3000,
}

// ============================================================
// Sponsor's single campaign (per spec: "One promotion")
// ============================================================

export const currentUserCampaign = {
  adHeadline: "The Course Creator Accelerator",
  adBody: "Build and launch a 6-figure online course in 12 weeks. Alex Johnson's proven system has generated over $2M in student revenue. Limited spots available for the spring cohort.",
  adCta: "Apply Now",
  adCtaUrl: "https://alexjohnson.co/accelerator",
}

// ============================================================
// Mock Promotion Requests (at different stages)
// ============================================================

export const promotionRequests: PromotionRequest[] = [
  // ── Pending: waiting on the other party ──
  {
    id: "req-6",
    sponsorId: "hero-6",
    publisherId: "current-user",
    status: "pending",
    initiatedBy: "sponsor",
    brief: "I run PodGrowth, a SaaS tool that helps podcasters grow their audience using AI-powered growth strategies. We've helped 2,000+ podcasters double their downloads. I'd love to reach your audience since many of your subscribers are also launching podcasts.",
    adHeadline: "Grow Your Podcast to 10K Downloads",
    adBody: "PodGrowth helps podcasters double their audience in 90 days with AI-powered growth tools. Join 2,000+ podcasters already using the platform.",
    adCta: "Try PodGrowth Free",
    adCtaUrl: "https://podgrowth.co/trial",
    proposedFee: 275,
    numberOfSends: 3,
    proposedDate: "2025-03-20",
    notes: "",
    createdAt: "2025-02-22",
    updatedAt: "2025-02-22",
  },
  {
    id: "req-7",
    sponsorId: "hero-9",
    publisherId: "current-user",
    status: "pending",
    initiatedBy: "sponsor",
    brief: "I built a 7-figure membership site and now teach others to do the same. I'm promoting my free training on creating recurring revenue through memberships. Your audience of knowledge entrepreneurs would love this — memberships are the natural next step after courses.",
    adHeadline: "Build a Membership Site That Runs Itself",
    adBody: "Lisa Park built a 7-figure membership site and now she's teaching her system. Learn how to create recurring revenue with a membership your audience will love.",
    adCta: "Watch the Free Training",
    adCtaUrl: "https://lisapark.co/training",
    proposedFee: 350,
    numberOfSends: 2,
    proposedDate: "2025-04-05",
    notes: "",
    createdAt: "2025-02-23",
    updatedAt: "2025-02-23",
  },
  // ── Pending: publisher-initiated (publisher wants to run the sponsor's campaign) ──
  {
    id: "req-18",
    sponsorId: "current-user",
    publisherId: "hero-1",
    status: "pending",
    initiatedBy: "publisher",
    brief: "Your Course Creator Accelerator is a perfect fit for my audience of coaches building online businesses. I'd love to feature it in my next send — my readers are always asking how to package their expertise into courses.",
    adHeadline: "The Course Creator Accelerator",
    adBody: "Build and launch a 6-figure online course in 12 weeks. Alex Johnson's proven system has generated over $2M in student revenue. Limited spots available for the spring cohort.",
    adCta: "Apply Now",
    adCtaUrl: "https://alexjohnson.co/accelerator",
    proposedFee: 350,
    numberOfSends: 3,
    proposedDate: "2025-04-01",
    notes: "",
    createdAt: "2025-02-25",
    updatedAt: "2025-02-25",
  },
  {
    id: "req-19",
    sponsorId: "current-user",
    publisherId: "hero-10",
    status: "pending",
    initiatedBy: "publisher",
    brief: "I think the Course Creator Accelerator would resonate strongly with my solopreneur audience. Many of them are sitting on expertise they haven't monetized yet — your program is exactly what they need to take the leap.",
    adHeadline: "The Course Creator Accelerator",
    adBody: "Build and launch a 6-figure online course in 12 weeks. Alex Johnson's proven system has generated over $2M in student revenue. Limited spots available for the spring cohort.",
    adCta: "Apply Now",
    adCtaUrl: "https://alexjohnson.co/accelerator",
    proposedFee: 425,
    numberOfSends: 4,
    proposedDate: "2025-04-10",
    notes: "",
    createdAt: "2025-02-24",
    updatedAt: "2025-02-24",
  },
  // ── Accepted: other party said yes ──
  {
    id: "req-16",
    sponsorId: "current-user",
    publisherId: "hero-1",
    status: "accepted",
    initiatedBy: "sponsor",
    brief: "I'm promoting the spring cohort of my Course Creator Accelerator to Sarah's mindset coaching audience. Many mindset coaches want to package their expertise into courses.",
    adHeadline: "The Course Creator Accelerator",
    adBody: "Build and launch a 6-figure online course in 12 weeks. Alex Johnson's proven system has generated over $2M in student revenue. Limited spots available for the spring cohort.",
    adCta: "Apply Now",
    adCtaUrl: "https://alexjohnson.co/accelerator",
    proposedFee: 350,
    numberOfSends: 4,
    proposedDate: "2025-04-12",
    notes: "",
    createdAt: "2025-02-24",
    updatedAt: "2025-02-25",
  },
  {
    id: "req-17",
    sponsorId: "current-user",
    publisherId: "hero-5",
    status: "accepted",
    initiatedBy: "sponsor",
    brief: "I'm promoting the Course Creator Accelerator to Aisha's finance audience. Financial educators are increasingly packaging their expertise into online courses.",
    adHeadline: "Scale Your Knowledge Business",
    adBody: "Alex Johnson's Course Creator Accelerator has helped 200+ entrepreneurs package their expertise into profitable online courses. Join the next cohort.",
    adCta: "Learn More",
    adCtaUrl: "https://alexjohnson.co/accelerator",
    proposedFee: 275,
    numberOfSends: 2,
    proposedDate: "2025-04-18",
    notes: "",
    createdAt: "2025-02-23",
    updatedAt: "2025-02-25",
  },
  {
    id: "req-1",
    sponsorId: "hero-4",
    publisherId: "current-user",
    status: "accepted",
    initiatedBy: "sponsor",
    brief: "I teach creators how to package their knowledge into profitable online courses. I'm looking to promote my free Course Launch Blueprint — a step-by-step framework that's helped 500+ creators launch their first course. I think your audience of knowledge entrepreneurs would be a perfect fit.",
    adHeadline: "Create Your First Online Course in 30 Days",
    adBody: "Jake Morrison's step-by-step framework has helped 500+ creators launch profitable courses. Get his free Course Launch Blueprint and start building your course today.",
    adCta: "Get the Free Blueprint",
    adCtaUrl: "https://jakemorrison.io/blueprint",
    proposedFee: 300,
    numberOfSends: 3,
    proposedDate: "2025-03-15",
    notes: "",
    createdAt: "2025-02-20",
    updatedAt: "2025-02-20",
  },
  {
    id: "req-2",
    sponsorId: "hero-6",
    publisherId: "hero-1",
    status: "accepted",
    initiatedBy: "sponsor",
    brief: "I run PodGrowth, a SaaS tool that helps podcasters grow their audience. Your coaching audience includes a lot of creators launching podcasts, so I think this would be a natural fit.",
    adHeadline: "Grow Your Podcast to 10K Downloads",
    adBody: "PodGrowth helps podcasters double their audience in 90 days with AI-powered growth tools. Join 2,000+ podcasters already using the platform.",
    adCta: "Try PodGrowth Free",
    adCtaUrl: "https://podgrowth.co/trial",
    proposedFee: 350,
    numberOfSends: 2,
    proposedDate: "2025-03-22",
    notes: "",
    createdAt: "2025-02-18",
    updatedAt: "2025-02-21",
  },
  // ── Scheduled: date is set, waiting to go live ──
  {
    id: "req-10",
    sponsorId: "hero-3",
    publisherId: "current-user",
    status: "scheduled",
    initiatedBy: "sponsor",
    brief: "I'm launching a new leadership coaching program for women and want to reach Alex's audience of knowledge entrepreneurs. Many of them are women building businesses who'd benefit from leadership skills.",
    adHeadline: "Lead With Confidence",
    adBody: "Priya Patel's new leadership program helps ambitious women step into their power. Join 5,000+ women already in the community.",
    adCta: "Join the Program",
    adCtaUrl: "https://priyapatel.com/lead",
    proposedFee: 400,
    numberOfSends: 4,
    proposedDate: "2025-04-10",
    notes: "",
    createdAt: "2025-02-19",
    updatedAt: "2025-02-22",
  },
  {
    id: "req-11",
    sponsorId: "hero-7",
    publisherId: "current-user",
    status: "scheduled",
    initiatedBy: "sponsor",
    brief: "I'm promoting my Connected Parenting digital workshop. Many knowledge entrepreneurs are also parents looking for better work-life balance strategies.",
    adHeadline: "The Connected Parenting Workshop",
    adBody: "Emma Nguyen's digital workshop helps busy parents build deeper connections with their kids — even with a packed schedule. Over 3,000 families transformed.",
    adCta: "Get Instant Access",
    adCtaUrl: "https://emmanguyen.com/workshop",
    proposedFee: 275,
    numberOfSends: 2,
    proposedDate: "2025-04-15",
    notes: "",
    createdAt: "2025-02-20",
    updatedAt: "2025-02-23",
  },
  {
    id: "req-3",
    sponsorId: "current-user",
    publisherId: "hero-3",
    status: "scheduled",
    initiatedBy: "sponsor",
    brief: "I'm promoting the spring cohort of my Course Creator Accelerator — a 12-week program that helps entrepreneurs package their expertise into profitable online courses. The program has generated over $2M in student revenue. Priya's community of ambitious women would be a perfect audience.",
    adHeadline: "The Course Creator Accelerator",
    adBody: "Build and launch a 6-figure online course in 12 weeks. Alex Johnson's proven system has generated over $2M in student revenue. Limited spots available for the spring cohort.",
    adCta: "Apply Now",
    adCtaUrl: "https://alexjohnson.co/accelerator",
    proposedFee: 500,
    numberOfSends: 4,
    proposedDate: "2025-04-01",
    notes: "",
    createdAt: "2025-02-15",
    updatedAt: "2025-02-22",
  },
  {
    id: "req-4",
    sponsorId: "hero-9",
    publisherId: "hero-10",
    status: "scheduled",
    initiatedBy: "sponsor",
    brief: "I built a 7-figure membership site and now teach my system to others. I'm promoting a free training on creating recurring revenue through memberships. Ryan's solopreneur audience would be a perfect fit.",
    adHeadline: "Build a Membership Site That Runs Itself",
    adBody: "Lisa Park built a 7-figure membership site and now she's teaching her system. Learn how to create recurring revenue with a membership your audience will love.",
    adCta: "Watch the Free Training",
    adCtaUrl: "https://lisapark.co/training",
    proposedFee: 425,
    numberOfSends: 6,
    proposedDate: "2025-03-28",
    notes: "",
    createdAt: "2025-02-10",
    updatedAt: "2025-02-23",
  },
  {
    id: "req-5",
    sponsorId: "current-user",
    publisherId: "hero-7",
    status: "scheduled",
    initiatedBy: "sponsor",
    brief: "I'm promoting the Course Creator Accelerator to Emma's parenting community. Many parents are looking for flexible ways to earn income, and an online course is a natural fit for their expertise.",
    adHeadline: "Scale Your Knowledge Business",
    adBody: "Alex Johnson's Course Creator Accelerator has helped 200+ entrepreneurs package their expertise into profitable online courses. Join the next cohort and build your course with expert guidance.",
    adCta: "Learn More",
    adCtaUrl: "https://alexjohnson.co/accelerator",
    proposedFee: 325,
    numberOfSends: 4,
    proposedDate: "2025-03-05",
    notes: "",
    createdAt: "2025-02-01",
    updatedAt: "2025-02-24",
  },
  {
    id: "req-13",
    sponsorId: "hero-10",
    publisherId: "current-user",
    status: "scheduled",
    initiatedBy: "publisher",
    brief: "I'm launching a Marketing Fundamentals bootcamp and want to reach Alex's audience of knowledge entrepreneurs who need marketing skills to grow.",
    adHeadline: "Marketing Bootcamp for Solopreneurs",
    adBody: "Ryan Brooks distills 15 years of marketing into a 5-day bootcamp. Learn the exact strategies that have generated $10M+ for his clients.",
    adCta: "Enroll Now",
    adCtaUrl: "https://ryanbrooks.com/bootcamp",
    proposedFee: 375,
    numberOfSends: 6,
    proposedDate: "2025-04-08",
    notes: "",
    createdAt: "2025-02-16",
    updatedAt: "2025-02-24",
  },
  {
    id: "req-14",
    sponsorId: "hero-2",
    publisherId: "current-user",
    status: "scheduled",
    initiatedBy: "publisher",
    brief: "I'm promoting my Fit Founder Challenge — a 30-day fitness program designed specifically for busy entrepreneurs. Alex's audience of knowledge entrepreneurs would benefit from this.",
    adHeadline: "The Fit Founder Challenge",
    adBody: "Marcus Rivera's 30-day program helps busy entrepreneurs build sustainable fitness habits. No gym required. Join 800+ founders who've already transformed their health.",
    adCta: "Start the Challenge",
    adCtaUrl: "https://marcusrivera.fit/challenge",
    proposedFee: 275,
    numberOfSends: 2,
    proposedDate: "2025-03-18",
    notes: "",
    createdAt: "2025-02-08",
    updatedAt: "2025-02-24",
  },
  // ── Published: broadcast sent ──
  {
    id: "req-12",
    sponsorId: "hero-5",
    publisherId: "current-user",
    status: "published",
    initiatedBy: "sponsor",
    brief: "I'm promoting my Wealth Mindset Masterclass to Alex's audience. Entrepreneurs need strong money mindsets to scale, and this masterclass delivers exactly that.",
    adHeadline: "Unlock Your Wealth Mindset",
    adBody: "Aisha Thompson's Wealth Mindset Masterclass has helped 1,200+ entrepreneurs transform their relationship with money. Free 90-minute session.",
    adCta: "Reserve Your Spot",
    adCtaUrl: "https://aishathompson.com/masterclass",
    proposedFee: 225,
    numberOfSends: 1,
    proposedDate: "2025-03-25",
    notes: "",
    createdAt: "2025-02-17",
    updatedAt: "2025-02-23",
  },
  {
    id: "req-8",
    sponsorId: "hero-4",
    publisherId: "current-user",
    status: "published",
    initiatedBy: "sponsor",
    brief: "I promoted my Weekend Course Sprint — a 48-hour intensive that helps creators go from idea to live course. No tech skills required. This was aimed at Alex's audience of knowledge entrepreneurs.",
    adHeadline: "Launch Your Course in a Weekend",
    adBody: "Jake Morrison's Weekend Course Sprint has helped 200+ creators go from idea to live course in 48 hours. No tech skills required.",
    adCta: "Join the Sprint",
    adCtaUrl: "https://jakemorrison.io/sprint",
    proposedFee: 250,
    numberOfSends: 1,
    proposedDate: "2025-02-01",
    notes: "",
    createdAt: "2025-01-10",
    updatedAt: "2025-02-01",
  },
  // ── Paid: payment cleared ──
  // (none yet for the current user)
  // ── Declined ──
  {
    id: "req-15",
    sponsorId: "hero-8",
    publisherId: "current-user",
    status: "declined",
    initiatedBy: "sponsor",
    brief: "I'm promoting my Brand Builder Workshop for creative professionals. Alex's audience includes creators who need to build their personal brand to grow.",
    adHeadline: "Build Your Brand in a Weekend",
    adBody: "Carlos Mendez's Brand Builder Workshop helps creative entrepreneurs craft a professional brand in just 2 days. Templates, tools, and live feedback included.",
    adCta: "Register Now",
    adCtaUrl: "https://carlosmendez.design/brand",
    proposedFee: 200,
    numberOfSends: 1,
    proposedDate: "2025-03-22",
    notes: "",
    createdAt: "2025-02-12",
    updatedAt: "2025-02-25",
  },
  // ── Expired ──
  {
    id: "req-9",
    sponsorId: "hero-8",
    publisherId: "current-user",
    status: "expired",
    initiatedBy: "sponsor",
    brief: "I teach creative entrepreneurs how to build a professional brand without hiring a designer. I'm promoting my Design Toolkit, which would be useful for education-focused creators building their personal brand.",
    adHeadline: "Design Systems for Non-Designers",
    adBody: "Carlos Mendez teaches creative entrepreneurs how to build a professional brand without hiring a designer.",
    adCta: "Get the Toolkit",
    adCtaUrl: "https://carlosmendez.design/toolkit",
    proposedFee: 200,
    numberOfSends: 1,
    proposedDate: "2025-02-10",
    notes: "",
    createdAt: "2025-01-20",
    updatedAt: "2025-02-05",
  },
]

// ============================================================
// Helper Functions
// ============================================================

export function getPublishers(): Hero[] {
  return heroes.filter((h) => h.role === "publisher" || h.role === "both")
}

export function getSponsors(): Hero[] {
  return heroes.filter((h) => h.role === "sponsor" || h.role === "both")
}

export function getHero(id: string): Hero | undefined {
  if (id === "current-user") return currentUser
  return heroes.find((h) => h.id === id)
}

export function getRecommendedFee(subscriberCount: number, openRate: number): number {
  const baseFee = subscriberCount * 0.005
  const engagementMultiplier = openRate > 35 ? 1.5 : openRate > 25 ? 1.2 : 1.0
  return Math.round(baseFee * engagementMultiplier / 25) * 25
}

export function getRequestsForUser(
  userId: string,
  roleFilter: Role
): PromotionRequest[] {
  return promotionRequests.filter((r) => {
    if (roleFilter === "publisher" || roleFilter === "both") {
      if (r.publisherId === userId) return true
    }
    if (roleFilter === "sponsor" || roleFilter === "both") {
      if (r.sponsorId === userId) return true
    }
    return false
  })
}

export function getRequest(id: string): PromotionRequest | undefined {
  return promotionRequests.find((r) => r.id === id)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}k`
  }
  return num.toString()
}

export function getEngagementColor(tier: EngagementTier): string {
  switch (tier) {
    case "high":
      return "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950"
    case "medium":
      return "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950"
    case "low":
      return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950"
  }
}

export function getStatusColor(status: RequestStatus): string {
  switch (status) {
    case "pending":
      return "bg-[#9FC2CC]/50 text-[#1E3A4D] dark:bg-[#3A6278]/40 dark:text-[#9FC2CC]"
    case "accepted":
      return "bg-[#EFD3A9]/50 text-[#6B4A15] dark:bg-[#D6A151]/30 dark:text-[#EFD3A9]"
    case "scheduled":
      return "bg-[#9FC2CC]/50 text-[#1E3A4D] dark:bg-[#3A6278]/40 dark:text-[#9FC2CC]"
    case "published":
      return "bg-[#CBD7CC]/50 text-[#2A3D35] dark:bg-[#405B50]/40 dark:text-[#CBD7CC]"
    case "paid":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
    case "declined":
      return "bg-[#D7CBD5]/50 text-[#352938] dark:bg-[#52405B]/40 dark:text-[#D7CBD5]"
    case "expired":
      return "bg-[#D7CBD5]/50 text-[#352938] dark:bg-[#52405B]/40 dark:text-[#D7CBD5]"
  }
}

/** Get heroes that would be good matches for the current user based on shared verticals */
export function getRecommendedHeroes(forRole: Role): Hero[] {
  const userVerticals = new Set(currentUser.verticals)
  return heroes
    .filter((h) => {
      // Publishers see sponsors and vice versa
      if (forRole === "publisher") return h.role === "sponsor" || h.role === "both"
      if (forRole === "sponsor") return h.role === "publisher" || h.role === "both"
      return true
    })
    .sort((a, b) => {
      const aMatch = a.verticals.filter((v) => userVerticals.has(v)).length
      const bMatch = b.verticals.filter((v) => userVerticals.has(v)).length
      return bMatch - aMatch
    })
}
