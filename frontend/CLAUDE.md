# Frontend — Development Guidelines

This is a **Vite + React 18 + TypeScript + Tailwind CSS 3** app. Follow the rules below for every change.

> ⚙️ **Environment constraint:** This machine runs **Node 16**. Dependencies are intentionally pinned (Vite 4, Tailwind 3, React 18). Do **not** upgrade to versions requiring Node 18+/20+ (Vite 5+, Tailwind 4) unless Node is upgraded first, and never run `npm audit fix --force`.

## Component Architecture — build granular, reusable components

- **Keep components small and single-purpose.** One component does one thing. If a component grows past ~150 lines or handles multiple concerns, split it.
- **Compose, don't duplicate.** Build small primitives (`Button`, `Input`, `Card`, `Avatar`, `Badge`) and assemble larger features from them. Never copy-paste markup — extract a shared component instead.
- **Organize by reuse scope:**
  - `src/components/ui/` — generic, app-agnostic primitives (buttons, inputs, modals).
  - `src/components/` — feature/domain components composed from primitives.
  - Co-locate a component's files (`Button.tsx`, plus any local helpers) in one folder when they grow.
- **Typed, documented props.** Every component has an explicit `Props` interface. Prefer a small number of well-named props over boolean soup. Provide sensible defaults.
- **Forward refs and spread native props** on interactive primitives (e.g. `...rest` onto the underlying `<button>`/`<input>`) so components stay flexible and composable.
- **Keep components presentational where possible.** Push data-fetching and state up; pass data down via props. This keeps components reusable and testable.
- **No magic values.** Extract shared constants, variants, and Tailwind class sets rather than hardcoding them inline repeatedly.

## Accessibility (a11y) — non-negotiable

- **Use semantic HTML first.** Reach for `<button>`, `<a>`, `<nav>`, `<main>`, `<header>`, `<ul>`/`<li>`, `<label>` before adding a `<div>` with a role. A `div` is never a button.
- **Every interactive element is keyboard-operable.** Focusable, activated with Enter/Space, and in a logical tab order. Never remove focus outlines without providing a visible `focus-visible` alternative.
- **Label everything.** Inputs have associated `<label>`s (or `aria-label`). Icon-only buttons have `aria-label`. Images have meaningful `alt` (empty `alt=""` for decorative images).
- **Use ARIA only to fill gaps** semantic HTML can't cover (e.g. `aria-expanded`, `aria-controls`, `aria-live` for dynamic updates, `role="dialog"` + focus trap for modals). Don't add redundant roles.
- **Respect color contrast** (WCAG AA: 4.5:1 for text). Never convey meaning by color alone — pair it with text or an icon.
- **Manage focus** on route changes and when opening/closing overlays. Restore focus to the trigger when a modal closes.
- **Honor user preferences** like `prefers-reduced-motion` for animations.

## Responsiveness — mobile-first, always

- **Design mobile-first.** Write base styles for small screens, then layer breakpoints up (`sm:`, `md:`, `lg:`, `xl:`). Avoid desktop-only assumptions.
- **Fluid layouts.** Prefer Flexbox/Grid with `flex-wrap`, `gap`, `min-w-0`, and relative units over fixed pixel widths. Let content reflow.
- **Test across breakpoints** — verify layouts hold at ~375px (mobile), ~768px (tablet), and ≥1024px (desktop) with no horizontal overflow.
- **Responsive typography and spacing** via Tailwind's scale (e.g. `text-base md:text-lg`). Keep tap targets at least ~44×44px on touch.
- **Images/media** use `max-w-full`, `h-auto`, and appropriate `object-fit`. Wide content (tables, code) scrolls inside its own container, never the page body.

## Styling conventions

- **Tailwind utilities are the default.** Avoid custom CSS unless a utility genuinely can't express it; put shared tokens in `tailwind.config.js` (`theme.extend`) rather than scattering arbitrary values.
- **Keep class lists readable.** For components with conditional/variant classes, group them into a small helper (e.g. a variant map) instead of long ternary chains inline.
- **Stay consistent** with the existing color, spacing, and radius scale — extend the theme rather than one-off hex values.

## TypeScript & code quality

- **`strict` mode is on.** No `any` — type props, state, and handlers explicitly. Prefer union types and discriminated unions over loose strings.
- **No unused locals/params** (enforced by tsconfig). Keep imports clean.
- **Meaningful names.** Components in PascalCase, hooks as `useX`, files match their default export.

## Before finishing any change

1. `npm run build` passes (this runs `tsc` — type errors block the build).
2. New/changed UI is keyboard-navigable and screen-reader labelled.
3. Layout verified from mobile to desktop with no overflow.
4. Any repeated markup has been extracted into a reusable component.
