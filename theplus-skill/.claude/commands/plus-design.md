# /plus-design — Design System Control

Apply or update the design system for the current project. Activates the Design Oracle agent.

## Usage
```
/plus-design                     # Interactive — asks for all choices
/plus-design V=8 M=6 D=4        # Set dials directly
/plus-design palette=Obsidian   # Apply specific palette
/plus-design fonts=T2            # Apply specific font pair code
/plus-design audit               # Audit current design against system
```

## What it does

1. Read SPEC.md to understand current project context
2. Apply the Design Oracle decision framework:
   - If no palette set → recommend 3 options with rationale, user picks
   - If no fonts set → recommend 2 pairs with rationale, user picks
   - If no dials set → ask 3 quick questions to determine V/M/D
3. Update SPEC.md with choices
4. Update/create DESIGN.md with full system
5. Update globals.css with palette tokens
6. Update tailwind.config.ts with extended colors matching tokens
7. Show visual preview of the design system as a code block

## Design Oracle Logic

**Palette selection heuristics:**
- Fintech/Legal/Enterprise → Trust, Slate, Carbon
- Luxury/Fashion/Jewelry → Obsidian, Midnight, Empire, Velvet
- Health/Wellness/Nature → Health, Sage, Forest, Ocean
- Tech/SaaS/Dev tools → Eclipse, Carbon, Void, Graphite
- Creative/Agency/Portfolio → Plasma, Aurora, Electric
- Consumer/App/Lifestyle → Coral, Solar, Impact

**Font selection heuristics:**
- Enterprise/B2B → T3 (General Sans + Inter) or T2 (Cabinet Grotesk + Manrope)
- Luxury/Fashion → E2 (Cormorant Garamond + Plus Jakarta Sans) or E3 (Fraunces + Satoshi)
- Tech/Dev → T1 (Geist + Geist Mono) or T4 (Space Grotesk + Space Mono)
- Bold Brand → B3 (Monument Extended + Neue Montreal) or B5 (Tusker Grotesk + Aktiv Grotesk)
- Consumer/App → H2 (Poppins + Lora) or H1 (Nunito + Merriweather)
- Editorial/Blog → E1 (Playfair Display + Inter) or E7 (Instrument Serif + Instrument Sans)
