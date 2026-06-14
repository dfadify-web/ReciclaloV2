# /plus-palette — Color Palette Applicator

Apply any named palette from ThePlusSkill's collection to the current project.

## Usage
```
/plus-palette                   # Show all palettes, ask user to pick
/plus-palette Obsidian          # Apply Obsidian palette
/plus-palette list              # List all palettes by category
/plus-palette preview           # Show palette as colored blocks
/plus-palette custom            # Define a custom palette interactively
/plus-palette dark              # Filter: show only dark palettes
/plus-palette light             # Filter: show only light palettes
```

## What it does
1. Updates CSS custom properties in `src/styles/globals.css`
2. Updates SPEC.md with palette name
3. Updates DESIGN.md palette section
4. Optionally generates Tailwind config extensions

## Output Template
When applying a palette, generate this in `globals.css`:

```css
/* Palette: [NAME] */
:root {
  --bg:             [value];
  --fg:             [value];
  --muted:          [value];
  --accent:         [value];
  --accent-fg:      [white or black];
  --surface:        color-mix(in srgb, var(--bg) 94%, var(--fg));
  --surface-2:      color-mix(in srgb, var(--bg) 88%, var(--fg));
  --surface-3:      color-mix(in srgb, var(--bg) 80%, var(--fg));
  --border:         color-mix(in srgb, var(--fg) 10%, transparent);
  --border-strong:  color-mix(in srgb, var(--fg) 22%, transparent);
  --shadow-sm:      0 1px 2px color-mix(in srgb, var(--fg) 6%, transparent);
  --shadow-md:      0 4px 12px color-mix(in srgb, var(--fg) 8%, transparent);
  --shadow-lg:      0 8px 32px color-mix(in srgb, var(--fg) 10%, transparent);
  --shadow-xl:      0 16px 64px color-mix(in srgb, var(--fg) 12%, transparent);
  --radius-sm:      4px;
  --radius-md:      8px;
  --radius-lg:      12px;
  --radius-xl:      20px;
  --radius-full:    9999px;
}
```

## Custom Palette Definition
When `/plus-palette custom` is run, collect:
- bg (background)
- fg (foreground / text)
- muted (secondary text)
- accent (primary brand color)

Then derive all other tokens automatically using `color-mix()`.

## All Palettes Quick Reference
See SKILL.md §COLOR PALETTES for the full collection (50+ palettes across 8 categories).
