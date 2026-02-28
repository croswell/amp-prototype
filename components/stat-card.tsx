interface StatCardProps {
  label: string
  value: string | number
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border p-4 space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-medium tabular-nums">{value}</p>
    </div>
  )
}
