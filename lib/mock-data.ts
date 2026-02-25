// ============================================================
// Types
// ============================================================

export type Role = "publisher" | "advertiser" | "both"
export type EngagementTier = "high" | "medium" | "low"
export type RequestStatus =
  | "pending"
  | "reviewing"
  | "copy-review"
  | "scheduling"
  | "locked"

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
  advertiserId: string
  publisherId: string
  status: RequestStatus
  adHeadline: string
  adBody: string
  adCta: string
  adCtaUrl: string
  adImage?: string
  proposedFee: number
  proposedDate: string
  notes: string
  createdAt: string
  updatedAt: string
}

// ============================================================
// Step labels for request flow
// ============================================================

export const REQUEST_STEPS: { key: RequestStatus; label: string }[] = [
  { key: "pending", label: "Request Sent" },
  { key: "reviewing", label: "Under Review" },
  { key: "copy-review", label: "Copy Review" },
  { key: "scheduling", label: "Scheduling" },
  { key: "locked", label: "Locked" },
]

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
    role: "advertiser",
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
    role: "advertiser",
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
    role: "advertiser",
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
// Mock Promotion Requests (at different stages)
// ============================================================

export const promotionRequests: PromotionRequest[] = [
  {
    id: "req-1",
    advertiserId: "hero-4",
    publisherId: "current-user",
    status: "pending",
    adHeadline: "Create Your First Online Course in 30 Days",
    adBody: "Jake Morrison's step-by-step framework has helped 500+ creators launch profitable courses. Get his free Course Launch Blueprint and start building your course today.",
    adCta: "Get the Free Blueprint",
    adCtaUrl: "https://jakemorrison.io/blueprint",
    proposedFee: 300,
    proposedDate: "2025-03-15",
    notes: "Big fan of your newsletter, Alex. I think my course creation framework would resonate with your audience of knowledge entrepreneurs.",
    createdAt: "2025-02-20",
    updatedAt: "2025-02-20",
  },
  {
    id: "req-2",
    advertiserId: "hero-6",
    publisherId: "hero-1",
    status: "reviewing",
    adHeadline: "Grow Your Podcast to 10K Downloads",
    adBody: "PodGrowth helps podcasters double their audience in 90 days with AI-powered growth tools. Join 2,000+ podcasters already using the platform.",
    adCta: "Try PodGrowth Free",
    adCtaUrl: "https://podgrowth.co/trial",
    proposedFee: 350,
    proposedDate: "2025-03-22",
    notes: "Sarah, your coaching audience includes a lot of people launching podcasts. This could be a great fit.",
    createdAt: "2025-02-18",
    updatedAt: "2025-02-21",
  },
  {
    id: "req-3",
    advertiserId: "current-user",
    publisherId: "hero-3",
    status: "copy-review",
    adHeadline: "The Course Creator Accelerator",
    adBody: "Build and launch a 6-figure online course in 12 weeks. Alex Johnson's proven system has generated over $2M in student revenue. Limited spots available for the spring cohort.",
    adCta: "Apply Now",
    adCtaUrl: "https://alexjohnson.co/accelerator",
    proposedFee: 500,
    proposedDate: "2025-04-01",
    notes: "Priya, your community of ambitious women would be a perfect audience for this. Many of them are looking to create courses around their expertise.",
    createdAt: "2025-02-15",
    updatedAt: "2025-02-22",
  },
  {
    id: "req-4",
    advertiserId: "hero-9",
    publisherId: "hero-10",
    status: "scheduling",
    adHeadline: "Build a Membership Site That Runs Itself",
    adBody: "Lisa Park built a 7-figure membership site and now she's teaching her system. Learn how to create recurring revenue with a membership your audience will love.",
    adCta: "Watch the Free Training",
    adCtaUrl: "https://lisapark.co/training",
    proposedFee: 425,
    proposedDate: "2025-03-28",
    notes: "Ryan, your solopreneur audience would love this. Memberships are the #1 way to create recurring revenue.",
    createdAt: "2025-02-10",
    updatedAt: "2025-02-23",
  },
  {
    id: "req-5",
    advertiserId: "current-user",
    publisherId: "hero-7",
    status: "locked",
    adHeadline: "Scale Your Knowledge Business",
    adBody: "Alex Johnson's Course Creator Accelerator has helped 200+ entrepreneurs package their expertise into profitable online courses. Join the next cohort and build your course with expert guidance.",
    adCta: "Learn More",
    adCtaUrl: "https://alexjohnson.co/accelerator",
    proposedFee: 325,
    proposedDate: "2025-03-05",
    notes: "Emma, many parents in your community are looking for flexible ways to earn income. An online course could be perfect for them.",
    createdAt: "2025-02-01",
    updatedAt: "2025-02-24",
  },
]

// ============================================================
// Helper Functions
// ============================================================

export function getPublishers(): Hero[] {
  return heroes.filter((h) => h.role === "publisher" || h.role === "both")
}

export function getAdvertisers(): Hero[] {
  return heroes.filter((h) => h.role === "advertiser" || h.role === "both")
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
    if (roleFilter === "advertiser" || roleFilter === "both") {
      if (r.advertiserId === userId) return true
    }
    return false
  })
}

export function getRequest(id: string): PromotionRequest | undefined {
  return promotionRequests.find((r) => r.id === id)
}

export function getStatusIndex(status: RequestStatus): number {
  return REQUEST_STEPS.findIndex((s) => s.key === status)
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
      return "text-emerald-600 bg-emerald-50"
    case "medium":
      return "text-amber-600 bg-amber-50"
    case "low":
      return "text-red-600 bg-red-50"
  }
}

export function getStatusColor(status: RequestStatus): string {
  switch (status) {
    case "pending":
      return "bg-blue-50 text-blue-700"
    case "reviewing":
      return "bg-amber-50 text-amber-700"
    case "copy-review":
      return "bg-purple-50 text-purple-700"
    case "scheduling":
      return "bg-cyan-50 text-cyan-700"
    case "locked":
      return "bg-emerald-50 text-emerald-700"
  }
}

/** Get heroes that would be good matches for the current user based on shared verticals */
export function getRecommendedHeroes(forRole: Role): Hero[] {
  const userVerticals = new Set(currentUser.verticals)
  return heroes
    .filter((h) => {
      // Publishers see advertisers and vice versa
      if (forRole === "publisher") return h.role === "advertiser" || h.role === "both"
      if (forRole === "advertiser") return h.role === "publisher" || h.role === "both"
      return true
    })
    .sort((a, b) => {
      const aMatch = a.verticals.filter((v) => userVerticals.has(v)).length
      const bMatch = b.verticals.filter((v) => userVerticals.has(v)).length
      return bMatch - aMatch
    })
}
