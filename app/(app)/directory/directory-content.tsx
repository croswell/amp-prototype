"use client"

import { useSearchParams } from "next/navigation"
import { type ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HeroCard } from "@/components/hero-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetBody,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { EmailBlockPreview } from "@/components/email-block-preview"
import {
  type Hero,
  type Vertical,
  heroes,
  getHero,
  formatCurrency,
  formatNumber,
  getEngagementColor,
  promotionRequests,
} from "@/lib/mock-data"
import { BADGE_COLORS } from "@/components/promotion-sheet"

// Look up a sponsor's campaign title from their promotion requests
function getCampaignTitle(heroId: string): string {
  const req = promotionRequests.find((r) => r.sponsorId === heroId)
  if (req) return req.adHeadline
  const hero = getHero(heroId)
  return hero?.tagline ?? ""
}
import { useState, useMemo } from "react"
import {
  MagnifyingGlass,
  SlidersHorizontal,
  X,
  Check,
  CaretLeft,
  CaretRight,
  Globe,
} from "@phosphor-icons/react"

const ALL_VERTICALS: Vertical[] = [
  "Health & Fitness",
  "Business & Marketing",
  "Personal Development",
  "Creative Arts",
  "Finance",
  "Parenting",
  "Technology",
  "Education",
  "Lifestyle",
]

const ITEMS_PER_PAGE = 25

// Deterministic schedule range based on hero ID (e.g. "Mar 9 – Mar 15")
function getScheduleRange(heroId: string): string {
  const hash = heroId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const dayOffset = (hash % 4) * 7 + 7
  const start = new Date()
  start.setDate(start.getDate() + dayOffset)
  // Round to nearest Monday
  const day = start.getDay()
  const diff = day === 0 ? 1 : day === 1 ? 0 : 8 - day
  start.setDate(start.getDate() + diff)
  const end = new Date(start)
  end.setDate(end.getDate() + 6) // Sunday of same week
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  return `${fmt(start)} – ${fmt(end)}`
}

// Deterministic days remaining (1–7) based on hero ID
function getDaysRemaining(heroId: string): number {
  const hash = heroId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return (hash % 7) + 1
}

export function DirectoryContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "publisher"
  const [selectedVerticals, setSelectedVerticals] = useState<Vertical[]>([])
  const [pendingVerticals, setPendingVerticals] = useState<Vertical[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())
  const [selectedHeroId, setSelectedHeroId] = useState<string | null>(null)
  const selectedHero = selectedHeroId ? getHero(selectedHeroId) ?? null : null

  // Publishers see sponsors, sponsors see publishers
  const targetRole = role === "publisher" ? "sponsor" : "publisher"
  const roleLabel = role === "publisher" ? "sponsors" : "publishers"

  const filtered = useMemo(() => {
    let result = heroes.filter(
      (h) => h.role === targetRole || h.role === "both"
    )

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.tagline.toLowerCase().includes(q)
      )
    }

    if (selectedVerticals.length > 0) {
      result = result.filter((h) =>
        h.verticals.some((v) => selectedVerticals.includes(v))
      )
    }

    // Hide dismissed sponsors
    if (dismissedIds.size > 0) {
      result = result.filter((h) => !dismissedIds.has(h.id))
    }

    return result
  }, [targetRole, searchQuery, selectedVerticals, dismissedIds])

  // Column definitions for the sponsor data table
  const sponsorColumns = useMemo<ColumnDef<Hero>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Sponsor",
        cell: ({ row }) => {
          const hero = row.original
          const initials = hero.name.charAt(0)
          return (
            <button
              onClick={() => setSelectedHeroId(hero.id)}
              className="flex items-center gap-3 cursor-pointer text-left"
            >
              <Avatar className="size-8">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{hero.name}</span>
            </button>
          )
        },
      },
      {
        id: "campaign",
        header: "Campaign",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {getCampaignTitle(row.original.id)}
          </span>
        ),
      },
      {
        id: "payout",
        header: "Payout",
        cell: ({ row }) => (
          <Badge variant="outline" className={`${BADGE_COLORS.greenOutline} tabular-nums`}>
            {formatCurrency(row.original.recommendedFee)}
          </Badge>
        ),
      },
      {
        id: "schedule",
        header: "Schedule",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {getScheduleRange(row.original.id)}
          </span>
        ),
      },
      {
        id: "expires",
        header: "Expires",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {getDaysRemaining(row.original.id)} days
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setSelectedHeroId(row.original.id)}>
              View
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  // Manual pagination for the grid view (sponsor role)
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const [currentPage, setCurrentPage] = useState(1)
  const safePage = Math.min(currentPage, Math.max(totalPages, 1))
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedHeroes = filtered.slice(startIndex, endIndex)

  function handleSearch(value: string) {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  // Filter dropdown: sync pending state when opening
  function handleFilterOpenChange(open: boolean) {
    if (open) {
      setPendingVerticals([...selectedVerticals])
    }
    setFilterOpen(open)
  }

  function togglePending(v: Vertical) {
    setPendingVerticals((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    )
  }

  function applyFilters() {
    setSelectedVerticals(pendingVerticals)
    setCurrentPage(1)
    setFilterOpen(false)
  }

  function removeVertical(v: Vertical) {
    setSelectedVerticals((prev) => prev.filter((x) => x !== v))
    setCurrentPage(1)
  }

  function clearAll() {
    setSelectedVerticals([])
    setCurrentPage(1)
  }

  function getPageNumbers(): (number | "...")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const pages: (number | "...")[] = [1]
    if (safePage > 3) pages.push("...")
    for (
      let i = Math.max(2, safePage - 1);
      i <= Math.min(totalPages - 1, safePage + 1);
      i++
    ) {
      pages.push(i)
    }
    if (safePage < totalPages - 2) pages.push("...")
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium tracking-tight">
          Verified {role === "publisher" ? "Sponsors" : "Publishers"}
        </h1>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2">
        <InputGroup className="flex-1">
          <InputGroupAddon>
            <MagnifyingGlass className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            placeholder={`Search ${roleLabel}`}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </InputGroup>

        <DropdownMenu open={filterOpen} onOpenChange={handleFilterOpenChange}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <SlidersHorizontal className="size-4" />
              Filter
              {selectedVerticals.length > 0 && (
                <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background">
                  {selectedVerticals.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-56">
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ALL_VERTICALS.map((v) => {
              const isChecked = pendingVerticals.includes(v)
              return (
                <DropdownMenuItem
                  key={v}
                  onSelect={(e) => e.preventDefault()}
                  onClick={() => togglePending(v)}
                >
                  <div
                    className={`flex size-4 shrink-0 items-center justify-center rounded-sm border ${
                      isChecked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input text-transparent"
                    }`}
                  >
                    <Check weight="bold" className="size-3" />
                  </div>
                  {v}
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <div className="p-1">
              <Button size="sm" className="w-full" onClick={applyFilters}>
                Apply
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Applied filter tags */}
      {selectedVerticals.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex flex-1 flex-wrap gap-1.5">
            {selectedVerticals.map((v) => (
              <Badge key={v} variant="secondary" className="gap-1 pr-1.5">
                {v}
                <button
                  onClick={() => removeVertical(v)}
                  className="ml-0.5 rounded-sm p-0.5 hover:bg-foreground/10"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-muted-foreground"
            onClick={clearAll}
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Sponsor data table (publisher view) or hero grid (sponsor view) */}
      {role === "publisher" ? (
        <DataTable
          columns={sponsorColumns}
          data={filtered}
          pageSize={ITEMS_PER_PAGE}
        />
      ) : (
        <>
          {/* Results count */}
          {filtered.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Showing {startIndex + 1}&ndash;
              {Math.min(endIndex, filtered.length)} of {filtered.length}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {paginatedHeroes.map((hero) => (
              <HeroCard key={hero.id} hero={hero} roleParam={role} onClick={() => setSelectedHeroId(hero.id)} />
            ))}
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "No results for that search."
                  : "No matches for the selected filters."}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 pt-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <CaretLeft className="size-4" />
                Previous
              </Button>
              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="px-2 text-xs text-muted-foreground"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={page === safePage ? "default" : "ghost"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="ghost"
                size="sm"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                Next
                <CaretRight className="size-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* ── Hero profile Sheet ── */}
      <Sheet open={!!selectedHero} onOpenChange={(open) => !open && setSelectedHeroId(null)}>
        <SheetContent className="sm:max-w-lg">
          {selectedHero && role === "publisher" && (
            <SponsorProfileSheet hero={selectedHero} />
          )}
          {selectedHero && role !== "publisher" && (
            <PublisherProfileSheet hero={selectedHero} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Sheet profile views
// ─────────────────────────────────────────────────────────────

function SponsorProfileSheet({ hero }: { hero: Hero }) {
  const initials = hero.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-lg">{hero.name}</SheetTitle>
      </SheetHeader>

      <SheetBody className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {hero.bio}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {hero.verticals.map((v) => (
            <Badge key={v} variant="outline">
              {v}
            </Badge>
          ))}
        </div>

        {/* Links */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Links</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a
              href={hero.website}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <Globe className="size-3.5" />
              Website
            </a>
            {hero.socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                className="flex items-center gap-1.5 text-sm capitalize text-muted-foreground hover:text-foreground"
              >
                <Globe className="size-3.5" />
                {link.platform}
              </a>
            ))}
          </div>
        </div>

        {/* Promotion preview */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Promotion</p>
          <EmailBlockPreview
            headline={hero.tagline}
            body={hero.bio}
            cta="Learn More"
          />
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Payout per send</p>
          <p className="text-lg font-medium tabular-nums">
            {formatCurrency(hero.recommendedFee)}
          </p>
        </div>
      </SheetBody>

      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Decline</Button>
        </SheetClose>
        <Button>Accept</Button>
      </SheetFooter>
    </>
  )
}

function PublisherProfileSheet({ hero }: { hero: Hero }) {
  const initials = hero.name
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <>
      <SheetHeader>
        <SheetTitle className="text-lg">{hero.name}</SheetTitle>
      </SheetHeader>

      <SheetBody className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Subscribers</p>
            <p className="text-lg font-medium tabular-nums">
              {formatNumber(hero.subscriberCount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Open Rate</p>
            <p className="text-lg font-medium tabular-nums">
              {hero.openRate}%
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Click Rate</p>
            <p className="text-lg font-medium tabular-nums">
              {hero.clickRate}%
            </p>
          </div>
        </div>

        <Badge
          variant="secondary"
          className={getEngagementColor(hero.engagementTier)}
        >
          {hero.engagementTier} engagement
        </Badge>

        <div>
          <p className="text-xs text-muted-foreground">Recommended Fee</p>
          <p className="text-lg font-medium tabular-nums">
            {formatCurrency(hero.recommendedFee)}
          </p>
        </div>

        {/* Sample promotion */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Sample Promotion
          </p>
          <EmailBlockPreview
            headline={`Recommended by ${hero.name.split(" ")[0]}`}
            body={`${hero.name} hand-picks every promotion they share. Their audience trusts their recommendations because they only endorse products they believe in.`}
            cta="Learn More"
            publisherName={hero.name}
          />
        </div>
      </SheetBody>

      <SheetFooter>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
        <Button>Send Request</Button>
      </SheetFooter>
    </>
  )
}
