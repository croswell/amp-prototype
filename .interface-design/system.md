# Kajabi Amplify — Design System

## Direction

Professional, neutral, editorial. A curated marketplace for Kajabi creators. Trust and credibility over flash.

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16 (App Router) | RSC + client components |
| UI Library | React 19 | |
| Language | TypeScript | |
| Styling | Tailwind CSS v4 | `@theme inline` in globals.css |
| Components | shadcn/ui | radix-vega style, neutral base |
| Icons | Phosphor Icons | Via `@phosphor-icons/react` |
| Tables | TanStack React Table | For DataTable component |
| Toasts | Sonner | |

---

## shadcn/ui Configuration

From `components.json`:

```json
{
  "style": "radix-vega",
  "rsc": true,
  "tsx": true,
  "iconLibrary": "phosphor",
  "tailwind": {
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

---

## Tailwind v4 Setup

No `tailwind.config.js`. All theme configuration is in `app/globals.css` using `@theme inline`.

**Import order:**
```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
```

**Dark mode:** Uses `prefers-color-scheme` media query, not a class toggle.
```css
@custom-variant dark (@media (prefers-color-scheme: dark));
```

**Radius collapse:** All radius tokens map to a single value, giving sharp corners throughout:
```css
--radius-sm: var(--radius);
--radius-md: var(--radius);
--radius-lg: var(--radius);
--radius-xl: var(--radius);
--radius-2xl: var(--radius);
--radius-3xl: var(--radius);
--radius-4xl: var(--radius);
```

---

## Color Tokens

All colors use OKLCH. The theme maps shadcn CSS variables to Tailwind color tokens via `@theme inline`.

### Light Mode (`:root`)

| Token | OKLCH Value | Description |
|-------|------------|-------------|
| `--background` | `oklch(0.985 0 0)` | Near-white page background |
| `--foreground` | `oklch(0.145 0 0)` | Near-black primary text |
| `--card` | `oklch(1 0 0)` | Pure white card surface |
| `--card-foreground` | `oklch(0.145 0 0)` | Card text (same as foreground) |
| `--popover` | `oklch(1 0 0)` | White popover surface |
| `--popover-foreground` | `oklch(0.145 0 0)` | Popover text |
| `--primary` | `oklch(0.205 0 0)` | Near-black for primary buttons |
| `--primary-foreground` | `oklch(0.985 0 0)` | White text on primary |
| `--secondary` | `oklch(0.97 0 0)` | Very light gray surface |
| `--secondary-foreground` | `oklch(0.205 0 0)` | Dark text on secondary |
| `--muted` | `oklch(0.97 0 0)` | Light gray for muted areas |
| `--muted-foreground` | `oklch(0.556 0 0)` | Medium gray secondary text |
| `--accent` | `oklch(0.97 0 0)` | Accent surface (same as muted) |
| `--accent-foreground` | `oklch(0.205 0 0)` | Dark text on accent |
| `--destructive` | `oklch(0.58 0.22 27)` | Red for errors/destructive |
| `--border` | `oklch(0.922 0 0)` | Light gray border |
| `--input` | `oklch(0.922 0 0)` | Input border (same as border) |
| `--ring` | `oklch(0.708 0 0)` | Focus ring, medium gray |
| `--chart-1` | `oklch(0.809 0.105 251.813)` | Light blue |
| `--chart-2` | `oklch(0.623 0.214 259.815)` | Medium blue-purple |
| `--chart-3` | `oklch(0.546 0.245 262.881)` | Blue-purple |
| `--chart-4` | `oklch(0.488 0.243 264.376)` | Deep blue-purple |
| `--chart-5` | `oklch(0.424 0.199 265.638)` | Dark blue-purple |

### Dark Mode (`@media (prefers-color-scheme: dark)`)

| Token | OKLCH Value | Description |
|-------|------------|-------------|
| `--background` | `oklch(0 0 0)` | Pure black background |
| `--foreground` | `oklch(0.985 0 0)` | Near-white text |
| `--card` | `oklch(0.145 0 0)` | Very dark gray surface |
| `--card-foreground` | `oklch(0.985 0 0)` | Light text on cards |
| `--popover` | `oklch(0.205 0 0)` | Dark gray popover |
| `--popover-foreground` | `oklch(0.985 0 0)` | Light text on popover |
| `--primary` | `oklch(0.87 0 0)` | Light gray for primary buttons |
| `--primary-foreground` | `oklch(0.205 0 0)` | Dark text on primary |
| `--secondary` | `oklch(0.269 0 0)` | Dark gray surface |
| `--secondary-foreground` | `oklch(0.985 0 0)` | Light text on secondary |
| `--muted` | `oklch(0.269 0 0)` | Dark gray muted areas |
| `--muted-foreground` | `oklch(0.708 0 0)` | Medium gray secondary text |
| `--accent` | `oklch(0.371 0 0)` | Medium-dark gray accent |
| `--accent-foreground` | `oklch(0.985 0 0)` | Light text on accent |
| `--destructive` | `oklch(0.704 0.191 22.216)` | Lighter red for dark mode |
| `--border` | `oklch(1 0 0 / 10%)` | White at 10% opacity |
| `--input` | `oklch(1 0 0 / 15%)` | White at 15% opacity |
| `--ring` | `oklch(0.556 0 0)` | Darker focus ring |
| `--chart-1–5` | Same as light mode | Chart colors shared across modes |

### Semantic Colors (via Tailwind utilities, not CSS variables)

| Key | Purpose | Light | Dark |
|-----|---------|-------|------|
| `emerald` | Success / Locked copy | `emerald-100/700` | `emerald-950/300` |
| `amber` | Pending / Warning | `amber-100/700` | `amber-950/300` |
| `indigo` | Pending (outgoing) | `indigo-100/700` | `indigo-950/300` |
| `yellow` | In Review | `yellow-100/700` | `yellow-950/300` |
| `blue` | Info / Scheduled | `blue-100/700` | `blue-950/300` |
| `zinc` | Neutral / Expired | `zinc-100/600` | `zinc-800/400` |

These are applied via the `COLOR_PAIRS` constant in `lib/mock-data.ts` for consistent badge styling.

---

## Radius

```css
--radius: 0.125rem;
```

All radius tokens (`--radius-sm` through `--radius-4xl`) collapse to this single value. The result is sharp, nearly-square corners throughout the entire UI. This is intentional — it gives the interface an editorial, structured feel.

---

## Typography

### Fonts

| Token | Font | Usage |
|-------|------|-------|
| `--font-sans` | Inter | All UI text |
| `--font-geist-mono` | Geist Mono | Code, monospace contexts |

Fonts are loaded via `next/font/google` (Inter) and `next/font/local` (Geist Mono) in `app/layout.tsx`.

### Type Scale

| Context | Classes | Example |
|---------|---------|---------|
| Page titles | `text-2xl font-medium tracking-tight` or `text-3xl` | Dashboard greeting |
| Section headings | `text-lg font-medium` | "Recent Activity" |
| Body text | `text-sm` (default) | Card descriptions, form labels |
| Supporting text | `text-xs text-muted-foreground` | Timestamps, metadata |
| Data / numbers | `text-2xl font-medium tabular-nums` | Stat card values |
| Small data | `text-sm tabular-nums` | Table cells with numbers |

### Conventions

- `tracking-tight` on headings only
- `tabular-nums` on any numerical display (stats, payouts, rates)
- `font-medium` for emphasis — `font-bold` is rarely used
- `text-muted-foreground` for all secondary/supporting text

---

## Dark Mode

Controlled by `prefers-color-scheme` — no manual toggle. The system respects the user's OS setting.

**Logo handling:** The logo switches to a white version in dark mode. `app-nav.tsx` uses separate image sources:
- Light mode: `amplify-logo-black.svg` / `amplify-icon-black.svg`
- Dark mode: `amplify-logo-white.svg` / `amplify-icon-white.svg`

Toggled with Tailwind's `dark:hidden` / `dark:block` utilities.

**Surface strategy:** Dark mode inverts the neutral scale — backgrounds go black, cards go very dark gray, text goes near-white. The border token changes from a solid light gray to `oklch(1 0 0 / 10%)` (white at 10% opacity) for a subtle effect.

---

## Depth

Minimal. The visual hierarchy comes from color contrast and spacing, not shadows.

- **Cards:** `shadow-xs` (shadcn default) + `ring-1 ring-foreground/10`
- **Everything else:** No shadows
- **Borders:** Used liberally for structure — `border-border` applied globally via base layer

---

## Surfaces

| Surface | Token | Usage |
|---------|-------|-------|
| Page background | `bg-background` | White / black |
| Cards | `bg-card` | White / very dark gray |
| Muted sections | `bg-muted` | Light gray / dark gray |
| Email mockups | `bg-muted` | Simulates email canvas |
| Popovers | `bg-popover` | Dropdown menus, dialogs |
| Inputs | Default border treatment | `bg-transparent` with `border-input` |

---

## Component Inventory

### shadcn/ui Primitives (`components/ui/`)

**Layout & Structure:**
- `card.tsx` — Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
- `separator.tsx` — Horizontal/vertical divider
- `skeleton.tsx` — Loading placeholder

**Forms & Inputs:**
- `button.tsx` — Button with variants (default, destructive, outline, secondary, ghost, link)
- `input.tsx` — Text input
- `textarea.tsx` — Multi-line text input
- `label.tsx` — Form label
- `field.tsx` — Field wrapper (label + input + description + error)
- `input-group.tsx` — Input with prefix/suffix addons
- `select.tsx` — Native select dropdown
- `combobox.tsx` — Searchable select (used for niche categories)
- `toggle.tsx` — Toggle button
- `toggle-group.tsx` — Grouped toggle buttons (used for frequency selector)

**Data Display:**
- `table.tsx` — Table, TableHeader, TableBody, TableRow, TableHead, TableCell
- `data-table.tsx` — TanStack React Table wrapper with sorting, pagination
- `badge.tsx` — Inline label with color variants
- `avatar.tsx` — Image with fallback initials
- `progress.tsx` — Progress bar (used in onboarding)
- `tooltip.tsx` — Hover tooltip

**Overlays:**
- `dialog.tsx` — Modal dialog
- `alert-dialog.tsx` — Confirmation dialog (used for decline action)
- `sheet.tsx` — Slide-out panel
- `dropdown-menu.tsx` — Context menu (used for user menu)

**Navigation:**
- `tabs.tsx` — Tab group with panels

### Custom Domain Components (`components/`)

**Navigation:**
- `app-nav.tsx` — Top nav bar + mobile bottom tabs + role switcher

**Creator Profiles:**
- `hero-card.tsx` — Profile preview card + `HeroIdentity` sub-component
- `sponsor-card.tsx` — Sponsor card with accept/dismiss actions
- `engagement-badge.tsx` — "High engagement" amber badge
- `social-icon.tsx` — Maps platform names to Phosphor icons

**Promotion Workflow:**
- `request-action-card.tsx` — Context-aware action buttons by status + role
- `request-sidebar.tsx` — Other-party info panel in request detail
- `timeline-event.tsx` — Full timeline system (rich events, simple events, copy diff, inline editing)
- `email-block-preview.tsx` — Ad unit preview simulating newsletter context
- `payout-badge.tsx` — Formatted dollar amount with optional suffix

**Dashboard:**
- `stat-card.tsx` — Single metric card (label + value)
- `revenue-calculator.tsx` — Interactive earnings projector with frequency toggle

**Layout:**
- `page-header.tsx` — Page title + description with bottom separator

---

## Layout Patterns

### App Shell

Top nav + centered content. No sidebar.

```
┌─────────────────────────────────────┐
│  [Logo]   Home  Promos  Settings  👤 │  ← AppNav (sticky top)
├─────────────────────────────────────┤
│                                     │
│     ┌───────────────────────┐       │
│     │   Page Content         │       │  ← max-w-6xl mx-auto
│     │   (centered)           │       │
│     └───────────────────────┘       │
│                                     │
└─────────────────────────────────────┘
        [Home] [Promos] [Settings]      ← Mobile bottom tabs
```

### Content Padding

- Desktop: `px-6` on the content wrapper
- Mobile: `px-4`
- Max width: `max-w-6xl` centered

### Responsive Strategy

| Breakpoint | Behavior |
|-----------|----------|
| `< sm` (mobile) | Bottom tab bar, stacked cards, select dropdowns for tabs |
| `≥ sm` (desktop) | Top nav links, tables, sidebar tabs, two-column layouts |

---

## Navigation Patterns

### URL State Management

All user context is carried in query parameters. No global state store.

| Parameter | Purpose |
|-----------|---------|
| `?role=` | Demo persona (publisher, sponsor, both) |
| `?view=` | View override for dual-role users |
| `?tab=` | Active tab in tabbed sections |
| `?new=true` | Post-onboarding flag |

### buildPersonaParams()

Every internal `<Link>` uses this utility to preserve role context:

```typescript
// lib/utils.ts
buildPersonaParams(persona: string, view: string | null, role: string): string
// Returns: "?role=publisher" or "?role=both&view=sponsor"
```

Components read params via `useSearchParams()`, compute the effective view role, then pass the params to child links. This keeps the demo persona consistent across the entire session without a global store.

---

## Spacing

4px base (Tailwind default).

| Context | Value | Tailwind |
|---------|-------|----------|
| Card padding | 24px | `p-6` |
| Section gaps | 24px | `gap-6` |
| Within groups | 16px | `gap-4` |
| Tight groups | 8px | `gap-2` |
| Page header bottom | 24px | `pb-6` (with separator) |

---

## Signature Element

**Email Block Preview** — A miniature email template showing the Amplify ad unit in context. Rendered by `EmailBlockPreview` component.

Appears in:
- Onboarding (publisher profile preview, sponsor campaign preview)
- Home page (recommendation dialog)
- Profile pages (sample promotion)
- Request detail (timeline proposal events)
- Settings (campaign tab live preview)

Visual treatment: `bg-muted` container with border, simulating an email canvas. Contains headline, body text, and a button-styled CTA.
