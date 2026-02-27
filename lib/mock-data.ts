import { generatedHeroes } from "./generated-heroes"

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
  },
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
    notes: "",
    createdAt: "2025-02-24",
    updatedAt: "2025-02-24",
  },
  {
    id: "req-20",
    sponsorId: "current-user",
    publisherId: "hero-6",
    status: "pending",
    initiatedBy: "publisher",
    brief: "My audience of tech professionals and aspiring entrepreneurs would love the Course Creator Accelerator. I've been recommending online course platforms for years — your program is the missing piece that shows them how to actually build one.",
    adHeadline: "The Course Creator Accelerator",
    adBody: "Build and launch a 6-figure online course in 12 weeks. Alex Johnson's proven system has generated over $2M in student revenue. Limited spots available for the spring cohort.",
    adCta: "Apply Now",
    adCtaUrl: "https://alexjohnson.co/accelerator",
    proposedFee: 350,
    notes: "",
    createdAt: "2025-02-25",
    updatedAt: "2025-02-25",
  },
  {
    id: "req-21",
    sponsorId: "current-user",
    publisherId: "hero-5",
    status: "pending",
    initiatedBy: "publisher",
    brief: "I run a newsletter for creative professionals looking to monetize their skills. The Course Creator Accelerator is exactly the kind of resource my readers ask about — I'd love to feature it in an upcoming send.",
    adHeadline: "The Course Creator Accelerator",
    adBody: "Build and launch a 6-figure online course in 12 weeks. Alex Johnson's proven system has generated over $2M in student revenue. Limited spots available for the spring cohort.",
    adCta: "Apply Now",
    adCtaUrl: "https://alexjohnson.co/accelerator",
    proposedFee: 275,
    notes: "",
    createdAt: "2025-02-26",
    updatedAt: "2025-02-26",
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
    notes: "",
    createdAt: "2025-02-18",
    updatedAt: "2025-02-21",
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
  },
  {
    id: "req-22",
    sponsorId: "hero-4",
    publisherId: "current-user",
    status: "in_review",
    initiatedBy: "sponsor",
    reviewTurn: "sponsor",
    brief: "I'm promoting my Advanced Course Launch System — a premium program for experienced creators. I think this would resonate well with your audience of knowledge entrepreneurs.",
    adHeadline: "Create Your First Online Course in 30 Days",
    adBody: "Jake Morrison's step-by-step framework has helped 500+ creators launch profitable courses. Get his free Course Launch Blueprint and start building your course today.",
    adCta: "Get the Free Blueprint",
    adCtaUrl: "https://jakemorrison.io/blueprint",
    proposedEdits: {
      adHeadline: "Launch a Profitable Online Course This Month",
      adBody: "Jake Morrison's proven framework has helped 500+ creators build and launch courses that sell. Get his free Course Launch Blueprint — designed for busy knowledge entrepreneurs.",
      adCta: "Download the Blueprint",
      adCtaUrl: "https://jakemorrison.io/blueprint",
    },
    proposedFee: 300,
    notes: "",
    createdAt: "2025-02-21",
    updatedAt: "2025-02-26",
  },
  {
    id: "req-23",
    sponsorId: "hero-9",
    publisherId: "current-user",
    status: "in_review",
    initiatedBy: "sponsor",
    reviewTurn: "publisher",
    revisionNotes: "Love the direction! Could you make the CTA more action-oriented? Something like 'Start Building' instead of 'Watch the Training'. Also, the body copy could mention the recurring revenue angle more prominently.",
    brief: "I'm promoting my membership site masterclass. Your audience of knowledge entrepreneurs would benefit from learning how to build recurring revenue through memberships.",
    adHeadline: "Build a Membership Site That Runs Itself",
    adBody: "Lisa Park built a 7-figure membership site and now she's teaching her system. Learn how to create recurring revenue with a membership your audience will love.",
    adCta: "Watch the Free Training",
    adCtaUrl: "https://lisapark.co/training",
    proposedEdits: {
      adHeadline: "Turn Your Expertise Into Recurring Revenue",
      adBody: "Lisa Park's membership model generates 7 figures on autopilot. In this free training, she reveals the exact system — so you can build a membership site your audience will love.",
      adCta: "Watch the Training",
      adCtaUrl: "https://lisapark.co/training",
    },
    proposedFee: 350,
    notes: "",
    createdAt: "2025-02-22",
    updatedAt: "2025-02-26",
  },
  {
    id: "req-24",
    sponsorId: "current-user",
    publisherId: "hero-2",
    status: "in_review",
    initiatedBy: "sponsor",
    reviewTurn: "sponsor",
    brief: "I'm promoting the Course Creator Accelerator to Marcus's fitness coaching audience. Many fitness coaches want to create online courses but don't know where to start.",
    adHeadline: "The Course Creator Accelerator",
    adBody: "Build and launch a 6-figure online course in 12 weeks. Alex Johnson's proven system has generated over $2M in student revenue. Limited spots available for the spring cohort.",
    adCta: "Apply Now",
    adCtaUrl: "https://alexjohnson.co/accelerator",
    proposedEdits: {
      adHeadline: "Turn Your Coaching Into a Course",
      adBody: "Alex Johnson's 12-week accelerator helps fitness coaches package their expertise into online courses that sell. Over $2M in student revenue generated. Spring cohort spots are limited.",
      adCta: "Apply for Spring Cohort",
      adCtaUrl: "https://alexjohnson.co/accelerator",
    },
    proposedFee: 275,
    notes: "",
    createdAt: "2025-02-20",
    updatedAt: "2025-02-26",
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
  },
  {
    id: "req-s-pub-2",
    sponsorId: "hero-5",
    publisherId: "hero-1",
    status: "paid",
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
  },
  {
    id: "req-j-pub-2",
    sponsorId: "hero-4",
    publisherId: "hero-10",
    status: "paid",
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

// ── Persona helpers (for demo switching) ──

export type Persona = "sarah" | "jake"

const personaMap: Record<Persona, string> = {
  sarah: "hero-1",
  jake: "hero-4",
}

/** Get the Hero for a persona key. Defaults to Sarah. */
export function getActiveUser(persona?: string | null): Hero {
  const heroId = personaMap[(persona as Persona)] ?? "hero-1"
  return heroes.find((h) => h.id === heroId) ?? currentUser
}

/** Get the role for a persona. Defaults to publisher. */
export function getRoleForPersona(persona?: string | null): Role {
  if (persona === "jake") return "sponsor"
  return "publisher"
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
    case "in_review":
      return "bg-[#AD715C]/30 text-[#4A2318] dark:bg-[#733725]/40 dark:text-[#AD715C]"
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
