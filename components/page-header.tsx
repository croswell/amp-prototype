export function PageHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="relative space-y-1.5 pb-10 after:absolute after:bottom-0 after:left-1/2 after:w-screen after:-translate-x-1/2 after:border-b after:border-border">
      <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
