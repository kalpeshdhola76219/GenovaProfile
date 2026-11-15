import assert from 'assert';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { getTemplatesByType } from '../src/templates/registry';
import { CoverLetterPreviewProvider } from '../src/templates/coverletter/CoverLetterTemplateHelpers';
import {
  analyzeLinkedInInput,
  checkJobTitleMentionedInBody,
  COVER_LETTER_TYPE_SCALE,
  formatCoverLetterCompanyText,
  formatCoverLetterPersonName,
  formatCoverLetterTitleText,
  mapCoverLetterData,
  MappedCoverLetterData,
} from '../src/utils/mapCoverLetterData';
import {
  detectWideJustificationGaps,
  rebuildCoverLetterBodyLinesForExport,
} from '../src/utils/coverLetterLineBreaker';
import { DocumentData } from '../src/types/document';
import { createEmptyDocument, sampleCoverLetterDocument } from '../src/data/sampleData';
import { previewCoverLetterSampleData } from '../src/data/previewSampleData';

console.log('\n================================================================');
console.log('COVER LETTER TYPOGRAPHY, PARAGRAPH & POLISH TEST SUITE');
console.log('================================================================\n');

// 1. Scan all files in src/templates/coverletter/ for zero hard-coded sizes or text-justify
const templatesDir = path.resolve(process.cwd(), 'src/templates/coverletter');
const templateFiles = fs
  .readdirSync(templatesDir)
  .filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'))
  .sort();

assert.strictEqual(
  templateFiles.length,
  11,
  `Expected 10 templates + CoverLetterTemplateHelpers.tsx (11 files), found ${templateFiles.length}`
);

const BANNED_SIZE_REGEX = /\btext-(?:xs|sm|base|lg|xl|2xl|3xl|4xl)\b/g;
const BANNED_PX_REGEX = /\btext-\[\d+(?:\.\d+)?px\]/g;
const BANNED_JUSTIFY_REGEX = /\btext-justify\b/g;
const BANNED_NO_JUSTIFY_REGEX = /\bno-justify\b/g;
const BANNED_TEXT_LEFT_REGEX = /\btext-left\b/g;
const CLOSING_BLOCK_CALL_REGEX = /<CoverLetterClosingBlock([\s\S]*?)\/>/g;
const BANNED_CLOSING_TOKENS = [
  'font-serif',
  'italic',
  'scriptSignatureClassName',
  'nameClassName',
  'signOffClassName',
  'titleClassName',
  'showScriptSignature',
  'enclosureClassName',
];

for (const file of templateFiles) {
  const fullPath = path.join(templatesDir, file);
  const src = fs.readFileSync(fullPath, 'utf8');
  const sizeMatches = src.match(BANNED_SIZE_REGEX) || [];
  const pxMatches = src.match(BANNED_PX_REGEX) || [];
  const justifyMatches = src.match(BANNED_JUSTIFY_REGEX) || [];
  const noJustifyMatches = src.match(BANNED_NO_JUSTIFY_REGEX) || [];
  const textLeftMatches = src.match(BANNED_TEXT_LEFT_REGEX) || [];

  assert.strictEqual(
    sizeMatches.length,
    0,
    `${file} contains banned Tailwind text size classes: ${sizeMatches.join(', ')}`
  );
  assert.strictEqual(
    pxMatches.length,
    0,
    `${file} contains banned pixel text size classes: ${pxMatches.join(', ')}`
  );
  assert.strictEqual(
    justifyMatches.length,
    0,
    `${file} contains banned text-justify class: ${justifyMatches.join(', ')}`
  );
  assert.strictEqual(
    noJustifyMatches.length,
    0,
    `${file} contains leftover no-justify class: ${noJustifyMatches.join(', ')}`
  );
  assert.strictEqual(
    textLeftMatches.length,
    0,
    `${file} contains leftover text-left class: ${textLeftMatches.join(', ')}`
  );

  if (file !== 'CoverLetterTemplateHelpers.tsx') {
    assert.ok(src.includes('lang="en"'), `${file} must set lang="en" on sheet root`);
    const closingCalls = Array.from(src.matchAll(CLOSING_BLOCK_CALL_REGEX));
    assert.strictEqual(
      closingCalls.length,
      1,
      `${file} should render CoverLetterClosingBlock once`
    );
    const propsBlock = closingCalls[0][1];
    for (const bannedToken of BANNED_CLOSING_TOKENS) {
      assert.ok(
        !propsBlock.includes(bannedToken),
        `${file} must not pass '${bannedToken}' to CoverLetterClosingBlock`
      );
    }
  }
}

// Verify TemplateRenderer.tsx does not apply doc-justify to cover letters
const rendererSrc = fs.readFileSync(
  path.resolve(process.cwd(), 'src/components/preview/TemplateRenderer.tsx'),
  'utf8'
);
assert.ok(
  /const shouldJustify = safeData\.type === 'resume';/.test(rendererSrc),
  'TemplateRenderer.tsx must only apply doc-justify to resumes'
);

console.log(
  `✓ Zero hard-coded text sizes, banned closing props, or justify overrides across all ${templateFiles.length} cover letter files`
);

// 2. Verify COVER_LETTER_TYPE_SCALE levels 0-5 and ratio bounds (1.08 to 1.15)
assert.strictEqual(COVER_LETTER_TYPE_SCALE.length, 6, 'Scale must define Levels 0..5');
for (let i = 0; i < COVER_LETTER_TYPE_SCALE.length; i++) {
  const row = COVER_LETTER_TYPE_SCALE[i];
  assert.strictEqual(row.level, i, `Level index mismatch at ${i}`);
  const ratio = row.bodyPt / row.metaPt;
  assert.ok(
    ratio >= 1.08 && ratio <= 1.15,
    `Level ${i} body:meta ratio ${ratio.toFixed(3)} must be between 1.08 and 1.15`
  );
  if (i > 0) {
    assert.ok(
      row.lineBody < COVER_LETTER_TYPE_SCALE[i - 1].lineBody,
      `Level ${i} lineBody must decrease from level ${i - 1}`
    );
  }
  for (const shift of [-0.5, 0, 0.5]) {
    const name = Math.max(18, row.namePt + shift);
    const title = Math.max(8.5, row.titlePt + shift);
    const body = Math.max(10, row.bodyPt + shift);
    const meta = Math.max(9, row.metaPt + shift);
    const label = Math.max(7.5, row.labelPt + shift);
    assert.ok(name >= 18 && title >= 8.5 && body >= 10 && meta >= 9 && label >= 7.5);
  }
}
console.log('✓ 6-level type scale ratios (1.08–1.15), line-heights (1.50–1.35), and Level 5 minimums verified');

// 3. Verify paragraph splitting, text-quality formatters, LinkedIn analyzer, and job title mention check
function buildWordsParagraph(wordTotal: number): string {
  const sampleWords = [
    'Led', 'cross-functional', 'enterprise', 'analytics', 'initiatives', 'delivering',
    'measurable', 'revenue', 'growth', 'and', 'operational', 'efficiency', 'across',
    'regional', 'teams', 'while', 'maintaining', 'strict', 'quality', 'standards',
  ];
  const out: string[] = [];
  for (let i = 0; i < wordTotal; i++) {
    out.push(sampleWords[i % sampleWords.length]);
  }
  return out.join(' ') + '.';
}

function makeCoverLetterDoc(
  templateId: string,
  wordCountTarget: number,
  coverLetterOverrides?: Partial<DocumentData['coverLetter']>
): DocumentData {
  const p1 = `I am writing to apply for the Senior Operations Manager role.\n${buildWordsParagraph(
    Math.floor(wordCountTarget * 0.35)
  )}`;
  const p2 = `Over the past six years,   I   managed complex programs.\n\n\n${buildWordsParagraph(
    Math.floor(wordCountTarget * 0.4)
  )}`;
  const p3 = buildWordsParagraph(Math.max(20, wordCountTarget - Math.floor(wordCountTarget * 0.75)));

  return {
    id: `cl-test-${templateId}`,
    type: 'cover-letter',
    title: 'Test Cover Letter',
    templateId,
    createdAt: '2026-11-13T00:00:00.000Z',
    updatedAt: '2026-11-13T00:00:00.000Z',
    customization: {
      fontFamily: 'jakarta',
      fontSize: 'base',
      headingSize: 'base',
      lineHeight: 'normal',
      margins: 'normal',
      sectionSpacing: 'normal',
      primaryColor: '#1e3a8a',
      accentColor: '#1e3a8a',
      showPhoto: false,
      justifyText: true,
    },
    personal: {
      fullName: 'Rahul Sharma',
      professionalTitle: 'Senior Operations Manager',
    },
    contact: {
      phone: '+91 98765 43210',
      email: 'rahul.sharma@example.com',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      linkedin: 'linkedin.com/in/rahulsharma',
      portfolio: 'rahulsharma.co',
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    family: {},
    marriage: {},
    customSections: [],
    coverLetter: {
      coverLetterType: 'experienced',
      letterDate: '14/11/2026',
      hiringManagerName: 'Ananya Verma',
      hiringManagerTitle: 'HR Director',
      companyName: 'Torrent Power Limited',
      jobTitle: 'Senior Operations Manager',
      jobReferenceId: 'TP-2026-11',
      jobSource: 'LinkedIn',
      showApplicationSource: false,
      currentCompany: 'Acme Consulting Pvt. Ltd.',
      currentRole: 'Operations Lead',
      totalExperienceYears: '6 Years',
      letterBody: `${p1}\n${p2}\n\n${p3}`,
      signOff: 'Sincerely,',
      signatureName: 'Rahul Sharma',
      enclosures: 'Resume',
      ...(coverLetterOverrides || {}),
    },
  };
}

const mappedSingleBreak = mapCoverLetterData(makeCoverLetterDoc('coverletter-ats-friendly', 250));
assert.strictEqual(mappedSingleBreak.blocks.length, 5, 'Should split on every single or repeated newline');
assert.ok(!mappedSingleBreak.blocks.some((b) => /\s{2,}/.test(b.text)), 'Must collapse repeated spaces');
assert.ok(
  !mappedSingleBreak.details.some((d) => d.label === 'Application Source'),
  'Application Source must be hidden when showApplicationSource is false'
);

const mappedWithSource = mapCoverLetterData(
  makeCoverLetterDoc('coverletter-ats-friendly', 250, {
    showApplicationSource: true,
  })
);
assert.ok(
  mappedWithSource.details.some((d) => d.label === 'Application Source' && d.value === 'LinkedIn'),
  'Application Source must appear when showApplicationSource is true'
);

// Blur auto-formatters
assert.strictEqual(
  formatCoverLetterTitleText('hr manager for sap and gst'),
  'HR Manager for SAP and GST'
);
assert.strictEqual(
  formatCoverLetterCompanyText('torrent power limited'),
  'Torrent Power Limited'
);
assert.strictEqual(
  formatCoverLetterCompanyText('acme systems pvt ltd'),
  'Acme Systems Pvt. Ltd.'
);
assert.strictEqual(
  formatCoverLetterCompanyText('zenith partners llp'),
  'Zenith Partners LLP'
);

// LinkedIn prefixing & typo detection
const bareLi = analyzeLinkedInInput('rahulsharma');
assert.strictEqual(bareLi.onBlurValue, 'linkedin.com/in/rahulsharma');
assert.strictEqual(bareLi.typoDetected, null);

const typoLi = analyzeLinkedInInput('linkdlen.com/in/rahulsharma');
assert.strictEqual(typoLi.typoDetected, 'linkdlen');
assert.strictEqual(typoLi.suggestedFix, 'linkedin.com/in/rahulsharma');
assert.strictEqual(typoLi.onBlurValue, 'linkdlen.com/in/rahulsharma');

// Job title mention check
assert.strictEqual(
  checkJobTitleMentionedInBody('Sales & Operations Lead', 'Applying for Sales and Operations Lead.'),
  true
);
assert.strictEqual(
  checkJobTitleMentionedInBody('Senior Product Manager', 'I am applying for a software engineer position.'),
  false
);
console.log('✓ Paragraph splitting, title/company formatters, LinkedIn helper, source toggle & mention check verified');

// Name Style formatting tests
assert.strictEqual(
  formatCoverLetterPersonName('a. p. j. abdul kalam', 'as-typed'),
  'a. p. j. abdul kalam'
);
assert.strictEqual(
  formatCoverLetterPersonName('a. p. j. abdul kalam', 'title-case'),
  'A. P. J. Abdul Kalam'
);
assert.strictEqual(
  formatCoverLetterPersonName('a.p.j. abdul kalam', 'title-case'),
  'A.P.J. Abdul Kalam'
);
assert.strictEqual(
  formatCoverLetterPersonName('kalpesh dhola', 'title-case'),
  'Kalpesh Dhola'
);
assert.strictEqual(
  formatCoverLetterPersonName('ludwig van beethoven', 'title-case'),
  'Ludwig van Beethoven'
);
assert.strictEqual(
  formatCoverLetterPersonName('Kalpesh Dhola', 'uppercase'),
  'KALPESH DHOLA'
);

// 4. Render all 10 cover letter templates at 250 and 350 words + uniform signature & nameStyle checks
const coverLetterTemplates = getTemplatesByType('cover-letter');
assert.strictEqual(coverLetterTemplates.length, 10, 'Expected exactly 10 kept cover letter templates');

for (const tmpl of coverLetterTemplates) {
  const TmplComponent = tmpl.component as React.ComponentType<{
    data: DocumentData;
    mapped?: MappedCoverLetterData;
  }>;

  for (const words of [250, 350]) {
    const doc = makeCoverLetterDoc(tmpl.id, words);
    doc.personal.companyName = 'Acme Global Ltd.';
    const mapped = mapCoverLetterData(doc);
    const childEl = React.createElement(TmplComponent, { data: doc, mapped });
    const html = renderToStaticMarkup(
      React.createElement(CoverLetterPreviewProvider, {
        isExportMode: false,
        previewMode: mapped.previewMode,
        children: childEl,
      })
    );

    assert.ok(html.includes('data-document-type="cover-letter"'), `${tmpl.id} missing data-document-type`);
    assert.ok(html.includes('lang="en"'), `${tmpl.id} missing lang="en"`);
    assert.ok(html.includes('data-cl-justify="true"'), `${tmpl.id} should default justify to true`);
    assert.ok(html.includes('cl-name'), `${tmpl.id} missing cl-name class`);
    assert.ok(html.includes('cl-body-content'), `${tmpl.id} missing cl-body-content class`);
    assert.ok(html.includes('Application Details'), `${tmpl.id} missing Application Details label`);
    assert.ok(!html.includes('whitespace-pre-line'), `${tmpl.id} still renders whitespace-pre-line`);
    assert.ok(!html.includes('text-justify'), `${tmpl.id} still renders text-justify`);
    assert.ok(!/genovaprofile/i.test(html), `${tmpl.id} leaked branding URL`);

    // Uniform closing block checks
    assert.ok(
      html.includes('<div class="cl-body font-normal break-words">Sincerely,</div>'),
      `${tmpl.id} sign-off must use cl-body font-normal`
    );
    assert.ok(
      html.includes('<div class="h-[28px]" aria-hidden="true"></div>'),
      `${tmpl.id} missing 28px signature gap`
    );
    assert.ok(
      html.includes('<div class="cl-body font-semibold break-words">Rahul Sharma</div>'),
      `${tmpl.id} default signature name must use cl-body font-semibold (no italic serif)`
    );
    assert.ok(
      html.includes('Senior Operations Manager, Acme Global Ltd.'),
      `${tmpl.id} closing title + company missing`
    );
    assert.ok(
      html.includes('cl-meta font-normal text-slate-600'),
      `${tmpl.id} closing title must use cl-meta font-normal text-slate-600`
    );

    // Ensure no italic or font-serif inside closing block when handwrittenSignature is off
    const sigIdx = html.indexOf('cl-signature-block');
    const sigHtml = html.slice(sigIdx);
    assert.ok(!sigHtml.includes('font-serif'), `${tmpl.id} closing block must not use font-serif`);
    assert.ok(!sigHtml.includes('italic'), `${tmpl.id} closing block must not use italic`);
  }

  // Verify handwrittenSignature toggle
  const docHandwritten = makeCoverLetterDoc(tmpl.id, 250);
  docHandwritten.customization.handwrittenSignature = true;
  const htmlHandwritten = renderToStaticMarkup(
    React.createElement(CoverLetterPreviewProvider, {
      isExportMode: false,
      previewMode: 'live',
      children: React.createElement(TmplComponent, { data: docHandwritten }),
    })
  );
  assert.ok(
    htmlHandwritten.includes('cl-signature-handwritten'),
    `${tmpl.id} missing cl-signature-handwritten when toggle is ON`
  );

  // Verify image signature uses max-h-[44px]
  const docImageSig = makeCoverLetterDoc(tmpl.id, 250, {
    signatureType: 'image',
    signatureImage: 'data:image/png;base64,iVBORw0KGgo=',
  });
  const htmlImageSig = renderToStaticMarkup(
    React.createElement(CoverLetterPreviewProvider, {
      isExportMode: false,
      previewMode: 'live',
      children: React.createElement(TmplComponent, { data: docImageSig }),
    })
  );
  assert.ok(htmlImageSig.includes('max-h-[44px]'), `${tmpl.id} signature image must use max-h-[44px]`);

  // Verify Name Style applies identically to header and signature (including ClassicProfessional!)
  const docTitleCase = makeCoverLetterDoc(tmpl.id, 250, { signatureName: 'kalpesh dhola' });
  docTitleCase.personal.fullName = 'kalpesh dhola';
  docTitleCase.customization.nameStyle = 'title-case';
  const htmlTitleCase = renderToStaticMarkup(
    React.createElement(CoverLetterPreviewProvider, {
      isExportMode: false,
      previewMode: 'live',
      children: React.createElement(TmplComponent, { data: docTitleCase }),
    })
  );
  assert.strictEqual(
    (htmlTitleCase.match(/Kalpesh Dhola/g) || []).length,
    2,
    `${tmpl.id} title-case nameStyle must match in header and signature`
  );
  assert.ok(
    !htmlTitleCase.includes('cl-name font-extrabold uppercase'),
    `${tmpl.id} header h1 must not force uppercase CSS`
  );

  // Verify unbreakable URL/email tokenization & always-on justify across all templates
  const docUnsetJustify = makeCoverLetterDoc(tmpl.id, 250);
  delete docUnsetJustify.customization.justifyText;
  const htmlUnsetJustify = renderToStaticMarkup(
    React.createElement(CoverLetterPreviewProvider, {
      isExportMode: false,
      previewMode: 'live',
      children: React.createElement(TmplComponent, { data: docUnsetJustify }),
    })
  );
  assert.ok(htmlUnsetJustify.includes('data-cl-justify="true"'), `${tmpl.id} unset justifyText must be true`);

  const docExplicitFalse = makeCoverLetterDoc(tmpl.id, 250);
  docExplicitFalse.customization.justifyText = false;
  const htmlExplicitFalse = renderToStaticMarkup(
    React.createElement(CoverLetterPreviewProvider, {
      isExportMode: false,
      previewMode: 'live',
      children: React.createElement(TmplComponent, { data: docExplicitFalse }),
    })
  );
  assert.ok(htmlExplicitFalse.includes('data-cl-justify="true"'), `${tmpl.id} must always justify cover letter paragraphs`);

  const docJustified = makeCoverLetterDoc(tmpl.id, 250, {
    letterBody:
      'Please review my portfolio at https://portfolio.example.com/case-study/2026-launch. Contact me at rahul.sharma@example.com, anytime.\n\nSecond paragraph content.',
  });
  const htmlJustified = renderToStaticMarkup(
    React.createElement(CoverLetterPreviewProvider, {
      isExportMode: false,
      previewMode: 'live',
      children: React.createElement(TmplComponent, { data: docJustified }),
    })
  );
  assert.ok(htmlJustified.includes('data-cl-justify="true"'), `${tmpl.id} must set data-cl-justify="true"`);
  assert.ok(
    htmlJustified.includes(
      '<span class="cl-unbreakable-token">https://portfolio.example.com/case-study/2026-launch</span>.'
    ),
    `${tmpl.id} URL token must exclude trailing period`
  );
  assert.ok(
    htmlJustified.includes(
      '<span class="cl-unbreakable-token">rahul.sharma@example.com</span>,'
    ),
    `${tmpl.id} email token must exclude trailing comma`
  );
}

// Verify no separate Justify UI toggle or wide-gap warning exists in Cover Letter UI
for (const uiFile of [
  'src/components/builder/CoverLetterToolbar.tsx',
  'src/components/builder/CoverLetterCustomizer.tsx',
  'src/components/forms/CoverLetterForm.tsx',
]) {
  const uiSrc = fs.readFileSync(path.resolve(process.cwd(), uiFile), 'utf8');
  assert.ok(
    !/AlignJustify|justifyText|Justify paragraphs|Justify text|Some lines have wide gaps|hasWideJustificationGaps/i.test(uiSrc),
    `${uiFile} must not expose a separate Justify toggle option or wide-gap warning`
  );
}

const clToolbarSrc = fs.readFileSync(
  path.resolve(process.cwd(), 'src/components/builder/CoverLetterToolbar.tsx'),
  'utf8'
);
assert.ok(
  !/onPrint|onDownloadPNG|Download PNG|\bPrint\b|\bPNG\b/.test(clToolbarSrc),
  'CoverLetterToolbar.tsx must not expose Print or PNG actions'
);

// Verify cover letter default documents enable justifyText without touching resume/biodata defaults
assert.strictEqual(
  createEmptyDocument('cover-letter', 'coverletter-ats-friendly').customization.justifyText,
  true,
  'New cover letter documents must enable justifyText by default'
);
assert.strictEqual(
  sampleCoverLetterDocument.customization.justifyText,
  true,
  'sampleCoverLetterDocument must enable justifyText'
);
assert.strictEqual(
  previewCoverLetterSampleData.customization.justifyText,
  true,
  'previewCoverLetterSampleData must enable justifyText'
);
assert.strictEqual(
  createEmptyDocument('resume', 'resume-ats-professional').customization.justifyText,
  undefined,
  'Resume default customization must remain untouched'
);
assert.strictEqual(
  createEmptyDocument('biodata', 'biodata-traditional-indian').customization.justifyText,
  undefined,
  'Biodata default customization must remain untouched'
);

// 5. Verify coverLetterLineBreaker line rebuild & river detection in a simulated DOM
{
  const makeMockNode = (text: string, lineIndexFn: (word: string, idx: number) => number, leftFn?: (word: string, idx: number) => number) => {
    const words = text.split(/(\s+)/);
    return { text, words, lineIndexFn, leftFn };
  };

  // Minimal DOM mock for Range.getClientRects + TreeWalker
  const buildFakeEnvironment = (
    pTexts: Array<{ text: string; lineIndexFn: (word: string, offset: number) => number; leftFn?: (word: string, offset: number) => number }>,
    justified: boolean
  ) => {
    const createdSpans: Array<{ style: Record<string, string>; textContent: string; className: string }> = [];
    const textNodes = pTexts.map((pSpec, pIdx) => {
      const textNode: any = {
        nodeType: 3,
        nodeValue: pSpec.text,
        parentElement: { closest: () => null },
        _spec: pSpec,
        _pIdx: pIdx,
      };
      return textNode;
    });

    const clonedParagraphs = pTexts.map(() => {
      const children: any[] = [];
      return {
        firstChild: null as any,
        style: {} as Record<string, string>,
        removeChild: () => {
          children.length = 0;
        },
        appendChild: (el: any) => {
          children.push(el);
          createdSpans.push(el);
        },
        get children() {
          return children;
        },
      };
    });

    const liveParagraphs = textNodes.map((tn) => ({
      ownerDocument: null as any,
      closest: () => null,
      getBoundingClientRect: () => ({ width: 700, top: 0, left: 0, right: 700, height: 60 }),
      _textNode: tn,
    }));

    const fakeDoc: any = {
      createTreeWalker: (root: any) => {
        let returned = false;
        return {
          nextNode: () => {
            if (!returned) {
              returned = true;
              return root._textNode;
            }
            return null;
          },
        };
      },
      createRange: () => {
        let node: any = null;
        let start = 0;
        let end = 0;
        return {
          setStart: (n: any, s: number) => {
            node = n;
            start = s;
          },
          setEnd: (_n: any, e: number) => {
            end = e;
          },
          getClientRects: () => {
            const slice = (node.nodeValue as string).slice(start, end);
            const lineIdx = node._spec.lineIndexFn(slice, start);
            const top = 100 + lineIdx * 24;
            const left = node._spec.leftFn ? node._spec.leftFn(slice, start) : (start % 50) * 10;
            const width = slice.length * 7;
            return [{ top, left, right: left + width, width, height: 20 }];
          },
          getBoundingClientRect: () => ({ top: 100, left: 0, right: 50, width: 50, height: 20 }),
        };
      },
      createElement: () => ({
        className: '',
        style: {} as Record<string, string>,
        textContent: '',
      }),
    };
    liveParagraphs.forEach((p) => (p.ownerDocument = fakeDoc));

    (globalThis as any).window = {
      getComputedStyle: () => ({
        font: '400 14px Plus Jakarta Sans',
        fontSize: '14px',
        lineHeight: '21px',
        paddingLeft: '0px',
        paddingRight: '0px',
        marginTop: '0px',
        marginBottom: '0px',
      }),
    };
    (globalThis as any).NodeFilter = { SHOW_TEXT: 4 };

    const liveRoot: any = {
      getAttribute: (k: string) => (k === 'data-cl-justify' ? (justified ? 'true' : 'false') : null),
      querySelector: () => null,
      querySelectorAll: () => liveParagraphs,
    };
    const clonedRoot: any = {
      querySelectorAll: () => clonedParagraphs,
    };

    return { fakeDoc, liveRoot, clonedRoot, clonedParagraphs, createdSpans };
  };

  // Case A: Justify ON -> 2 lines on P1 (first line justified, last line left), 1 line on P2 (left)
  const envA = buildFakeEnvironment(
    [
      {
        text: 'Alpha beta gamma delta epsilon zeta',
        lineIndexFn: (_w, offset) => (offset < 17 ? 0 : 1),
      },
      {
        text: 'Short closing line.',
        lineIndexFn: () => 0,
      },
    ],
    true
  );
  rebuildCoverLetterBodyLinesForExport(envA.fakeDoc, envA.clonedRoot, envA.liveRoot);
  assert.strictEqual(envA.clonedParagraphs[0].children.length, 2, 'P1 must rebuild into exactly 2 lines');
  assert.strictEqual(envA.clonedParagraphs[1].children.length, 1, 'P2 must rebuild into exactly 1 line');
  assert.strictEqual(envA.clonedParagraphs[0].children[0].style.whiteSpace, 'nowrap');
  assert.strictEqual(envA.clonedParagraphs[0].children[0].style.textAlign, 'justify');
  assert.strictEqual(envA.clonedParagraphs[0].children[0].style.textAlignLast, 'justify');
  assert.strictEqual(envA.clonedParagraphs[0].children[1].style.textAlign, 'left');
  assert.strictEqual(envA.clonedParagraphs[1].children[0].style.textAlign, 'left');

  // Case B: Justify OFF -> all lines left-aligned, exact same line count
  const envB = buildFakeEnvironment(
    [
      {
        text: 'Alpha beta gamma delta epsilon zeta',
        lineIndexFn: (_w, offset) => (offset < 17 ? 0 : 1),
      },
    ],
    false
  );
  rebuildCoverLetterBodyLinesForExport(envB.fakeDoc, envB.clonedRoot, envB.liveRoot);
  assert.strictEqual(envB.clonedParagraphs[0].children.length, 2);
  assert.strictEqual(envB.clonedParagraphs[0].children[0].style.textAlign, 'left');
  assert.strictEqual(envB.clonedParagraphs[0].children[1].style.textAlign, 'left');

  // Case C: Wide-gap river detection (> 2.2x normal space)
  const envWide = buildFakeEnvironment(
    [
      {
        text: 'Two words nextline',
        lineIndexFn: (_w, offset) => (offset < 10 ? 0 : 1),
        leftFn: (_w, offset) => (offset === 0 ? 0 : offset === 4 ? 400 : 0), // huge 372px gap!
      },
    ],
    true
  );
  assert.strictEqual(detectWideJustificationGaps(envWide.liveRoot), true, 'Must detect wide justification gap');

  const envNormal = buildFakeEnvironment(
    [
      {
        text: 'Normal spacing across a realistically filled line with several words before wrapping nextline',
        lineIndexFn: (_w, offset) => (offset < 89 ? 0 : 1),
        leftFn: (_w, offset) => offset * 7.8,
      },
    ],
    true
  );
  assert.strictEqual(detectWideJustificationGaps(envNormal.liveRoot), false, 'Normal spacing must not trigger river warning');

  delete (globalThis as any).window;
  delete (globalThis as any).NodeFilter;
}

console.log(
  '✓ All 10 cover letter templates verified for consistent signature, nameStyle, justify rules, and export line parity\n'
);
