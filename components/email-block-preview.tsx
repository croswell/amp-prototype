import { cn } from "@/lib/utils"

interface EmailBlockPreviewProps {
  headline: string
  body: string
  cta: string
  publisherName?: string
  className?: string
}

export function EmailBlockPreview({
  headline,
  body,
  cta,
  publisherName,
  className,
}: EmailBlockPreviewProps) {
  return (
    <div className={cn("overflow-hidden rounded-sm border bg-muted/30", className)}>
      <div className="space-y-3 p-4">
        <h4 className="text-sm font-normal leading-snug text-muted-foreground">{headline}</h4>
        <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
        <div className="pt-1">
          <span className="inline-block rounded-md border px-4 py-2 text-xs font-medium text-muted-foreground cursor-default">
            {cta}
          </span>
        </div>
      </div>
    </div>
  )
}
