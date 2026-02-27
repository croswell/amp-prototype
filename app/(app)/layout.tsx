import { Suspense } from "react"
import { AppNav } from "@/components/app-nav"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <AppNav />
      </Suspense>
      <main className="mx-auto w-full max-w-6xl px-6 pt-10 pb-12">
        {children}
      </main>
    </>
  )
}
