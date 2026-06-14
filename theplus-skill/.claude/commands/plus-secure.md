# /plus-secure — Security Audit

Run a comprehensive OWASP-based security audit. Activates the Security Guardian agent.

## Usage
```
/plus-secure           # Full audit of entire codebase
/plus-secure quick     # Check only new/changed files
/plus-secure headers   # Audit only security headers config
/plus-secure auth      # Audit only authentication flows
/plus-secure input     # Audit only input validation (Zod schemas)
/plus-secure deps      # Run npm audit + check for known CVEs
```

## Audit Checklist

### Phase 1 — Static Analysis
- [ ] Search for `dangerouslySetInnerHTML` → verify DOMPurify used
- [ ] Search for `eval(` or `new Function(` → flag any with user input
- [ ] Search for `localStorage.setItem` → flag token/session storage
- [ ] Search for template literals in SQL/query strings → flag concatenation
- [ ] Search for `.env` references in client code → flag NEXT_PUBLIC_ misuse
- [ ] Search for `console.log` with potential PII → flag for removal

### Phase 2 — Auth & Access Control
- [ ] Every protected route has server-side session check
- [ ] Every data mutation verifies ownership (userId match)
- [ ] Rate limiting present on `/api/auth/*` and form submissions
- [ ] Password reset tokens: time-limited, single-use, hashed
- [ ] Session cookies: httpOnly + secure + sameSite=lax

### Phase 3 — Headers & Config
- [ ] `next.config.ts` has all 7 security headers
- [ ] CSP policy doesn't use `unsafe-inline` for scripts (if possible)
- [ ] `CORS` configured with explicit allowed origins
- [ ] `X-Frame-Options: SAMEORIGIN` present
- [ ] HSTS header with preload

### Phase 4 — Dependencies
- [ ] Run `npm audit --audit-level=high`
- [ ] Check `package.json` for pinned vs. range versions on security-critical deps
- [ ] Verify no abandoned packages (last publish >2 years)

### Phase 5 — SSRF & External Requests
- [ ] All server-side URL fetches validate against allowlist
- [ ] Webhook endpoints verify HMAC signatures
- [ ] No user-controlled URLs passed to `fetch()` without validation

## Output Format
```
SECURITY AUDIT REPORT — [project] — [date]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 CRITICAL (fix before deploy)
  [file:line] — [description] — [fix]

🟠 HIGH (fix this sprint)
  [file:line] — [description] — [fix]

🟡 MEDIUM (fix next sprint)
  [file:line] — [description] — [fix]

🔵 INFO (best practice)
  [file:line] — [description]

✅ PASSING
  Auth: ✓ | Input validation: ✓ | Headers: ✓ | Deps: ✓
  
SCORE: [n]/100 — [SECURE / NEEDS WORK / CRITICAL ISSUES]
```
