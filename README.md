# Genova Profile (`genovaprofile.com`)

Online document builder for ATS-friendly resumes, matrimonial biodatas, and cover letters with live A4 preview and 300 DPI PDF/PNG export.

> **Important for Contributors & Automated Sessions:** Before modifying PDF export, pagination, Resume templates, or `vercel.json`, read **[PROJECT_GUARDRAILS.md](./PROJECT_GUARDRAILS.md)**. Locked engine files must not be altered unless explicitly requested.

## Development & Verification Commands

```bash
# Start local development server (port 3000)
npm run dev

# TypeScript type-check
npx tsc --noEmit

# Run full regression test suite (pagination, boundary duplication, sanitizer & zero-fallback checks)
npm test

# Production build
npm run build
```
