import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const VARIANT_STYLES = {
  outline: "text-muted-foreground",
  filled: "bg-[#CBD7CC]/50 text-[#2A3D35] border-0 dark:bg-[#405B50]/40 dark:text-[#CBD7CC]",
} as const

interface PayoutBadgeProps {
  amount: number
  label?: string
  suffix?: string
  variant?: keyof typeof VARIANT_STYLES
  className?: string
}

export function PayoutBadge({ amount, label, suffix, variant = "outline", className }: PayoutBadgeProps) {
  if (variant === "outline") {
    return (
      <span className={cn("text-sm tabular-nums text-muted-foreground", className)}>
        {label && <span>{label}</span>}{formatCurrency(amount)}{suffix}
      </span>
    )
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs tabular-nums",
        VARIANT_STYLES[variant],
        className
      )}
    >
      {label && <span>{label}</span>}{formatCurrency(amount)}{suffix}
    </Badge>
  )
}
