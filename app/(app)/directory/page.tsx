import { Suspense } from "react"
import { DirectoryContent } from "./directory-content"

export default function DirectoryPage() {
  return (
    <Suspense>
      <DirectoryContent />
    </Suspense>
  )
}
