# VÉLORA — Hotels & Resorts

A premium, multi-page hotel & resort website built as a modern, responsive,
animation-rich single-page application. Created for the Creative Front-End &
UI/UX practical assessment.

**Live experience:** an editorial luxury-hospitality brand — cinematic hero,
world-atlas destination explorer, room comparison, a six-step booking flow,
experience builder, and a personalised post-booking journey.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** (fast dev server & optimized production build)
- **Tailwind CSS v4** (`@tailwindcss/vite`, design tokens via `@theme`)
- Pure-CSS animations, transitions & micro-interactions (no runtime animation library)

## Pages

1. **Home** — cinematic video hero, destination grid, featured stays carousel, the VÉLORA Way, signature section, curated offers, quick-booking CTA
2. **Destinations** — filterable world-atlas map with interactive pins, editorial region grid, detail drawer
3. **Stays** — property selector, live availability search, room cards, room compare, detail modal/bottom-sheet
4. **Experiences** — filterable experience grid + "Build Your Journey" itinerary
5. **Offers** — curated offers + a 6-step booking engine (destination → dates → guests → room → extras → review) with a live price summary
6. **Journey** — post-reservation confirmation & personal timeline

## Highlights

- Fully responsive (desktop / tablet / mobile) with mobile bottom sheets & sticky CTAs
- Smooth animations: scroll reveals, image mask reveals, page-curtain transitions, custom cursor, Ken-Burns hero, staggered hero text
- Reusable components (Navbar, Footer, BottomSheet, Icons, ConciergeModal) and a shared currency context (7 currencies)
- Accessibility: reduced-motion support, ARIA roles/labels, keyboard-dismissable modals, thumb-friendly tap targets
- Clean, typed, well-structured code

## Getting Started

```bash
npm install
npm run dev      # start dev server → http://localhost:5173
```

## Build

```bash
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
```

## Project Structure

```
src/
  App.tsx              # shell: routing state, cursor, curtain, scroll reveals
  main.tsx
  index.css            # design tokens + all animation utilities
  data.ts              # destinations, properties, rooms, experiences, offers
  types.ts
  context/Currency.tsx # currency provider + formatter
  components/          # Navbar, Footer, BottomSheet, ConciergeModal, Icons, LoadingScreen
  pages/               # Home, Destinations, Stays, Experiences, Offers, Journey
  imports/             # hero video asset
```

## Notes

The hero uses a local video with a graceful image fallback (it degrades to a
still if the video can't play). Destination/room/offer photography is served
from Unsplash.
