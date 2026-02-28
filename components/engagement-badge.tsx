import { Badge } from "@/components/ui/badge"
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
      className={`gap-1 text-xs bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 ${className ?? ""}`}
    >
      <CaretDoubleUp className="size-3" />
      High Engagement
    </Badge>
  )
}
