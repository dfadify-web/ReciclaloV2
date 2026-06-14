# /plus-init — Project Bootstrap

Bootstrap a complete ThePlusSkill project from zero. Run this once at the start of every new web project.

## Steps

1. **Gather context** — Ask the user:
   - Project name + type (landing / saas / ecommerce / portfolio / app)
   - Target audience
   - Brand vibe (3 adjectives)
   - Stack preference (Next.js 15 default)

2. **Create SPEC.md** using caveman notation with all fields populated

3. **Set design system** — activate Design Oracle agent:
   - Select palette from §PALETTES based on vibe
   - Select font pair from §TYPOGRAPHY
   - Set dials V / M / D

4. **Create DESIGN.md** — full design system documentation

5. **Create SECURITY.md** — empty security log with template

6. **Create .env.example** — with all required variables for chosen stack

7. **Scaffold project structure** — create all directories:
   ```
   src/app/ src/components/ui/ src/components/layout/ 
   src/components/sections/ src/lib/ src/styles/
   ```

8. **Install core dependencies**:
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app --src-dir
   npx shadcn@latest init
   npm install framer-motion @studio-freight/lenis lucide-react
   npm install react-hook-form zod @hookform/resolvers
   npm install sonner
   ```

9. **Generate globals.css** — palette CSS tokens, font declarations, fluid type scale

10. **Generate next.config.ts** — with security headers

11. **Create layout.tsx** — with Lenis provider, AnimatePresence, font variables

12. **Output summary** — what was created, palette+fonts chosen, next steps

## Output
After running, the user should have a fully configured project ready to build on.
