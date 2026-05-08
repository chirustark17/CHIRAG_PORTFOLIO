# Chirag K S — Portfolio

Personal portfolio for Chirag K S, final-year B.Tech CSE + Data Science. Covers projects, certifications, skills, and a standalone highlight reel.

**Live:** https://chirag-portfolio-two.vercel.app

---

## Stack

- **Framework:** Vite 8.0.4 + React 19.2.4
- **Styling:** Tailwind CSS 4.2.2 via the `@tailwindcss/vite` plugin — no PostCSS config
- **Motion:** Framer Motion 12.38.0
- **Icons:** Lucide React 1.8.0
- **Utilities:** clsx 2.1.1, react-scroll 1.9.3
- **Hosting:** Vercel, production branch `redesign`

---

## Design system

**Palette — five tokens, one accent**

- `ink-950` `#0A0A0B` — near-black background
- `ink-900` `#111113` — body text
- `ink-800` `#1C1C1F` — secondary dark surface
- `bone-50` `#FAFAF7` — light mode surface
- `bone-100` `#F2F1EA` — secondary light surface
- `cyan-400` — the single accent; used for borders, glows, and interactive highlights throughout
- `amber-500` — reserved exclusively for rank and achievement badges; appears nowhere else

**Typography — one face per semantic role**

- `Instrument Serif` — display headings only
- `Inter` — body and UI text
- `JetBrains Mono` — labels, eyebrows, tag chips, monospace data

**Motion language**

No linear easings. Every transition is a Framer Motion spring. The shimmer border on the active Featured Work card — a rotating `conic-gradient` with a separate pulse animation — is the one deliberate exception to the otherwise restricted visual vocabulary; it exists only on the center card and nowhere else in the UI.

Light and dark modes are both supported via a `.dark` class toggle, with `ThemeToggle.jsx` handling the switch.

---

## Architecture

**Separate mobile and desktop component trees**

This project does not use responsive CSS to fork a single component into two layouts. It maintains two fully independent component trees, switched at runtime by a `useIsMobile` hook with a 1024px breakpoint. `App.jsx` renders entirely different components based on that value: `<Hero />` vs `<HeroMobile />`, `<Projects />` vs `<ProjectsMobile />`, `<SelectedWork />` vs `<SelectedWorkMobile />`, and `<ReelDeck />` vs `<ReelDeckMobile />`. Every component in `src/components/mobile/` was written from scratch for touch-first interaction — pointer capture, velocity-based swipe detection, drag-to-advance — rather than being a conditionally-styled variant of its desktop counterpart. The reason: an earlier attempt maintained single components with responsive forks. The interaction models are fundamentally incompatible. Desktop uses hover-tilt effects, auto-advancing interval timers, and mouse-specific events; mobile needs `setPointerCapture`, velocity history windows, and `touchAction: pan-y` declarations to negotiate with the browser's scroll handler. Trying to unify both inside one component created more conditional coupling than the code saved.

**Slot-swap carousel for Featured Work on mobile**

`SelectedWorkMobile.jsx` assigns each card a named slot — `center`, `left`, `right`, `hidden_left`, `hidden_right` — each with fixed transform targets: x offset, rotation, scale, and opacity. When the active index changes, cards remap to new slots and Framer Motion springs them to the new target. This avoids per-frame geometry calculations; the animation system only manages slot assignment. Spring values: stiffness 340, damping 30, mass 0.9. Rotation angles are ±7° for visible side cards, ±14° for the hidden positions — kept small to prevent the swap from reading as exaggerated.

Drag during a gesture sets `panX` (a `useMotionValue`) at 1:1 with the finger delta for tactile feedback, then springs back to zero on release (stiffness 500, damping 30). Swipe registers at 45px displacement or 250px/s velocity, whichever comes first.

**Highlight Reel as a manually-navigated overlay**

The Highlight Reel is a full-screen overlay deck launched from a persistent button. Six slides, driven by `src/data/reel.js`, advance via prev/next controls or keyboard arrow keys. Slides do not auto-advance. An earlier version was a guided auto-tour with timed transitions; it introduced layout thrashing and nondeterministic exit animation states that were difficult to isolate. Manual navigation removed the timing dependency entirely and made the overlay's closed state predictable.

**IntersectionObserver-driven StarkTag positioning**

The "Designed & built by Stark aka CHIRAG" tag uses two observers to pick between three render modes: `hidden`, `floating` (fixed bottom-center), and `parked` (absolutely positioned above the footer border). The contact observer fires at 15% threshold; the footer observer uses `rootMargin: '0px 0px 80px 0px'` to fire 80px before the footer enters the viewport naturally. Two pill copies render simultaneously — one floating, one inside `Footer.jsx` at `position: absolute, top: 0, translateY(-100%)` — and cross-fade at 200ms. This sidesteps runtime positioning math: the visual positions are close enough at transition time that a fast opacity swap reads as a single movement.

**`overflow-x: clip` instead of `overflow-x: hidden`**

Applied at three levels: `html`, `body`, and `#root`. `overflow-x: hidden` creates a new scroll container, which breaks `position: sticky`. `overflow-x: clip` clips painted overflow without establishing a scroll container, so the sticky navbar and other fixed elements continue to work correctly.

**Content-driven, no fetch layer**

All displayed content — projects, skills, certifications, achievements, showcase items, reel slides — lives in flat JS files under `src/data/`. Components import directly or receive data as props. No CMS, no API calls, no build-time data pipeline. A content update is a single file edit.

---

## Project structure

```
src/
├── components/
│   ├── mobile/                 # Mobile-specific components — not responsive variants
│   │   ├── HeroMobile.jsx
│   │   ├── ProjectsMobile.jsx
│   │   ├── ProjectCardMobile.jsx
│   │   ├── FeatureCardMobile.jsx
│   │   ├── SelectedWorkMobile.jsx
│   │   └── ReelDeckMobile.jsx
│   ├── AuroraBackground.jsx
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── ReelButton.jsx
│   ├── ReelDeck.jsx
│   ├── ReelHint.jsx
│   ├── ReelSlideViewport.jsx
│   ├── ReelTransitions.js
│   ├── ScrollToTop.jsx
│   ├── SectionHeading.jsx
│   ├── ShowcaseSlide.jsx
│   ├── StarkTag.jsx
│   └── ThemeToggle.jsx
├── data/
│   ├── achievements.js
│   ├── certifications.js
│   ├── projects.js
│   ├── reel.js
│   ├── showcase.js
│   └── skills.js
├── hooks/
│   ├── useGyroscope.js
│   ├── useIsMobile.js
│   ├── usePrefersReducedMotion.js
│   └── useReelTrigger.js
├── sections/
│   ├── About.jsx
│   ├── Achievements.jsx
│   ├── Certifications.jsx
│   ├── Contact.jsx
│   ├── Hero.jsx
│   ├── NowStrip.jsx
│   ├── Projects.jsx
│   ├── SelectedWork.jsx
│   └── Skills.jsx
├── App.jsx
├── index.css
└── main.jsx

public/
├── favicon.svg
├── icons.svg
└── og-image.png
```

---

## Local development

Node 18 or higher required.

```bash
npm install
npm run dev      # development server at http://localhost:5173
npm run build    # production build to dist/
npm run preview  # serve the dist/ build locally
```

---

## Contact

- Email: chiruchirag2447@gmail.com
- LinkedIn: [linkedin.com/in/chirag-ks](https://www.linkedin.com/in/chirag-ks)
- GitHub: [github.com/chirustark17](https://github.com/chirustark17)

---

The visual design, color decisions, typographic rhythm, and content layout in this project are specific to Chirag K S and are not offered for template reuse or redistribution.
