import { Suspense } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Suspense>
        <AppSidebar />
      </Suspense>
      <SidebarInset>
        <main className="mx-auto w-full max-w-6xl px-6 pt-6 pb-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
