"use client"

import { Badge } from "@/components/ui/badge"
import type { Vertical } from "@/lib/mock-data"

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

interface VerticalPickerProps {
  selected: Vertical[]
  onChange: (verticals: Vertical[]) => void
}

export function VerticalPicker({ selected, onChange }: VerticalPickerProps) {
  function toggle(v: Vertical) {
    if (selected.includes(v)) {
      onChange(selected.filter((x) => x !== v))
    } else {
      onChange([...selected, v])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_VERTICALS.map((v) => {
        const isActive = selected.includes(v)
        return (
          <button key={v} type="button" onClick={() => toggle(v)}>
            <Badge
              variant={isActive ? "default" : "outline"}
              className="cursor-pointer px-3 py-3 text-xs"
            >
              {v}
            </Badge>
          </button>
        )
      })}
    </div>
  )
}
