import { Badge } from "@/components/ui/badge"
import { COLOR_PAIRS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { CaretDoubleUp } from "@phosphor-icons/react"

interface EngagementBadgeProps {
  tier: string
  className?: string
}

export function EngagementBadge({ tier, className }: EngagementBadgeProps) {
  if (tier !== "high") return null

  return (
    <Badge
      variant="secondary"
      className={cn("gap-1 text-xs", COLOR_PAIRS.amber, className)}
    >
      <CaretDoubleUp className="size-3" />
      High Engagement
    </Badge>
  )
}
