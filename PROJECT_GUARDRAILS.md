# Genova Profile — Project Guardrails & Regression Lock

**READ THIS FIRST BEFORE MODIFYING ANY EXPORT, PAGINATION, RESUME TEMPLATE, OR DEPLOYMENT FILE.**

This document codifies non-negotiable engineering invariants for `genovaprofile.com`. Every future AI Studio session or contributor MUST preserve these rules unless the user explicitly asks to change them.

---

## 1. Locked Files (Do Not Modify Without Explicit User Instruction)

The following files carry the top-of-file lock banner `// LOCKED EXPORT & PAGINATION ENGINE — DO NOT MODIFY UNLESS EXPLICITLY REQUESTED` (and `vercel.json` is locked here since standard JSON forbids `//` comments):

- `src/services/exportService.ts`
- `src/services/paginationEngine.ts`
- `src/templates/resume/resumeTemplateUtils.tsx`
- `vercel.json`

---

## 2. Chrome Desktop, Mobile Chrome & Firefox A4 PDF Parity Rules

1. **Font & Paint Settlement:** Always wait for `await document.fonts.ready` plus two `requestAnimationFrame` ticks (`waitForFontsAndTwoFrames()`) before measuring or capturing any page so Chrome font metrics match Firefox.
2. **Fixed Desktop A4 Clone Geometry:** Always lock the off-screen export clone (`documentElement`, `body`, ancestor wrappers, target sheet, and flow root) to exact desktop A4 width:
   - `width: 794px`, `minWidth: 794px`, `maxWidth: 794px`
   - `transform: 'none'`, `zoom: '1'`
   - `html2canvas` options: `width: 794`, `windowWidth: 794`, `windowHeight: 1123`, `scale: 2`, `scrollX: 0`, `scrollY: 0` (never raw mobile `window.innerWidth` or `window.devicePixelRatio`).
3. **No Text Glyph Clipping in Chrome:** Inside `sanitizeClonedDocumentForExport`, override `overflow: hidden` on text rows/containers with `overflow: visible` and `wordBreak: 'break-word'` (excluding pure media/avatar frames) so Chrome never clips trailing characters (e.g. `Proficiency` clipped as `Proficien`).
4. **Atomic Entries & Non-Shrinking Date/Link Columns:**
   - Every individual `experience`, `education`, `project`, and `certification` entry is marked `data-entry="true"` and treated as an atomic `break-inside: avoid` unit (splitting only giant >580px multi-bullet entries cleanly between bullets with strictly non-overlapping boundaries `nextStartY >= endY`).
   - Date and link columns (`ResumeSplitRow` right cell / `[data-right-col]`) always carry `flex-shrink: 0` (`shrink-0`) and `overflow: visible` so date ranges (`- Present`) never duplicate across page breaks and project URLs never detach below subsequent sections.

---

## 3. Resume Data Hygiene & Zero-Fallback Rules

1. **Zero Hardcoded Location Fallbacks:** Never render `'NY'`, `'CA'`, `'New York'`, `'San Francisco'`, or sample location defaults when `city`, `state`, `country`, or `location` is empty. Format location strictly via `formatResumeLocation(contact)`. If all fields are empty, render nothing.
2. **Zero Hardcoded Certification / Honor Fallbacks:** Never render `"Top 50 Global Business Leaders"`, `"Recognized for executive leadership in enterprise value creation"`, `'Verified'`, `'Active'`, or hidden/uneditable `achievements` arrays inside Resume templates. Filter certifications strictly via `getValidCertifications(certifications)` and hide the entire Certifications section when empty.
3. **Zero Stray Separators:** Render `|`, `•`, `–`, `,`, or `—` ONLY when both adjacent values are non-empty (using `joinNonEmpty`, `formatDateRange`, `formatEducationScore`). Empty fields must never output stray ` | `, ` • `, or trailing punctuation.
4. **Blank New-Resume Initialization & Autofill Prevention:**
   - New or cleared Resumes initialize with `city: ''`, `state: ''`, `country: ''`, `location: ''`, `certifications: []`, and `achievements: []` (never reverting to sample data).
   - Location `<input>` fields in `ResumeForm.tsx` must keep `autoComplete="off"`.

---

## 4. Cache Prevention (`vercel.json`)

- `/` and `/index.html` MUST always send `Cache-Control: no-cache, no-store, must-revalidate` so Chrome Desktop and Mobile Chrome never serve stale HTML bundles after deploys.
- `/assets/(.*)` MUST send `Cache-Control: public, max-age=31536000, immutable`.
- Keep `vercel.json` strictly valid JSON (no `//` comments or unknown keys) so Vercel schema validation always passes.

---

## 5. Mandatory Verification Before Finishing Any Change

Run and confirm 100% pass with zero errors:

```bash
npx tsc --noEmit
npm test
npm run build
```

Regression suites enforced by `npm test`:
- `tests/boundary_duplicate_check.test.ts`
- `tests/pagination_verification.test.ts`
- `tests/export_sanitizer_regression.test.ts`
