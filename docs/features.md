# Features

A walkthrough of every feature in the prototype, in the order a user would encounter them.

---

## 1. Prototype Index

**Route:** `/`

The landing page for the prototype itself (not part of the product UI). Four cards link to different demo personas:

| Card | Links to | Role |
|------|---------|------|
| Onboarding Flow | `/onboarding` | New user |
| Publisher Experience | `/home?role=publisher` | Publisher |
| Sponsor Experience | `/home?role=sponsor` | Sponsor |
| Both Roles | `/home?role=both` | Dual-role user |

Each card has a Phosphor icon and brief description. The page uses responsive logo variants — full logo on desktop, icon on mobile, with dark mode alternatives.

---

## 2. Onboarding

**Route:** `/onboarding`

A linear, multi-step flow that simulates account setup. Uses its own layout (no app nav). A segmented progress bar at the top fills as the user advances.

### Steps (shared)

1. **Kajabi Sign-in** — Simulated login screen with email/password fields. Clicking "Sign In" advances.
2. **Connecting** — A 2-second spinner simulating account sync. Auto-advances.
3. **Edit Profile** — Pre-filled from "Kajabi" (name, bio, niche selector). The niche uses a combobox with all `Vertical` options.
4. **Role Selection** — Choose Publisher, Sponsor, or Both. Determines remaining steps.

### Publisher Path

5. **Revenue Reveal** — An interactive `RevenueCalculator` showing projected earnings. The user sets their audience size and per-send fee, then picks a frequency (1/mo, 2/mo, 4/mo). Monthly and yearly projections update live.
6. **Profile Preview** — Shows how their publisher profile will appear to sponsors, including an `EmailBlockPreview` of the ad unit.

### Sponsor Path

5. **Create Campaign** — Form for campaign name, ad headline, body, CTA text, and CTA URL. Also sets budget per 1k subscribers and max budget.
6. **Campaign Preview** — Shows the `EmailBlockPreview` with the ad copy they just entered, plus a budget summary.

Both paths end with a "Go to Dashboard" button that navigates to `/home?role=<role>&new=true`.

---

## 3. Home / Dashboard

**Route:** `/home`

The main landing page after onboarding. Content adapts based on the active role.

### Greeting

Time-of-day greeting ("Good morning/afternoon/evening") with the user's first name.

### New Account Callout

When `?new=true` is in the URL, a prominent card appears asking the user to connect Stripe for payouts. Shows a Stripe-branded button. This simulates the post-onboarding setup step.

### Stat Cards

Four metrics displayed in a responsive grid. Different stats per role:

**Publisher view:**
| Stat | Example |
|------|---------|
| Audience | 38,000 |
| Ad Revenue | $12,500 |
| Active Promotions | 5 |
| Completed | 20 |

**Sponsor view:**
| Stat | Example |
|------|---------|
| Ad Spend | $8,200 |
| Active Promotions | 3 |
| Completed | 12 |
| Pending Approvals | 2 |

### Recent Activity

Shows the 3 most recent open promotion requests as a list. Each row links to the request detail page. Only shows requests relevant to the active view role.

### Recommended Heroes

A grid of `HeroCard` components showing creators the user might want to work with:
- **Publishers see** recommended sponsors (with budget stats)
- **Sponsors see** recommended publishers (with audience stats)

Clicking a card opens a profile dialog with:
- Full profile info (avatar, name, tagline, bio, niche, links)
- Audience/budget stats
- An `EmailBlockPreview` showing what their ad would look like
- Action buttons ("Send Request" or "Accept & Set Up")

The dialog also supports sending a proposal — a form with a brief, proposed fee, and ad copy fields.

### Discovery Section

Below recommendations, a section prompts users to "Discover More" creators in the marketplace.

---

## 4. Promotions / Requests

### Request List

**Route:** `/requests`

A tabbed view of all promotion requests. Tabs filter by status group:

| Tab | Includes | Description |
|-----|----------|-------------|
| In Progress | pending, in_review, accepted | Active negotiations and approved requests |
| Scheduled | scheduled | Promotions with a broadcast date |
| Published | published | Completed promotions |
| Declined | declined, expired | Closed requests |

The default tab is the first one that has items.

**Desktop:** Each tab shows a `DataTable` (TanStack React Table) with columns:
- Sponsor or Publisher name (with avatar) — depends on viewer role
- Campaign name
- Status badge (color-coded, direction-aware)
- Payout estimate
- Action link → request detail

**Mobile:** Stacked cards grouped by status, with key info (name, campaign, status, payout) in a compact layout.

The tab state syncs to the URL via `?tab=` so it persists on refresh.

### Request Detail

**Route:** `/requests/[id]`

The most complex page in the prototype. Shows the full negotiation workflow for a single promotion request.

#### Header

- Ad headline as the page title
- Status badge
- Sponsor → Publisher flow indicator (avatars with arrow)
- Back link to request list

#### Layout

- **Desktop:** Two columns — timeline on the left, sidebar on the right
- **Mobile:** Tabs switching between Timeline, Details, and Actions

#### Timeline

A chronological event log showing the full history of the request. Two event styles:

**Rich events** (displayed as cards with full content):
- `proposal_sent` — Shows the original brief, ad copy preview, and proposed fee
- `copy_suggested` — Shows a copy diff (before/after) with the editor's changes highlighted
- `revision_requested` — Shows the revision note and the copy that was rejected

**Simple events** (displayed as inline text with icon):
- `accepted`, `declined`, `copy_locked`, `broadcast_created`, `scheduled`, `published`, `expired`

Each event shows the actor's avatar, name, timestamp, and role-specific context.

#### Copy Editing Workflow

This is the core workflow innovation in the prototype:

1. **Publisher suggests edits** — An inline editor appears at the bottom of the timeline. The publisher can modify headline, body, CTA text, and CTA URL. Submitting creates a `copy_suggested` event.
2. **Sponsor reviews** — The sponsor sees a diff view (previous version collapsed, new version prominent). They can either:
   - **Approve** — Locks the copy (`copy_locked` event), advances to `accepted`
   - **Request revision** — Opens a form for revision notes, creates a `revision_requested` event
3. **Revision rounds** — Steps 1-2 repeat. The `revisionRound` counter tracks how many rounds have occurred. `whoseTurn` flips between parties.

The `deriveRequestState()` function walks the timeline to compute the current state of this workflow.

#### Action Card

A context-aware panel that shows different buttons depending on:
- The request's current status
- Whose turn it is (`whoseTurn`)
- Whether the viewer is the publisher or sponsor

| Status | Publisher Actions | Sponsor Actions |
|--------|------------------|-----------------|
| pending (their turn) | Accept / Suggest Changes / Decline | — (waiting) |
| pending (sponsor's turn) | — (waiting) | Accept / Request Changes / Decline |
| in_review (publisher's turn) | Edit Copy / Decline | — (waiting) |
| in_review (sponsor's turn) | — (waiting) | Approve Copy / Request Revision |
| accepted | Create Broadcast | — (waiting) |
| scheduled | View Broadcast | — |
| published | Stats (opens, clicks, subs) | Stats |
| declined / expired | Read-only message | Read-only message |

#### Sidebar

Shows the other party's profile info:
- Avatar, name, role
- Bio excerpt
- Niche category badge
- Website and social links

#### Payout Breakdown

Displayed in the action card area. Shows:
- Rate per 1k subscribers
- Publisher audience size
- Calculated payout amount
- Whether payout is capped at sponsor's max budget

---

## 5. Profiles

**Route:** `/profile/[id]`

Full-page profile view for any hero. Layout differs based on who you're viewing:

### Publisher Profile (viewed by sponsors)

Full-width layout with:
- Large avatar, name, tagline, niche badge
- Bio section
- Audience stats (subscribers, open rate, click rate, engagement tier)
- Promotions completed count and rating
- Website and social links
- Sample `EmailBlockPreview` showing what a promotion would look like in their newsletter
- "Send Request" CTA button

### Sponsor Profile (viewed by publishers)

More compact layout with:
- Avatar, name, tagline, niche badge
- Bio
- Budget info (per-send budget, max budget)
- Campaign preview (`EmailBlockPreview`)
- "Set Up & Accept" CTA button

---

## 6. Settings

**Route:** `/settings`

Settings page with vertical tab navigation.

**Desktop:** Sidebar tabs on the left, content on the right.
**Mobile:** A `<Select>` dropdown replaces the tab sidebar.

### Profile Tab

- Name, tagline, bio (textarea)
- Niche category (combobox)
- Website URL
- Social links (Twitter, Instagram, LinkedIn)
- Change detection — Save button disabled until edits are made

### Pricing Tab (Publisher only)

- Audience size input
- Per-send fee input
- Visible only when the active role includes publisher

### Ad Campaign Tab (Sponsor only)

- Campaign headline, body, CTA text, CTA URL
- Budget per 1k subscribers, max budget
- Live `EmailBlockPreview` showing the campaign as you edit
- Visible only when the active role includes sponsor

### Account Tab

- Email address (read-only)
- Member since date
- Sign out button

Each tab section tracks changes independently — the Save button only enables when that section has been modified.

---

## 7. Navigation

### Top Navigation Bar

Present on all `(app)` routes. Contains:
- **Logo** — Icon on mobile, full wordmark on desktop. White version in dark mode.
- **Nav links** — Home, Promotions, Settings. Hidden on mobile (replaced by bottom tabs).
- **User menu** — Dropdown with avatar. If `role=both`, includes a role switcher (Publisher View / Sponsor View) that toggles the `?view=` param.

### Mobile Bottom Tabs

A fixed bottom tab bar visible only on small screens (`sm` breakpoint and below). Shows:
- Home (House icon)
- Promotions (Megaphone icon)
- Settings (Gear icon)

Active state uses a filled icon weight. The bottom bar is hidden on request detail pages (`/requests/[id]`) to maximize content space.

### Link Behavior

All internal links preserve the current persona context by appending `?role=...&view=...` via `buildPersonaParams()`. This means navigating between pages never loses your demo role.

---

## 8. URL State

The prototype relies heavily on URL query parameters instead of a global state store. This makes every state shareable via URL and keeps the architecture simple.

### Parameters

| Parameter | Values | Used on | Purpose |
|-----------|--------|---------|---------|
| `role` | `publisher`, `sponsor`, `both` | All `(app)` pages | Which demo persona is active |
| `view` | `publisher`, `sponsor` | All `(app)` pages | View override when `role=both` |
| `tab` | `open`, `scheduled`, `published`, `declined` | `/requests` | Active filter tab |
| `tab` | `profile`, `pricing`, `campaign`, `account` | `/settings` | Active settings section |
| `new` | `true` | `/home` | Shows Stripe onboarding callout |

### How Role Resolution Works

1. `role` param sets the demo persona (publisher, sponsor, or both)
2. If `role=both`, the `view` param determines which perspective to show
3. If `role=both` and no `view` is set, defaults to publisher view
4. `getActiveViewRole(role, view)` resolves to a single `"publisher"` or `"sponsor"` for rendering
5. All links call `buildPersonaParams()` to carry this context forward

### Example URLs

```
/home?role=publisher              → Publisher dashboard
/home?role=both&view=sponsor      → Dual-role user, sponsor view
/requests?role=sponsor&tab=open   → Sponsor's in-progress requests
/requests/req-1?role=both&view=publisher → Request detail, publisher perspective
/home?role=publisher&new=true     → Post-onboarding dashboard with Stripe callout
```
