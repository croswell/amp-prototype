"use client"

import { useSearchParams } from "next/navigation"
import { HeroCard } from "@/components/hero-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
} from "@/lib/mock-data"
import { useState, useMemo, useCallback } from "react"
import {
  MagnifyingGlass,
  SlidersHorizontal,
  X,
  Check,
  CaretLeft,
  CaretRight,
  Globe,
  CheckCircle,
  X as XIcon,
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

  // Pagination
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
      <div className="space-y-1.5">
        <h1 className="text-2xl font-medium tracking-tight">Discover</h1>
        <p className="text-sm text-muted-foreground">
          Verified {role === "publisher" ? "sponsors" : "publishers"}, hand-selected and curated by our team.
        </p>
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

      <div className="grid gap-4 sm:grid-cols-2">
        {paginatedHeroes.map((hero) => (
          <HeroCard key={hero.id} hero={hero} showPublisherStats={role === "sponsor"} onClick={() => setSelectedHeroId(hero.id)} />
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
      {filtered.length > 0 && (
        <div className="flex items-center pt-2">
          <p className="text-xs text-muted-foreground">
            Showing {startIndex + 1}&ndash;
            {Math.min(endIndex, filtered.length)} of {filtered.length}
          </p>
          {totalPages > 1 && (
            <div className="ml-auto flex items-center gap-1">
              <Button
                variant="outline"
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
                    variant={page === safePage ? "default" : "outline"}
                    size="sm"
                    className="w-8 p-0"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
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
        </div>
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
  const [phase, setPhase] = useState<"idle" | "loading" | "success">("idle")

  const handleAccept = useCallback(() => {
    setPhase("loading")
    setTimeout(() => {
      setPhase("success")
    }, 1200)
  }, [])

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <SheetTitle className="flex-1 text-lg">{hero.name}</SheetTitle>
          <SheetClose asChild>
            <Button variant="outline" size="icon-sm">
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <SheetBody className="space-y-4">
        {/* Confirmation message */}
        {phase === "success" && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/50">
            <div className="flex items-center gap-2">
              <CheckCircle weight="fill" className="size-5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                Request sent to {hero.name}
              </p>
            </div>
            <p className="mt-1 ml-7 text-xs text-emerald-700 dark:text-emerald-400">
              Switch to <span className="font-medium">?role=sponsor</span> to see the request in their inbox.
            </p>
          </div>
        )}

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
        {phase === "success" ? (
          <Button className="bg-emerald-600 hover:bg-emerald-600 text-white" disabled>
            <Check weight="bold" className="size-4" />
            Sent
          </Button>
        ) : (
          <Button loading={phase === "loading"} onClick={handleAccept}>
            {phase === "loading" ? "Sending..." : "Accept"}
          </Button>
        )}
      </SheetFooter>
    </>
  )
}

function PublisherProfileSheet({ hero }: { hero: Hero }) {
  const [phase, setPhase] = useState<"idle" | "loading" | "success">("idle")

  const handleSendRequest = useCallback(() => {
    setPhase("loading")
    setTimeout(() => {
      setPhase("success")
    }, 1200)
  }, [])

  return (
    <>
      <SheetHeader>
        <div className="flex items-center gap-3">
          <SheetTitle className="flex-1 text-lg">{hero.name}</SheetTitle>
          <SheetClose asChild>
            <Button variant="outline" size="icon-sm">
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <SheetBody className="space-y-4">
        {/* Confirmation message */}
        {phase === "success" && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/50">
            <div className="flex items-center gap-2">
              <CheckCircle weight="fill" className="size-5 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                Request sent to {hero.name}
              </p>
            </div>
            <p className="mt-1 ml-7 text-xs text-emerald-700 dark:text-emerald-400">
              Switch to <span className="font-medium">?role=publisher</span> to see the request in their inbox.
            </p>
          </div>
        )}

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
        {phase === "success" ? (
          <Button className="bg-emerald-600 hover:bg-emerald-600 text-white" disabled>
            <Check weight="bold" className="size-4" />
            Sent
          </Button>
        ) : (
          <Button loading={phase === "loading"} onClick={handleSendRequest}>
            {phase === "loading" ? "Sending..." : "Send Request"}
          </Button>
        )}
      </SheetFooter>
    </>
  )
}
