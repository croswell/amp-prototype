import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const VARIANT_STYLES = {
  outline: "text-emerald-700 dark:text-[#86CEAC]",
  filled: "bg-[#CBD7CC]/50 text-[#2A3D35] border-0 dark:bg-[#405B50]/40 dark:text-[#CBD7CC]",
} as const

interface PayoutBadgeProps {
  amount: number
  label?: string
  variant?: keyof typeof VARIANT_STYLES
  className?: string
}

export function PayoutBadge({ amount, label, variant = "outline", className }: PayoutBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "tabular-nums",
        VARIANT_STYLES[variant],
        className
      )}
    >
      {label && <span>{label}</span>}{formatCurrency(amount)}
    </Badge>
  )
}
