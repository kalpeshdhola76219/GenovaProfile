import React, { useEffect, useRef, useState } from 'react';
import { getTemplatesByType, RegisteredTemplate } from '../templates/registry';
import { OnePageFit } from '../components/preview/OnePageFit';
import { sampleBiodataDocument } from '../data/sampleData';
import { DocumentData } from '../types/document';

// Comprehensive long sample matrimonial profile to rigorously test layout scaling and page fill
const longSampleBiodataData: DocumentData = {
  ...sampleBiodataDocument,
  personal: {
    ...sampleBiodataDocument.personal,
    fullName: 'Aarav Rajesh Sharma',
    dateOfBirth: '1995-10-18',
    timeOfBirth: '07:45 AM',
    placeOfBirth: 'Ahmedabad, Gujarat',
    rashi: 'Tula (Libra)',
    nakshatra: 'Swati',
    manglik: 'Non-Manglik',
    gotra: 'Kashyap',
    caste: 'Brahmin',
    subCaste: 'Nagar',
    religion: 'Hindu',
    height: "5' 11\" (180 cm)",
    weight: '72 kg',
    complexion: 'Fair',
    bloodGroup: 'B+',
    motherTongue: 'Gujarati / Hindi',
    maritalStatus: 'Never Married',
    profilePhoto:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    extraPhotos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    ],
    diet: 'Strict Vegetarian',
  },
  education: [
    {
      id: 'edu-1',
      degree: 'B.Tech in Computer Science & Engineering',
      institute: 'Indian Institute of Technology (IIT) Bombay',
      endYear: '2017',
      description: 'Graduated with First Class Distinction (CGPA 9.2/10). Dean’s Honor List.',
    },
    {
      id: 'edu-2',
      degree: 'Master of Business Administration (MBA)',
      institute: 'Indian Institute of Management (IIM) Ahmedabad',
      endYear: '2020',
      description: 'Specialization in Technology Strategy and International Finance.',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      jobTitle: 'Lead Cloud Solutions Architect',
      company: 'Microsoft Corporation India',
      startDate: '2020',
      endDate: 'Present',
      location: 'Bengaluru / Hyderabad',
      description: 'Architecting scalable cloud infra for global enterprise banking clients.',
    },
    {
      id: 'exp-2',
      jobTitle: 'Senior Software Systems Engineer',
      company: 'Oracle Financial Services',
      startDate: '2017',
      endDate: '2020',
      location: 'Pune / Mumbai',
      description: 'Core engineering of distributed payment platforms and microservices.',
    },
  ],
  family: {
    fatherName: 'Rajesh Kantilal Sharma',
    fatherOccupation: 'Executive Director, State Bank of India (Retired)',
    motherName: 'Sunita Rajesh Sharma',
    motherOccupation: 'Principal, Delhi Public School',
    brothersCount: '1 Younger Brother (Software Engineer at Google California)',
    sistersCount: 'None',
    familyType: 'Nuclear with Traditional Vedic Values',
    familyStatus: 'Upper Middle Class',
    nativePlace: 'Vadodara, Gujarat',
    familyAddress: 'Bodakdev, Ahmedabad',
  },
  marriage: {
    lifestyle: 'Vegetarian, Teetotaler, Non-Smoker',
    hobbies: 'Classical Sitar, Badminton, Photography, Nature Treks',
    partnerExpectations:
      'Seeking an educated, warm, and broad-minded partner from a cultured family. Career-oriented and values family bonding.',
  },
  contact: {
    phone: '+91 98765 43210',
    email: 'aarav.sharma.matrimony@example.com',
    address: 'B-402, Shivalik High Street, Judges Bungalow Road, Bodakdev',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',
  },
  customSections: [
    {
      id: 'sec-astrology',
      title: 'Horoscope / Kundali Details',
      type: 'text',
      content:
        'Sun Sign: Libra • Gana: Deva • Nadi: Antya • Charan: 3 • Shani / Mangal: Favorable • Gun Milan: 32/36 compatible.',
    },
    {
      id: 'sec-assets',
      title: 'Family Assets & Property',
      type: 'text',
      content:
        'Owns 4-BHK Penthouse in Bodakdev, Ahmedabad, and commercial office space in GIFT City Gandhinagar.',
    },
  ],
};

interface TemplateAuditResult {
  id: string;
  name: string;
  scale: number;
  fillsPage: 'yes' | 'no';
  fitsOnePage: 'yes' | 'no';
  passed: boolean;
}

const TemplateAuditRow: React.FC<{
  template: RegisteredTemplate;
  onAuditComplete: (result: TemplateAuditResult) => void;
}> = ({ template, onAuditComplete }) => {
  const rowContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1.0);
  const [fillsPage, setFillsPage] = useState<'yes' | 'no'>('no');
  const [fitsOnePage, setFitsOnePage] = useState<'yes' | 'no'>('yes');
  const [hasAudited, setHasAudited] = useState<boolean>(false);

  const tplData: DocumentData = {
    ...longSampleBiodataData,
    templateId: template.id,
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const container = rowContainerRef.current;
      if (!container) return;

      const pageEl = container.querySelector('[data-one-page-fit="true"]') as HTMLElement | null;
      const rootEl = pageEl?.querySelector('.one-page-stage > :first-child') as HTMLElement | null;

      if (pageEl && rootEl) {
        const pageRect = pageEl.getBoundingClientRect();
        const rootRect = rootEl.getBoundingClientRect();

        const leftDiff = Math.abs(rootRect.left - pageRect.left);
        const topDiff = Math.abs(rootRect.top - pageRect.top);
        const rightDiff = Math.abs(rootRect.right - pageRect.right);
        const bottomDiff = Math.abs(rootRect.bottom - pageRect.bottom);

        // "yes only if the template root rectangle equals the page rectangle within 1 px on all 4 sides"
        const fills =
          leftDiff <= 1.05 && topDiff <= 1.05 && rightDiff <= 1.05 && bottomDiff <= 1.05;

        const isOver = pageEl.getAttribute('data-is-overflowing') === 'true';
        const parsedScale = parseFloat(pageEl.getAttribute('data-scale') || '1.0');
        const fits = parsedScale >= 0.72 && !isOver;

        const fillsStr = fills ? 'yes' : 'no';
        const fitsStr = fits ? 'yes' : 'no';

        setScale(parsedScale);
        setFillsPage(fillsStr);
        setFitsOnePage(fitsStr);
        setHasAudited(true);

        onAuditComplete({
          id: template.id,
          name: template.name,
          scale: parsedScale,
          fillsPage: fillsStr,
          fitsOnePage: fitsStr,
          passed: fills && fits,
        });
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [template.id]);

  const Component = template.component;

  return (
    <tr className="border-b border-slate-200 hover:bg-slate-50/80 transition-colors">
      <td className="py-3 px-4 text-sm font-semibold text-slate-900">
        <div>{template.name}</div>
        <div className="text-xs text-slate-400 font-mono">{template.id}</div>
      </td>
      <td className="py-3 px-4 text-sm font-mono font-bold text-slate-700">
        {scale.toFixed(3)} ({Math.round(scale * 100)}%)
      </td>
      <td className="py-3 px-4 text-sm">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
            fillsPage === 'yes'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-rose-100 text-rose-800'
          }`}
        >
          {fillsPage}
        </span>
      </td>
      <td className="py-3 px-4 text-sm">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
            fitsOnePage === 'yes'
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-rose-100 text-rose-800'
          }`}
        >
          {fitsOnePage}
        </span>
      </td>
      <td className="py-3 px-4 text-sm font-bold">
        {hasAudited ? (
          fillsPage === 'yes' && fitsOnePage === 'yes' ? (
            <span className="text-emerald-600 flex items-center gap-1">✓ PASS</span>
          ) : (
            <span className="text-rose-600 flex items-center gap-1">✗ FAIL</span>
          )
        ) : (
          <span className="text-slate-400">Auditing...</span>
        )}
      </td>
      <td className="py-3 px-4">
        {/* Thumbnail Preview Container */}
        <div
          ref={rowContainerRef}
          className="border border-slate-300 rounded shadow-xs overflow-hidden bg-white"
          style={{ width: '120px', height: '170px', position: 'relative' }}
        >
          <div
            style={{
              width: '800px',
              height: '1131px',
              transform: 'scale(0.15)',
              transformOrigin: 'top left',
              pointerEvents: 'none',
            }}
          >
            <OnePageFit data={tplData} TemplateComponent={Component} />
          </div>
        </div>
      </td>
    </tr>
  );
};

export const BiodataFullPageAudit: React.FC = () => {
  if (!import.meta.env.DEV) {
    return (
      <div className="p-8 text-center text-slate-600 font-sans">
        <h1 className="text-2xl font-bold text-slate-800">404 - Development Only</h1>
        <p className="mt-2 text-sm">This audit page is only accessible in development mode.</p>
      </div>
    );
  }

  const templates = getTemplatesByType('biodata');
  const [results, setResults] = useState<Record<string, TemplateAuditResult>>({});

  const handleAuditComplete = (result: TemplateAuditResult) => {
    setResults((prev) => ({
      ...prev,
      [result.id]: result,
    }));
  };

  const resultsList = Object.values(results);
  const passedCount = resultsList.filter((r) => r.passed).length;

  return (
    <div className="min-h-screen bg-slate-100 p-6 sm:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Development Audit Suite
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                Matrimonial Biodata Full Page & Auto-Fit Audit
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Rigorous full-page edge-to-edge fill and auto-fit verification across all biodata templates.
              </p>
            </div>
            {/* Requirement 7 Summary Line */}
            <div className="px-5 py-3 rounded-xl bg-emerald-50 border-2 border-emerald-500/80 text-emerald-950 font-black text-lg sm:text-xl shadow-xs shrink-0 text-center">
              {passedCount} of {templates.length} templates pass
            </div>
          </div>
        </div>

        {/* Audit Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3.5 px-4">Template Name</th>
                  <th className="py-3.5 px-4">Scale (s)</th>
                  <th className="py-3.5 px-4">Fills Page</th>
                  <th className="py-3.5 px-4">Fits One Page</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Thumbnail</th>
                </tr>
              </thead>
              <tbody>
                {templates.map((tpl) => (
                  <TemplateAuditRow
                    key={tpl.id}
                    template={tpl}
                    onAuditComplete={handleAuditComplete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiodataFullPageAudit;

/**
 * Self-mounting helper for `/dev/biodata-audit` route in development mode
 */
export function mountBiodataAuditPage(): void {
  if (typeof window === 'undefined' || !import.meta.env.DEV) return;
  if (document.getElementById('biodata-audit-mounted-root')) return;

  const mount = () => {
    const rootEl = document.getElementById('root');
    if (!rootEl) {
      setTimeout(mount, 50);
      return;
    }
    import('react-dom/client').then(({ createRoot }) => {
      const auditContainer = document.createElement('div');
      auditContainer.id = 'biodata-audit-mounted-root';
      document.body.innerHTML = '';
      document.body.appendChild(auditContainer);
      createRoot(auditContainer).render(<BiodataFullPageAudit />);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
}

if (
  import.meta.env.DEV &&
  typeof window !== 'undefined' &&
  window.location.pathname === '/dev/biodata-audit'
) {
  mountBiodataAuditPage();
}
