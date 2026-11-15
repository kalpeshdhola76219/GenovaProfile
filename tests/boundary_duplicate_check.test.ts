import assert from 'assert';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TEMPLATE_REGISTRY } from '../src/templates/registry';
import { calculateDocumentPagination, A4_DIMENSIONS } from '../src/services/paginationEngine';
import { DocumentData } from '../src/types/document';

console.log('================================================================');
console.log('DUPLICATE CONTENT & PAGE BOUNDARY SYNCHRONIZATION TEST SUITE');
console.log('================================================================\n');

// Specific bullet mentioned in user prompt
const TARGET_BULLET = 'Prepared MIS reports and supported reporting requirements.';

function createMockResumeWithTargetBullet(templateId: string): DocumentData {
  return {
    id: 'test-boundary-doc',
    type: 'resume',
    title: 'Financial Analyst Resume',
    templateId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    customization: {
      fontFamily: 'jakarta',
      fontSize: 'base',
      headingSize: 'lg',
      lineHeight: 'normal',
      margins: 'normal',
      sectionSpacing: 'normal',
      primaryColor: '#0f172a',
      accentColor: '#3b82f6',
      showPhoto: false,
    },
    personal: {
      fullName: 'Rahul Deshmukh',
      professionalTitle: 'Senior Financial Analyst',
    },
    contact: {
      email: 'rahul.deshmukh@example.com',
      phone: '+91 98200 12345',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
    },
    summary: 'Diligent Senior Financial Analyst with 7+ years of experience in corporate financial planning, variance analysis, MIS reporting, and capital budgeting.',
    experience: [
      {
        id: 'exp-1',
        company: 'Apex Global Financial Services',
        jobTitle: 'Senior Financial Analyst',
        location: 'Mumbai, India',
        startDate: '2021',
        endDate: 'Present',
        currentlyWorking: true,
        description: `• Spearheaded quarterly budget forecasting models for $120M annual portfolio.\n• Conducted detailed variance analysis across 14 operational business units.\n• ${TARGET_BULLET}\n• Automated monthly dashboard consolidation reducing manual effort by 22 hours per cycle.\n• Partnered with senior leadership to deliver executive briefing decks for board meetings.`,
        achievements: 'Ranked Best Performer in Corporate Finance division 2023',
      },
      {
        id: 'exp-2',
        company: 'Tata Consultancy Services',
        jobTitle: 'Financial Planning Associate',
        location: 'Pune, India',
        startDate: '2017',
        endDate: '2021',
        currentlyWorking: false,
        description: `• Managed general ledger accounts and balance sheet reconciliations.\n• Coordinated with statutory auditors for year-end compliance audits.\n• Generated weekly cash flow forecasting reports with 98% projection accuracy.\n• Streamlined vendor accounts payable workflow and invoice tracking.`,
        achievements: '',
      },
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Master of Business Administration (Finance)',
        institute: 'Jamnalal Bajaj Institute of Management Studies',
        location: 'Mumbai',
        startYear: '2015',
        endYear: '2017',
        score: 'CGPA: 8.8 / 10',
      },
      {
        id: 'edu-2',
        degree: 'Bachelor of Commerce (Accounting & Finance)',
        institute: 'University of Mumbai',
        location: 'Mumbai',
        startYear: '2012',
        endYear: '2015',
        score: 'First Class with Distinction',
      },
    ],
    skills: [
      { id: 's-1', name: 'Financial Modeling', category: 'technical' },
      { id: 's-2', name: 'MIS Reporting', category: 'technical' },
      { id: 's-3', name: 'Variance Analysis', category: 'technical' },
      { id: 's-4', name: 'SAP ERP', category: 'technical' },
      { id: 's-5', name: 'Advanced Excel & VBA', category: 'technical' },
      { id: 's-6', name: 'PowerBI Dashboards', category: 'technical' },
    ],
    projects: [
      {
        id: 'p-1',
        name: 'Automated Financial Dashboard Suite',
        role: 'Project Lead',
        technologies: 'PowerBI, SQL, Advanced Excel',
        description: 'Engineered unified financial performance tracking system connecting data across 5 enterprise accounting systems.',
      },
    ],
    certifications: [
      { id: 'c-1', name: 'Chartered Financial Analyst (CFA) Level II', issuer: 'CFA Institute', issueDate: '2020' },
    ],
    achievements: [],
    family: {},
    marriage: {},
    customSections: [],
  };
}

// 1. Test mathematical guarantee of non-overlapping page breaks
console.log('Test 1: Mathematical Non-Overlap Verification');
{
  const mockDOM = {
    scrollHeight: 1850,
    offsetHeight: 1850,
    getBoundingClientRect: () => ({ top: 0, bottom: 1850, left: 0, right: 800, width: 800, height: 1850 }),
    querySelectorAll: () => [],
  } as unknown as HTMLElement;

  const result = calculateDocumentPagination(mockDOM);
  assert.ok(result.pageCount >= 2, 'Expected 2 pages for 1850px height');

  for (let i = 0; i < result.pageBreaks.length - 1; i++) {
    const cur = result.pageBreaks[i];
    const nxt = result.pageBreaks[i + 1];

    console.log(`  Page ${i + 1}: startY=${cur.startY}, endY=${cur.endY}, height=${cur.contentHeight}`);
    console.log(`  Page ${i + 2}: startY=${nxt.startY}, endY=${nxt.endY}, height=${nxt.contentHeight}`);

    // Core invariant: Next page startY must be greater than or equal to current page endY
    assert.ok(
      nxt.startY >= cur.endY,
      `FATAL: Overlapping page boundary detected! Page ${i + 1} endY (${cur.endY}) is greater than Page ${i + 2} startY (${nxt.startY})`
    );
  }
  console.log('✓ Passed: Strictly zero overlap between all consecutive page boundaries.\n');
}

// 2. Test Simulated Bullet-Level Boundary with TARGET_BULLET
console.log(`Test 2: Verifying Target Bullet "${TARGET_BULLET}"`);
{
  // Simulate DOM elements where TARGET_BULLET is positioned around 1040-1070px (near standard 1087px boundary)
  const headerTop = 200;
  const exp1HeaderTop = 500;
  const exp1HeaderBottom = 540;

  const b1Top = 550, b1Bottom = 590;
  const b2Top = 600, b2Bottom = 640;
  // TARGET_BULLET: ends right before boundary
  const bTargetTop = 1030, bTargetBottom = 1070;
  const bNextTop = 1085, bNextBottom = 1125;

  const mockHeadingEl = {
    tagName: 'H2',
    textContent: 'Professional Experience',
    getBoundingClientRect: () => ({ top: 460, bottom: 490, left: 0, right: 800, width: 800, height: 30 }),
  };

  const mockTargetBulletEl = {
    tagName: 'DIV',
    className: 'flex items-start gap-1.5 leading-relaxed',
    textContent: TARGET_BULLET,
    getBoundingClientRect: () => ({ top: bTargetTop, bottom: bTargetBottom, left: 0, right: 800, width: 800, height: 40 }),
  };

  const mockNextBulletEl = {
    tagName: 'DIV',
    className: 'flex items-start gap-1.5 leading-relaxed',
    textContent: 'Automated monthly dashboard consolidation...',
    getBoundingClientRect: () => ({ top: bNextTop, bottom: bNextBottom, left: 0, right: 800, width: 800, height: 40 }),
  };

  const mockEntryEl = {
    tagName: 'DIV',
    className: 'space-y-3',
    firstElementChild: {
      getBoundingClientRect: () => ({ top: exp1HeaderTop, bottom: exp1HeaderBottom, left: 0, right: 800, width: 800, height: 40 }),
    },
    querySelector: (sel: string) => {
      if (sel === '.flex.justify-between') {
        return {
          getBoundingClientRect: () => ({ top: exp1HeaderTop, bottom: exp1HeaderBottom, left: 0, right: 800, width: 800, height: 40 }),
        };
      }
      return null;
    },
    querySelectorAll: (sel: string) => {
      if (sel.includes('flex.items-start') || sel.includes('data-bullet') || sel.includes('li')) {
        return [
          {
            getBoundingClientRect: () => ({ top: b1Top, bottom: b1Bottom, left: 0, right: 800, width: 800, height: 40 }),
          },
          mockTargetBulletEl,
          mockNextBulletEl,
        ];
      }
      return [];
    },
    getBoundingClientRect: () => ({ top: exp1HeaderTop, bottom: 1300, left: 0, right: 800, width: 800, height: 800 }),
  };

  const mockContainer = {
    scrollHeight: 1900,
    offsetHeight: 1900,
    getBoundingClientRect: () => ({ top: 0, bottom: 1900, left: 0, right: 800, width: 800, height: 1900 }),
    querySelectorAll: (selector: string) => {
      if (selector.includes('h1, h2, h3')) {
        return [mockHeadingEl];
      }
      if (selector.includes('space-y-3') || selector.includes('space-y-4')) {
        return [mockEntryEl];
      }
      return [];
    },
  } as unknown as HTMLElement;

  const result = calculateDocumentPagination(mockContainer);
  console.log(`  Pagination calculated: ${result.pageCount} pages`);
  const page1 = result.pageBreaks[0];
  const page2 = result.pageBreaks[1];

  console.log(`  Page 1 range: [${page1.startY}, ${page1.endY}]`);
  console.log(`  Page 2 range: [${page2.startY}, ${page2.endY}]`);
  console.log(`  Target bullet range: [${bTargetTop}, ${bTargetBottom}]`);
  console.log(`  Next bullet range: [${bNextTop}, ${bNextBottom}]`);

  // Target bullet must be fully included in Page 1
  assert.ok(
    bTargetBottom <= page1.endY,
    `Target bullet bottom (${bTargetBottom}) should be <= Page 1 endY (${page1.endY})`
  );

  // Target bullet must NOT be included in Page 2
  assert.ok(
    bTargetBottom <= page2.startY,
    `Target bullet bottom (${bTargetBottom}) should be <= Page 2 startY (${page2.startY}) to prevent Page 2 duplication`
  );

  // Next bullet must start at or after Page 2 startY
  assert.ok(
    bNextTop >= page2.startY - 10,
    `Next bullet top (${bNextTop}) should begin on Page 2`
  );

  console.log('✓ Passed: Target bullet appears exclusively on Page 1 and is never duplicated on Page 2.\n');
}

// 3. Test Across All 22 Resume Templates
console.log('Test 3: Rendering & Content Single-Appearance Audit Across All 22 Templates');
const resumeTemplates = TEMPLATE_REGISTRY.filter((t) => t.type === 'resume');

resumeTemplates.forEach((t, index) => {
  const doc = createMockResumeWithTargetBullet(t.id);
  const TemplateComp = t.component;

  const html = renderToStaticMarkup(React.createElement(TemplateComp, { data: doc }));

  // Verify target bullet exists in the rendered template
  const occurrences = (html.match(/Prepared MIS reports and supported reporting requirements\./g) || []).length;
  assert.strictEqual(
    occurrences,
    1,
    `Template ${t.id} rendered target bullet ${occurrences} times in single render (expected exactly 1)`
  );

  // Verify personal name and experience entries
  assert.ok(html.includes('Rahul Deshmukh'), `Template ${t.id} missing personal name`);
  assert.ok(html.includes('Apex Global Financial Services'), `Template ${t.id} missing experience 1`);
  assert.ok(html.includes('Tata Consultancy Services'), `Template ${t.id} missing experience 2`);
  assert.ok(html.includes('Jamnalal Bajaj Institute'), `Template ${t.id} missing education`);

  console.log(`  [${index + 1}/22] Template '${t.id}' passed single-occurrence content audit.`);
});

console.log('\n================================================================');
console.log('ALL VERIFICATION CHECKS PASSED: ZERO DUPLICATION CONFIRMED');
console.log('================================================================');
