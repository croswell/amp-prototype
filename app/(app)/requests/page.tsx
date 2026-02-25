import { Suspense } from "react"
import { RequestsContent } from "./requests-content"

export default function RequestsPage() {
  return (
    <Suspense>
      <RequestsContent />
    </Suspense>
  )
}
