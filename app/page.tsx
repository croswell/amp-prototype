import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Broadcast,
  CaretRight,
  Megaphone,
  Rocket,
} from "@phosphor-icons/react/dist/ssr"

const experiences = [
  {
    title: "Onboarding Flow",
    description: "New user setup — role selection, profile, and the revenue \"aha\" moment",
    href: "/onboarding",
    icon: Rocket,
  },
  {
    title: "Publisher Experience",
    description: "Incoming promotion requests, revenue dashboard, and directory of sponsors",
    href: "/dashboard?role=publisher",
    icon: Broadcast,
  },
  {
    title: "Sponsor Experience",
    description: "Outgoing promotion requests, curated publisher directory, and campaign tracking",
    href: "/dashboard?role=sponsor",
    icon: Megaphone,
  },
]

export default function PrototypeIndex() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="inline-block rounded-sm border border-dashed border-amber-300 bg-amber-50 px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-widest text-amber-600">
            Prototype
          </span>
          <h1 className="text-3xl font-medium tracking-tight">
            Kajabi Amplify
          </h1>
        </div>

        <div className="grid gap-3">
          {experiences.map((exp) => (
            <Link key={exp.href} href={exp.href} className="group">
              <Card size="sm" className="transition-colors group-hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-neutral-200 dark:bg-neutral-700">
                      <exp.icon className="size-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <CardTitle>{exp.title}</CardTitle>
                      <CardDescription>{exp.description}</CardDescription>
                    </div>
                    <CaretRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
