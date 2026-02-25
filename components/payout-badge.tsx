import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface PayoutBadgeProps {
  amount: number
  className?: string
}

export function PayoutBadge({ amount, className }: PayoutBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-emerald-700 tabular-nums dark:text-[#86CEAC]",
        className
      )}
    >
      {formatCurrency(amount)}
    </Badge>
  )
}
