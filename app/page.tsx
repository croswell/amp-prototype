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
    description: "Incoming promotion requests, revenue dashboard, and directory of advertisers",
    href: "/dashboard?role=publisher",
    icon: Broadcast,
  },
  {
    title: "Advertiser Experience",
    description: "Outgoing promotion requests, curated publisher directory, and campaign tracking",
    href: "/dashboard?role=advertiser",
    icon: Megaphone,
  },
]

export default function PrototypeIndex() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-2 text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Prototype
          </p>
          <h1 className="text-3xl font-medium tracking-tight">
            Kajabi Amplify
          </h1>
          <p className="text-muted-foreground">
            A curated promotion network where Kajabi heroes buy and sell email broadcast promotions.
          </p>
        </div>

        <div className="grid gap-3">
          {experiences.map((exp) => (
            <Link key={exp.href} href={exp.href} className="group">
              <Card size="sm" className="transition-colors group-hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                      <exp.icon className="size-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle>{exp.title}</CardTitle>
                      <CardDescription>{exp.description}</CardDescription>
                    </div>
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
