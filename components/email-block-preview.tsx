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
    <div className={cn("overflow-hidden rounded-sm border", className)}>
      {publisherName && (
        <div className="border-b bg-muted px-4 py-2">
          <p className="text-xs text-muted-foreground">
            Recommended by {publisherName}
          </p>
        </div>
      )}
      <div className="space-y-3 p-4">
        <h4 className="text-sm font-medium leading-snug">{headline}</h4>
        <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
        <div className="pt-1">
          <span className="inline-block bg-muted px-4 py-2 text-xs font-medium text-muted-foreground cursor-default">
            {cta}
          </span>
        </div>
      </div>
      <div className="border-t bg-muted px-4 py-1.5">
        <p className="text-[10px] text-muted-foreground">
          Powered by Kajabi Amplify
        </p>
      </div>
    </div>
  )
}
