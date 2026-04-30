# Voyage — Next.js 14 App Router

Static-to-Next.js conversion of the Voyage private transfer marketplace.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Pure CSS** (no Tailwind — design tokens via CSS custom properties)
- **No external UI libraries**

## Getting started

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Structure

```
app/
├── layout.tsx          # Root layout — Nav + Footer wrappers
├── globals.css         # All styles (tokens, components, animations)
├── page.tsx            # Homepage — hero, booking form, services, testimonials
├── results/
│   └── page.tsx        # Driver bid results (reads URL search params)
├── driver/
│   └── page.tsx        # Driver dashboard — earnings, open trips, bid form
├── how-it-works/
│   ├── page.tsx        # Steps, comparison table, FAQ
│   └── FaqListClient.tsx
├── about/
│   └── page.tsx        # Company story, team, values
├── login/
│   └── page.tsx        # Login with OAuth + email/password
└── signup/
    └── page.tsx        # Signup with passenger/driver toggle

components/
├── Nav.tsx             # Sticky nav, mobile burger, scroll shadow
├── Footer.tsx          # Full footer grid
├── BookingForm.tsx     # Booking card — tabs, autocomplete, pax counter
├── Autocomplete.tsx    # Location suggestions with keyboard nav
└── ScrollReveal.tsx    # IntersectionObserver for .animate-up elements
```

## Key patterns

- **Server Components by default** — only interactive pages use `'use client'`
- **URL params** — booking form passes `from/to/date/time/pax` to `/results` via Next.js router
- **No form tags in client components** — uses `onSubmit` on `<form>` with `e.preventDefault()`
- **CSS custom properties** — all design tokens live in `:root` inside `globals.css`
# Voyage
