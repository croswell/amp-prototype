"use client"

import { useState } from "react"
import { formatCurrency } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface RevenueCalculatorProps {
  recommendedFee: number
  subscriberCount: number
}

const FREQUENCY_OPTIONS = [
  { label: "1/mo", value: 1 },
  { label: "2/mo", value: 2 },
  { label: "4/mo", value: 4 },
]

export function RevenueCalculator({
  recommendedFee,
  subscriberCount,
}: RevenueCalculatorProps) {
  const [frequency, setFrequency] = useState(2)

  const monthlyRevenue = recommendedFee * frequency
  const yearlyRevenue = monthlyRevenue * 12

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-xs font-medium text-muted-foreground">
          Promotions per month
        </label>
        <div className="flex gap-2">
          {FREQUENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFrequency(opt.value)}
              className={cn(
                "flex-1 rounded-sm border px-3 py-2 text-sm font-medium transition-colors",
                frequency === opt.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground hover:bg-muted"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 rounded-sm border bg-muted/50 p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">
            Recommended fee per promotion
          </span>
          <span className="text-sm font-medium tabular-nums">
            {formatCurrency(recommendedFee)}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-xs text-muted-foreground">
            Based on {subscriberCount.toLocaleString()} subscribers
          </span>
        </div>

        <div className="border-t pt-4" />

        <div className="flex items-baseline justify-between">
          <span className="text-sm text-muted-foreground">Monthly</span>
          <span className="text-lg font-medium tabular-nums">
            {formatCurrency(monthlyRevenue)}
          </span>
        </div>

        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium">Yearly</span>
          <span className="text-2xl font-medium tracking-tight tabular-nums">
            {formatCurrency(yearlyRevenue)}
          </span>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        At {frequency} promotion{frequency > 1 ? "s" : ""} per month, that&apos;s{" "}
        <span className="font-medium text-foreground">
          {formatCurrency(yearlyRevenue)}/year
        </span>{" "}
        in additional revenue — just from your existing audience.
      </p>
    </div>
  )
}
