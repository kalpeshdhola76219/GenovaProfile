import React, { useState, useEffect } from 'react';
import {
  DocumentData,
  EducationItem,
  ExperienceItem,
  SkillItem,
  ProjectItem,
  CertificationItem,
  CustomSectionItem,
  ExecutiveMetric,
} from '../../types/document';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  BarChart3,
  Sliders,
  Eye,
  EyeOff,
} from 'lucide-react';

interface ResumeFormProps {
  data: DocumentData;
  onChange: (updated: DocumentData) => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<
    'personal' | 'metrics' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'credentials' | 'custom'
  >('personal');
  const [notification, setNotification] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [skillCategory] = useState<'technical' | 'soft' | 'language' | 'tool'>('technical');
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const updatePersonal = (field: string, value: any) => {
    onChange({
      ...data,
      personal: { ...data.personal, [field]: value },
    });
  };

  const updateContact = (field: string, value: any) => {
    onChange({
      ...data,
      contact: { ...data.contact, [field]: value },
    });
  };



  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp_${Date.now()}`,
      company: '',
      jobTitle: '',
      location: '',
      startDate: '',
      endDate: 'Present',
      currentlyWorking: true,
      description: '',
      achievements: '',
    };
    onChange({ ...data, experience: [newItem, ...data.experience] });
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, val: any) => {
    onChange({
      ...data,
      experience: data.experience.map((e) => {
        if (e.id !== id) return e;
        const updated = { ...e, [field]: val };
        if (field === 'endDate') {
          const strVal = String(val || '').trim();
          if (strVal && strVal.toLowerCase() !== 'present') {
            updated.currentlyWorking = false;
          } else if (strVal.toLowerCase() === 'present') {
            updated.currentlyWorking = true;
          }
        }
        return updated;
      }),
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter((e) => e.id !== id),
    });
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= data.experience.length) return;
    const copy = [...data.experience];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    onChange({ ...data, experience: copy });
  };

  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu_${Date.now()}`,
      degree: '',
      institute: '',
      location: '',
      startYear: '',
      endYear: '',
      score: '',
    };
    onChange({ ...data, education: [...data.education, newItem] });
  };

  const updateEducation = (id: string, field: keyof EducationItem, val: any) => {
    onChange({
      ...data,
      education: data.education.map((e) => (e.id === id ? { ...e, [field]: val } : e)),
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((e) => e.id !== id),
    });
  };

  const addSkill = (name: string, category: 'technical' | 'soft' | 'language' | 'tool' = skillCategory) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (data.skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;
    const newItem: SkillItem = {
      id: `sk_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: trimmed,
      category,
    };
    onChange({ ...data, skills: [...data.skills, newItem] });
    setSkillInput('');
  };

  const removeSkill = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((s) => s.id !== id),
    });
  };

  const addProject = () => {
    const newItem: ProjectItem = {
      id: `proj_${Date.now()}`,
      name: '',
      role: '',
      technologies: '',
      link: '',
      description: '',
    };
    onChange({ ...data, projects: [...data.projects, newItem] });
  };

  const updateProject = (id: string, field: keyof ProjectItem, val: any) => {
    onChange({
      ...data,
      projects: data.projects.map((p) => (p.id === id ? { ...p, [field]: val } : p)),
    });
  };

  const removeProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    });
  };

  const addCertification = () => {
    const newItem: CertificationItem = {
      id: `cert_${Date.now()}`,
      name: '',
      issuer: '',
      issueDate: '',
    };
    onChange({ ...data, certifications: [...data.certifications, newItem] });
  };

  const updateCertification = (id: string, field: keyof CertificationItem, val: any) => {
    onChange({
      ...data,
      certifications: data.certifications.map((c) => (c.id === id ? { ...c, [field]: val } : c)),
    });
  };

  const removeCertification = (id: string) => {
    onChange({
      ...data,
      certifications: data.certifications.filter((c) => c.id !== id),
    });
  };

  const isMonacoSovereign = data.templateId === 'resume-monaco-sovereign';

  // The Scorecard / Executive Metrics function is strictly exclusive to Monaco Sovereign Executive
  useEffect(() => {
    if (!isMonacoSovereign && activeTab === 'metrics') {
      setActiveTab('personal');
    }
  }, [isMonacoSovereign, activeTab]);

  const defaultMetrics: ExecutiveMetric[] = [
    { id: 'm1', value: '12+', label: 'Years Experience' },
    { id: 'm2', value: '$180M+', label: 'Portfolio Managed' },
    { id: 'm3', value: '18', label: 'Global Markets' },
    { id: 'm4', value: '99.99%', label: 'Delivery Rigor' },
  ];

  const currentMetrics: ExecutiveMetric[] =
    data.executiveMetrics && data.executiveMetrics.length > 0
      ? data.executiveMetrics
      : defaultMetrics;

  const updateExecutiveMetric = (id: string, field: 'value' | 'label', val: string) => {
    const list = currentMetrics.map((m) => (m.id === id ? { ...m, [field]: val } : m));
    onChange({
      ...data,
      executiveMetrics: list,
    });
  };

  const addExecutiveMetric = () => {
    if (currentMetrics.length >= 6) {
      showNotification('Maximum 6 metrics recommended for optimal layout');
      return;
    }
    const newMetric: ExecutiveMetric = {
      id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      value: '10+',
      label: 'Key Metric',
    };
    onChange({
      ...data,
      executiveMetrics: [...currentMetrics, newMetric],
    });
    showNotification('Added new scorecard metric');
  };

  const removeExecutiveMetric = (id: string) => {
    if (currentMetrics.length <= 1) {
      showNotification('Keep at least one metric or toggle the strip off');
      return;
    }
    onChange({
      ...data,
      executiveMetrics: currentMetrics.filter((m) => m.id !== id),
    });
  };

  const moveExecutiveMetric = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= currentMetrics.length) return;
    const copy = [...currentMetrics];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    onChange({
      ...data,
      executiveMetrics: copy,
    });
  };

  const toggleExecutiveMetrics = () => {
    const current = data.showExecutiveMetrics !== false;
    onChange({
      ...data,
      showExecutiveMetrics: !current,
    });
    showNotification(current ? 'Scorecard strip hidden on resume' : 'Scorecard strip visible on resume');
  };

  const applyMetricPreset = (presetMetrics: ExecutiveMetric[]) => {
    onChange({
      ...data,
      executiveMetrics: JSON.parse(JSON.stringify(presetMetrics)),
      showExecutiveMetrics: true,
    });
    showNotification('Applied executive scorecard preset!');
  };

  const autoCalculateMetrics = () => {
    let yearsCount = 0;
    if (data.experience.length > 0) {
      const allYears: number[] = [];
      data.experience.forEach((e) => {
        const startMatch = e.startDate?.match(/\b(19\d\d|20\d\d)\b/);
        if (startMatch) allYears.push(parseInt(startMatch[1], 10));
        const endMatch = e.endDate?.match(/\b(19\d\d|20\d\d)\b/);
        if (endMatch) allYears.push(parseInt(endMatch[1], 10));
      });
      if (allYears.length > 0) {
        const minYear = Math.min(...allYears);
        const currentYear = new Date().getFullYear();
        yearsCount = Math.max(1, currentYear - minYear);
      } else {
        yearsCount = Math.max(3, data.experience.length * 2);
      }
    } else {
      yearsCount = 12;
    }

    const locations = new Set<string>();
    if (data.contact.city) locations.add(data.contact.city);
    if (data.contact.country) locations.add(data.contact.country);
    data.experience.forEach((e) => {
      if (e.location) {
        e.location.split(/[,/•&]/).forEach((l) => {
          const clean = l.trim();
          if (clean) locations.add(clean);
        });
      }
    });
    const marketsCount = Math.max(locations.size, data.experience.length * 3, 12);

    let dollarImpact = '$180M+';
    const combinedText = [
      data.summary || '',
      ...data.experience.map((e) => `${e.description || ''} ${e.achievements || ''}`),
    ].join(' ');
    const dollarMatch = combinedText.match(/\$([0-9.]+[MBK]?\+?)/i);
    if (dollarMatch) {
      dollarImpact = dollarMatch[0];
    } else if (data.experience.length > 0) {
      dollarImpact = `$${Math.max(50, data.experience.length * 45)}M+`;
    }

    const calculated: ExecutiveMetric[] = [
      { id: `m_${Date.now()}_1`, value: `${yearsCount}+`, label: 'Years Experience' },
      { id: `m_${Date.now()}_2`, value: dollarImpact, label: 'Portfolio Managed' },
      { id: `m_${Date.now()}_3`, value: `${marketsCount}`, label: 'Global Markets' },
      { id: `m_${Date.now()}_4`, value: '99.99%', label: 'Delivery Rigor' },
    ];

    onChange({
      ...data,
      executiveMetrics: calculated,
      showExecutiveMetrics: true,
    });
    showNotification('Auto-calculated executive metrics from your resume!');
  };

  const SCORECARD_PRESETS = [
    {
      name: 'Sovereign Executive',
      metrics: [
        { id: 'p1', value: '12+', label: 'Years Experience' },
        { id: 'p2', value: '$180M+', label: 'Portfolio Managed' },
        { id: 'p3', value: '18', label: 'Global Markets' },
        { id: 'p4', value: '99.99%', label: 'Delivery Rigor' },
      ],
    },
    {
      name: 'C-Suite / P&L',
      metrics: [
        { id: 'p1', value: '15+', label: 'Years Leadership' },
        { id: 'p2', value: '$250M+', label: 'P&L Managed' },
        { id: 'p3', value: '25+', label: 'Global Markets' },
        { id: 'p4', value: '98%', label: 'Retention Rate' },
      ],
    },
    {
      name: 'Tech & AI Lead',
      metrics: [
        { id: 'p1', value: '10+', label: 'Years Tech Lead' },
        { id: 'p2', value: '50M+', label: 'Users Scaled' },
        { id: 'p3', value: '99.99%', label: 'System Uptime' },
        { id: 'p4', value: '40+', label: 'Engineers Led' },
      ],
    },
    {
      name: 'Finance & Investment',
      metrics: [
        { id: 'p1', value: '14+', label: 'Years PE / VC' },
        { id: 'p2', value: '$500M+', label: 'AUM / Deals' },
        { id: 'p3', value: '30+', label: 'Portfolio Exits' },
        { id: 'p4', value: '28%', label: 'IRR Track Record' },
      ],
    },
    {
      name: 'Product & Growth',
      metrics: [
        { id: 'p1', value: '8+', label: 'Years Product' },
        { id: 'p2', value: '$45M+', label: 'ARR Added' },
        { id: 'p3', value: '10x', label: 'Scale Growth' },
        { id: 'p4', value: '4.8★', label: 'Product Rating' },
      ],
    },
  ];

  const tabs = [
    { id: 'personal', label: '1. Contact' },
    ...(isMonacoSovereign ? [{ id: 'metrics', label: 'Scorecard' }] : []),
    { id: 'summary', label: '2. Summary' },
    { id: 'experience', label: '3. Experience' },
    { id: 'education', label: '4. Education' },
    { id: 'skills', label: '5. Skills' },
    { id: 'projects', label: '6. Projects' },
    { id: 'credentials', label: '7. Certifications' },
    { id: 'custom', label: 'Custom' },
  ];

  return (
    <div className="space-y-6">
      {notification && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs font-medium">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'personal' && (
        <div className="space-y-4">
          {isMonacoSovereign && (
            <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50/40 border border-amber-200/90 rounded-xl flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0a0a0c] text-[#c5a059] flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  12+
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Monaco Sovereign Executive Scorecard</span>
                    <span className="text-[10px] font-semibold bg-[#c5a059]/20 text-[#85651e] px-1.5 py-0.5 rounded">Template Feature</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Edit the 4 executive stats ({currentMetrics.map(m => m.label).slice(0, 3).join(', ')}...) shown directly on your resume.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('metrics')}
                className="px-3 py-1.5 bg-[#0a0a0c] text-[#c5a059] hover:bg-slate-800 rounded-lg font-bold text-xs shrink-0 cursor-pointer transition-colors shadow-xs"
              >
                Edit Scorecard Stats →
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={data.personal.fullName}
                onChange={(e) => updatePersonal('fullName', e.target.value)}
                placeholder="e.g. Priya Patel"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Target Professional Title *</label>
              <input
                type="text"
                value={data.personal.professionalTitle || ''}
                onChange={(e) => updatePersonal('professionalTitle', e.target.value)}
                placeholder="e.g. Staff Full Stack Engineer / Product Leader"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                value={data.contact.email}
                onChange={(e) => updateContact('email', e.target.value)}
                placeholder="e.g. priya.patel@example.com"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="text"
                value={data.contact.phone}
                onChange={(e) => updateContact('phone', e.target.value)}
                placeholder="e.g. +1 (415) 555-0192"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City & State</label>
              <input
                type="text"
                value={data.contact.city || ''}
                onChange={(e) => updateContact('city', e.target.value)}
                placeholder="e.g. San Francisco, CA"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Country</label>
              <input
                type="text"
                value={data.contact.country || ''}
                onChange={(e) => updateContact('country', e.target.value)}
                placeholder="e.g. United States or India"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">LinkedIn Profile</label>
              <input
                type="text"
                value={data.contact.linkedin || ''}
                onChange={(e) => updateContact('linkedin', e.target.value)}
                placeholder="linkedin.com/in/username"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Portfolio / GitHub / Website</label>
              <input
                type="text"
                value={data.contact.website || data.contact.portfolio || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange({
                    ...data,
                    contact: {
                      ...data.contact,
                      website: val,
                      portfolio: val,
                    },
                  });
                }}
                placeholder="github.com/username or yoursite.dev"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {isMonacoSovereign && activeTab === 'metrics' && (
        <div className="space-y-5 text-xs">
          {/* Header Info & Visibility Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Executive Scorecard & Metric Strip</h3>
                {isMonacoSovereign && (
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                    Monaco Sovereign Template
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Manually customize the high-impact leadership statistics displayed in the dark executive bar under your header.
              </p>
            </div>

            {/* Toggle show/hide strip */}
            <button
              type="button"
              onClick={toggleExecutiveMetrics}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
                data.showExecutiveMetrics !== false
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {data.showExecutiveMetrics !== false ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>Strip Visible on Resume</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  <span>Strip Hidden on Resume</span>
                </>
              )}
            </button>
          </div>

          {/* Live Preview of the exact Scorecard strip from template */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#c5a059] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#c5a059]" /> Live Preview of Resume Scorecard
              </span>
              <span className="text-[10px] text-slate-400">Updates live as you edit below</span>
            </div>

            <div
              className={`grid gap-2 bg-[#0b101b] text-white rounded-xl p-3.5 border border-slate-800/80 transition-opacity ${
                data.showExecutiveMetrics === false ? 'opacity-40' : 'opacity-100'
              }`}
              style={{
                gridTemplateColumns: `repeat(${Math.max(currentMetrics.length, 1)}, minmax(0, 1fr))`,
              }}
            >
              {currentMetrics.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className={`text-center ${idx < currentMetrics.length - 1 ? 'border-r border-slate-800' : ''} px-1`}
                >
                  <div className="text-base sm:text-lg font-black text-[#c5a059] tracking-tight">{m.value || '—'}</div>
                  <div className="text-[8px] sm:text-[9px] uppercase tracking-wider text-slate-400 mt-0.5 leading-tight font-medium">
                    {m.label || 'Metric'}
                  </div>
                </div>
              ))}
            </div>
            {data.showExecutiveMetrics === false && (
              <p className="text-center text-[11px] text-amber-400/90 mt-2 font-medium">
                Note: This scorecard is currently toggled OFF and will not appear on your exported PDF.
              </p>
            )}
          </div>

          {/* Quick Actions Toolbar */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-500" /> Quick Autofill & Presets
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={autoCalculateMetrics}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-semibold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Auto-Calculate from Resume</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyMetricPreset(defaultMetrics)}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg font-semibold text-xs cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-slate-500" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-200/60">
              <span className="text-[11px] text-slate-400 self-center mr-1">Executive Themes:</span>
              {SCORECARD_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyMetricPreset(preset.metrics)}
                  className="text-[11px] px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer font-medium transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Metric Items List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs">
                Manual Edit Details ({currentMetrics.length} / 6)
              </span>
              {currentMetrics.length < 6 && (
                <button
                  type="button"
                  onClick={addExecutiveMetric}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Metric</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentMetrics.map((metric, index) => (
                <div
                  key={metric.id || index}
                  className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-mono">
                      Metric {index + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveExecutiveMetric(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                        title="Move left/up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveExecutiveMetric(index, 'down')}
                        disabled={index === currentMetrics.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                        title="Move right/down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      {currentMetrics.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExecutiveMetric(metric.id)}
                          className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer ml-1"
                          title="Remove metric"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Value / Stat Number *
                    </label>
                    <input
                      type="text"
                      value={metric.value}
                      onChange={(e) => updateExecutiveMetric(metric.id, 'value', e.target.value)}
                      placeholder="e.g. 12+, $180M+, 18, 99.99%"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 font-bold text-slate-900 text-sm focus:bg-white focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Label / Description *
                    </label>
                    <input
                      type="text"
                      value={metric.label}
                      onChange={(e) => updateExecutiveMetric(metric.id, 'label', e.target.value)}
                      placeholder="e.g. Years Experience, Portfolio Managed"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 font-medium text-slate-800 text-xs focus:bg-white focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
            <strong>Pro Tip:</strong> Executive scorecards are the highest-retention anchor on executive CVs. Keep metric values punchy (under 8 characters, e.g. <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono font-bold">$180M+</code> or <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono font-bold">12+</code>) and labels clear (<code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono font-bold">Years Experience</code>).
          </div>
        </div>
      )}

      {activeTab === 'summary' && (
        <div className="space-y-4 text-xs">
          {isMonacoSovereign && (
            <div className="p-2.5 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c5a059]" />
                <span className="text-slate-700">Looking to edit the 4 Executive Scorecard metrics?</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('metrics')}
                className="font-bold text-[#85651e] hover:underline cursor-pointer"
              >
                Edit Metrics Strip →
              </button>
            </div>
          )}
          <div>
            <label className="font-semibold text-slate-800 text-sm">Professional Summary</label>
          </div>
          <textarea
            rows={6}
            value={data.summary || ''}
            onChange={(e) => onChange({ ...data, summary: e.target.value })}
            placeholder="Write a concise 3-4 sentence elevator pitch highlighting your key career achievements, core technical competencies, and quantifiable business impact..."
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 bg-white leading-relaxed text-slate-800 text-xs"
          />
          <p className="text-[11px] text-slate-500">
            <strong>Pro Tip:</strong> Recruiters and ATS bots scan the first 3 lines of your summary for role keywords, years of experience, and metric scale.
          </p>
        </div>
      )}

      {activeTab === 'experience' && (
        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Work Experience</h3>
              <p className="text-slate-500 text-[11px]">List your experience in reverse chronological order.</p>
            </div>
            <button
              type="button"
              onClick={addExperience}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 font-medium shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Experience
            </button>
          </div>
          {data.experience.length === 0 ? (
            <p className="text-slate-500 italic p-4 bg-slate-50 rounded-xl text-center">
              No work experience added. Click "+ Add Experience" to begin.
            </p>
          ) : (
            <div className="space-y-4">
              {data.experience.map((exp, index) => (
                <div key={exp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 relative space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                    <span className="font-bold text-slate-700">Role #{index + 1}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveExperience(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveExperience(index, 'down')}
                        disabled={index === data.experience.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="p-1 text-rose-500 hover:text-rose-700 ml-2 cursor-pointer"
                        title="Delete Role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">Job Title *</label>
                      <input
                        type="text"
                        value={exp.jobTitle}
                        onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">Company Name *</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        placeholder="e.g. Stripe, Inc."
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">Location</label>
                      <input
                        type="text"
                        value={exp.location || ''}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        placeholder="e.g. San Francisco, CA / Remote"
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-0.5">Dates (Start - End)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={exp.startDate || ''}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          placeholder="2022-03"
                          className="w-1/2 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                        <input
                          type="text"
                          value={exp.endDate || ''}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          placeholder="Present"
                          className="w-1/2 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div className="mt-1.5">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-700 text-xs select-none font-medium">
                          <input
                            type="checkbox"
                            checked={!!exp.currentlyWorking}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              onChange({
                                ...data,
                                experience: data.experience.map((item) =>
                                  item.id === exp.id
                                    ? {
                                        ...item,
                                        currentlyWorking: checked,
                                        endDate: checked ? 'Present' : (item.endDate === 'Present' ? '' : item.endDate),
                                      }
                                    : item
                                ),
                              });
                            }}
                            className="rounded border-slate-300 text-[#5B4BDB] focus:ring-indigo-500"
                          />
                          <span>Currently Working (Present)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1">
                      <label className="font-semibold text-slate-700">Role Description & Responsibilities</label>
                    </div>
                    <textarea
                      rows={3}
                      value={exp.description || ''}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      placeholder="• Spearheaded core initiatives as Lead Engineer..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-0.5">Quantifiable Achievements (Optional)</label>
                    <textarea
                      rows={2}
                      value={exp.achievements || ''}
                      onChange={(e) => updateExperience(exp.id, 'achievements', e.target.value)}
                      placeholder="• Reduced p99 latency by 68% and optimized cloud compute cost by $140k/yr"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'education' && (
        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Education & Degrees</h3>
            <button
              type="button"
              onClick={addEducation}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-1 font-medium shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Degree
            </button>
          </div>
          {data.education.map((edu) => (
            <div key={edu.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 relative space-y-2">
              <button
                type="button"
                onClick={() => removeEducation(edu.id)}
                className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-2 gap-2 pr-6">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-0.5">Degree & Major</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="e.g. Master of Science in Computer Science"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5">Institute / University</label>
                  <input
                    type="text"
                    value={edu.institute}
                    onChange={(e) => updateEducation(edu.id, 'institute', e.target.value)}
                    placeholder="e.g. Stanford University"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5">Graduation Year & GPA</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={edu.endYear || ''}
                      onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                      placeholder="2017"
                      className="w-1/2 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                    <input
                      type="text"
                      value={edu.score || ''}
                      onChange={(e) => updateEducation(edu.id, 'score', e.target.value)}
                      placeholder="3.95 GPA"
                      className="w-1/2 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Skills & Competencies</h3>
              <p className="text-slate-500 text-[11px]">Add both technical skills and domain strengths.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill(skillInput);
                }
              }}
              placeholder="Type a skill and press Enter (e.g. TypeScript, AWS, Kubernetes)..."
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 bg-white"
            />
            <button
              type="button"
              onClick={() => addSkill(skillInput)}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-semibold cursor-pointer"
            >
              Add
            </button>
          </div>

          {suggestedSkills.length > 0 && (
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
              <span className="text-[11px] font-semibold text-indigo-900 block mb-1.5">
                Click any suggestion to add:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedSkills.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addSkill(s)}
                    className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-800 text-[11px] hover:bg-indigo-100 transition-colors cursor-pointer"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="font-semibold text-slate-700 block mb-2">Active Resume Skills ({data.skills.length}):</span>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1.5 font-medium"
                >
                  {skill.name}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    className="text-slate-400 hover:text-rose-600 font-bold cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Key Projects</h3>
            <button
              type="button"
              onClick={addProject}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 inline-flex items-center gap-1 font-medium shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Project
            </button>
          </div>
          {data.projects.map((p) => (
            <div key={p.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 relative space-y-2">
              <button
                type="button"
                onClick={() => removeProject(p.id)}
                className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-2 gap-2 pr-6">
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5">Project Name</label>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => updateProject(p.id, 'name', e.target.value)}
                    placeholder="e.g. Distributed Event Gateway"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-0.5">Link / Repository</label>
                  <input
                    type="text"
                    value={p.link || ''}
                    onChange={(e) => updateProject(p.id, 'link', e.target.value)}
                    placeholder="github.com/org/repo"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-0.5">Technologies Used</label>
                  <input
                    type="text"
                    value={p.technologies || ''}
                    onChange={(e) => updateProject(p.id, 'technologies', e.target.value)}
                    placeholder="Go, Redis, Kubernetes, eBPF"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-0.5">Project Description & Impact</label>
                  <textarea
                    rows={2}
                    value={p.description || ''}
                    onChange={(e) => updateProject(p.id, 'description', e.target.value)}
                    placeholder="Describe problem solved, metrics achieved, and architecture..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'credentials' && (
        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Certifications & Honors</h3>
            <button
              type="button"
              onClick={addCertification}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 inline-flex items-center gap-1 font-medium shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Certification
            </button>
          </div>
          {data.certifications.map((c) => (
            <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 relative flex gap-2 items-center">
              <div className="grid grid-cols-3 gap-2 flex-1">
                <div>
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => updateCertification(c.id, 'name', e.target.value)}
                    placeholder="Certification Name"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={c.issuer}
                    onChange={(e) => updateCertification(c.id, 'issuer', e.target.value)}
                    placeholder="Issuing Organization (e.g. AWS)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={c.issueDate || ''}
                    onChange={(e) => updateCertification(c.id, 'issueDate', e.target.value)}
                    placeholder="Year (e.g. 2023)"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeCertification(c.id)}
                className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 text-sm">Custom Sections</h3>
            <button
              type="button"
              onClick={() => {
                const newSec: CustomSectionItem = {
                  id: `cust_${Date.now()}`,
                  title: 'Languages',
                  type: 'text',
                  content: 'English (Fluent), Hindi, German (A2)',
                };
                onChange({ ...data, customSections: [...data.customSections, newSec] });
              }}
              className="px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 inline-flex items-center gap-1 font-medium shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Section
            </button>
          </div>
          {data.customSections.map((sec) => (
            <div key={sec.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 relative space-y-2">
              <div className="flex justify-between items-center pr-6">
                <input
                  type="text"
                  value={sec.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange({
                      ...data,
                      customSections: data.customSections.map((s) => (s.id === sec.id ? { ...s, title: val } : s)),
                    });
                  }}
                  className="font-bold text-slate-900 px-2 py-1 bg-white border border-slate-300 rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    onChange({
                      ...data,
                      customSections: data.customSections.filter((s) => s.id !== sec.id),
                    });
                  }}
                  className="text-rose-500 hover:text-rose-700 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                rows={2}
                value={sec.content || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  onChange({
                    ...data,
                    customSections: data.customSections.map((s) => (s.id === sec.id ? { ...s, content: val } : s)),
                  });
                }}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
