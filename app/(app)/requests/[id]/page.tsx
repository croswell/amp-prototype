import { Suspense } from "react"
import { RequestDetailContent } from "./request-detail-content"

export default function RequestDetailPage() {
  return (
    <Suspense>
      <RequestDetailContent />
    </Suspense>
  )
}
