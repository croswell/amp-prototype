"use client"

import { useSearchParams } from "next/navigation"
import { HeroCard } from "@/components/hero-card"
import { Badge } from "@/components/ui/badge"
import { type Vertical, heroes } from "@/lib/mock-data"
import { useState } from "react"

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

export function DirectoryContent() {
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "publisher"
  const [selectedVerticals, setSelectedVerticals] = useState<Vertical[]>([])

  // Single role: publishers see advertisers, advertisers see publishers
  const targetRole = role === "publisher" ? "advertiser" : "publisher"

  const byRole = heroes.filter(
    (h) => h.role === targetRole || h.role === "both"
  )

  const filtered =
    selectedVerticals.length === 0
      ? byRole
      : byRole.filter((h) =>
          h.verticals.some((v) => selectedVerticals.includes(v))
        )

  function toggleVertical(v: Vertical) {
    setSelectedVerticals((prev) =>
      prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">
          {role === "publisher" ? "Advertisers" : "Publishers"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Every creator in this network has been hand-selected and verified
          by our team.
        </p>
      </div>

      {/* Vertical filters */}
      <div className="flex flex-wrap gap-1.5">
        {ALL_VERTICALS.map((v) => {
          const isActive = selectedVerticals.includes(v)
          return (
            <button key={v} onClick={() => toggleVertical(v)}>
              <Badge
                variant={isActive ? "default" : "outline"}
                className="cursor-pointer"
              >
                {v}
              </Badge>
            </button>
          )
        })}
        {selectedVerticals.length > 0 && (
          <button onClick={() => setSelectedVerticals([])}>
            <Badge variant="ghost" className="cursor-pointer">
              Clear
            </Badge>
          </button>
        )}
      </div>

      {/* Hero grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((hero) => (
          <HeroCard key={hero.id} hero={hero} roleParam={role} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No matches for the selected filters.
          </p>
        </div>
      )}
    </div>
  )
}
