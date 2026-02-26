import { Check } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { type WorkspaceStep } from "@/lib/mock-data"

const STEPS: { key: WorkspaceStep; label: string }[] = [
  { key: "edit", label: "Edit Copy" },
  { key: "in-review", label: "Review" },
  { key: "approved", label: "Schedule" },
  { key: "scheduled", label: "Publish" },
]

// Maps each step to its position in the linear flow
const STEP_ORDER: Record<WorkspaceStep, number> = {
  edit: 0,
  "in-review": 1,
  "changes-requested": 1, // treat same position as in-review
  approved: 2,
  scheduled: 3,
}

interface WorkspaceStepIndicatorProps {
  currentStep: WorkspaceStep
}

export function WorkspaceStepIndicator({ currentStep }: WorkspaceStepIndicatorProps) {
  const currentIndex = STEP_ORDER[currentStep]

  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, i) => {
        const isCompleted = i < currentIndex
        const isCurrent = i === currentIndex

        return (
          <div key={step.key} className="flex items-center gap-1">
            {/* Step dot */}
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-medium transition-colors",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check weight="bold" className="size-3" />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs whitespace-nowrap",
                  isCurrent ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line (not after last step) */}
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px w-6 shrink-0",
                  i < currentIndex ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
