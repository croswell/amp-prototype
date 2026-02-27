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
      className={`gap-1 text-xs bg-[#EFD3A9]/50 text-[#6B4A15] dark:bg-[#D6A151]/30 dark:text-[#EFD3A9] ${className ?? ""}`}
    >
      <CaretDoubleUp className="size-3" />
      High Engagement
    </Badge>
  )
}
