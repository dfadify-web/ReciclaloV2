# /plus-audit — Full Project Audit

Comprehensive project audit across design quality, security, performance, and accessibility.

## Usage
```
/plus-audit            # Full audit — all categories
/plus-audit design     # Design quality only
/plus-audit security   # Security only (same as /plus-secure)
/plus-audit perf       # Performance only
/plus-audit a11y       # Accessibility only
/plus-audit pre-launch # Complete pre-launch checklist
```

## Audit Categories

### 🎨 Design Audit
- Font pair from approved list? (check globals.css or layout.tsx)
- Palette from collection with semantic tokens? (check CSS vars)
- Dials set in SPEC.md?
- No design anti-patterns? (check §ANTI-PATTERNS)
- Mobile-first breakpoints? (320px, 375px, 768px, 1280px)
- Dark mode working?
- `prefers-reduced-motion` respected?
- Typography using `clamp()` fluid scale?

### 🔒 Security Audit
Run full OWASP checklist (see /plus-secure for details)

### ⚡ Performance Audit
- All images: `next/image` with explicit dimensions?
- Font loading: `display: swap`?
- Route-level code splitting? (App Router: automatic)
- Bundle size: check for large unoptimized imports
- No synchronous third-party scripts in `<head>`?
- Core Web Vitals budget set?
- `loading="lazy"` on below-fold images?

### ♿ Accessibility Audit
- `<html lang="">` correct?
- All images have descriptive `alt` text?
- Icon-only buttons have `aria-label`?
- Focus styles visible (no bare `outline: none`)?
- Color contrast ≥ 4.5:1 for normal text?
- Color contrast ≥ 3:1 for large text / UI components?
- Keyboard navigation through entire page?
- No `tabindex` values > 0?
- Form inputs have associated `<label>`?
- Error messages linked to inputs via `aria-describedby`?

## Output Format
```
FULL AUDIT REPORT — [project]
Generated: [date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DESIGN SCORE: [n]/25
  ✅ Font pair: T2 (Cabinet Grotesk + Manrope)
  ✅ Palette: Obsidian (dark luxury)
  ✅ Dials: V=7 M=6 D=5
  ❌ Missing: prefers-reduced-motion check in HeroSection
  ⚠️  Mobile: 320px viewport needs review (overflow-x detected)

SECURITY SCORE: [n]/40
  [findings from /plus-secure]

PERFORMANCE SCORE: [n]/20
  ✅ next/image: 8/8 images optimized
  ⚠️  Bundle: lodash imported fully in utils.ts (use lodash-es)
  ❌ LCP: estimated 3.2s — optimize hero image

ACCESSIBILITY SCORE: [n]/15
  ✅ lang attribute set
  ❌ 3 icon buttons missing aria-label
  ⚠️  Contrast: muted text on surface-2 = 3.8:1 (below 4.5:1)

OVERALL: [n]/100 — [EXCELLENT / GOOD / NEEDS WORK / CRITICAL]

TOP 3 PRIORITIES:
1. [most critical fix]
2. [second priority]
3. [third priority]
```
