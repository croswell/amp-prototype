import { generatedHeroes } from "./generated-heroes"
import { seedPromotions } from "./seed-promotions"

// ============================================================
// Types
// ============================================================

export type Role = "publisher" | "sponsor" | "both"
export type EngagementTier = "high" | "medium" | "low"
export type RequestStatus =
  | "pending"
  | "accepted"
  | "in_review"
  | "scheduled"
  | "published"
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
  budgetPerThousand?: number
  maxBudget?: number
  bio: string
  website: string
  socialLinks: { platform: string; url: string }[]
  promotionsCompleted: number
  rating: number
  joinedDate: string
}

export type TimelineEventType =
  | "proposal_sent"
  | "accepted"
  | "declined"
  | "copy_suggested"
  | "revision_requested"
  | "copy_locked"
  | "broadcast_created"
  | "scheduled"
  | "published"
  | "expired"

export interface CopySnapshot {
  adHeadline: string
  adBody: string
  adCta: string
  adCtaUrl: string
}

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  actorId: string
  timestamp: string
  note?: string
  copyBefore?: CopySnapshot
  copyAfter?: CopySnapshot
  metadata?: Record<string, string>
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
  notes: string
  reviewTurn?: "sponsor" | "publisher"
  proposedEdits?: {
    adHeadline: string
    adBody: string
    adCta: string
    adCtaUrl: string
  }
  revisionNotes?: string
  scheduledAt?: string
  createdAt: string
  updatedAt: string
  timeline?: TimelineEvent[]
}

// ============================================================
// Status labels for request flow
// ============================================================

export const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: "Pending",
  accepted: "Approved",
  in_review: "In Review",
  scheduled: "Scheduled",
  published: "Published",
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
    budgetPerThousand: 35,
    maxBudget: 2500,
    bio: "Author, speaker, and community builder. I run a 5,000-member community for women in leadership. My subscribers are engaged, ambitious, and ready to invest in themselves.",
    website: "https://priyapatel.com",
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/priyapatel" },
      { platform: "twitter", url: "https://twitter.com/priyapatel" },
    ],
    promotionsCompleted: 31,
    rating: 5.0,
    joinedDate: "2024-01-10",
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
    budgetPerThousand: 25,
    maxBudget: 1500,
    bio: "I teach creators how to package their knowledge into profitable online courses. Looking to reach new audiences through trusted publisher recommendations.",
    website: "https://jakemorrison.io",
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/jakemorrison" },
    ],
    promotionsCompleted: 8,
    rating: 4.7,
    joinedDate: "2024-08-01",
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
    budgetPerThousand: 20,
    maxBudget: 500,
    bio: "I run a SaaS tool that helps podcasters grow their audience. Looking to partner with publishers who have engaged, creator-focused audiences.",
    website: "https://podgrowth.co",
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/davidkim" },
      { platform: "linkedin", url: "https://linkedin.com/in/davidkim" },
    ],
    promotionsCompleted: 5,
    rating: 4.5,
    joinedDate: "2024-09-01",
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
    budgetPerThousand: 30,
    maxBudget: 1500,
    bio: "Mom of 3, author of 'Connected Parenting', and creator of the Mindful Moms community. My audience is deeply engaged and trusts my product recommendations.",
    website: "https://emmanguyen.com",
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/emmanguyen" },
      { platform: "youtube", url: "https://youtube.com/@emmanguyen" },
    ],
    promotionsCompleted: 22,
    rating: 4.9,
    joinedDate: "2024-02-28",
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
    budgetPerThousand: 25,
    maxBudget: 800,
    bio: "I built a 7-figure membership site and now teach others to do the same. Looking to reach engaged publisher audiences in the education and coaching space.",
    website: "https://lisapark.co",
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/lisapark" },
    ],
    promotionsCompleted: 10,
    rating: 4.8,
    joinedDate: "2024-07-10",
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
  },
  // ── Additional curated publishers ──
  {
    id: "hero-11",
    name: "Tanya Osei",
    avatar: "/avatars/tanya.jpg",
    role: "publisher",
    tagline: "Financial freedom for first-gen wealth builders",
    verticals: ["Finance", "Personal Development"],
    subscriberCount: 61000,
    engagementTier: "high",
    openRate: 46,
    clickRate: 9.4,
    recommendedFee: 475,
    bio: "First-generation wealth builder turned financial educator. My community of 61K readers is highly engaged — they click, they buy, and they share. I only promote tools I've personally used to grow my own net worth.",
    website: "https://tanyaosei.com",
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/tanyaosei" },
      { platform: "youtube", url: "https://youtube.com/@tanyaosei" },
    ],
    promotionsCompleted: 34,
    rating: 5.0,
    joinedDate: "2023-11-20",
  },
  {
    id: "hero-12",
    name: "Ben Gallagher",
    avatar: "/avatars/ben.jpg",
    role: "publisher",
    tagline: "The bootstrapped SaaS newsletter",
    verticals: ["Technology", "Business & Marketing"],
    subscriberCount: 37000,
    engagementTier: "high",
    openRate: 41,
    clickRate: 7.8,
    recommendedFee: 350,
    bio: "Bootstrapped my SaaS to $50K MRR and write about the journey every week. My readers are indie hackers, solopreneurs, and developers building their own products. They love actionable tools and resources.",
    website: "https://bengallagher.dev",
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/bengallagher" },
      { platform: "linkedin", url: "https://linkedin.com/in/bengallagher" },
    ],
    promotionsCompleted: 19,
    rating: 4.8,
    joinedDate: "2024-03-01",
  },
  {
    id: "hero-13",
    name: "Diana Reyes",
    avatar: "/avatars/diana.jpg",
    role: "publisher",
    tagline: "Wellness routines for working moms",
    verticals: ["Health & Fitness", "Parenting"],
    subscriberCount: 44000,
    engagementTier: "high",
    openRate: 43,
    clickRate: 8.0,
    recommendedFee: 375,
    bio: "Certified nutritionist and mom of two. I help busy moms reclaim their energy without restrictive diets or 5 AM workouts. My readers are loyal and actively looking for products that make healthy living easier.",
    website: "https://dianareyes.co",
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/dianareyes" },
      { platform: "tiktok", url: "https://tiktok.com/@dianareyes" },
    ],
    promotionsCompleted: 21,
    rating: 4.9,
    joinedDate: "2024-02-15",
  },
  {
    id: "hero-14",
    name: "Kenji Watanabe",
    avatar: "/avatars/kenji.jpg",
    role: "publisher",
    tagline: "AI tools for non-technical creators",
    verticals: ["Technology", "Education"],
    subscriberCount: 72000,
    engagementTier: "high",
    openRate: 48,
    clickRate: 10.2,
    recommendedFee: 550,
    bio: "Former Google engineer turned creator educator. I break down AI and no-code tools so anyone can build. My newsletter is one of the fastest-growing in the creator economy — readers are early adopters who love trying new tools.",
    website: "https://kenjiwatanabe.com",
    socialLinks: [
      { platform: "youtube", url: "https://youtube.com/@kenjiwatanabe" },
      { platform: "twitter", url: "https://twitter.com/kenjiwatanabe" },
    ],
    promotionsCompleted: 27,
    rating: 4.9,
    joinedDate: "2024-01-15",
  },
  {
    id: "hero-15",
    name: "Nadia Volkov",
    avatar: "/avatars/nadia.jpg",
    role: "publisher",
    tagline: "Creative business for artists and makers",
    verticals: ["Creative Arts", "Business & Marketing"],
    subscriberCount: 26000,
    engagementTier: "medium",
    openRate: 34,
    clickRate: 6.1,
    recommendedFee: 200,
    bio: "I turned my illustration side hustle into a six-figure business and now I teach other artists to do the same. My readers are painters, illustrators, photographers, and makers looking to monetize their craft.",
    website: "https://nadiavolkov.art",
    socialLinks: [
      { platform: "instagram", url: "https://instagram.com/nadiavolkov" },
      { platform: "dribbble", url: "https://dribbble.com/nadiavolkov" },
    ],
    promotionsCompleted: 11,
    rating: 4.7,
    joinedDate: "2024-06-01",
  },
  {
    id: "hero-16",
    name: "Jordan Ellis",
    avatar: "/avatars/jordan.jpg",
    role: "publisher",
    tagline: "Intentional living and slow productivity",
    verticals: ["Lifestyle", "Personal Development"],
    subscriberCount: 39000,
    engagementTier: "high",
    openRate: 40,
    clickRate: 7.1,
    recommendedFee: 325,
    bio: "Author of 'The Slow Build' and advocate for doing less, better. My audience rejects hustle culture — they want quality tools, books, and systems that support a sustainable lifestyle. High trust, high conversion.",
    website: "https://jordanellis.co",
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/jordanellis" },
      { platform: "linkedin", url: "https://linkedin.com/in/jordanellis" },
    ],
    promotionsCompleted: 16,
    rating: 4.8,
    joinedDate: "2024-04-10",
  },
  // ── Additional curated sponsors ──
  {
    id: "hero-17",
    name: "Michelle Tang",
    avatar: "/avatars/michelle.jpg",
    role: "sponsor",
    tagline: "All-in-one email marketing for creators",
    verticals: ["Technology", "Business & Marketing"],
    subscriberCount: 11000,
    engagementTier: "medium",
    openRate: 26,
    clickRate: 4.0,
    recommendedFee: 130,
    budgetPerThousand: 22,
    maxBudget: 650,
    bio: "Co-founder of MailSpark, an email marketing platform built specifically for creators and course sellers. We're looking to get in front of engaged publisher audiences who already understand the value of email.",
    website: "https://mailspark.io",
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/michelletang" },
      { platform: "linkedin", url: "https://linkedin.com/in/michelletang" },
    ],
    promotionsCompleted: 7,
    rating: 4.6,
    joinedDate: "2024-08-15",
  },
  {
    id: "hero-18",
    name: "Derek Hoffman",
    avatar: "/avatars/derek.jpg",
    role: "sponsor",
    tagline: "Accounting software for solopreneurs",
    verticals: ["Finance", "Business & Marketing"],
    subscriberCount: 9000,
    engagementTier: "medium",
    openRate: 24,
    clickRate: 3.5,
    recommendedFee: 110,
    budgetPerThousand: 18,
    maxBudget: 500,
    bio: "I built SoloBooks — dead-simple accounting for one-person businesses. No accounting degree required. Looking to partner with publishers whose audiences are freelancers, coaches, and creators managing their own finances.",
    website: "https://solobooks.co",
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/derekhoffman" },
    ],
    promotionsCompleted: 4,
    rating: 4.5,
    joinedDate: "2024-09-20",
  },
  {
    id: "hero-19",
    name: "Serena Obi",
    avatar: "/avatars/serena.jpg",
    role: "sponsor",
    tagline: "Coaching certification for aspiring coaches",
    verticals: ["Education", "Personal Development"],
    subscriberCount: 14000,
    engagementTier: "medium",
    openRate: 29,
    clickRate: 4.8,
    recommendedFee: 155,
    budgetPerThousand: 25,
    maxBudget: 750,
    bio: "I run the Certified Coach Academy — an ICF-accredited program that turns experts into certified coaches in 12 weeks. Looking to reach audiences of aspiring coaches, consultants, and educators who want to add coaching to their skillset.",
    website: "https://certifiedcoachacademy.com",
    socialLinks: [
      { platform: "linkedin", url: "https://linkedin.com/in/serenaobi" },
      { platform: "instagram", url: "https://instagram.com/serenaobi" },
    ],
    promotionsCompleted: 9,
    rating: 4.7,
    joinedDate: "2024-07-05",
  },
  {
    id: "hero-20",
    name: "Aaron Voss",
    avatar: "/avatars/aaron.jpg",
    role: "sponsor",
    tagline: "Landing page builder for course creators",
    verticals: ["Technology", "Education"],
    subscriberCount: 7500,
    engagementTier: "medium",
    openRate: 23,
    clickRate: 3.3,
    recommendedFee: 100,
    budgetPerThousand: 18,
    maxBudget: 400,
    bio: "Founder of LaunchKit — a drag-and-drop landing page builder designed for course creators and coaches. We convert 2x better than generic page builders because we're built for knowledge businesses.",
    website: "https://launchkit.app",
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/aaronvoss" },
      { platform: "youtube", url: "https://youtube.com/@aaronvoss" },
    ],
    promotionsCompleted: 3,
    rating: 4.4,
    joinedDate: "2024-10-01",
  },
  {
    id: "hero-21",
    name: "Camille Roux",
    avatar: "/avatars/camille.jpg",
    role: "sponsor",
    tagline: "Premium templates for Kajabi creators",
    verticals: ["Creative Arts", "Education"],
    subscriberCount: 6000,
    engagementTier: "low",
    openRate: 20,
    clickRate: 2.8,
    recommendedFee: 75,
    budgetPerThousand: 15,
    maxBudget: 300,
    bio: "I design premium Kajabi website and course templates that help creators look professional on day one. Looking to reach Kajabi users and online educators who want to level up their branding.",
    website: "https://camilleroux.design",
    socialLinks: [
      { platform: "dribbble", url: "https://dribbble.com/camilleroux" },
      { platform: "instagram", url: "https://instagram.com/camilleroux" },
    ],
    promotionsCompleted: 2,
    rating: 4.3,
    joinedDate: "2024-11-01",
  },
  {
    id: "hero-22",
    name: "Troy Aniston",
    avatar: "/avatars/troy.jpg",
    role: "sponsor",
    tagline: "Video editing made effortless with AI",
    verticals: ["Technology", "Creative Arts"],
    subscriberCount: 10000,
    engagementTier: "medium",
    openRate: 27,
    clickRate: 4.1,
    recommendedFee: 125,
    budgetPerThousand: 20,
    maxBudget: 600,
    bio: "Co-founder of ClipFlow, an AI-powered video editor that turns long-form content into social clips in minutes. Creators who publish courses, YouTube videos, or podcasts are our ideal users.",
    website: "https://clipflow.ai",
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/troyaniston" },
      { platform: "youtube", url: "https://youtube.com/@troyaniston" },
    ],
    promotionsCompleted: 6,
    rating: 4.6,
    joinedDate: "2024-08-10",
  },
  // ── Additional curated both (publisher + sponsor) ──
  {
    id: "hero-23",
    name: "Lena Kapoor",
    avatar: "/avatars/lena.jpg",
    role: "both",
    tagline: "Community building for knowledge entrepreneurs",
    verticals: ["Business & Marketing", "Education"],
    subscriberCount: 50000,
    engagementTier: "high",
    openRate: 43,
    clickRate: 8.5,
    recommendedFee: 425,
    budgetPerThousand: 30,
    maxBudget: 2000,
    bio: "I built a 10,000-member paid community and now teach the model to other creators. As a publisher, my audience is deeply engaged course creators. As a sponsor, I'm promoting my Community Playbook program to aligned audiences.",
    website: "https://lenakapoor.com",
    socialLinks: [
      { platform: "twitter", url: "https://twitter.com/lenakapoor" },
      { platform: "linkedin", url: "https://linkedin.com/in/lenakapoor" },
    ],
    promotionsCompleted: 26,
    rating: 4.9,
    joinedDate: "2024-01-20",
  },
  {
    id: "hero-24",
    name: "Marcus Webb",
    avatar: "/avatars/marcuswebb.jpg",
    role: "both",
    tagline: "Sleep science and recovery for peak performance",
    verticals: ["Health & Fitness", "Personal Development"],
    subscriberCount: 35000,
    engagementTier: "high",
    openRate: 37,
    clickRate: 6.9,
    recommendedFee: 300,
    budgetPerThousand: 25,
    maxBudget: 1500,
    bio: "Sleep researcher and former Olympic trainer. My newsletter covers the science of recovery, sleep optimization, and sustainable performance. As a sponsor, I promote my Sleep Protocol course to health-conscious audiences.",
    website: "https://marcuswebb.co",
    socialLinks: [
      { platform: "youtube", url: "https://youtube.com/@marcuswebb" },
      { platform: "instagram", url: "https://instagram.com/marcuswebb" },
    ],
    promotionsCompleted: 14,
    rating: 4.8,
    joinedDate: "2024-05-01",
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
  // ── Demo requests between Sarah (publisher) & Jake (sponsor) ──
  {
    id: "req-demo-1",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "pending",
    initiatedBy: "sponsor",
    brief: "I teach creators how to package their knowledge into profitable online courses. My Course Launch Blueprint has helped 500+ creators launch their first course. I think your audience of coaches building online businesses would be a perfect fit — many of them are sitting on expertise they haven't monetized yet.",
    adHeadline: "Create Your First Online Course in 30 Days",
    adBody: "Jake Morrison's step-by-step framework has helped 500+ creators launch profitable courses. Get his free Course Launch Blueprint and start building your course today.",
    adCta: "Get the Free Blueprint",
    adCtaUrl: "https://jakemorrison.io/blueprint",
    proposedFee: 350,
    notes: "",
    createdAt: "2025-02-26",
    updatedAt: "2025-02-26",
    timeline: [
      {
        id: "req-demo-1-evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2025-02-26T10:00:00Z",
        note: "I teach creators how to package their knowledge into profitable online courses. My Course Launch Blueprint has helped 500+ creators launch their first course. I think your audience of coaches building online businesses would be a perfect fit — many of them are sitting on expertise they haven't monetized yet.",
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
  {
    id: "req-demo-4",
    sponsorId: "hero-3",
    publisherId: "current-user",
    status: "pending",
    initiatedBy: "publisher",
    brief:
      "I'd love to feature your 'Ambitious Women' community in my newsletter. My audience of coaches and consultants skews 70% women — and they're always looking for communities to join. This feels like a natural fit.",
    adHeadline: "Join 5,000 Ambitious Women Building Their Empires",
    adBody:
      "Priya Patel's community for women in leadership gives you weekly masterclasses, peer accountability, and a network of ambitious women who get it. Stop going it alone.",
    adCta: "Join the Community",
    adCtaUrl: "https://priyapatel.com/community",
    proposedFee: 500,
    notes: "",
    createdAt: "2025-02-24",
    updatedAt: "2025-02-24",
    timeline: [
      {
        id: "req-demo-4-evt-1",
        type: "proposal_sent",
        actorId: "current-user",
        timestamp: "2025-02-24T14:00:00Z",
        note: "I'd love to feature your 'Ambitious Women' community in my newsletter. My audience of coaches and consultants skews 70% women — and they're always looking for communities to join. This feels like a natural fit.",
        copyAfter: {
          adHeadline: "Join 5,000 Ambitious Women Building Their Empires",
          adBody:
            "Priya Patel's community for women in leadership gives you weekly masterclasses, peer accountability, and a network of ambitious women who get it. Stop going it alone.",
          adCta: "Join the Community",
          adCtaUrl: "https://priyapatel.com/community",
        },
      },
    ],
  },
  {
    id: "req-demo-2",
    sponsorId: "hero-4",
    publisherId: "hero-1",
    status: "accepted",
    initiatedBy: "sponsor",
    brief: "Promoting the Weekend Course Sprint to Sarah's coaching audience. Many coaches want a quick way to create their first course without spending months on it.",
    adHeadline: "Launch Your Course in a Weekend",
    adBody: "Jake Morrison's Weekend Course Sprint has helped 200+ creators go from idea to live course in 48 hours. No tech skills required.",
    adCta: "Join the Sprint",
    adCtaUrl: "https://jakemorrison.io/sprint",
    proposedFee: 300,
    notes: "",
    createdAt: "2025-02-20",
    updatedAt: "2025-02-24",
    timeline: [
      {
        id: "req-demo-2-evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2025-02-20T10:00:00Z",
        note: "Promoting the Weekend Course Sprint to Sarah's coaching audience. Many coaches want a quick way to create their first course without spending months on it.",
        copyAfter: {
          adHeadline: "Launch Your Course in a Weekend",
          adBody:
            "Jake Morrison's Weekend Course Sprint has helped 200+ creators go from idea to live course in 48 hours. No tech skills required.",
          adCta: "Join the Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
      },
      {
        id: "req-demo-2-evt-2",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-02-21T14:30:00Z",
        note: "Love the Sprint concept! I tweaked the angle to acknowledge my readers' existing expertise — they respond better when we speak to what they already know.",
        copyBefore: {
          adHeadline: "Launch Your Course in a Weekend",
          adBody:
            "Jake Morrison's Weekend Course Sprint has helped 200+ creators go from idea to live course in 48 hours. No tech skills required.",
          adCta: "Join the Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
        copyAfter: {
          adHeadline: "From Expertise to Course in 48 Hours",
          adBody:
            "You already have the knowledge — Jake Morrison's Weekend Course Sprint helps you package it into a live course in just one weekend. 200+ creators have done it. No tech skills needed.",
          adCta: "Reserve Your Spot",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
      },
      {
        id: "req-demo-2-evt-3",
        type: "revision_requested",
        actorId: "hero-4",
        timestamp: "2025-02-22T09:15:00Z",
        note: "Love the angle of acknowledging their expertise! But can we keep 'Weekend' in the headline? That's our key differentiator. The body is great.",
      },
      {
        id: "req-demo-2-evt-4",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-02-23T11:00:00Z",
        note: "Done! Kept 'Weekend' front and center while preserving the expertise angle.",
        copyBefore: {
          adHeadline: "From Expertise to Course in 48 Hours",
          adBody:
            "You already have the knowledge — Jake Morrison's Weekend Course Sprint helps you package it into a live course in just one weekend. 200+ creators have done it. No tech skills needed.",
          adCta: "Reserve Your Spot",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
        copyAfter: {
          adHeadline: "Turn Your Expertise Into a Course This Weekend",
          adBody:
            "You already have the knowledge — Jake Morrison's Weekend Course Sprint helps you package it into a live course in just 48 hours. 200+ creators have already done it, no tech skills needed.",
          adCta: "Reserve Your Spot",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
      },
      {
        id: "req-demo-2-evt-5",
        type: "copy_locked",
        actorId: "hero-4",
        timestamp: "2025-02-24T08:00:00Z",
        note: "Perfect — approved!",
      },
    ],
  },
  // ── In Review: revision loop in progress ──
  {
    id: "req-demo-3",
    sponsorId: "hero-6",
    publisherId: "hero-1",
    status: "in_review",
    initiatedBy: "sponsor",
    reviewTurn: "sponsor",
    brief: "I run PodGrowth, a SaaS tool that helps podcasters grow. Sarah's coaching audience includes creators launching podcasts, so this is a natural fit.",
    adHeadline: "Grow Your Podcast to 10K Downloads",
    adBody: "PodGrowth helps podcasters double their audience in 90 days with AI-powered growth tools. Join 2,000+ podcasters already using the platform.",
    adCta: "Try PodGrowth Free",
    adCtaUrl: "https://podgrowth.co/trial",
    proposedEdits: {
      adHeadline: "Double Your Podcast Audience in 90 Days",
      adBody: "PodGrowth's AI-powered tools have helped 2,000+ podcasters grow faster. Whether you're just starting or scaling, get the downloads your content deserves.",
      adCta: "Start Free Trial",
      adCtaUrl: "https://podgrowth.co/trial",
    },
    proposedFee: 350,
    notes: "",
    createdAt: "2025-02-22",
    updatedAt: "2025-02-26",
    timeline: [
      {
        id: "req-demo-3-evt-1",
        type: "proposal_sent",
        actorId: "hero-6",
        timestamp: "2025-02-22T10:00:00Z",
        note: "I run PodGrowth, a SaaS tool that helps podcasters grow. Sarah's coaching audience includes creators launching podcasts, so this is a natural fit.",
        copyAfter: {
          adHeadline: "Grow Your Podcast to 10K Downloads",
          adBody:
            "PodGrowth helps podcasters double their audience in 90 days with AI-powered growth tools. Join 2,000+ podcasters already using the platform.",
          adCta: "Try PodGrowth Free",
          adCtaUrl: "https://podgrowth.co/trial",
        },
      },
      {
        id: "req-demo-3-evt-2",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-02-23T15:00:00Z",
        note: "Love the product! I tweaked the angle to focus on the ease of getting started — my audience responds better to 'made easy' framing than big number promises.",
        copyBefore: {
          adHeadline: "Grow Your Podcast to 10K Downloads",
          adBody:
            "PodGrowth helps podcasters double their audience in 90 days with AI-powered growth tools. Join 2,000+ podcasters already using the platform.",
          adCta: "Try PodGrowth Free",
          adCtaUrl: "https://podgrowth.co/trial",
        },
        copyAfter: {
          adHeadline: "Podcasting Made Easy — Grow Your Audience Faster",
          adBody:
            "Whether you're just starting or trying to scale, PodGrowth's AI-powered tools help podcasters reach more listeners. Over 2,000 podcasters already use it to grow smarter.",
          adCta: "Try PodGrowth Free",
          adCtaUrl: "https://podgrowth.co/trial",
        },
      },
      {
        id: "req-demo-3-evt-3",
        type: "revision_requested",
        actorId: "hero-6",
        timestamp: "2025-02-25T09:00:00Z",
        note: "Good direction! But I'd rather lead with the specific '90 days' promise — that's our key selling point. Can you make it more results-focused?",
      },
      {
        id: "req-demo-3-evt-4",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-02-26T14:00:00Z",
        note: "Got it — led with the 90-day result and tightened the CTA. This should hit harder.",
        copyBefore: {
          adHeadline: "Podcasting Made Easy — Grow Your Audience Faster",
          adBody:
            "Whether you're just starting or trying to scale, PodGrowth's AI-powered tools help podcasters reach more listeners. Over 2,000 podcasters already use it to grow smarter.",
          adCta: "Try PodGrowth Free",
          adCtaUrl: "https://podgrowth.co/trial",
        },
        copyAfter: {
          adHeadline: "Double Your Podcast Audience in 90 Days",
          adBody:
            "PodGrowth's AI-powered tools have helped 2,000+ podcasters grow faster. Whether you're just starting or scaling, get the downloads your content deserves.",
          adCta: "Start Free Trial",
          adCtaUrl: "https://podgrowth.co/trial",
        },
      },
    ],
  },
  // ── Scheduled: date is set, waiting to go live ──
  {
    id: "req-10",
    sponsorId: "hero-3",
    publisherId: "current-user",
    status: "scheduled",
    scheduledAt: "2025-03-05T10:00:00",
    initiatedBy: "sponsor",
    brief: "I'm launching a new leadership coaching program for women and want to reach Alex's audience of knowledge entrepreneurs. Many of them are women building businesses who'd benefit from leadership skills.",
    adHeadline: "Lead With Confidence",
    adBody: "Priya Patel's new leadership program helps ambitious women step into their power. Join 5,000+ women already in the community.",
    adCta: "Join the Program",
    adCtaUrl: "https://priyapatel.com/lead",
    proposedFee: 400,
    notes: "",
    createdAt: "2025-02-19",
    updatedAt: "2025-02-22",
    timeline: [
      {
        id: "req-10-evt-1",
        type: "proposal_sent",
        actorId: "hero-3",
        timestamp: "2025-02-19T10:00:00Z",
        note: "I'm launching a new leadership coaching program for women and want to reach Alex's audience of knowledge entrepreneurs. Many of them are women building businesses who'd benefit from leadership skills.",
        copyAfter: {
          adHeadline: "Lead With Confidence",
          adBody:
            "Priya Patel's new leadership program helps ambitious women step into their power. Join 5,000+ women already in the community.",
          adCta: "Join the Program",
          adCtaUrl: "https://priyapatel.com/lead",
        },
      },
      {
        id: "req-10-evt-2",
        type: "copy_suggested",
        actorId: "current-user",
        timestamp: "2025-02-19T16:00:00Z",
        note: "Love this Priya! Tweaked the body to make it feel more personal and less like a generic ad. My audience responds to transformation language.",
        copyBefore: {
          adHeadline: "Lead With Confidence",
          adBody:
            "Priya Patel's new leadership program helps ambitious women step into their power. Join 5,000+ women already in the community.",
          adCta: "Join the Program",
          adCtaUrl: "https://priyapatel.com/lead",
        },
        copyAfter: {
          adHeadline: "Confidence in Leadership Starts Here",
          adBody:
            "Priya Patel's leadership program is designed for ambitious professionals ready to step up. Join 5,000+ women already building confidence and influence.",
          adCta: "Join the Program",
          adCtaUrl: "https://priyapatel.com/lead",
        },
      },
      {
        id: "req-10-evt-3",
        type: "revision_requested",
        actorId: "hero-3",
        timestamp: "2025-02-20T09:00:00Z",
        note: "Love it! But can we emphasize the community aspect more? And 'step up' might feel vague — can we be more specific about what they'll get?",
      },
      {
        id: "req-10-evt-4",
        type: "copy_suggested",
        actorId: "current-user",
        timestamp: "2025-02-20T15:00:00Z",
        note: "Revised! Brought back 'Lead With Confidence' and emphasized the community support angle.",
        copyBefore: {
          adHeadline: "Confidence in Leadership Starts Here",
          adBody:
            "Priya Patel's leadership program is designed for ambitious professionals ready to step up. Join 5,000+ women already building confidence and influence.",
          adCta: "Join the Program",
          adCtaUrl: "https://priyapatel.com/lead",
        },
        copyAfter: {
          adHeadline: "Lead With Confidence",
          adBody:
            "Priya Patel's leadership program helps ambitious women build the confidence and skills to lead. With a 5,000-member community behind you, you'll never lead alone.",
          adCta: "Join the Program",
          adCtaUrl: "https://priyapatel.com/lead",
        },
      },
      {
        id: "req-10-evt-5",
        type: "copy_locked",
        actorId: "hero-3",
        timestamp: "2025-02-21T09:00:00Z",
        note: "That's perfect — approved!",
      },
      {
        id: "req-10-evt-6",
        type: "broadcast_created",
        actorId: "current-user",
        timestamp: "2025-02-22T10:00:00Z",
      },
      {
        id: "req-10-evt-7",
        type: "scheduled",
        actorId: "current-user",
        timestamp: "2025-02-22T14:00:00Z",
        metadata: { scheduledAt: "2025-03-05T10:00:00" },
      },
    ],
  },
  {
    id: "req-11",
    sponsorId: "hero-7",
    publisherId: "current-user",
    status: "scheduled",
    scheduledAt: "2025-03-07T09:00:00",
    initiatedBy: "sponsor",
    brief: "I'm promoting my Connected Parenting digital workshop. Many knowledge entrepreneurs are also parents looking for better work-life balance strategies.",
    adHeadline: "The Connected Parenting Workshop",
    adBody: "Emma Nguyen's digital workshop helps busy parents build deeper connections with their kids — even with a packed schedule. Over 3,000 families transformed.",
    adCta: "Get Instant Access",
    adCtaUrl: "https://emmanguyen.com/workshop",
    proposedFee: 275,
    notes: "",
    createdAt: "2025-02-20",
    updatedAt: "2025-02-23",
    timeline: [
      {
        id: "req-11-evt-1",
        type: "proposal_sent",
        actorId: "hero-7",
        timestamp: "2025-02-20T10:00:00Z",
        note: "I'm promoting my Connected Parenting digital workshop. Many knowledge entrepreneurs are also parents looking for better work-life balance strategies.",
        copyAfter: {
          adHeadline: "The Connected Parenting Workshop",
          adBody:
            "Emma Nguyen's digital workshop helps busy parents build deeper connections with their kids — even with a packed schedule. Over 3,000 families transformed.",
          adCta: "Get Instant Access",
          adCtaUrl: "https://emmanguyen.com/workshop",
        },
      },
      {
        id: "req-11-evt-2",
        type: "copy_suggested",
        actorId: "current-user",
        timestamp: "2025-02-20T15:00:00Z",
        note: "Perfect fit for my audience, Emma! Adjusted the body to speak to busy entrepreneurs specifically.",
        copyBefore: {
          adHeadline: "The Connected Parenting Workshop",
          adBody:
            "Emma Nguyen's digital workshop helps busy parents build deeper connections with their kids — even with a packed schedule. Over 3,000 families transformed.",
          adCta: "Get Instant Access",
          adCtaUrl: "https://emmanguyen.com/workshop",
        },
        copyAfter: {
          adHeadline: "Build Deeper Connections With Your Kids",
          adBody:
            "Even busy entrepreneurs can be present parents. Emma Nguyen's Connected Parenting Workshop gives you practical tools to strengthen your relationship with your kids — no matter how packed your schedule is.",
          adCta: "Get Workshop Access",
          adCtaUrl: "https://emmanguyen.com/workshop",
        },
      },
      {
        id: "req-11-evt-3",
        type: "revision_requested",
        actorId: "hero-7",
        timestamp: "2025-02-21T09:00:00Z",
        note: "Great angle! But can we mention the 3,000 families stat? Social proof matters here. Also, 'present parents' might feel guilt-inducing — can we soften that?",
      },
      {
        id: "req-11-evt-4",
        type: "copy_suggested",
        actorId: "current-user",
        timestamp: "2025-02-22T11:00:00Z",
        note: "Good call — removed the guilt angle and brought back the social proof.",
        copyBefore: {
          adHeadline: "Build Deeper Connections With Your Kids",
          adBody:
            "Even busy entrepreneurs can be present parents. Emma Nguyen's Connected Parenting Workshop gives you practical tools to strengthen your relationship with your kids — no matter how packed your schedule is.",
          adCta: "Get Workshop Access",
          adCtaUrl: "https://emmanguyen.com/workshop",
        },
        copyAfter: {
          adHeadline: "The Connected Parenting Workshop",
          adBody:
            "Emma Nguyen's digital workshop helps busy parents build deeper connections with their kids — even with a packed schedule. Over 3,000 families transformed.",
          adCta: "Get Instant Access",
          adCtaUrl: "https://emmanguyen.com/workshop",
        },
      },
      {
        id: "req-11-evt-5",
        type: "copy_locked",
        actorId: "hero-7",
        timestamp: "2025-02-22T16:00:00Z",
        note: "Looks great — approved!",
      },
      {
        id: "req-11-evt-6",
        type: "broadcast_created",
        actorId: "current-user",
        timestamp: "2025-02-23T10:00:00Z",
      },
      {
        id: "req-11-evt-7",
        type: "scheduled",
        actorId: "current-user",
        timestamp: "2025-02-23T14:00:00Z",
        metadata: { scheduledAt: "2025-03-07T09:00:00" },
      },
    ],
  },
  {
    id: "req-3",
    sponsorId: "current-user",
    publisherId: "hero-3",
    status: "scheduled",
    scheduledAt: "2025-03-10T11:00:00",
    initiatedBy: "sponsor",
    brief: "I'm promoting the spring cohort of my Course Creator Accelerator — a 12-week program that helps entrepreneurs package their expertise into profitable online courses. The program has generated over $2M in student revenue. Priya's community of ambitious women would be a perfect audience.",
    adHeadline: "The Course Creator Accelerator",
    adBody: "Build and launch a 6-figure online course in 12 weeks. Alex Johnson's proven system has generated over $2M in student revenue. Limited spots available for the spring cohort.",
    adCta: "Apply Now",
    adCtaUrl: "https://alexjohnson.co/accelerator",
    proposedFee: 500,
    notes: "",
    createdAt: "2025-02-15",
    updatedAt: "2025-02-22",
    timeline: [
      {
        id: "req-3-evt-1",
        type: "proposal_sent",
        actorId: "current-user",
        timestamp: "2025-02-15T10:00:00Z",
        note: "I'm promoting the spring cohort of my Course Creator Accelerator. Priya's community of ambitious women would be a perfect audience.",
        copyAfter: {
          adHeadline: "The Course Creator Accelerator",
          adBody:
            "Build and launch a 6-figure online course in 12 weeks. Alex Johnson's proven system has generated over $2M in student revenue. Limited spots available for the spring cohort.",
          adCta: "Apply Now",
          adCtaUrl: "https://alexjohnson.co/accelerator",
        },
      },
      {
        id: "req-3-evt-2",
        type: "copy_suggested",
        actorId: "hero-3",
        timestamp: "2025-02-16T14:00:00Z",
        note: "Love this Alex! I tailored the headline for my community — they respond to ambition-driven language and specific outcomes.",
        copyBefore: {
          adHeadline: "The Course Creator Accelerator",
          adBody:
            "Build and launch a 6-figure online course in 12 weeks. Alex Johnson's proven system has generated over $2M in student revenue. Limited spots available for the spring cohort.",
          adCta: "Apply Now",
          adCtaUrl: "https://alexjohnson.co/accelerator",
        },
        copyAfter: {
          adHeadline: "Turn Your Ambition Into a Course That Sells",
          adBody:
            "Alex Johnson's 12-week Course Creator Accelerator is designed for ambitious leaders who want to share their expertise with the world. Over $2M in student revenue generated. Spring cohort spots are limited.",
          adCta: "Apply Now",
          adCtaUrl: "https://alexjohnson.co/accelerator",
        },
      },
      {
        id: "req-3-evt-3",
        type: "revision_requested",
        actorId: "current-user",
        timestamp: "2025-02-17T09:00:00Z",
        note: "Love the ambition angle! Can we make the headline more about the outcome (6-figure course) and keep it inclusive? My accelerator is for all ambitious leaders.",
      },
      {
        id: "req-3-evt-4",
        type: "copy_suggested",
        actorId: "hero-3",
        timestamp: "2025-02-19T11:00:00Z",
        note: "Updated! Led with the 6-figure outcome and kept it broad. Added urgency around spots.",
        copyBefore: {
          adHeadline: "Turn Your Ambition Into a Course That Sells",
          adBody:
            "Alex Johnson's 12-week Course Creator Accelerator is designed for ambitious leaders who want to share their expertise with the world. Over $2M in student revenue generated. Spring cohort spots are limited.",
          adCta: "Apply Now",
          adCtaUrl: "https://alexjohnson.co/accelerator",
        },
        copyAfter: {
          adHeadline: "Build a 6-Figure Course in 12 Weeks",
          adBody:
            "Alex Johnson's Course Creator Accelerator helps ambitious leaders package their expertise into profitable online courses. Over $2M in student revenue generated — and spring cohort spots are going fast.",
          adCta: "Apply Now",
          adCtaUrl: "https://alexjohnson.co/accelerator",
        },
      },
      {
        id: "req-3-evt-5",
        type: "copy_locked",
        actorId: "current-user",
        timestamp: "2025-02-20T09:00:00Z",
        note: "Perfect — approved!",
      },
      {
        id: "req-3-evt-6",
        type: "broadcast_created",
        actorId: "hero-3",
        timestamp: "2025-02-21T10:00:00Z",
      },
      {
        id: "req-3-evt-7",
        type: "scheduled",
        actorId: "hero-3",
        timestamp: "2025-02-22T09:00:00Z",
        metadata: { scheduledAt: "2025-03-10T11:00:00" },
      },
    ],
  },
  {
    id: "req-4",
    sponsorId: "hero-9",
    publisherId: "hero-10",
    status: "scheduled",
    scheduledAt: "2025-03-12T08:30:00",
    initiatedBy: "sponsor",
    brief: "I built a 7-figure membership site and now teach my system to others. I'm promoting a free training on creating recurring revenue through memberships. Ryan's solopreneur audience would be a perfect fit.",
    adHeadline: "Build a Membership Site That Runs Itself",
    adBody: "Lisa Park built a 7-figure membership site and now she's teaching her system. Learn how to create recurring revenue with a membership your audience will love.",
    adCta: "Watch the Free Training",
    adCtaUrl: "https://lisapark.co/training",
    proposedFee: 425,
    notes: "",
    createdAt: "2025-02-10",
    updatedAt: "2025-02-23",
    timeline: [
      {
        id: "req-4-evt-1",
        type: "proposal_sent",
        actorId: "hero-9",
        timestamp: "2025-02-10T10:00:00Z",
        note: "I built a 7-figure membership site and now teach my system to others. I'm promoting a free training on creating recurring revenue through memberships. Ryan's solopreneur audience would be a perfect fit.",
        copyAfter: {
          adHeadline: "Build a Membership Site That Runs Itself",
          adBody:
            "Lisa Park built a 7-figure membership site and now she's teaching her system. Learn how to create recurring revenue with a membership your audience will love.",
          adCta: "Watch the Free Training",
          adCtaUrl: "https://lisapark.co/training",
        },
      },
      {
        id: "req-4-evt-2",
        type: "copy_suggested",
        actorId: "hero-10",
        timestamp: "2025-02-12T14:00:00Z",
        note: "Great fit for my audience Lisa! I reframed it around the 'recurring revenue without the hustle' angle — that resonates with solopreneurs who are tired of launch cycles.",
        copyBefore: {
          adHeadline: "Build a Membership Site That Runs Itself",
          adBody:
            "Lisa Park built a 7-figure membership site and now she's teaching her system. Learn how to create recurring revenue with a membership your audience will love.",
          adCta: "Watch the Free Training",
          adCtaUrl: "https://lisapark.co/training",
        },
        copyAfter: {
          adHeadline: "Recurring Revenue Without the Hustle",
          adBody:
            "Lisa Park built a 7-figure membership site that practically runs itself. In this free training, she breaks down the system — so you can build predictable recurring revenue without the launch rollercoaster.",
          adCta: "Watch the Training",
          adCtaUrl: "https://lisapark.co/training",
        },
      },
      {
        id: "req-4-evt-3",
        type: "revision_requested",
        actorId: "hero-9",
        timestamp: "2025-02-14T09:00:00Z",
        note: "Love the 'without the hustle' angle! But can we keep 'teaching her system' language? And make it clearer that this is a free training — my best conversions happen when the value is obvious upfront.",
      },
      {
        id: "req-4-evt-4",
        type: "copy_suggested",
        actorId: "hero-10",
        timestamp: "2025-02-17T11:00:00Z",
        note: "Updated! Brought back the original headline for clarity and made the 'free' part more prominent.",
        copyBefore: {
          adHeadline: "Recurring Revenue Without the Hustle",
          adBody:
            "Lisa Park built a 7-figure membership site that practically runs itself. In this free training, she breaks down the system — so you can build predictable recurring revenue without the launch rollercoaster.",
          adCta: "Watch the Training",
          adCtaUrl: "https://lisapark.co/training",
        },
        copyAfter: {
          adHeadline: "Build a Membership Site That Runs Itself",
          adBody:
            "Lisa Park built a 7-figure membership site and now she's teaching her exact system. This free training shows solopreneurs how to create recurring revenue your audience will love.",
          adCta: "Watch the Free Training",
          adCtaUrl: "https://lisapark.co/training",
        },
      },
      {
        id: "req-4-evt-5",
        type: "copy_locked",
        actorId: "hero-9",
        timestamp: "2025-02-19T09:00:00Z",
        note: "That's it — approved!",
      },
      {
        id: "req-4-evt-6",
        type: "broadcast_created",
        actorId: "hero-10",
        timestamp: "2025-02-22T10:00:00Z",
      },
      {
        id: "req-4-evt-7",
        type: "scheduled",
        actorId: "hero-10",
        timestamp: "2025-02-23T09:00:00Z",
        metadata: { scheduledAt: "2025-03-12T08:30:00" },
      },
    ],
  },
  {
    id: "req-5",
    sponsorId: "current-user",
    publisherId: "hero-7",
    status: "scheduled",
    scheduledAt: "2025-03-14T10:00:00",
    initiatedBy: "sponsor",
    brief: "I'm promoting the Course Creator Accelerator to Emma's parenting community. Many parents are looking for flexible ways to earn income, and an online course is a natural fit for their expertise.",
    adHeadline: "Scale Your Knowledge Business",
    adBody: "Alex Johnson's Course Creator Accelerator has helped 200+ entrepreneurs package their expertise into profitable online courses. Join the next cohort and build your course with expert guidance.",
    adCta: "Learn More",
    adCtaUrl: "https://alexjohnson.co/accelerator",
    proposedFee: 325,
    notes: "",
    createdAt: "2025-02-01",
    updatedAt: "2025-02-24",
    timeline: [
      {
        id: "req-5-evt-1",
        type: "proposal_sent",
        actorId: "current-user",
        timestamp: "2025-02-01T10:00:00Z",
        note: "I'm promoting the Course Creator Accelerator to Emma's parenting community. Many parents are looking for flexible ways to earn income, and an online course is a natural fit for their expertise.",
        copyAfter: {
          adHeadline: "Scale Your Knowledge Business",
          adBody:
            "Alex Johnson's Course Creator Accelerator has helped 200+ entrepreneurs package their expertise into profitable online courses. Join the next cohort and build your course with expert guidance.",
          adCta: "Learn More",
          adCtaUrl: "https://alexjohnson.co/accelerator",
        },
      },
      {
        id: "req-5-evt-2",
        type: "copy_suggested",
        actorId: "hero-7",
        timestamp: "2025-02-04T14:00:00Z",
        note: "Love this Alex! I personalized it for my parent audience — they care about flexible schedules and building something on their own terms.",
        copyBefore: {
          adHeadline: "Scale Your Knowledge Business",
          adBody:
            "Alex Johnson's Course Creator Accelerator has helped 200+ entrepreneurs package their expertise into profitable online courses. Join the next cohort and build your course with expert guidance.",
          adCta: "Learn More",
          adCtaUrl: "https://alexjohnson.co/accelerator",
        },
        copyAfter: {
          adHeadline: "From Parenting Expert to Course Creator",
          adBody:
            "Many parents have expertise worth sharing. Alex Johnson's Course Creator Accelerator helps you package your knowledge into a profitable online course — on your own schedule. Join 200+ entrepreneurs who've already done it.",
          adCta: "Learn More",
          adCtaUrl: "https://alexjohnson.co/accelerator",
        },
      },
      {
        id: "req-5-evt-3",
        type: "revision_requested",
        actorId: "current-user",
        timestamp: "2025-02-07T09:00:00Z",
        note: "Love the parenting angle! But let's not limit it to parents — some of your readers are general knowledge entrepreneurs too. Can we broaden while keeping the flexible schedule angle?",
      },
      {
        id: "req-5-evt-4",
        type: "copy_suggested",
        actorId: "hero-7",
        timestamp: "2025-02-12T11:00:00Z",
        note: "Broadened the headline and kept the 'own pace' angle that works for my audience.",
        copyBefore: {
          adHeadline: "From Parenting Expert to Course Creator",
          adBody:
            "Many parents have expertise worth sharing. Alex Johnson's Course Creator Accelerator helps you package your knowledge into a profitable online course — on your own schedule. Join 200+ entrepreneurs who've already done it.",
          adCta: "Learn More",
          adCtaUrl: "https://alexjohnson.co/accelerator",
        },
        copyAfter: {
          adHeadline: "Scale Your Knowledge Business",
          adBody:
            "Alex Johnson's Course Creator Accelerator has helped 200+ entrepreneurs package their expertise into profitable online courses. Build your course at your own pace with expert guidance.",
          adCta: "Learn More",
          adCtaUrl: "https://alexjohnson.co/accelerator",
        },
      },
      {
        id: "req-5-evt-5",
        type: "copy_locked",
        actorId: "current-user",
        timestamp: "2025-02-15T09:00:00Z",
        note: "Perfect — let's go!",
      },
      {
        id: "req-5-evt-6",
        type: "broadcast_created",
        actorId: "hero-7",
        timestamp: "2025-02-20T10:00:00Z",
      },
      {
        id: "req-5-evt-7",
        type: "scheduled",
        actorId: "hero-7",
        timestamp: "2025-02-24T09:00:00Z",
        metadata: { scheduledAt: "2025-03-14T10:00:00" },
      },
    ],
  },
  {
    id: "req-13",
    sponsorId: "hero-10",
    publisherId: "current-user",
    status: "scheduled",
    scheduledAt: "2025-03-03T14:00:00",
    initiatedBy: "publisher",
    brief: "I'm launching a Marketing Fundamentals bootcamp and want to reach Alex's audience of knowledge entrepreneurs who need marketing skills to grow.",
    adHeadline: "Marketing Bootcamp for Solopreneurs",
    adBody: "Ryan Brooks distills 15 years of marketing into a 5-day bootcamp. Learn the exact strategies that have generated $10M+ for his clients.",
    adCta: "Enroll Now",
    adCtaUrl: "https://ryanbrooks.com/bootcamp",
    proposedFee: 375,
    notes: "",
    createdAt: "2025-02-16",
    updatedAt: "2025-02-24",
    timeline: [
      {
        id: "req-13-evt-1",
        type: "proposal_sent",
        actorId: "current-user",
        timestamp: "2025-02-16T10:00:00Z",
        note: "I'm launching a Marketing Fundamentals bootcamp and want to reach Alex's audience of knowledge entrepreneurs who need marketing skills to grow.",
        copyAfter: {
          adHeadline: "Marketing Bootcamp for Solopreneurs",
          adBody:
            "Ryan Brooks distills 15 years of marketing into a 5-day bootcamp. Learn the exact strategies that have generated $10M+ for his clients.",
          adCta: "Enroll Now",
          adCtaUrl: "https://ryanbrooks.com/bootcamp",
        },
      },
      {
        id: "req-13-evt-2",
        type: "revision_requested",
        actorId: "hero-10",
        timestamp: "2025-02-18T09:00:00Z",
        note: "Love that you're featuring the bootcamp! Can we make the body copy feel more urgent? Mention that it's only 5 days and spots fill fast.",
      },
      {
        id: "req-13-evt-3",
        type: "copy_suggested",
        actorId: "current-user",
        timestamp: "2025-02-20T14:00:00Z",
        note: "Added urgency with the 5-day format and limited spots angle.",
        copyBefore: {
          adHeadline: "Marketing Bootcamp for Solopreneurs",
          adBody:
            "Ryan Brooks distills 15 years of marketing into a 5-day bootcamp. Learn the exact strategies that have generated $10M+ for his clients.",
          adCta: "Enroll Now",
          adCtaUrl: "https://ryanbrooks.com/bootcamp",
        },
        copyAfter: {
          adHeadline: "Marketing Bootcamp for Solopreneurs",
          adBody:
            "In just 5 days, Ryan Brooks teaches you the marketing strategies that have generated $10M+ for his clients. Spots fill fast — don't miss this cohort.",
          adCta: "Enroll Now",
          adCtaUrl: "https://ryanbrooks.com/bootcamp",
        },
      },
      {
        id: "req-13-evt-4",
        type: "copy_locked",
        actorId: "hero-10",
        timestamp: "2025-02-21T09:00:00Z",
        note: "Looks great — approved!",
      },
      {
        id: "req-13-evt-5",
        type: "broadcast_created",
        actorId: "current-user",
        timestamp: "2025-02-23T10:00:00Z",
      },
      {
        id: "req-13-evt-6",
        type: "scheduled",
        actorId: "current-user",
        timestamp: "2025-02-24T09:00:00Z",
        metadata: { scheduledAt: "2025-03-03T14:00:00" },
      },
    ],
  },
  {
    id: "req-14",
    sponsorId: "hero-2",
    publisherId: "current-user",
    status: "scheduled",
    scheduledAt: "2025-03-08T09:30:00",
    initiatedBy: "publisher",
    brief: "I'm promoting my Fit Founder Challenge — a 30-day fitness program designed specifically for busy entrepreneurs. Alex's audience of knowledge entrepreneurs would benefit from this.",
    adHeadline: "The Fit Founder Challenge",
    adBody: "Marcus Rivera's 30-day program helps busy entrepreneurs build sustainable fitness habits. No gym required. Join 800+ founders who've already transformed their health.",
    adCta: "Start the Challenge",
    adCtaUrl: "https://marcusrivera.fit/challenge",
    proposedFee: 275,
    notes: "",
    createdAt: "2025-02-08",
    updatedAt: "2025-02-24",
    timeline: [
      {
        id: "req-14-evt-1",
        type: "proposal_sent",
        actorId: "current-user",
        timestamp: "2025-02-08T10:00:00Z",
        note: "I'm promoting Marcus's Fit Founder Challenge — a 30-day fitness program designed specifically for busy entrepreneurs.",
        copyAfter: {
          adHeadline: "The Fit Founder Challenge",
          adBody:
            "Marcus Rivera's 30-day program helps busy entrepreneurs build sustainable fitness habits. No gym required. Join 800+ founders who've already transformed their health.",
          adCta: "Start the Challenge",
          adCtaUrl: "https://marcusrivera.fit/challenge",
        },
      },
      {
        id: "req-14-evt-2",
        type: "revision_requested",
        actorId: "hero-2",
        timestamp: "2025-02-10T09:00:00Z",
        note: "Love that you're featuring the challenge! Can we emphasize the '30-day' timeframe and the 'no gym required' part more? Those are the biggest hooks for busy founders.",
      },
      {
        id: "req-14-evt-3",
        type: "copy_suggested",
        actorId: "current-user",
        timestamp: "2025-02-13T14:00:00Z",
        note: "Made the 30-day and no-gym angles more prominent. Added the transformation stat.",
        copyBefore: {
          adHeadline: "The Fit Founder Challenge",
          adBody:
            "Marcus Rivera's 30-day program helps busy entrepreneurs build sustainable fitness habits. No gym required. Join 800+ founders who've already transformed their health.",
          adCta: "Start the Challenge",
          adCtaUrl: "https://marcusrivera.fit/challenge",
        },
        copyAfter: {
          adHeadline: "The Fit Founder Challenge",
          adBody:
            "Build sustainable fitness habits in just 30 days — no gym required. Marcus Rivera's program is built for busy entrepreneurs. 800+ founders have already transformed their health.",
          adCta: "Start the Challenge",
          adCtaUrl: "https://marcusrivera.fit/challenge",
        },
      },
      {
        id: "req-14-evt-4",
        type: "copy_locked",
        actorId: "hero-2",
        timestamp: "2025-02-16T09:00:00Z",
        note: "Looks great — approved!",
      },
      {
        id: "req-14-evt-5",
        type: "broadcast_created",
        actorId: "current-user",
        timestamp: "2025-02-20T10:00:00Z",
      },
      {
        id: "req-14-evt-6",
        type: "scheduled",
        actorId: "current-user",
        timestamp: "2025-02-24T09:00:00Z",
        metadata: { scheduledAt: "2025-03-08T09:30:00" },
      },
    ],
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
    notes: "",
    createdAt: "2025-02-17",
    updatedAt: "2025-02-23",
    timeline: [
      {
        id: "req-12-evt-1",
        type: "proposal_sent",
        actorId: "hero-5",
        timestamp: "2025-02-17T10:00:00Z",
        note: "I'm promoting my Wealth Mindset Masterclass to Alex's audience. Entrepreneurs need strong money mindsets to scale, and this masterclass delivers exactly that.",
        copyAfter: {
          adHeadline: "Unlock Your Wealth Mindset",
          adBody:
            "Aisha Thompson's Wealth Mindset Masterclass has helped 1,200+ entrepreneurs transform their relationship with money. Free 90-minute session.",
          adCta: "Reserve Your Spot",
          adCtaUrl: "https://aishathompson.com/masterclass",
        },
      },
      {
        id: "req-12-evt-2",
        type: "copy_suggested",
        actorId: "current-user",
        timestamp: "2025-02-17T16:00:00Z",
        note: "Love this Aisha! Tweaked the body to emphasize the transformation and speak more directly to my entrepreneurial audience.",
        copyBefore: {
          adHeadline: "Unlock Your Wealth Mindset",
          adBody:
            "Aisha Thompson's Wealth Mindset Masterclass has helped 1,200+ entrepreneurs transform their relationship with money. Free 90-minute session.",
          adCta: "Reserve Your Spot",
          adCtaUrl: "https://aishathompson.com/masterclass",
        },
        copyAfter: {
          adHeadline: "Transform Your Money Mindset",
          adBody:
            "Aisha Thompson has helped 1,200+ entrepreneurs rewire their relationship with money. In this free 90-minute masterclass, she shares the exact framework that separates 6-figure entrepreneurs from everyone else.",
          adCta: "Reserve Your Spot",
          adCtaUrl: "https://aishathompson.com/masterclass",
        },
      },
      {
        id: "req-12-evt-3",
        type: "revision_requested",
        actorId: "hero-5",
        timestamp: "2025-02-18T09:00:00Z",
        note: "Love it! But can we keep 'Wealth Mindset' in the headline? It's how my audience knows me. Also, 'rewire' feels too clinical — can we soften to 'transform'?",
      },
      {
        id: "req-12-evt-4",
        type: "copy_suggested",
        actorId: "current-user",
        timestamp: "2025-02-19T11:00:00Z",
        note: "Brought back 'Wealth Mindset' and softened the language. Kept it clean and simple.",
        copyBefore: {
          adHeadline: "Transform Your Money Mindset",
          adBody:
            "Aisha Thompson has helped 1,200+ entrepreneurs rewire their relationship with money. In this free 90-minute masterclass, she shares the exact framework that separates 6-figure entrepreneurs from everyone else.",
          adCta: "Reserve Your Spot",
          adCtaUrl: "https://aishathompson.com/masterclass",
        },
        copyAfter: {
          adHeadline: "Unlock Your Wealth Mindset",
          adBody:
            "Aisha Thompson's Wealth Mindset Masterclass has helped 1,200+ entrepreneurs transform their relationship with money. Free 90-minute session.",
          adCta: "Reserve Your Spot",
          adCtaUrl: "https://aishathompson.com/masterclass",
        },
      },
      {
        id: "req-12-evt-5",
        type: "copy_locked",
        actorId: "hero-5",
        timestamp: "2025-02-19T16:00:00Z",
        note: "Perfect — approved!",
      },
      {
        id: "req-12-evt-6",
        type: "broadcast_created",
        actorId: "current-user",
        timestamp: "2025-02-21T10:00:00Z",
      },
      {
        id: "req-12-evt-7",
        type: "scheduled",
        actorId: "current-user",
        timestamp: "2025-02-21T14:00:00Z",
        metadata: { scheduledAt: "2025-02-23T09:00:00" },
      },
      {
        id: "req-12-evt-8",
        type: "published",
        actorId: "current-user",
        timestamp: "2025-02-23T09:00:00Z",
      },
    ],
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
    notes: "",
    createdAt: "2025-01-10",
    updatedAt: "2025-02-01",
    timeline: [
      {
        id: "req-8-evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2025-01-10T10:00:00Z",
        note: "I promoted my Weekend Course Sprint — a 48-hour intensive that helps creators go from idea to live course. No tech skills required. This was aimed at Alex's audience of knowledge entrepreneurs.",
        copyAfter: {
          adHeadline: "Launch Your Course in a Weekend",
          adBody:
            "Jake Morrison's Weekend Course Sprint has helped 200+ creators go from idea to live course in 48 hours. No tech skills required.",
          adCta: "Join the Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
      },
      {
        id: "req-8-evt-2",
        type: "copy_suggested",
        actorId: "current-user",
        timestamp: "2025-01-12T14:00:00Z",
        note: "Love the Sprint concept Jake! I made the headline punchier and the body more specific about the transformation.",
        copyBefore: {
          adHeadline: "Launch Your Course in a Weekend",
          adBody:
            "Jake Morrison's Weekend Course Sprint has helped 200+ creators go from idea to live course in 48 hours. No tech skills required.",
          adCta: "Join the Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
        copyAfter: {
          adHeadline: "Build a Course in 48 Hours — Seriously",
          adBody:
            "Jake Morrison's Weekend Course Sprint takes you from idea to live course in just one weekend. 200+ creators have already done it — no tech skills needed.",
          adCta: "Join the Next Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
      },
      {
        id: "req-8-evt-3",
        type: "revision_requested",
        actorId: "hero-4",
        timestamp: "2025-01-14T09:00:00Z",
        note: "Great copy! But let's keep the original headline — 'Launch Your Course in a Weekend' tested better. And the CTA should stay 'Join the Sprint' for consistency across campaigns.",
      },
      {
        id: "req-8-evt-4",
        type: "copy_suggested",
        actorId: "current-user",
        timestamp: "2025-01-16T11:00:00Z",
        note: "Reverted to the original headline and CTA. Kept the updated body flow.",
        copyBefore: {
          adHeadline: "Build a Course in 48 Hours — Seriously",
          adBody:
            "Jake Morrison's Weekend Course Sprint takes you from idea to live course in just one weekend. 200+ creators have already done it — no tech skills needed.",
          adCta: "Join the Next Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
        copyAfter: {
          adHeadline: "Launch Your Course in a Weekend",
          adBody:
            "Jake Morrison's Weekend Course Sprint has helped 200+ creators go from idea to live course in 48 hours. No tech skills required.",
          adCta: "Join the Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
      },
      {
        id: "req-8-evt-5",
        type: "copy_locked",
        actorId: "hero-4",
        timestamp: "2025-01-18T09:00:00Z",
        note: "Perfect — approved!",
      },
      {
        id: "req-8-evt-6",
        type: "broadcast_created",
        actorId: "current-user",
        timestamp: "2025-01-25T10:00:00Z",
      },
      {
        id: "req-8-evt-7",
        type: "scheduled",
        actorId: "current-user",
        timestamp: "2025-01-27T09:00:00Z",
        metadata: { scheduledAt: "2025-02-01T09:00:00" },
      },
      {
        id: "req-8-evt-8",
        type: "published",
        actorId: "current-user",
        timestamp: "2025-02-01T09:00:00Z",
      },
    ],
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
    notes: "",
    createdAt: "2025-02-12",
    updatedAt: "2025-02-25",
    timeline: [
      {
        id: "req-15-evt-1",
        type: "proposal_sent",
        actorId: "hero-8",
        timestamp: "2025-02-12T10:00:00Z",
        note: "I'm promoting my Brand Builder Workshop for creative professionals. Alex's audience includes creators who need to build their personal brand to grow.",
        copyAfter: {
          adHeadline: "Build Your Brand in a Weekend",
          adBody:
            "Carlos Mendez's Brand Builder Workshop helps creative entrepreneurs craft a professional brand in just 2 days. Templates, tools, and live feedback included.",
          adCta: "Register Now",
          adCtaUrl: "https://carlosmendez.design/brand",
        },
      },
      {
        id: "req-15-evt-2",
        type: "declined",
        actorId: "current-user",
        timestamp: "2025-02-25T09:00:00Z",
        note: "Thanks for the offer Carlos, but branding workshops aren't the best fit for my audience right now. My subscribers are more focused on course creation and scaling — I'd want something more directly tied to that.",
      },
    ],
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
    notes: "",
    createdAt: "2025-01-20",
    updatedAt: "2025-02-05",
    timeline: [
      {
        id: "req-9-evt-1",
        type: "proposal_sent",
        actorId: "hero-8",
        timestamp: "2025-01-20T10:00:00Z",
        note: "I teach creative entrepreneurs how to build a professional brand without hiring a designer. I'm promoting my Design Toolkit, which would be useful for education-focused creators building their personal brand.",
        copyAfter: {
          adHeadline: "Design Systems for Non-Designers",
          adBody:
            "Carlos Mendez teaches creative entrepreneurs how to build a professional brand without hiring a designer.",
          adCta: "Get the Toolkit",
          adCtaUrl: "https://carlosmendez.design/toolkit",
        },
      },
      {
        id: "req-9-evt-2",
        type: "expired",
        actorId: "hero-8",
        timestamp: "2025-02-05T00:00:00Z",
      },
    ],
  },

  // ── Sarah (hero-1, publisher) — scheduled, published, declined ──
  {
    id: "req-s-sched-1",
    sponsorId: "hero-9",
    publisherId: "hero-1",
    status: "scheduled",
    scheduledAt: "2025-03-04T10:00:00",
    initiatedBy: "sponsor",
    brief: "I'm promoting my membership masterclass to Sarah's coaching audience. Coaches are a natural fit for recurring-revenue models.",
    adHeadline: "Turn Your Expertise Into Recurring Revenue",
    adBody: "Lisa Park's free masterclass reveals how she built a 7-figure membership site — and how you can too. Perfect for coaches ready to scale beyond 1:1.",
    adCta: "Save Your Seat",
    adCtaUrl: "https://lisapark.co/masterclass",
    proposedFee: 325,
    notes: "",
    createdAt: "2025-02-10",
    updatedAt: "2025-02-20",
    timeline: [
      {
        id: "req-s-sched-1-evt-1",
        type: "proposal_sent",
        actorId: "hero-9",
        timestamp: "2025-02-10T10:00:00Z",
        note: "I'm promoting my membership masterclass to Sarah's coaching audience. Coaches are a natural fit for recurring-revenue models.",
        copyAfter: {
          adHeadline: "Turn Your Expertise Into Recurring Revenue",
          adBody:
            "Lisa Park's free masterclass reveals how she built a 7-figure membership site — and how you can too. Perfect for coaches ready to scale beyond 1:1.",
          adCta: "Save Your Seat",
          adCtaUrl: "https://lisapark.co/masterclass",
        },
      },
      {
        id: "req-s-sched-1-evt-2",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-02-11T15:00:00Z",
        note: "Love this Lisa! I adjusted the headline for my coaching audience — they respond to the idea of escaping the time-for-money trap.",
        copyBefore: {
          adHeadline: "Turn Your Expertise Into Recurring Revenue",
          adBody:
            "Lisa Park's free masterclass reveals how she built a 7-figure membership site — and how you can too. Perfect for coaches ready to scale beyond 1:1.",
          adCta: "Save Your Seat",
          adCtaUrl: "https://lisapark.co/masterclass",
        },
        copyAfter: {
          adHeadline: "Recurring Revenue for Coaches",
          adBody:
            "Tired of trading time for money? Lisa Park's free masterclass shows you how to build a membership site that generates revenue on autopilot. She built hers to 7 figures — and she'll show you exactly how.",
          adCta: "Save Your Seat",
          adCtaUrl: "https://lisapark.co/masterclass",
        },
      },
      {
        id: "req-s-sched-1-evt-3",
        type: "revision_requested",
        actorId: "hero-9",
        timestamp: "2025-02-13T09:00:00Z",
        note: "Great angle! But let's keep the 'beyond 1:1' language — that resonates with coaches who are already successful but want to scale. Can we work that back in?",
      },
      {
        id: "req-s-sched-1-evt-4",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-02-15T11:00:00Z",
        note: "Done! Brought back the 'beyond 1:1' angle and kept the revenue-focused headline.",
        copyBefore: {
          adHeadline: "Recurring Revenue for Coaches",
          adBody:
            "Tired of trading time for money? Lisa Park's free masterclass shows you how to build a membership site that generates revenue on autopilot. She built hers to 7 figures — and she'll show you exactly how.",
          adCta: "Save Your Seat",
          adCtaUrl: "https://lisapark.co/masterclass",
        },
        copyAfter: {
          adHeadline: "Turn Your Expertise Into Recurring Revenue",
          adBody:
            "Lisa Park's free masterclass reveals how she built a 7-figure membership site — and how you can too. Perfect for coaches ready to scale beyond 1:1.",
          adCta: "Save Your Seat",
          adCtaUrl: "https://lisapark.co/masterclass",
        },
      },
      {
        id: "req-s-sched-1-evt-5",
        type: "copy_locked",
        actorId: "hero-9",
        timestamp: "2025-02-17T09:00:00Z",
        note: "Perfect — approved!",
      },
      {
        id: "req-s-sched-1-evt-6",
        type: "broadcast_created",
        actorId: "hero-1",
        timestamp: "2025-02-19T10:00:00Z",
      },
      {
        id: "req-s-sched-1-evt-7",
        type: "scheduled",
        actorId: "hero-1",
        timestamp: "2025-02-20T09:00:00Z",
        metadata: { scheduledAt: "2025-03-04T10:00:00" },
      },
    ],
  },
  {
    id: "req-s-sched-2",
    sponsorId: "hero-3",
    publisherId: "hero-1",
    status: "scheduled",
    scheduledAt: "2025-03-11T09:00:00",
    initiatedBy: "sponsor",
    brief: "Promoting my leadership retreat to Sarah's audience of coaches building online businesses. Leadership is the next level for successful coaches.",
    adHeadline: "The Women's Leadership Retreat",
    adBody: "Priya Patel's 3-day virtual retreat has helped 500+ women step into leadership. Join the next cohort and build the confidence to lead.",
    adCta: "Apply Now",
    adCtaUrl: "https://priyapatel.com/retreat",
    proposedFee: 400,
    notes: "",
    createdAt: "2025-02-08",
    updatedAt: "2025-02-18",
    timeline: [
      {
        id: "req-s-sched-2-evt-1",
        type: "proposal_sent",
        actorId: "hero-3",
        timestamp: "2025-02-08T10:00:00Z",
        note: "Promoting my leadership retreat to Sarah's audience of coaches building online businesses. Leadership is the next level for successful coaches.",
        copyAfter: {
          adHeadline: "The Women's Leadership Retreat",
          adBody:
            "Priya Patel's 3-day virtual retreat has helped 500+ women step into leadership. Join the next cohort and build the confidence to lead.",
          adCta: "Apply Now",
          adCtaUrl: "https://priyapatel.com/retreat",
        },
      },
      {
        id: "req-s-sched-2-evt-2",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-02-09T14:00:00Z",
        note: "Great fit for my audience Priya! Tweaked the headline to feel more empowering and personal.",
        copyBefore: {
          adHeadline: "The Women's Leadership Retreat",
          adBody:
            "Priya Patel's 3-day virtual retreat has helped 500+ women step into leadership. Join the next cohort and build the confidence to lead.",
          adCta: "Apply Now",
          adCtaUrl: "https://priyapatel.com/retreat",
        },
        copyAfter: {
          adHeadline: "Lead Like the Woman You Are",
          adBody:
            "Priya Patel's 3-day virtual retreat is designed for women who are ready to step into leadership. Build confidence, clarity, and connection with 500+ women who've already transformed their careers.",
          adCta: "Apply Now",
          adCtaUrl: "https://priyapatel.com/retreat",
        },
      },
      {
        id: "req-s-sched-2-evt-3",
        type: "revision_requested",
        actorId: "hero-3",
        timestamp: "2025-02-11T09:00:00Z",
        note: "Love the energy! But 'Lead Like the Woman You Are' might feel too casual for my audience. Can we keep it more aspirational? Also, mention 'next cohort' — scarcity drives signups.",
      },
      {
        id: "req-s-sched-2-evt-4",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-02-13T11:00:00Z",
        note: "Reverted to the original headline for that aspirational feel. Kept the cohort scarcity angle.",
        copyBefore: {
          adHeadline: "Lead Like the Woman You Are",
          adBody:
            "Priya Patel's 3-day virtual retreat is designed for women who are ready to step into leadership. Build confidence, clarity, and connection with 500+ women who've already transformed their careers.",
          adCta: "Apply Now",
          adCtaUrl: "https://priyapatel.com/retreat",
        },
        copyAfter: {
          adHeadline: "The Women's Leadership Retreat",
          adBody:
            "Priya Patel's 3-day virtual retreat has helped 500+ women step into leadership. Join the next cohort and build the confidence to lead.",
          adCta: "Apply Now",
          adCtaUrl: "https://priyapatel.com/retreat",
        },
      },
      {
        id: "req-s-sched-2-evt-5",
        type: "copy_locked",
        actorId: "hero-3",
        timestamp: "2025-02-15T09:00:00Z",
        note: "Perfect — approved!",
      },
      {
        id: "req-s-sched-2-evt-6",
        type: "broadcast_created",
        actorId: "hero-1",
        timestamp: "2025-02-17T10:00:00Z",
      },
      {
        id: "req-s-sched-2-evt-7",
        type: "scheduled",
        actorId: "hero-1",
        timestamp: "2025-02-18T09:00:00Z",
        metadata: { scheduledAt: "2025-03-11T09:00:00" },
      },
    ],
  },
  {
    id: "req-s-pub-1",
    sponsorId: "hero-7",
    publisherId: "hero-1",
    status: "published",
    initiatedBy: "sponsor",
    brief: "Emma promoted her Connected Parenting Workshop to Sarah's audience. Many coaches are also parents looking for balance.",
    adHeadline: "The Connected Parenting Workshop",
    adBody: "Emma Nguyen's digital workshop helps busy parents build deeper connections with their kids — even with a packed schedule. Over 3,000 families transformed.",
    adCta: "Get Instant Access",
    adCtaUrl: "https://emmanguyen.com/workshop",
    proposedFee: 250,
    notes: "",
    createdAt: "2025-01-15",
    updatedAt: "2025-02-01",
    timeline: [
      {
        id: "req-s-pub-1-evt-1",
        type: "proposal_sent",
        actorId: "hero-7",
        timestamp: "2025-01-15T10:00:00Z",
        note: "Emma promoted her Connected Parenting Workshop to Sarah's audience. Many coaches are also parents looking for balance.",
        copyAfter: {
          adHeadline: "The Connected Parenting Workshop",
          adBody:
            "Emma Nguyen's digital workshop helps busy parents build deeper connections with their kids — even with a packed schedule. Over 3,000 families transformed.",
          adCta: "Get Instant Access",
          adCtaUrl: "https://emmanguyen.com/workshop",
        },
      },
      {
        id: "req-s-pub-1-evt-2",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-01-16T15:00:00Z",
        note: "Perfect for my audience Emma! I tweaked the headline to lead with the outcome and made the body more conversational.",
        copyBefore: {
          adHeadline: "The Connected Parenting Workshop",
          adBody:
            "Emma Nguyen's digital workshop helps busy parents build deeper connections with their kids — even with a packed schedule. Over 3,000 families transformed.",
          adCta: "Get Instant Access",
          adCtaUrl: "https://emmanguyen.com/workshop",
        },
        copyAfter: {
          adHeadline: "Parenting That Actually Works",
          adBody:
            "Emma Nguyen's Connected Parenting Workshop gives busy professionals practical tools to connect with their kids — even when life is chaos. 3,000+ families have already seen the difference.",
          adCta: "Get Instant Access",
          adCtaUrl: "https://emmanguyen.com/workshop",
        },
      },
      {
        id: "req-s-pub-1-evt-3",
        type: "revision_requested",
        actorId: "hero-7",
        timestamp: "2025-01-18T09:00:00Z",
        note: "Love the angle! But 'Parenting That Actually Works' sounds like other approaches aren't valid — can we soften? And keep 'Connected' in the name, it's our brand.",
      },
      {
        id: "req-s-pub-1-evt-4",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-01-20T11:00:00Z",
        note: "Good call — brought back the Connected Parenting name and kept the social proof.",
        copyBefore: {
          adHeadline: "Parenting That Actually Works",
          adBody:
            "Emma Nguyen's Connected Parenting Workshop gives busy professionals practical tools to connect with their kids — even when life is chaos. 3,000+ families have already seen the difference.",
          adCta: "Get Instant Access",
          adCtaUrl: "https://emmanguyen.com/workshop",
        },
        copyAfter: {
          adHeadline: "The Connected Parenting Workshop",
          adBody:
            "Emma Nguyen's digital workshop helps busy parents build deeper connections with their kids — even with a packed schedule. Over 3,000 families transformed.",
          adCta: "Get Instant Access",
          adCtaUrl: "https://emmanguyen.com/workshop",
        },
      },
      {
        id: "req-s-pub-1-evt-5",
        type: "copy_locked",
        actorId: "hero-7",
        timestamp: "2025-01-22T09:00:00Z",
        note: "That's perfect — approved!",
      },
      {
        id: "req-s-pub-1-evt-6",
        type: "broadcast_created",
        actorId: "hero-1",
        timestamp: "2025-01-28T10:00:00Z",
      },
      {
        id: "req-s-pub-1-evt-7",
        type: "scheduled",
        actorId: "hero-1",
        timestamp: "2025-01-29T09:00:00Z",
        metadata: { scheduledAt: "2025-02-01T09:00:00" },
      },
      {
        id: "req-s-pub-1-evt-8",
        type: "published",
        actorId: "hero-1",
        timestamp: "2025-02-01T09:00:00Z",
      },
    ],
  },
  {
    id: "req-s-pub-2",
    sponsorId: "hero-5",
    publisherId: "hero-1",
    status: "published",
    initiatedBy: "sponsor",
    brief: "Aisha promoted her Wealth Mindset Masterclass to Sarah's coaching audience. Coaches need strong money mindsets to scale their businesses.",
    adHeadline: "Unlock Your Wealth Mindset",
    adBody: "Aisha Thompson's Wealth Mindset Masterclass has helped 1,200+ entrepreneurs transform their relationship with money. Free 90-minute session.",
    adCta: "Reserve Your Spot",
    adCtaUrl: "https://aishathompson.com/masterclass",
    proposedFee: 275,
    notes: "",
    createdAt: "2025-01-05",
    updatedAt: "2025-01-25",
    timeline: [
      {
        id: "req-s-pub-2-evt-1",
        type: "proposal_sent",
        actorId: "hero-5",
        timestamp: "2025-01-05T10:00:00Z",
        note: "Aisha promoted her Wealth Mindset Masterclass to Sarah's coaching audience. Coaches need strong money mindsets to scale their businesses.",
        copyAfter: {
          adHeadline: "Unlock Your Wealth Mindset",
          adBody:
            "Aisha Thompson's Wealth Mindset Masterclass has helped 1,200+ entrepreneurs transform their relationship with money. Free 90-minute session.",
          adCta: "Reserve Your Spot",
          adCtaUrl: "https://aishathompson.com/masterclass",
        },
      },
      {
        id: "req-s-pub-2-evt-2",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-01-06T15:00:00Z",
        note: "Great fit for my readers Aisha! I personalized the headline to lead with the emotional transformation coaches want.",
        copyBefore: {
          adHeadline: "Unlock Your Wealth Mindset",
          adBody:
            "Aisha Thompson's Wealth Mindset Masterclass has helped 1,200+ entrepreneurs transform their relationship with money. Free 90-minute session.",
          adCta: "Reserve Your Spot",
          adCtaUrl: "https://aishathompson.com/masterclass",
        },
        copyAfter: {
          adHeadline: "Rewrite Your Money Story",
          adBody:
            "Aisha Thompson has helped 1,200+ entrepreneurs transform their relationship with money. Join her free 90-minute Wealth Mindset Masterclass and start building the financial confidence to scale.",
          adCta: "Reserve Your Spot",
          adCtaUrl: "https://aishathompson.com/masterclass",
        },
      },
      {
        id: "req-s-pub-2-evt-3",
        type: "revision_requested",
        actorId: "hero-5",
        timestamp: "2025-01-08T09:00:00Z",
        note: "Great angle! But 'Rewrite Your Money Story' sounds more like therapy than business growth. Keep 'Unlock Your Wealth Mindset' — it's what my audience expects and it's my brand.",
      },
      {
        id: "req-s-pub-2-evt-4",
        type: "copy_suggested",
        actorId: "hero-1",
        timestamp: "2025-01-09T11:00:00Z",
        note: "Got it — brought back the branded headline and kept the body clean.",
        copyBefore: {
          adHeadline: "Rewrite Your Money Story",
          adBody:
            "Aisha Thompson has helped 1,200+ entrepreneurs transform their relationship with money. Join her free 90-minute Wealth Mindset Masterclass and start building the financial confidence to scale.",
          adCta: "Reserve Your Spot",
          adCtaUrl: "https://aishathompson.com/masterclass",
        },
        copyAfter: {
          adHeadline: "Unlock Your Wealth Mindset",
          adBody:
            "Aisha Thompson's Wealth Mindset Masterclass has helped 1,200+ entrepreneurs transform their relationship with money. Free 90-minute session.",
          adCta: "Reserve Your Spot",
          adCtaUrl: "https://aishathompson.com/masterclass",
        },
      },
      {
        id: "req-s-pub-2-evt-5",
        type: "copy_locked",
        actorId: "hero-5",
        timestamp: "2025-01-10T09:00:00Z",
        note: "Perfect — approved!",
      },
      {
        id: "req-s-pub-2-evt-6",
        type: "broadcast_created",
        actorId: "hero-1",
        timestamp: "2025-01-14T10:00:00Z",
      },
      {
        id: "req-s-pub-2-evt-7",
        type: "scheduled",
        actorId: "hero-1",
        timestamp: "2025-01-15T09:00:00Z",
        metadata: { scheduledAt: "2025-01-20T09:00:00" },
      },
      {
        id: "req-s-pub-2-evt-8",
        type: "published",
        actorId: "hero-1",
        timestamp: "2025-01-20T09:00:00Z",
      },
    ],
  },
  {
    id: "req-s-dec-1",
    sponsorId: "hero-10",
    publisherId: "hero-1",
    status: "declined",
    initiatedBy: "sponsor",
    brief: "Ryan wanted to promote his Marketing Bootcamp to Sarah's coaching audience, but it wasn't the right fit for her subscribers.",
    adHeadline: "Marketing Bootcamp for Solopreneurs",
    adBody: "Ryan Brooks distills 15 years of marketing into a 5-day bootcamp. Learn the exact strategies that have generated $10M+ for his clients.",
    adCta: "Enroll Now",
    adCtaUrl: "https://ryanbrooks.com/bootcamp",
    proposedFee: 300,
    notes: "",
    createdAt: "2025-02-05",
    updatedAt: "2025-02-08",
    timeline: [
      {
        id: "req-s-dec-1-evt-1",
        type: "proposal_sent",
        actorId: "hero-10",
        timestamp: "2025-02-05T10:00:00Z",
        note: "Ryan wanted to promote his Marketing Bootcamp to Sarah's coaching audience, but it wasn't the right fit for her subscribers.",
        copyAfter: {
          adHeadline: "Marketing Bootcamp for Solopreneurs",
          adBody:
            "Ryan Brooks distills 15 years of marketing into a 5-day bootcamp. Learn the exact strategies that have generated $10M+ for his clients.",
          adCta: "Enroll Now",
          adCtaUrl: "https://ryanbrooks.com/bootcamp",
        },
      },
      {
        id: "req-s-dec-1-evt-2",
        type: "declined",
        actorId: "hero-1",
        timestamp: "2025-02-08T09:30:00Z",
        note: "Hey Ryan, appreciate the pitch! Marketing bootcamps are a bit outside what my coaching audience looks for. They're more focused on business strategy and client acquisition — I'd need something more aligned with that.",
      },
    ],
  },

  // ── Jake (hero-4, sponsor) — scheduled, published, declined ──
  {
    id: "req-j-sched-1",
    sponsorId: "hero-4",
    publisherId: "hero-3",
    status: "scheduled",
    scheduledAt: "2025-03-06T11:00:00",
    initiatedBy: "sponsor",
    brief: "Jake is promoting the Course Launch Blueprint to Priya's community of ambitious women. Many women leaders want to create courses to amplify their impact.",
    adHeadline: "Create Your First Online Course in 30 Days",
    adBody: "Jake Morrison's step-by-step framework has helped 500+ creators launch profitable courses. Get his free Course Launch Blueprint and start building your course today.",
    adCta: "Get the Free Blueprint",
    adCtaUrl: "https://jakemorrison.io/blueprint",
    proposedFee: 400,
    notes: "",
    createdAt: "2025-02-12",
    updatedAt: "2025-02-22",
    timeline: [
      {
        id: "req-j-sched-1-evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2025-02-12T10:00:00Z",
        note: "Jake is promoting the Course Launch Blueprint to Priya's community of ambitious women. Many women leaders want to create courses to amplify their impact.",
        copyAfter: {
          adHeadline: "Create Your First Online Course in 30 Days",
          adBody:
            "Jake Morrison's step-by-step framework has helped 500+ creators launch profitable courses. Get his free Course Launch Blueprint and start building your course today.",
          adCta: "Get the Free Blueprint",
          adCtaUrl: "https://jakemorrison.io/blueprint",
        },
      },
      {
        id: "req-j-sched-1-evt-2",
        type: "copy_suggested",
        actorId: "hero-3",
        timestamp: "2025-02-13T14:00:00Z",
        note: "Love this Jake! Reframed the headline around sharing expertise with the world — that's what drives my community.",
        copyBefore: {
          adHeadline: "Create Your First Online Course in 30 Days",
          adBody:
            "Jake Morrison's step-by-step framework has helped 500+ creators launch profitable courses. Get his free Course Launch Blueprint and start building your course today.",
          adCta: "Get the Free Blueprint",
          adCtaUrl: "https://jakemorrison.io/blueprint",
        },
        copyAfter: {
          adHeadline: "Share Your Expertise With the World",
          adBody:
            "Jake Morrison's free Course Launch Blueprint gives you a step-by-step framework to turn your knowledge into a profitable course. 500+ creators have used it. You could be next.",
          adCta: "Get the Free Blueprint",
          adCtaUrl: "https://jakemorrison.io/blueprint",
        },
      },
      {
        id: "req-j-sched-1-evt-3",
        type: "revision_requested",
        actorId: "hero-4",
        timestamp: "2025-02-15T09:00:00Z",
        note: "Love the empowerment angle! Can we keep '30 Days' in the headline though? That's a concrete promise that drives conversions. Body is great.",
      },
      {
        id: "req-j-sched-1-evt-4",
        type: "copy_suggested",
        actorId: "hero-3",
        timestamp: "2025-02-17T11:00:00Z",
        note: "Brought back the 30-day promise and kept the empowering body copy.",
        copyBefore: {
          adHeadline: "Share Your Expertise With the World",
          adBody:
            "Jake Morrison's free Course Launch Blueprint gives you a step-by-step framework to turn your knowledge into a profitable course. 500+ creators have used it. You could be next.",
          adCta: "Get the Free Blueprint",
          adCtaUrl: "https://jakemorrison.io/blueprint",
        },
        copyAfter: {
          adHeadline: "Create Your First Online Course in 30 Days",
          adBody:
            "Jake Morrison's free Course Launch Blueprint gives you a step-by-step framework to turn your knowledge into a profitable course. 500+ creators have used it — you could be next.",
          adCta: "Get the Free Blueprint",
          adCtaUrl: "https://jakemorrison.io/blueprint",
        },
      },
      {
        id: "req-j-sched-1-evt-5",
        type: "copy_locked",
        actorId: "hero-4",
        timestamp: "2025-02-19T09:00:00Z",
        note: "Perfect — approved!",
      },
      {
        id: "req-j-sched-1-evt-6",
        type: "broadcast_created",
        actorId: "hero-3",
        timestamp: "2025-02-21T10:00:00Z",
      },
      {
        id: "req-j-sched-1-evt-7",
        type: "scheduled",
        actorId: "hero-3",
        timestamp: "2025-02-22T09:00:00Z",
        metadata: { scheduledAt: "2025-03-06T11:00:00" },
      },
    ],
  },
  {
    id: "req-j-sched-2",
    sponsorId: "hero-4",
    publisherId: "hero-7",
    status: "scheduled",
    scheduledAt: "2025-03-13T08:00:00",
    initiatedBy: "sponsor",
    brief: "Jake is promoting the Weekend Course Sprint to Emma's parenting audience. Parents often want to create courses to share their expertise while working flexibly.",
    adHeadline: "Launch Your Course in a Weekend",
    adBody: "Jake Morrison's Weekend Course Sprint has helped 200+ creators go from idea to live course in 48 hours. No tech skills required.",
    adCta: "Join the Sprint",
    adCtaUrl: "https://jakemorrison.io/sprint",
    proposedFee: 275,
    notes: "",
    createdAt: "2025-02-09",
    updatedAt: "2025-02-19",
    timeline: [
      {
        id: "req-j-sched-2-evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2025-02-09T10:00:00Z",
        note: "Jake is promoting the Weekend Course Sprint to Emma's parenting audience. Parents often want to create courses to share their expertise while working flexibly.",
        copyAfter: {
          adHeadline: "Launch Your Course in a Weekend",
          adBody:
            "Jake Morrison's Weekend Course Sprint has helped 200+ creators go from idea to live course in 48 hours. No tech skills required.",
          adCta: "Join the Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
      },
      {
        id: "req-j-sched-2-evt-2",
        type: "copy_suggested",
        actorId: "hero-7",
        timestamp: "2025-02-10T14:00:00Z",
        note: "Great fit for my audience Jake! I reframed it for busy parents who want to create something on their own schedule.",
        copyBefore: {
          adHeadline: "Launch Your Course in a Weekend",
          adBody:
            "Jake Morrison's Weekend Course Sprint has helped 200+ creators go from idea to live course in 48 hours. No tech skills required.",
          adCta: "Join the Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
        copyAfter: {
          adHeadline: "Create a Course on Your Schedule",
          adBody:
            "Jake Morrison's Weekend Course Sprint helps busy creators go from idea to live course in 48 hours. Perfect for parents who want to share their knowledge without months of prep.",
          adCta: "Join the Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
      },
      {
        id: "req-j-sched-2-evt-3",
        type: "revision_requested",
        actorId: "hero-4",
        timestamp: "2025-02-12T09:00:00Z",
        note: "Love the parent angle! But can we keep 'Weekend' prominent in the headline? That's our key selling point — it communicates speed and simplicity.",
      },
      {
        id: "req-j-sched-2-evt-4",
        type: "copy_suggested",
        actorId: "hero-7",
        timestamp: "2025-02-14T11:00:00Z",
        note: "Brought 'Weekend' back to the headline and kept the simplicity angle in the body.",
        copyBefore: {
          adHeadline: "Create a Course on Your Schedule",
          adBody:
            "Jake Morrison's Weekend Course Sprint helps busy creators go from idea to live course in 48 hours. Perfect for parents who want to share their knowledge without months of prep.",
          adCta: "Join the Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
        copyAfter: {
          adHeadline: "Launch Your Course in a Weekend",
          adBody:
            "Jake Morrison's Weekend Course Sprint helps busy creators go from idea to live course in 48 hours. No tech skills needed — just your expertise and a weekend.",
          adCta: "Join the Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
      },
      {
        id: "req-j-sched-2-evt-5",
        type: "copy_locked",
        actorId: "hero-4",
        timestamp: "2025-02-16T09:00:00Z",
        note: "Love it — approved!",
      },
      {
        id: "req-j-sched-2-evt-6",
        type: "broadcast_created",
        actorId: "hero-7",
        timestamp: "2025-02-18T10:00:00Z",
      },
      {
        id: "req-j-sched-2-evt-7",
        type: "scheduled",
        actorId: "hero-7",
        timestamp: "2025-02-19T09:00:00Z",
        metadata: { scheduledAt: "2025-03-13T08:00:00" },
      },
    ],
  },
  {
    id: "req-j-pub-1",
    sponsorId: "hero-4",
    publisherId: "hero-5",
    status: "published",
    initiatedBy: "sponsor",
    brief: "Jake promoted the Course Launch Blueprint to Aisha's finance audience. Financial educators increasingly want to package their expertise into courses.",
    adHeadline: "Create Your First Online Course in 30 Days",
    adBody: "Jake Morrison's step-by-step framework has helped 500+ creators launch profitable courses. Get his free Course Launch Blueprint and start building your course today.",
    adCta: "Get the Free Blueprint",
    adCtaUrl: "https://jakemorrison.io/blueprint",
    proposedFee: 300,
    notes: "",
    createdAt: "2025-01-10",
    updatedAt: "2025-01-28",
    timeline: [
      {
        id: "req-j-pub-1-evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2025-01-10T10:00:00Z",
        note: "Jake promoted the Course Launch Blueprint to Aisha's finance audience. Financial educators increasingly want to package their expertise into courses.",
        copyAfter: {
          adHeadline: "Create Your First Online Course in 30 Days",
          adBody:
            "Jake Morrison's step-by-step framework has helped 500+ creators launch profitable courses. Get his free Course Launch Blueprint and start building your course today.",
          adCta: "Get the Free Blueprint",
          adCtaUrl: "https://jakemorrison.io/blueprint",
        },
      },
      {
        id: "req-j-pub-1-evt-2",
        type: "copy_suggested",
        actorId: "hero-5",
        timestamp: "2025-01-12T14:00:00Z",
        note: "Hey Jake! I reframed the headline for my finance audience — they respond to the idea of turning financial knowledge into something scalable.",
        copyBefore: {
          adHeadline: "Create Your First Online Course in 30 Days",
          adBody:
            "Jake Morrison's step-by-step framework has helped 500+ creators launch profitable courses. Get his free Course Launch Blueprint and start building your course today.",
          adCta: "Get the Free Blueprint",
          adCtaUrl: "https://jakemorrison.io/blueprint",
        },
        copyAfter: {
          adHeadline: "Turn Your Financial Knowledge Into a Course",
          adBody:
            "Jake Morrison's step-by-step framework helps experts package their knowledge into profitable courses. 500+ creators have used his free Blueprint. Get yours today.",
          adCta: "Download the Blueprint",
          adCtaUrl: "https://jakemorrison.io/blueprint",
        },
      },
      {
        id: "req-j-pub-1-evt-3",
        type: "revision_requested",
        actorId: "hero-4",
        timestamp: "2025-01-14T09:00:00Z",
        note: "Nice! But let's keep the original headline — it's broader and tested well across audiences. '30 Days' gives a concrete promise that drives clicks.",
      },
      {
        id: "req-j-pub-1-evt-4",
        type: "copy_suggested",
        actorId: "hero-5",
        timestamp: "2025-01-16T11:00:00Z",
        note: "Reverted to the original headline. Kept the body copy streamlined.",
        copyBefore: {
          adHeadline: "Turn Your Financial Knowledge Into a Course",
          adBody:
            "Jake Morrison's step-by-step framework helps experts package their knowledge into profitable courses. 500+ creators have used his free Blueprint. Get yours today.",
          adCta: "Download the Blueprint",
          adCtaUrl: "https://jakemorrison.io/blueprint",
        },
        copyAfter: {
          adHeadline: "Create Your First Online Course in 30 Days",
          adBody:
            "Jake Morrison's step-by-step framework has helped 500+ creators launch profitable courses. Get his free Course Launch Blueprint and start building your course today.",
          adCta: "Get the Free Blueprint",
          adCtaUrl: "https://jakemorrison.io/blueprint",
        },
      },
      {
        id: "req-j-pub-1-evt-5",
        type: "copy_locked",
        actorId: "hero-4",
        timestamp: "2025-01-18T09:00:00Z",
        note: "Perfect — approved!",
      },
      {
        id: "req-j-pub-1-evt-6",
        type: "broadcast_created",
        actorId: "hero-5",
        timestamp: "2025-01-24T10:00:00Z",
      },
      {
        id: "req-j-pub-1-evt-7",
        type: "scheduled",
        actorId: "hero-5",
        timestamp: "2025-01-25T09:00:00Z",
        metadata: { scheduledAt: "2025-01-28T09:00:00" },
      },
      {
        id: "req-j-pub-1-evt-8",
        type: "published",
        actorId: "hero-5",
        timestamp: "2025-01-28T09:00:00Z",
      },
    ],
  },
  {
    id: "req-j-pub-2",
    sponsorId: "hero-4",
    publisherId: "hero-10",
    status: "published",
    initiatedBy: "sponsor",
    brief: "Jake promoted the Weekend Course Sprint to Ryan's solopreneur audience. Campaign completed and payment settled.",
    adHeadline: "Launch Your Course in a Weekend",
    adBody: "Jake Morrison's Weekend Course Sprint has helped 200+ creators go from idea to live course in 48 hours. No tech skills required.",
    adCta: "Join the Sprint",
    adCtaUrl: "https://jakemorrison.io/sprint",
    proposedFee: 350,
    notes: "",
    createdAt: "2025-01-01",
    updatedAt: "2025-01-20",
    timeline: [
      {
        id: "req-j-pub-2-evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2025-01-01T10:00:00Z",
        note: "Jake promoted the Weekend Course Sprint to Ryan's solopreneur audience. Campaign completed and payment settled.",
        copyAfter: {
          adHeadline: "Launch Your Course in a Weekend",
          adBody:
            "Jake Morrison's Weekend Course Sprint has helped 200+ creators go from idea to live course in 48 hours. No tech skills required.",
          adCta: "Join the Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
      },
      {
        id: "req-j-pub-2-evt-2",
        type: "copy_suggested",
        actorId: "hero-10",
        timestamp: "2025-01-02T14:00:00Z",
        note: "Great product Jake! I adjusted the angle for my solopreneur audience — they love the idea of building something fast without a huge time commitment.",
        copyBefore: {
          adHeadline: "Launch Your Course in a Weekend",
          adBody:
            "Jake Morrison's Weekend Course Sprint has helped 200+ creators go from idea to live course in 48 hours. No tech skills required.",
          adCta: "Join the Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
        copyAfter: {
          adHeadline: "Your Weekend Course is Waiting",
          adBody:
            "Jake Morrison's Weekend Course Sprint takes solopreneurs from idea to live course in 48 hours. Over 200 creators have already launched. No tech skills needed.",
          adCta: "Join the Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
      },
      {
        id: "req-j-pub-2-evt-3",
        type: "revision_requested",
        actorId: "hero-4",
        timestamp: "2025-01-04T09:00:00Z",
        note: "Nice! But 'Your Weekend Course is Waiting' sounds passive. Let's keep the 'Launch' framing — it's more action-oriented and tested better across audiences.",
      },
      {
        id: "req-j-pub-2-evt-4",
        type: "copy_suggested",
        actorId: "hero-10",
        timestamp: "2025-01-06T11:00:00Z",
        note: "Reverted to the original headline. Kept it tight and action-oriented.",
        copyBefore: {
          adHeadline: "Your Weekend Course is Waiting",
          adBody:
            "Jake Morrison's Weekend Course Sprint takes solopreneurs from idea to live course in 48 hours. Over 200 creators have already launched. No tech skills needed.",
          adCta: "Join the Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
        copyAfter: {
          adHeadline: "Launch Your Course in a Weekend",
          adBody:
            "Jake Morrison's Weekend Course Sprint has helped 200+ creators go from idea to live course in 48 hours. No tech skills required.",
          adCta: "Join the Sprint",
          adCtaUrl: "https://jakemorrison.io/sprint",
        },
      },
      {
        id: "req-j-pub-2-evt-5",
        type: "copy_locked",
        actorId: "hero-4",
        timestamp: "2025-01-08T09:00:00Z",
        note: "Love it — approved!",
      },
      {
        id: "req-j-pub-2-evt-6",
        type: "broadcast_created",
        actorId: "hero-10",
        timestamp: "2025-01-12T10:00:00Z",
      },
      {
        id: "req-j-pub-2-evt-7",
        type: "scheduled",
        actorId: "hero-10",
        timestamp: "2025-01-13T09:00:00Z",
        metadata: { scheduledAt: "2025-01-16T09:00:00" },
      },
      {
        id: "req-j-pub-2-evt-8",
        type: "published",
        actorId: "hero-10",
        timestamp: "2025-01-16T09:00:00Z",
      },
    ],
  },
  {
    id: "req-j-dec-1",
    sponsorId: "hero-4",
    publisherId: "hero-8",
    status: "declined",
    initiatedBy: "sponsor",
    brief: "Jake wanted to promote the Course Launch Blueprint to Carlos's design audience, but it wasn't the right fit for creative professionals.",
    adHeadline: "Create Your First Online Course in 30 Days",
    adBody: "Jake Morrison's step-by-step framework has helped 500+ creators launch profitable courses. Get his free Course Launch Blueprint and start building your course today.",
    adCta: "Get the Free Blueprint",
    adCtaUrl: "https://jakemorrison.io/blueprint",
    proposedFee: 250,
    notes: "",
    createdAt: "2025-02-03",
    updatedAt: "2025-02-06",
    timeline: [
      {
        id: "req-j-dec-1-evt-1",
        type: "proposal_sent",
        actorId: "hero-4",
        timestamp: "2025-02-03T10:00:00Z",
        note: "Jake wanted to promote the Course Launch Blueprint to Carlos's design audience, but it wasn't the right fit for creative professionals.",
        copyAfter: {
          adHeadline: "Create Your First Online Course in 30 Days",
          adBody:
            "Jake Morrison's step-by-step framework has helped 500+ creators launch profitable courses. Get his free Course Launch Blueprint and start building your course today.",
          adCta: "Get the Free Blueprint",
          adCtaUrl: "https://jakemorrison.io/blueprint",
        },
      },
      {
        id: "req-j-dec-1-evt-2",
        type: "declined",
        actorId: "hero-8",
        timestamp: "2025-02-06T11:00:00Z",
        note: "Hey Jake, thanks for thinking of me! My audience is more visual/design-focused — online course creation isn't really their thing. I think you'd get better results with a business or education publisher.",
      },
    ],
  },
  // ── Seed promotions with full timeline data ──
  ...seedPromotions,
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

// ── Persona helpers (for demo switching) ──

export type Persona = "publisher" | "sponsor" | "both"

/** Get the Hero for a persona key. Always returns Sarah. */
export function getActiveUser(persona?: string | null): Hero {
  return heroes.find((h) => h.id === "hero-1") ?? currentUser
}

/** Get the role for a persona. Defaults to publisher. */
export function getRoleForPersona(persona?: string | null): Role {
  if (persona === "sponsor") return "sponsor"
  if (persona === "both") return "both"
  return "publisher"
}

/** For "both" users, get the currently active view role from the `view` param. */
export function getActiveViewRole(role: Role, view?: string | null): "publisher" | "sponsor" {
  if (role === "both") return view === "sponsor" ? "sponsor" : "publisher"
  return role === "sponsor" ? "sponsor" : "publisher"
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

/**
 * Derive the current state of a promotion request from its timeline.
 * Returns whose turn it is, the current ad copy, whether copy is locked,
 * and how many revision rounds have happened.
 */
export function deriveRequestState(request: PromotionRequest) {
  const timeline = request.timeline || []

  let currentCopy: CopySnapshot = {
    adHeadline: request.adHeadline,
    adBody: request.adBody,
    adCta: request.adCta,
    adCtaUrl: request.adCtaUrl,
  }

  let copyLocked = false
  let revisionRound = 0
  // Default: if pending with no timeline, the receiving party acts
  let whoseTurn: "sponsor" | "publisher" | null =
    request.status === "pending"
      ? request.initiatedBy === "sponsor" ? "publisher" : "sponsor"
      : null
  let lastActorId: string | null = null

  for (const event of timeline) {
    lastActorId = event.actorId

    switch (event.type) {
      case "proposal_sent":
        // The other party needs to respond
        whoseTurn = event.actorId === request.sponsorId ? "publisher" : "sponsor"
        break
      case "accepted":
        whoseTurn = null
        break
      case "copy_suggested":
        revisionRound++
        if (event.copyAfter) currentCopy = event.copyAfter
        // The other party reviews the suggested copy
        whoseTurn = event.actorId === request.sponsorId ? "publisher" : "sponsor"
        break
      case "revision_requested":
        // Kicked back — other party needs to revise
        whoseTurn = event.actorId === request.sponsorId ? "publisher" : "sponsor"
        break
      case "copy_locked":
        copyLocked = true
        whoseTurn = null
        break
      case "broadcast_created":
      case "scheduled":
      case "published":
      case "declined":
      case "expired":
        whoseTurn = null
        break
    }
  }

  return { currentCopy, copyLocked, revisionRound, whoseTurn, lastActorId }
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

export interface PayoutEstimate {
  amount: number
  ratePerK: number
  maxPayout: number | undefined
  audienceSize: number
  capped: boolean
}

/** Calculate the payout for a promotion based on sponsor budget and publisher audience */
export function calculatePayout(sponsor: Hero, publisher: Hero): PayoutEstimate | null {
  if (!sponsor.budgetPerThousand) return null
  const ratePerK = sponsor.budgetPerThousand
  const audienceSize = publisher.subscriberCount
  const raw = ratePerK * (audienceSize / 1000)
  const maxPayout = sponsor.maxBudget
  const capped = maxPayout ? raw > maxPayout : false
  const amount = capped ? maxPayout! : raw
  return { amount, ratePerK, maxPayout, audienceSize, capped }
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
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
    case "accepted":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
    case "in_review":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
    case "scheduled":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
    case "published":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
    case "declined":
      return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
    case "expired":
      return "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
  }
}

/** Get heroes that would be good matches for the active user based on shared verticals */
export function getRecommendedHeroes(forRole: Role, activeUser: Hero = currentUser): Hero[] {
  const userVerticals = new Set(activeUser.verticals)
  return heroes
    .filter((h) => {
      // Exclude the active user from their own recommendations
      if (h.id === activeUser.id) return false
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
