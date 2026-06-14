# /plus-spec — Spec Manager

Interactive manager for SPEC.md — the project's source of truth.

## Usage
```
/plus-spec              # View current SPEC.md + suggest updates
/plus-spec update       # Interactive SPEC.md update wizard
/plus-spec drift        # Check for drift between SPEC.md and actual code
/plus-spec invariants   # View/add §B invariants
/plus-spec reset        # Regenerate SPEC.md from current codebase
```

## What is SPEC.md?

Inspired by Cavekit's spec-driven development. SPEC.md is the single source of truth for the project:
- What it is (not what it does — implementation is in code)
- Design decisions already made
- §B invariants (things learned from failures — never violate)
- Component inventory

## Drift Detection

When `/plus-spec drift` runs, compare:
- Routes in SPEC.md vs actual `src/app/` structure
- Components listed vs actual files in `src/components/`
- Palette in SPEC.md vs CSS vars in globals.css
- Fonts in SPEC.md vs font declarations in layout.tsx

Report:
```
SPEC DRIFT REPORT
━━━━━━━━━━━━━━━━
✅ Routes: all 5 routes match
❌ Missing component: /contact route in SPEC.md but not in codebase
⚠️  Palette mismatch: SPEC.md says "Obsidian" but globals.css uses different values
✅ Fonts: T2 (Cabinet Grotesk + Manrope) — confirmed in layout.tsx
```

## §B Invariants — Rules from Failures

When a bug is fixed or a test fails, add the lesson to §B:

```
## §B INVARIANTS
§B01: auth: always verify userId ownership before returning resource
§B02: forms: always parse FormData with zod before using values
§B03: images: always set width/height on next/image to prevent CLS
§B04: a11y: floating dock items must have aria-label (fixed: 2026-01-15)
§B05: mobile: Lenis conflicts with iOS Safari scroll — disable on touch
```

These invariants are automatically checked by the Spec Keeper agent during builds.
