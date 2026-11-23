import assert from 'assert';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { sanitizeDisplayText, sanitizeDocumentTextFields } from '../src/utils/textSanitizer';
import { storageService } from '../src/services/storageService';
import { sampleResumeDocument } from '../src/data/sampleData';
import { TEMPLATE_REGISTRY } from '../src/templates/registry';

console.log('=== Export Scaling, Date Table Alignment & Sanitizer Regression Tests ===\n');

// 1. Backslash sanitizer & localStorage self-healing
assert.strictEqual(sanitizeDisplayText('Scaled payments to \\$120M+ at 99.9\\% uptime'), 'Scaled payments to $120M+ at 99.9% uptime');
assert.strictEqual(sanitizeDisplayText('\\\\$120M+ ARR'), '$120M+ ARR');
assert.strictEqual(sanitizeDisplayText('https://example.com/a/b'), 'https://example.com/a/b');

const memoryStore: Record<string, string> = {};
(globalThis as any).localStorage = {
  getItem: (k: string) => (k in memoryStore ? memoryStore[k] : null),
  setItem: (k: string, v: string) => {
    memoryStore[k] = String(v);
  },
  removeItem: (k: string) => {
    delete memoryStore[k];
  },
};

const dirtyPriya = JSON.parse(JSON.stringify(sampleResumeDocument));
dirtyPriya.summary = 'Scaled volume to \\$120M+ globally with 99.9\\% reliability.';
dirtyPriya.experience[0].description = '- Delivered \\$120M+ ARR growth';
memoryStore['genovadoc_documents_v1'] = JSON.stringify([dirtyPriya]);

const loaded = storageService.getAll();
assert.strictEqual(loaded.length, 1);
const loadedSummary = loaded[0].summary ?? '';
const loadedExpDesc = loaded[0].experience[0]?.description ?? '';
assert.ok(!loadedSummary.includes('\\$'), 'Loaded summary must not contain literal \\$');
assert.ok(loadedSummary.includes('$120M+'), 'Loaded summary must contain $120M+');
assert.ok(!loadedExpDesc.includes('\\$'), 'Loaded experience must not contain literal \\$');
assert.ok(
  !memoryStore['genovadoc_documents_v1'].includes('\\\\$'),
  'localStorage must be self-healed and persisted without literal \\$'
);
console.log('✓ Test 1: Sanitizer & localStorage self-healing verified.');

// 2. Verify all 22 Resume templates render Priya Patel dates in explicit <table> rows with nowrap and zero literal \$
const resumeTemplates = TEMPLATE_REGISTRY.filter((t) => t.type === 'resume');
assert.ok(resumeTemplates.length >= 22, `Expected at least 22 resume templates, found ${resumeTemplates.length}`);

for (const tmpl of resumeTemplates) {
  const dirtyInput = sanitizeDocumentTextFields({
    ...dirtyPriya,
    templateId: tmpl.id,
  });
  const Comp = tmpl.component;
  const html = renderToStaticMarkup(React.createElement(Comp, { data: dirtyInput }));

  assert.ok(!html.includes('\\$'), `[${tmpl.id}] Rendered HTML must not contain literal \\$`);
  assert.ok(html.includes('$120M+'), `[${tmpl.id}] Rendered HTML must contain clean $120M+`);
  assert.ok(html.includes('<table'), `[${tmpl.id}] Must render experience/education header rows with HTML <table>`);
  assert.ok(html.includes('table-layout:fixed'), `[${tmpl.id}] Split row tables must enforce table-layout:fixed`);
  assert.ok(html.includes('white-space:nowrap'), `[${tmpl.id}] Date cells must enforce white-space:nowrap`);
  assert.ok(
    html.includes('2019-06') && html.includes('2022-02'),
    `[${tmpl.id}] Experience date range 2019-06 - 2022-02 must be rendered`
  );
  // Ensure no date cell uses float or position:absolute
  assert.ok(!/<td[^>]*position:absolute/i.test(html), `[${tmpl.id}] Date <td> must never use position:absolute`);
  assert.ok(!/<td[^>]*float:/i.test(html), `[${tmpl.id}] Date <td> must never use float`);
}
console.log(`✓ Test 2: All ${resumeTemplates.length} resume templates verified for <table> date layout and clean $120M+ output.`);

// 3. Verify exportService.ts scaling, font-readiness, overflow & clone isolation guarantees
const exportSrc = fs.readFileSync(path.join(process.cwd(), 'src/services/exportService.ts'), 'utf8');
const paginationSrc = fs.readFileSync(path.join(process.cwd(), 'src/services/paginationEngine.ts'), 'utf8');
const utilsSrc = fs.readFileSync(path.join(process.cwd(), 'src/templates/resume/resumeTemplateUtils.tsx'), 'utf8');
const formSrc = fs.readFileSync(path.join(process.cwd(), 'src/components/forms/ResumeForm.tsx'), 'utf8');

const LOCK_BANNER = '// LOCKED EXPORT & PAGINATION ENGINE — DO NOT MODIFY UNLESS EXPLICITLY REQUESTED';
assert.ok(exportSrc.startsWith(LOCK_BANNER), 'src/services/exportService.ts must start with the permanent lock banner');
assert.ok(paginationSrc.startsWith(LOCK_BANNER), 'src/services/paginationEngine.ts must start with the permanent lock banner');
assert.ok(utilsSrc.startsWith(LOCK_BANNER), 'src/templates/resume/resumeTemplateUtils.tsx must start with the permanent lock banner');

assert.ok(exportSrc.includes('waitForFontsAndTwoFrames'), 'Must await document.fonts.ready + 2 rAF ticks before measuring/capturing');
assert.ok(exportSrc.includes('document.fonts.ready'), 'Must await document.fonts.ready');
assert.ok(exportSrc.includes('normalizeWindowDevicePixelRatio(clonedDoc.defaultView)'), 'Must normalize cloned iframe DPR');
assert.ok(exportSrc.includes("clonedDoc.documentElement.style.zoom = '1'"), 'Must lock cloned documentElement zoom to 1');
assert.ok(exportSrc.includes("clonedDoc.body.style.zoom = '1'"), 'Must lock cloned body zoom to 1');
assert.ok(exportSrc.includes("clonedDoc.body.style.transform = 'none'"), 'Must reset cloned body transform');
assert.ok(exportSrc.includes('windowWidth: EXPORT_A4_WIDTH_PX'), 'Must lock html2canvas windowWidth to 794px desktop A4');
assert.ok(exportSrc.includes('windowHeight: EXPORT_A4_HEIGHT_PX'), 'Must pass explicit windowHeight to html2canvas');
assert.ok(exportSrc.includes("flowRoot.style.minHeight = '0px'"), 'Must clear flowRoot minHeight before measuring totalPages');
assert.ok(exportSrc.includes("clonedEl.style.overflow = 'visible'"), 'Must override overflow: hidden on text rows in export clone');
assert.ok(exportSrc.includes("clonedEl.style.wordBreak = 'break-word'"), 'Must enforce wordBreak: break-word on text rows in export clone');
assert.ok(formSrc.includes('autoComplete="off"'), 'ResumeForm location inputs must disable browser autofill');
console.log('✓ Test 3: Lock banners, font readiness, DPR normalization, desktop 794px A4 lock, and overflow guards verified.');

// 4. Verify vercel.json Cache-Control headers and PROJECT_GUARDRAILS.md documentation lock
const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
assert.ok(Array.isArray(vercelConfig.headers), 'vercel.json must define headers array');
const findCacheControl = (source: string) => {
  const entry = vercelConfig.headers.find((h: any) => h.source === source);
  const header = entry?.headers?.find((hh: any) => hh.key.toLowerCase() === 'cache-control');
  return header?.value || '';
};
assert.strictEqual(findCacheControl('/'), 'no-cache, no-store, must-revalidate', 'Root / must send no-cache, no-store, must-revalidate');
assert.strictEqual(findCacheControl('/index.html'), 'no-cache, no-store, must-revalidate', '/index.html must send no-cache, no-store, must-revalidate');
assert.strictEqual(findCacheControl('/assets/(.*)'), 'public, max-age=31536000, immutable', '/assets/(.*) must send immutable 1-year cache');

const guardrailsPath = path.join(process.cwd(), 'PROJECT_GUARDRAILS.md');
const readmePath = path.join(process.cwd(), 'README.md');
assert.ok(fs.existsSync(guardrailsPath), 'PROJECT_GUARDRAILS.md must exist at project root');
assert.ok(fs.existsSync(readmePath), 'README.md must exist at project root');
assert.ok(
  fs.readFileSync(readmePath, 'utf8').includes('PROJECT_GUARDRAILS.md'),
  'README.md must reference PROJECT_GUARDRAILS.md'
);
console.log('✓ Test 4: vercel.json Cache-Control headers and PROJECT_GUARDRAILS.md lock verified.');

console.log('\n🎉 ALL EXPORT & SANITIZER REGRESSION TESTS PASSED!');
