import Link from "next/link"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh">
      <div className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
          <Link href="/" className="text-sm font-medium tracking-tight">
            Amplify
          </Link>
        </div>
      </div>
      {children}
    </div>
  )
}
