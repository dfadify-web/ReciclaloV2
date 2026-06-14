# ⚡ ThePlusSkill

> The ultimate Claude Code skill for building premium, secure, and visually stunning web projects.

ThePlusSkill combines the best ideas from the most popular Claude Code skills into one unified system:

| Inspiration | What we took |
|-------------|-------------|
| **Cavekit / Caveman** | Spec-driven development, SPEC.md, caveman notation, §B invariants |
| **Taste Skill** | Design variance dials, anti-slop principles, motion intensity |
| **Impeccable** | Design vocabulary, anti-pattern detection, DESIGN.md system |
| **claude-code-owasp** | OWASP Top 10 2025 enforcement, ASVS 5.0 patterns |
| **claude-cybersecurity** | Multi-agent security scanning, threat modeling |
| **21st.dev** | Component registry patterns, shadcn/ui, Radix UI primitives |
| **MotionSites.ai** | Hero section templates, animation patterns, Framer Motion choreography |

---

## 🚀 Install

### Option 1 — Copy skill files into your project
```bash
git clone https://github.com/dfadify-web/ThePlusSkill /tmp/theplus
cp -r /tmp/theplus/.claude/* your-project/.claude/
```

### Option 2 — Copy SKILL.md only (minimal)
```bash
mkdir -p .claude/skills/theplus-skill
curl -o .claude/skills/theplus-skill/SKILL.md \
  https://raw.githubusercontent.com/dfadify-web/ThePlusSkill/main/.claude/skills/theplus-skill/SKILL.md
```

### Option 3 — Register in settings.json
Add to `.claude/settings.json`:
```json
{
  "skills": [
    "https://github.com/dfadify-web/ThePlusSkill"
  ]
}
```

---

## 📋 Commands

| Command | What it does |
|---------|-------------|
| `/plus-init` | Bootstrap project: SPEC.md, DESIGN.md, installs stack, scaffolds structure |
| `/plus-design [V=n] [M=n] [D=n]` | Apply design system, set dials, pick palette + fonts |
| `/plus-secure` | Full OWASP Top 10 audit with severity report |
| `/plus-components [section]` | Scaffold 21st.dev + shadcn components |
| `/plus-motion [M=n]` | Add MotionSites animation patterns, install Lenis |
| `/plus-palette [name]` | Apply named color palette, update CSS tokens |
| `/plus-fonts [code]` | Apply named font pair (e.g. T2, E1, B3) |
| `/plus-spec` | View/update SPEC.md interactively |
| `/plus-audit` | Full project audit: design + security + perf + a11y |
| `/plus-deploy` | Pre-deployment checklist |

---

## 🤖 Agents

| Agent | Activates when... |
|-------|-------------------|
| **Design Oracle** | Any UI/UX decision, palette/font selection, layout review |
| **Security Guardian** | Writing auth, input handling, API routes, mutations |
| **Motion Architect** | Building components or sections with animations |
| **Component Wizard** | Scaffolding pages or UI sections |
| **Spec Keeper** | Project start, major changes, `/plus-spec` |

---

## 🎨 Includes

- **50+ color palettes** across 8 categories (minimal, luxury, vibrant, nature, brand, dark mode)
- **35+ professional font pairs** across 5 categories (editorial, tech, bold, humanist, experimental)
- **8 hero section templates** (stagger, video, bento, split, glass, particle, typewriter, 3D)
- **30+ UI components** (navbar, cards, backgrounds, buttons, data display, micro-interactions)
- **8 animation patterns** with Framer Motion code
- **OWASP Top 10 2025** enforcement on every code write
- **WCAG 2.1 AA** accessibility built into every component

---

## 🔑 The Three Dials

```
V (DESIGN_VARIANCE) 1-10:   Safe/centered → Asymmetric/editorial/bold
M (MOTION_INTENSITY) 1-10:  Static → Magnetic/3D/scroll-driven/cinematic
D (VISUAL_DENSITY) 1-10:    Ultra minimal → Dense information grid
```

Set in SPEC.md. Change anytime with `/plus-design V=8 M=7 D=4`.

---

## 📁 Structure

```
ThePlusSkill/
├── .claude/
│   ├── skills/
│   │   └── theplus-skill/
│   │       └── SKILL.md          ← Main skill (the whole system)
│   ├── commands/
│   │   ├── plus-init.md          ← /plus-init
│   │   ├── plus-design.md        ← /plus-design
│   │   ├── plus-secure.md        ← /plus-secure
│   │   ├── plus-components.md    ← /plus-components
│   │   ├── plus-motion.md        ← /plus-motion
│   │   ├── plus-palette.md       ← /plus-palette
│   │   ├── plus-audit.md         ← /plus-audit
│   │   ├── plus-spec.md          ← /plus-spec
│   │   └── plus-deploy.md        ← /plus-deploy
│   └── agents/
│       ├── design-oracle.md      ← Design decisions
│       ├── security-guardian.md  ← OWASP enforcement
│       ├── motion-architect.md   ← Animation patterns
│       ├── component-wizard.md   ← UI scaffolding
│       └── spec-keeper.md        ← SPEC.md management
└── README.md
```

---

*ThePlusSkill v1.0 — by [@dfadify-web](https://github.com/dfadify-web)*
