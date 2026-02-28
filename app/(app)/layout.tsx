import { Suspense } from "react"
import { AppNav } from "@/components/app-nav"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <AppNav />
      </Suspense>
      <main className="mx-auto w-full max-w-6xl px-6 pt-6 pb-24 sm:pt-10 sm:pb-12">
        {children}
      </main>
    </>
  )
}
