# /plus-deploy — Pre-Deployment Checklist

Run the complete pre-deployment verification before shipping to production.

## Usage
```
/plus-deploy           # Run full pre-deploy checklist
/plus-deploy vercel    # Vercel-specific deployment checks
/plus-deploy env       # Environment variables audit only
/plus-deploy headers   # Security headers verification only
```

## Pre-Deploy Checklist

### Phase 1 — Code Quality
- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] No ESLint errors (`next lint`)
- [ ] No TODO/FIXME comments in production code
- [ ] All console.log statements removed (or replaced with logger)
- [ ] No hardcoded development URLs or API keys

### Phase 2 — Environment Variables
- [ ] All required vars in `.env.example` are set in production env
- [ ] `NEXTAUTH_URL` set to production domain (not localhost)
- [ ] `NEXTAUTH_SECRET` is a strong random string (≥32 bytes)
- [ ] Database URL points to production database
- [ ] All API keys are production keys (not test/sandbox)
- [ ] No development secrets in production env

### Phase 3 — Security
- [ ] Security headers present in `next.config.ts`
- [ ] `npm audit` → 0 critical, 0 high
- [ ] HTTPS enforced (Vercel: automatic)
- [ ] Rate limiting active on auth endpoints
- [ ] CORS configured with explicit origin list
- [ ] Environment variables not exposed to client (no NEXT_PUBLIC_ for secrets)

### Phase 4 — Performance
- [ ] Production build succeeds (`npm run build`)
- [ ] Bundle size reviewed (`next build` output)
- [ ] Lighthouse score ≥ 90 (Performance, Accessibility, Best Practices, SEO)
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
- [ ] Images optimized (WebP/AVIF via next/image)
- [ ] Fonts: `display: swap`, subset to used characters

### Phase 5 — SEO & Meta
- [ ] `<title>` and `<meta name="description">` on every page
- [ ] OpenGraph tags (`og:title`, `og:description`, `og:image`)
- [ ] `robots.txt` and `sitemap.xml` present
- [ ] Canonical URLs set
- [ ] `<html lang="[locale]">` correct
- [ ] Favicon and app icons present (all sizes)

### Phase 6 — Functionality
- [ ] All forms submit successfully
- [ ] Auth flow works end-to-end
- [ ] Payment flow tested in production mode (use test card)
- [ ] Email delivery working (transactional emails)
- [ ] 404 and 500 error pages exist and are styled
- [ ] Mobile tested on real device (not just DevTools)

## Quick Commands
```bash
# Build + type check
npm run build && npx tsc --noEmit

# Security audit
npm audit --audit-level=high

# Lint
npm run lint

# Check bundle size
npx @next/bundle-analyzer
```
