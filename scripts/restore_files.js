const fs = require('fs');
const path = require('path');

function writeFile(filePath, content) {
  const fullPath = path.resolve(filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log('Wrote:', filePath);
}

// -------------------------------------------------------------
// 1. FORMS & ATS MODAL
// -------------------------------------------------------------
writeFile('src/components/forms/BiodataForm.tsx', `import React, { useState } from 'react';
import { DocumentData, EducationItem, ExperienceItem, CustomSectionItem } from '../../types/document';
import { PhotoUploader } from '../common/PhotoUploader';
import { aiService } from '../../services/aiService';
import { Sparkles, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface BiodataFormProps {
  data: DocumentData;
  onChange: (updated: DocumentData) => void;
}

export const BiodataForm: React.FC<BiodataFormProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'education' | 'family' | 'contact' | 'expectations' | 'custom'>('personal');
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

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

  const updateFamily = (field: string, value: any) => {
    onChange({
      ...data,
      family: { ...data.family, [field]: value },
    });
  };

  const updateMarriage = (field: string, value: any) => {
    onChange({
      ...data,
      marriage: { ...data.marriage, [field]: value },
    });
  };

  const addEducation = () => {
    const newItem: EducationItem = {
      id: \`edu_\${Date.now()}\`,
      degree: '',
      institute: '',
      endYear: '',
      score: '',
    };
    onChange({
      ...data,
      education: [...data.education, newItem],
    });
  };

  const updateEducation = (id: string, field: keyof EducationItem, val: string) => {
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

  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: \`exp_\${Date.now()}\`,
      company: '',
      jobTitle: '',
      startDate: '',
      endDate: 'Present',
      currentlyWorking: true,
      achievements: '',
    };
    onChange({
      ...data,
      experience: [...data.experience, newItem],
    });
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, val: any) => {
    onChange({
      ...data,
      experience: data.experience.map((e) => (e.id === id ? { ...e, [field]: val } : e)),
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter((e) => e.id !== id),
    });
  };

  const addCustomSection = () => {
    const newSec: CustomSectionItem = {
      id: \`cust_\${Date.now()}\`,
      title: 'Additional Details',
      type: 'key-value',
      items: [
        { id: \`kv_\${Date.now()}_1\`, key: 'Field Name', value: 'Details' },
      ],
    };
    onChange({
      ...data,
      customSections: [...data.customSections, newSec],
    });
  };

  const updateCustomSection = (id: string, field: string, val: any) => {
    onChange({
      ...data,
      customSections: data.customSections.map((s) => (s.id === id ? { ...s, [field]: val } : s)),
    });
  };

  const removeCustomSection = (id: string) => {
    onChange({
      ...data,
      customSections: data.customSections.filter((s) => s.id !== id),
    });
  };

  const handleAIGenerateAboutMe = async () => {
    setAiLoading('aboutMe');
    try {
      const res = await aiService.generateAboutMeBiodata(data);
      if (res.success) {
        updateMarriage('aboutMe', res.result);
        showNotification('Generated "About Myself" using your background details!');
      }
    } finally {
      setAiLoading(null);
    }
  };

  const handleAIGenerateExpectations = async () => {
    setAiLoading('expectations');
    try {
      const res = await aiService.generatePartnerExpectations(data);
      if (res.success) {
        updateMarriage('partnerExpectations', res.result);
        showNotification('Partner expectations generated successfully!');
      }
    } finally {
      setAiLoading(null);
    }
  };

  const tabs = [
    { id: 'personal', label: '1. Personal & Kundali' },
    { id: 'education', label: '2. Education & Profession' },
    { id: 'family', label: '3. Family Heritage' },
    { id: 'contact', label: '4. Contact & Address' },
    { id: 'expectations', label: '5. Alliance Preferences' },
    { id: 'custom', label: '6. Additional Details' },
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
            className={\`px-3 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer \${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }\`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'personal' && (
        <div className="space-y-4">
          <PhotoUploader
            currentPhoto={data.personal.profilePhoto}
            onPhotoChange={(photo) => updatePersonal('profilePhoto', photo)}
            onRemovePhoto={() => updatePersonal('profilePhoto', '')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={data.personal.fullName}
                onChange={(e) => updatePersonal('fullName', e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={data.personal.dateOfBirth || ''}
                onChange={(e) => updatePersonal('dateOfBirth', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Age</label>
              <input
                type="text"
                value={data.personal.age || ''}
                onChange={(e) => updatePersonal('age', e.target.value)}
                placeholder="e.g. 28 Years"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={data.personal.gender || 'Male'}
                onChange={(e) => updatePersonal('gender', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Height</label>
              <input
                type="text"
                value={data.personal.height || ''}
                onChange={(e) => updatePersonal('height', e.target.value)}
                placeholder={'e.g. 5\\' 10" (178 cm)'}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Religion</label>
              <input
                type="text"
                value={data.personal.religion || 'Hindu'}
                onChange={(e) => updatePersonal('religion', e.target.value)}
                placeholder="e.g. Hindu, Jain, Sikh"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Caste</label>
              <input
                type="text"
                value={data.personal.caste || ''}
                onChange={(e) => updatePersonal('caste', e.target.value)}
                placeholder="e.g. Brahmin, Rajput, Patel"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sub-Caste (Optional)</label>
              <input
                type="text"
                value={data.personal.subCaste || ''}
                onChange={(e) => updatePersonal('subCaste', e.target.value)}
                placeholder="e.g. Gaur, Kulin"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gotra</label>
              <input
                type="text"
                value={data.personal.gotra || ''}
                onChange={(e) => updatePersonal('gotra', e.target.value)}
                placeholder="e.g. Kashyap, Bhardwaj"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Manglik Status</label>
              <select
                value={data.personal.manglik || 'Non-Manglik'}
                onChange={(e) => updatePersonal('manglik', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              >
                <option value="Non-Manglik">Non-Manglik</option>
                <option value="Manglik">Manglik</option>
                <option value="Anshik Manglik">Anshik Manglik</option>
                <option value="Don't Know">Don't Know</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mother Tongue</label>
              <input
                type="text"
                value={data.personal.motherTongue || ''}
                onChange={(e) => updatePersonal('motherTongue', e.target.value)}
                placeholder="e.g. Hindi, Gujarati, Marathi"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Time of Birth</label>
              <input
                type="text"
                value={data.personal.timeOfBirth || ''}
                onChange={(e) => updatePersonal('timeOfBirth', e.target.value)}
                placeholder="e.g. 08:30 AM"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Place of Birth</label>
              <input
                type="text"
                value={data.personal.placeOfBirth || ''}
                onChange={(e) => updatePersonal('placeOfBirth', e.target.value)}
                placeholder="e.g. Jaipur, Rajasthan"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'education' && (
        <div className="space-y-5 text-xs">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-slate-900 text-sm">Educational Qualifications</h3>
              <button
                type="button"
                onClick={addEducation}
                className="px-2.5 py-1 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-1 font-medium cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Degree
              </button>
            </div>
            {data.education.length === 0 ? (
              <p className="text-slate-500 italic p-3 bg-slate-50 rounded-lg text-center">
                No education added yet. Click "+ Add Degree" to add qualifications.
              </p>
            ) : (
              <div className="space-y-3">
                {data.education.map((edu) => (
                  <div key={edu.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 relative">
                    <button
                      type="button"
                      onClick={() => removeEducation(edu.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-2 pr-6">
                      <div className="col-span-2">
                        <label className="block font-semibold text-slate-700 mb-0.5">Degree / Course</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="e.g. B.Tech in Computer Science"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-0.5">Institute / University</label>
                        <input
                          type="text"
                          value={edu.institute}
                          onChange={(e) => updateEducation(edu.id, 'institute', e.target.value)}
                          placeholder="e.g. IIT Delhi"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-0.5">Completion Year</label>
                        <input
                          type="text"
                          value={edu.endYear || ''}
                          onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                          placeholder="e.g. 2019"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-slate-900 text-sm">Career & Occupation</h3>
              <button
                type="button"
                onClick={addExperience}
                className="px-2.5 py-1 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-1 font-medium cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Job
              </button>
            </div>
            {data.experience.length === 0 ? (
              <p className="text-slate-500 italic p-3 bg-slate-50 rounded-lg text-center">
                No employment details added. Click "+ Add Job" to add job details.
              </p>
            ) : (
              <div className="space-y-3">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 relative">
                    <button
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-2 pr-6">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-0.5">Job Title</label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                          placeholder="e.g. Senior Software Architect"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-0.5">Company / Organization</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="e.g. Google / Microsoft"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-0.5">Work Location</label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                          placeholder="e.g. Bengaluru, India"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-0.5">Annual Income (Optional)</label>
                        <input
                          type="text"
                          value={exp.achievements || ''}
                          onChange={(e) => updateExperience(exp.id, 'achievements', e.target.value)}
                          placeholder="e.g. ₹35 LPA or Confidential"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'family' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Father's Name</label>
            <input
              type="text"
              value={data.family.fatherName || ''}
              onChange={(e) => updateFamily('fatherName', e.target.value)}
              placeholder="e.g. Dr. Ramesh Sharma"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Father's Occupation</label>
            <input
              type="text"
              value={data.family.fatherOccupation || ''}
              onChange={(e) => updateFamily('fatherOccupation', e.target.value)}
              placeholder="e.g. Retired Govt. Officer / Businessman"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mother's Name</label>
            <input
              type="text"
              value={data.family.motherName || ''}
              onChange={(e) => updateFamily('motherName', e.target.value)}
              placeholder="e.g. Mrs. Sunita Sharma"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Mother's Occupation</label>
            <input
              type="text"
              value={data.family.motherOccupation || ''}
              onChange={(e) => updateFamily('motherOccupation', e.target.value)}
              placeholder="e.g. Homemaker / School Principal"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Brothers Count & Status</label>
            <input
              type="text"
              value={data.family.brothersCount || ''}
              onChange={(e) => updateFamily('brothersCount', e.target.value)}
              placeholder="e.g. 1 (Married, living in UK)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Sisters Count & Status</label>
            <input
              type="text"
              value={data.family.sistersCount || ''}
              onChange={(e) => updateFamily('sistersCount', e.target.value)}
              placeholder="e.g. 1 (Unmarried, studying)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Family Type</label>
            <select
              value={data.family.familyType || 'Nuclear'}
              onChange={(e) => updateFamily('familyType', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            >
              <option value="Nuclear">Nuclear</option>
              <option value="Joint">Joint Family</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Native Place / Ancestral Roots</label>
            <input
              type="text"
              value={data.family.nativePlace || ''}
              onChange={(e) => updateFamily('nativePlace', e.target.value)}
              placeholder="e.g. Jaipur, Rajasthan"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            />
          </div>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Contact Phone / Mobile *</label>
            <input
              type="text"
              value={data.contact.phone}
              onChange={(e) => updateContact('phone', e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Contact Email</label>
            <input
              type="email"
              value={data.contact.email}
              onChange={(e) => updateContact('email', e.target.value)}
              placeholder="e.g. family.contact@example.com"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">City</label>
            <input
              type="text"
              value={data.contact.city || ''}
              onChange={(e) => updateContact('city', e.target.value)}
              placeholder="e.g. Jaipur"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">State / Province</label>
            <input
              type="text"
              value={data.contact.state || ''}
              onChange={(e) => updateContact('state', e.target.value)}
              placeholder="e.g. Rajasthan"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Residential Address</label>
            <textarea
              rows={2}
              value={data.contact.address || ''}
              onChange={(e) => updateContact('address', e.target.value)}
              placeholder="e.g. B-402, Royal Residency, Malviya Nagar"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
            />
          </div>
        </div>
      )}

      {activeTab === 'expectations' && (
        <div className="space-y-4 text-xs">
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-slate-700">About Myself</label>
                <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200 inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-violet-600" /> GenovaProfile AI
                </span>
              </div>
              <button
                type="button"
                onClick={handleAIGenerateAboutMe}
                disabled={aiLoading === 'aboutMe'}
                className="px-2.5 py-1 text-xs font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-lg hover:bg-violet-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                {aiLoading === 'aboutMe' ? 'Synthesizing...' : 'Generate with AI'}
              </button>
            </div>
            <textarea
              rows={4}
              value={data.marriage.aboutMe || ''}
              onChange={(e) => updateMarriage('aboutMe', e.target.value)}
              placeholder="Describe personality, values, hobbies, and outlook on life..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white leading-relaxed"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">Partner Expectations</label>
              <button
                type="button"
                onClick={handleAIGenerateExpectations}
                disabled={aiLoading === 'expectations'}
                className="px-2.5 py-1 text-xs font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-lg hover:bg-violet-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                {aiLoading === 'expectations' ? 'Drafting...' : 'Generate with AI'}
              </button>
            </div>
            <textarea
              rows={3}
              value={data.marriage.partnerExpectations || ''}
              onChange={(e) => updateMarriage('partnerExpectations', e.target.value)}
              placeholder="e.g. Looking for an educated, understanding, and family-oriented companion..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white leading-relaxed"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hobbies & Interests</label>
              <input
                type="text"
                value={data.marriage.hobbies || ''}
                onChange={(e) => updateMarriage('hobbies', e.target.value)}
                placeholder="e.g. Music, Badminton, Reading, Travel"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Diet / Lifestyle</label>
              <input
                type="text"
                value={data.marriage.lifestyle || ''}
                onChange={(e) => updateMarriage('lifestyle', e.target.value)}
                placeholder="e.g. Pure Vegetarian, Non-smoker"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'custom' && (
        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Custom Sections</h3>
              <p className="text-slate-500 text-[11px]">Add specialized fields like Kundali details, Property/Assets, or References.</p>
            </div>
            <button
              type="button"
              onClick={addCustomSection}
              className="px-2.5 py-1 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center gap-1 font-medium cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Section
            </button>
          </div>
          {data.customSections.length === 0 ? (
            <p className="text-slate-500 italic p-3 bg-slate-50 rounded-lg text-center">
              No custom sections added yet. Click "+ Add Section" to add one.
            </p>
          ) : (
            <div className="space-y-3">
              {data.customSections.map((sec) => (
                <div key={sec.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 relative space-y-2">
                  <div className="flex justify-between items-center pr-6">
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => updateCustomSection(sec.id, 'title', e.target.value)}
                      placeholder="Section Title (e.g. Kundali Details)"
                      className="font-bold text-slate-900 px-2 py-1 bg-white border border-slate-300 rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeCustomSection(sec.id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={sec.content || ''}
                    onChange={(e) => updateCustomSection(sec.id, 'content', e.target.value)}
                    placeholder="Enter details or notes..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
`);
