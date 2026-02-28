# Kajabi Amplify — Prototype

A UI/UX prototype for Amplify, a creator promotion network built into Kajabi. Publishers monetize their email newsletters with sponsored content; sponsors reach new audiences through trusted creators.

**Linear issue:** [FLEX-1065](https://linear.app/kajabi/issue/FLEX-1065)

---

## Running Locally

```bash
pnpm install
pnpm dev
```

Opens at `http://localhost:3000`.

---

## Entry Points

The root page (`/`) shows four demo cards:

| Card | Description |
|------|-------------|
| **Onboarding Flow** | Multi-step account setup (sign-in → profile → role → path-specific setup) |
| **Publisher Experience** | Dashboard, incoming requests, copy editing, newsletter workflow |
| **Sponsor Experience** | Dashboard, outgoing requests, copy review, campaign management |
| **Both Roles** | Dual-role user with a perspective switcher in the nav |

---

## Documentation

| Document | Contents |
|----------|----------|
| [Architecture](./architecture.md) | Tech stack, project structure, routing, data model, state management, status flow diagram, helper functions |
| [Features](./features.md) | Walkthrough of every feature in user-experience order |
| [Design System](../.interface-design/system.md) | Color tokens, typography, components, layout patterns, navigation patterns |

---

## Tech Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Phosphor Icons

All data is mocked in-memory (`lib/mock-data.ts`). No backend, no database, no API calls.
