# Kajabi Amplify — Design System

## Direction
Professional, neutral, editorial. A curated marketplace for Kajabi creators. Trust and credibility over flash.

## Palette
Existing shadcn neutral oklch theme. No custom brand colors.
- **Surfaces:** background/card (white), muted (light gray) for section backgrounds
- **Text hierarchy:** foreground (primary), muted-foreground (secondary/supporting)
- **Accents:** chart-1 through chart-5 (blue/purple range) for data visualization and key metrics
- **Semantic:** emerald for success/locked, amber for pending/warning, blue for info, red/destructive for errors
- **Borders:** border token (oklch 0.922) — low contrast, quiet structure

## Depth
Borders only. Cards use `ring-1 ring-foreground/10` (existing card pattern). No shadows except card default `shadow-xs`. Sharp corners throughout (`--radius: 0`).

## Surfaces
- Base: `bg-background` (white)
- Sections: `bg-muted` (light gray) for contrast areas
- Cards: `bg-card` with ring border
- Inputs: default theme treatment
- Email mockups: `bg-muted` to simulate email canvas

## Typography
Inter (--font-sans). Already configured.
- Headlines: text-2xl/3xl font-medium tracking-tight
- Section heads: text-lg font-medium
- Body: text-sm (default)
- Labels/metadata: text-xs text-muted-foreground
- Data/numbers: tabular-nums font-medium

## Spacing
4px base (Tailwind default). Components use p-6 (cards), gap-6 (sections), gap-4 (within groups).

## Signature Element
Email block preview — a miniature email template showing the Amplify ad unit in context. Appears in onboarding, directory profiles, and request flow. Uses muted background with border to simulate email canvas.

## Navigation
Top nav only (no sidebar). Lightweight marketplace feel.

## Component Patterns
- Cards: shadcn Card with default styling
- Badges: shadcn Badge for verticals, engagement tiers, status
- Buttons: shadcn Button, `asChild` with Link for navigation
- Avatars: shadcn Avatar with fallback initials
- Tabs: shadcn Tabs for view switching
