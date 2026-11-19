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

// 3. Verify exportService.ts scaling & clone isolation guarantees
const exportSrc = fs.readFileSync(path.join(process.cwd(), 'src/services/exportService.ts'), 'utf8');
assert.ok(exportSrc.includes('normalizeWindowDevicePixelRatio(clonedDoc.defaultView)'), 'Must normalize cloned iframe DPR');
assert.ok(exportSrc.includes("clonedDoc.documentElement.style.zoom = '1'"), 'Must lock cloned documentElement zoom to 1');
assert.ok(exportSrc.includes("clonedDoc.body.style.zoom = '1'"), 'Must lock cloned body zoom to 1');
assert.ok(exportSrc.includes("clonedDoc.body.style.transform = 'none'"), 'Must reset cloned body transform');
assert.ok(exportSrc.includes('windowHeight: EXPORT_A4_HEIGHT_PX'), 'Must pass explicit windowHeight to html2canvas');
assert.ok(exportSrc.includes("flowRoot.style.minHeight = '0px'"), 'Must clear flowRoot minHeight before measuring totalPages');
console.log('✓ Test 3: exportService.ts DPR normalization, clone isolation, and 1-page measurement guards verified.');

console.log('\n🎉 ALL EXPORT & SANITIZER REGRESSION TESTS PASSED!');
