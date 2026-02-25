import { cn } from "@/lib/utils"
import { EmailBlockPreview } from "@/components/email-block-preview"

interface EmailBuilderMockupProps {
  state: "empty" | "filled"
  headline?: string
  body?: string
  cta?: string
  publisherName?: string
  className?: string
}

export function EmailBuilderMockup({
  state,
  headline = "",
  body = "",
  cta = "",
  publisherName,
  className,
}: EmailBuilderMockupProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-md overflow-hidden rounded-sm border bg-background",
        className
      )}
    >
      {/* Email header mockup */}
      <div className="border-b bg-muted px-5 py-3">
        <div className="space-y-1.5">
          <div className="h-2.5 w-32 rounded-sm bg-foreground/10" />
          <div className="h-2 w-48 rounded-sm bg-foreground/5" />
        </div>
      </div>

      {/* Email body */}
      <div className="space-y-4 px-5 py-5">
        {/* Simulated text lines */}
        <div className="space-y-2">
          <div className="h-2 w-full rounded-sm bg-foreground/8" />
          <div className="h-2 w-11/12 rounded-sm bg-foreground/8" />
          <div className="h-2 w-4/5 rounded-sm bg-foreground/8" />
        </div>

        <div className="space-y-2">
          <div className="h-2 w-full rounded-sm bg-foreground/8" />
          <div className="h-2 w-3/4 rounded-sm bg-foreground/8" />
        </div>

        {/* Amplify block */}
        {state === "empty" ? (
          <div className="rounded-sm border-2 border-dashed border-foreground/15 p-6">
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground">
                Amplify Block
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground/70">
                Promotion content will appear here
              </p>
            </div>
          </div>
        ) : (
          <EmailBlockPreview
            headline={headline}
            body={body}
            cta={cta}
            publisherName={publisherName}
          />
        )}

        {/* More simulated text */}
        <div className="space-y-2">
          <div className="h-2 w-full rounded-sm bg-foreground/8" />
          <div className="h-2 w-2/3 rounded-sm bg-foreground/8" />
        </div>
      </div>

      {/* Email footer */}
      <div className="border-t bg-muted px-5 py-3">
        <div className="h-2 w-36 rounded-sm bg-foreground/5" />
      </div>
    </div>
  )
}
