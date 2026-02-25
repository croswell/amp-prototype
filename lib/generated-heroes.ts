import type { Hero, Vertical, EngagementTier, Role } from "./mock-data"

// Deterministic PRNG (Park-Miller) — same output every time
function createRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]
}

function pickN<T>(arr: readonly T[], n: number, rng: () => number): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

// ============================================================
// Name pools (96 first × 58 last = 5,568 combos)
// ============================================================

const FIRST_NAMES = [
  "James", "Maria", "Daniel", "Sophia", "Michael", "Elena", "Chris", "Aaliyah",
  "Nathan", "Yuki", "Omar", "Rachel", "Wei", "Jade", "Raj", "Chloe",
  "Pablo", "Megan", "Andre", "Layla", "Felix", "Nora", "Kai", "Ruby",
  "Noah", "Ivy", "Ethan", "Aurora", "Liam", "Valentina", "Sebastian", "Camila",
  "Adrian", "Maya", "Xavier", "Luna", "Miles", "Stella", "Bennett", "Fatima",
  "Tyler", "Harper", "Jordan", "Aria", "Brandon", "Willow", "Cooper", "Violet",
  "Finn", "Hazel", "Ian", "Savannah", "Jasper", "Skylar", "Luke", "Nova",
  "Max", "Grace", "Oscar", "Ella", "Zane", "Hannah", "Sam", "Lily",
  "Tate", "Zoe", "Will", "Scarlett", "Reid", "Charlotte", "Declan", "Amelia",
  "Leon", "Olivia", "Marcel", "Ava", "Dominic", "Isabella", "Henry", "Mia",
  "Carter", "Emily", "Jayden", "Ashley", "Cameron", "Brittany", "Isaac", "Nicole",
  "Owen", "Lauren", "Lucas", "Stephanie", "Mason", "Amanda", "Vincent", "Jessica",
] as const

const LAST_NAMES = [
  "Nakamura", "Santos", "Petrov", "Johansson", "Okafor", "Singh",
  "Rossi", "Kowalski", "Fernandez", "Chang", "Dubois", "Hoffman", "Yamamoto",
  "Alvarez", "Walsh", "Torres", "Lindberg", "Reeves", "Vasquez",
  "Stone", "Cross", "Blake", "Pierce", "Grant", "Fox", "Cole", "Hart",
  "Wells", "Burke", "Dunn", "Moss", "Quinn", "Frost", "Lane", "Ray",
  "Wade", "Holt", "Vega", "Dale", "Roth", "Soto", "Lam", "Gill",
  "Bass", "Ware", "Hale", "Knox", "Pace", "York", "Park", "Reed",
  "Shaw", "Bell", "Kim", "Chen", "Ali", "Das", "Roy", "Tan",
] as const

// ============================================================
// Taglines per vertical (12 each)
// ============================================================

const ALL_VERTICALS: Vertical[] = [
  "Health & Fitness", "Business & Marketing", "Personal Development",
  "Creative Arts", "Finance", "Parenting", "Technology", "Education", "Lifestyle",
]

const TAGLINES: Record<Vertical, string[]> = {
  "Health & Fitness": [
    "Science-backed fitness for busy professionals",
    "Holistic wellness and mindful movement",
    "Plant-based nutrition simplified",
    "Strength training fundamentals",
    "Yoga and mobility for desk workers",
    "Mental health through exercise",
    "No-nonsense weight loss strategies",
    "Functional fitness for every body",
    "Nutrition science made accessible",
    "Home workout programming weekly",
    "Sleep and recovery optimization",
    "Endurance coaching for athletes",
  ],
  "Business & Marketing": [
    "Growth strategies for bootstrapped founders",
    "Email marketing that actually converts",
    "SEO and content strategy weekly",
    "Brand building for solopreneurs",
    "Social media growth tactics",
    "Startup lessons from the trenches",
    "Copywriting that drives revenue",
    "Digital marketing deep dives",
    "Revenue operations simplified",
    "B2B sales playbooks weekly",
    "Community-led growth strategies",
    "Productized service blueprints",
  ],
  "Personal Development": [
    "Daily habits for high performers",
    "Mindset shifts for ambitious people",
    "Productivity systems that stick",
    "Leadership lessons for new managers",
    "Building confidence and resilience",
    "Career transitions made manageable",
    "Emotional intelligence at work",
    "Time management for creators",
    "Goal setting with accountability",
    "Journaling and self-reflection weekly",
    "Finding purpose in your work",
    "Overcoming imposter syndrome",
  ],
  "Creative Arts": [
    "Design thinking for non-designers",
    "Photography tips and inspiration",
    "Writing craft and storytelling",
    "Music production for beginners",
    "Illustration and visual art weekly",
    "Creative entrepreneurship insights",
    "Film and video production tips",
    "Graphic design trends and tools",
    "Creative process deep dives",
    "Art business and gallery prep",
    "Handmade crafts and DIY projects",
    "Animation and motion design",
  ],
  "Finance": [
    "Personal finance for millennials",
    "Investing strategies simplified",
    "Building wealth on any income",
    "Crypto and DeFi explained clearly",
    "Retirement planning made simple",
    "Real estate investing insights",
    "Financial independence roadmap",
    "Stock market analysis weekly",
    "Budgeting without restriction",
    "Side income strategies that work",
    "Tax optimization for creators",
    "Money mindset and wealth building",
  ],
  "Parenting": [
    "Positive parenting strategies",
    "Raising kids in the digital age",
    "Montessori-inspired home learning",
    "Work-life balance for parents",
    "Toddler development milestones",
    "Teen communication skills",
    "Family meal planning simplified",
    "Mindful parenting practices",
    "Homeschooling resources weekly",
    "New parent survival guide",
    "Co-parenting with confidence",
    "Play-based learning activities",
  ],
  "Technology": [
    "AI and machine learning explained",
    "No-code tools for non-techies",
    "Web development trends weekly",
    "Cybersecurity for small businesses",
    "SaaS product insights",
    "Tech career growth strategies",
    "Open source project highlights",
    "Developer productivity tips",
    "Cloud infrastructure simplified",
    "Mobile app development insights",
    "Data science for decision makers",
    "Emerging tech trends analyzed",
  ],
  "Education": [
    "Online course creation strategies",
    "EdTech tools and trends weekly",
    "Teaching methods that engage",
    "Student success frameworks",
    "Curriculum design insights",
    "Learning science applied weekly",
    "Corporate training innovation",
    "Language learning techniques",
    "STEM education resources",
    "Adult education and upskilling",
    "Knowledge business blueprints",
    "Instructional design weekly",
  ],
  "Lifestyle": [
    "Intentional living for busy people",
    "Travel planning and adventures",
    "Minimalist lifestyle insights",
    "Home organization and design",
    "Sustainable living made easy",
    "Fashion and personal style tips",
    "Cooking and recipe inspiration",
    "Digital nomad lifestyle weekly",
    "Wellness and self-care routines",
    "Relationship advice for adults",
    "Pet care and animal lovers weekly",
    "Outdoor adventures and nature",
  ],
}

const SOCIAL_PLATFORMS = ["twitter", "instagram", "linkedin", "youtube", "tiktok"] as const

// ============================================================
// Generator
// ============================================================

const rng = createRng(42)

function generateHero(index: number, role: Role): Hero {
  const firstName = pick(FIRST_NAMES, rng)
  const lastName = pick(LAST_NAMES, rng)
  const name = `${firstName} ${lastName}`

  const numVerticals = rng() < 0.4 ? 1 : rng() < 0.7 ? 2 : 3
  const verticals = pickN(ALL_VERTICALS, numVerticals, rng)

  // 25% high, 50% medium, 25% low
  const tierRoll = rng()
  const engagementTier: EngagementTier =
    tierRoll < 0.25 ? "high" : tierRoll < 0.75 ? "medium" : "low"

  const subscriberCount =
    Math.round(
      (engagementTier === "high"
        ? 20000 + rng() * 80000
        : engagementTier === "medium"
          ? 5000 + rng() * 40000
          : 2000 + rng() * 15000) / 100
    ) * 100

  const openRate =
    Math.round(
      (engagementTier === "high"
        ? 35 + rng() * 15
        : engagementTier === "medium"
          ? 22 + rng() * 13
          : 12 + rng() * 10) * 10
    ) / 10

  const clickRate =
    Math.round(
      (engagementTier === "high"
        ? 5 + rng() * 5
        : engagementTier === "medium"
          ? 2.5 + rng() * 3.5
          : 1 + rng() * 2) * 10
    ) / 10

  const recommendedFee = Math.max(
    Math.round(
      (subscriberCount *
        0.005 *
        (engagementTier === "high"
          ? 1.5
          : engagementTier === "medium"
            ? 1.2
            : 1.0)) /
        25
    ) * 25,
    50
  )

  const idPrefix = role === "publisher" ? "gen-pub" : "gen-adv"
  const slug = firstName.toLowerCase() + lastName.toLowerCase()

  const numSocials = rng() < 0.6 ? 1 : 2
  const platforms = pickN(SOCIAL_PLATFORMS, numSocials, rng)
  const socialLinks = platforms.map((p) => ({
    platform: p,
    url: `https://${p}.com/${slug}`,
  }))

  const bio =
    role === "publisher"
      ? `${name} delivers ${verticals[0].toLowerCase()} insights to ${subscriberCount.toLocaleString()} engaged subscribers. Their audience trusts their recommendations and actively engages with sponsored content.`
      : `${name} is building in the ${verticals[0].toLowerCase()} space and looking to reach engaged audiences through trusted creator partnerships.`

  return {
    id: `${idPrefix}-${index}`,
    name,
    avatar: `/avatars/${slug}.jpg`,
    role,
    tagline: pick(TAGLINES[verticals[0]], rng),
    verticals,
    subscriberCount,
    engagementTier,
    openRate,
    clickRate,
    recommendedFee,
    bio,
    website: `https://${slug}.com`,
    socialLinks,
    promotionsCompleted: Math.floor(rng() * 35),
    rating: Math.round((3.8 + rng() * 1.2) * 10) / 10,
    joinedDate: `2024-${String(Math.floor(rng() * 12) + 1).padStart(2, "0")}-${String(Math.floor(rng() * 28) + 1).padStart(2, "0")}`,
  }
}

export const generatedHeroes: Hero[] = [
  ...Array.from({ length: 95 }, (_, i) => generateHero(i + 1, "publisher")),
  ...Array.from({ length: 95 }, (_, i) => generateHero(i + 1, "sponsor")),
]
