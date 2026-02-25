import { Suspense } from "react"
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Suspense>
        <AppSidebar />
      </Suspense>
      <SidebarInset>
        <header className="flex h-14 items-center gap-3 border-b px-4 md:hidden">
          <SidebarTrigger />
          <img src="/icon-black.svg" alt="Amplify" className="size-6 rounded-sm" />
          <span className="text-sm font-medium">Amplify</span>
        </header>
        <main className="mx-auto w-full max-w-6xl px-6 pt-6 pb-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
