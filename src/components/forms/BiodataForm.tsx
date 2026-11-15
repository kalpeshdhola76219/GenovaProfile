import React, { useState } from 'react';
import { DocumentData, EducationItem, FamilyMemberItem } from '../../types/document';
import { PhotoUploader } from '../common/PhotoUploader';
import { User, Users, Heart, GraduationCap, Phone, Sparkles, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface BiodataFormProps {
  data: DocumentData;
  onChange: (updated: DocumentData) => void;
}

export const BiodataForm: React.FC<BiodataFormProps> = ({ data, onChange }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'astrology' | 'family' | 'career' | 'expectations' | 'contact'>('personal');
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

  const updateContact = (field: string, value: any) => {
    onChange({
      ...data,
      contact: { ...data.contact, [field]: value },
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-xs">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-slate-50/75 overflow-x-auto p-1.5 gap-1">
        {[
          { id: 'personal', label: 'Personal', icon: User },
          { id: 'astrology', label: 'Horoscope / Kundali', icon: Sparkles },
          { id: 'career', label: 'Education & Work', icon: GraduationCap },
          { id: 'family', label: 'Family Details', icon: Users },
          { id: 'expectations', label: 'About & Expectations', icon: Heart },
          { id: 'contact', label: 'Contact', icon: Phone },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium cursor-pointer transition-all shrink-0 ${
                isActive
                  ? 'bg-white text-indigo-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {notification && (
        <div className="m-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* TAB 1: Personal Details */}
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 text-sm border-b pb-2">Basic Personal Profile</h4>

            <div>
              <PhotoUploader
                currentPhoto={data.personal?.profilePhoto}
                onPhotoChange={(url) => updatePersonal('profilePhoto', url)}
                onRemovePhoto={() => updatePersonal('profilePhoto', undefined)}
                label="Profile Photograph"
                aspectRatio="3:4"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  value={data.personal?.fullName || ''}
                  onChange={(e) => updatePersonal('fullName', e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={data.personal?.dateOfBirth || ''}
                  onChange={(e) => updatePersonal('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                <select
                  value={data.personal?.gender || 'Male'}
                  onChange={(e) => updatePersonal('gender', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Height</label>
                <input
                  type="text"
                  value={data.personal?.height || ''}
                  onChange={(e) => updatePersonal('height', e.target.value)}
                  placeholder="e.g. 5 ft 10 in (178 cm)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Weight</label>
                <input
                  type="text"
                  value={data.personal?.weight || ''}
                  onChange={(e) => updatePersonal('weight', e.target.value)}
                  placeholder="e.g. 68 kg"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Blood Group</label>
                <input
                  type="text"
                  value={data.personal?.bloodGroup || ''}
                  onChange={(e) => updatePersonal('bloodGroup', e.target.value)}
                  placeholder="e.g. B+"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Complexion</label>
                <input
                  type="text"
                  value={data.personal?.complexion || ''}
                  onChange={(e) => updatePersonal('complexion', e.target.value)}
                  placeholder="e.g. Fair / Wheatish"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mother Tongue</label>
                <input
                  type="text"
                  value={data.personal?.motherTongue || ''}
                  onChange={(e) => updatePersonal('motherTongue', e.target.value)}
                  placeholder="e.g. Hindi, Gujarati, Marathi"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Religion</label>
                <input
                  type="text"
                  value={data.personal?.religion || 'Hindu'}
                  onChange={(e) => updatePersonal('religion', e.target.value)}
                  placeholder="e.g. Hindu / Jain / Sikh"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Caste & Sub-Caste</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={data.personal?.caste || ''}
                    onChange={(e) => updatePersonal('caste', e.target.value)}
                    placeholder="Caste"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={data.personal?.subCaste || ''}
                    onChange={(e) => updatePersonal('subCaste', e.target.value)}
                    placeholder="Sub-Caste"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Marital Status</label>
                <select
                  value={data.personal?.maritalStatus || 'Never Married'}
                  onChange={(e) => updatePersonal('maritalStatus', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Never Married">Never Married</option>
                  <option value="Awaiting Divorce">Awaiting Divorce</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Horoscope / Astrology */}
        {activeTab === 'astrology' && (
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 text-sm border-b pb-2">Astrological & Kundali Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Time of Birth</label>
                <input
                  type="text"
                  value={data.personal?.timeOfBirth || ''}
                  onChange={(e) => updatePersonal('timeOfBirth', e.target.value)}
                  placeholder="e.g. 09:35 AM"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Place of Birth</label>
                <input
                  type="text"
                  value={data.personal?.placeOfBirth || ''}
                  onChange={(e) => updatePersonal('placeOfBirth', e.target.value)}
                  placeholder="e.g. Ahmedabad, Gujarat"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Rashi (Zodiac Moon Sign)</label>
                <input
                  type="text"
                  value={data.personal?.rashi || ''}
                  onChange={(e) => updatePersonal('rashi', e.target.value)}
                  placeholder="e.g. Mesh / Taurus / Vrishabha"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nakshatra</label>
                <input
                  type="text"
                  value={data.personal?.nakshatra || ''}
                  onChange={(e) => updatePersonal('nakshatra', e.target.value)}
                  placeholder="e.g. Rohini / Ashwini"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Gotra</label>
                <input
                  type="text"
                  value={data.personal?.gotra || ''}
                  onChange={(e) => updatePersonal('gotra', e.target.value)}
                  placeholder="e.g. Kashyap"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Manglik Status</label>
                <select
                  value={data.personal?.manglik || 'No'}
                  onChange={(e) => updatePersonal('manglik', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                >
                  <option value="No">Non-Manglik</option>
                  <option value="Yes">Manglik</option>
                  <option value="Anshik">Anshik Manglik (Partial)</option>
                  <option value="Don't Know">Don't Know</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Education & Career */}
        {activeTab === 'career' && (
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 text-sm border-b pb-2">Education & Profession</h4>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Occupation / Job Title</label>
              <input
                type="text"
                value={data.personal?.professionalTitle || ''}
                onChange={(e) => updatePersonal('professionalTitle', e.target.value)}
                placeholder="e.g. Senior Software Engineer at MNC"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
              />
            </div>

            {/* Education Items */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700">Educational Qualifications</span>
                <button
                  type="button"
                  onClick={() => {
                    const newItem: EducationItem = {
                      id: String(Date.now()),
                      degree: '',
                      institute: '',
                      endYear: '',
                    };
                    onChange({ ...data, education: [...(data.education || []), newItem] });
                  }}
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Degree
                </button>
              </div>

              {(data.education || []).map((edu, idx) => (
                <div key={edu.id || idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const updated = [...data.education];
                      updated[idx].degree = e.target.value;
                      onChange({ ...data, education: updated });
                    }}
                    placeholder="Degree (e.g. B.Tech Computer Eng)"
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    value={edu.institute}
                    onChange={(e) => {
                      const updated = [...data.education];
                      updated[idx].institute = e.target.value;
                      onChange({ ...data, education: updated });
                    }}
                    placeholder="College / University"
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={edu.endYear || ''}
                      onChange={(e) => {
                        const updated = [...data.education];
                        updated[idx].endYear = e.target.value;
                        onChange({ ...data, education: updated });
                      }}
                      placeholder="Year"
                      className="w-24 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = data.education.filter((_, i) => i !== idx);
                        onChange({ ...data, education: updated });
                      }}
                      className="p-1.5 text-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Family Details */}
        {activeTab === 'family' && (
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 text-sm border-b pb-2">Family Information</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Father's Name & Occupation</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={data.family?.fatherName || ''}
                    onChange={(e) => updateFamily('fatherName', e.target.value)}
                    placeholder="Father Name"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={data.family?.fatherOccupation || ''}
                    onChange={(e) => updateFamily('fatherOccupation', e.target.value)}
                    placeholder="Occupation / Business"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mother's Name & Occupation</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={data.family?.motherName || ''}
                    onChange={(e) => updateFamily('motherName', e.target.value)}
                    placeholder="Mother Name"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={data.family?.motherOccupation || ''}
                    onChange={(e) => updateFamily('motherOccupation', e.target.value)}
                    placeholder="e.g. Homemaker / Teacher"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Brothers & Married Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={data.family?.brothersCount || ''}
                    onChange={(e) => updateFamily('brothersCount', e.target.value)}
                    placeholder="e.g. 1 Brother"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={data.family?.marriedBrothers || ''}
                    onChange={(e) => updateFamily('marriedBrothers', e.target.value)}
                    placeholder="Married / Unmarried"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Sisters & Married Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={data.family?.sistersCount || ''}
                    onChange={(e) => updateFamily('sistersCount', e.target.value)}
                    placeholder="e.g. 1 Sister"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={data.family?.marriedSisters || ''}
                    onChange={(e) => updateFamily('marriedSisters', e.target.value)}
                    placeholder="Married / Unmarried"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Family Type & Values</label>
                <input
                  type="text"
                  value={data.family?.familyType || 'Nuclear Family / Moderate'}
                  onChange={(e) => updateFamily('familyType', e.target.value)}
                  placeholder="e.g. Joint / Nuclear, Traditional / Moderate"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Native Place / Ancestral Town</label>
                <input
                  type="text"
                  value={data.family?.nativePlace || ''}
                  onChange={(e) => updateFamily('nativePlace', e.target.value)}
                  placeholder="e.g. Surat, Gujarat"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Expectations & About Me */}
        {activeTab === 'expectations' && (
          <div className="space-y-4">
            <div className="border-b pb-2">
              <h4 className="font-bold text-slate-800 text-sm">About Me & Partner Expectations</h4>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">About Me (Lifestyle, Hobbies & Values)</label>
              <textarea
                rows={3}
                value={data.marriage?.aboutMe || ''}
                onChange={(e) => updateMarriage('aboutMe', e.target.value)}
                placeholder="Share a brief introduction about your lifestyle, interests, hobbies, and outlook on life..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Partner Expectations</label>
              <textarea
                rows={4}
                value={data.marriage?.partnerExpectations || ''}
                onChange={(e) => updateMarriage('partnerExpectations', e.target.value)}
                placeholder="Describe your expectations regarding education, family values, lifestyle, and preferences..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {/* TAB 6: Contact */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 text-sm border-b pb-2">Contact & Residence Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Mobile / WhatsApp Number *</label>
                <input
                  type="text"
                  value={data.contact?.phone || ''}
                  onChange={(e) => updateContact('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={data.contact?.email || ''}
                  onChange={(e) => updateContact('email', e.target.value)}
                  placeholder="contact@example.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-semibold mb-1">Residential Address</label>
                <input
                  type="text"
                  value={data.contact?.address || ''}
                  onChange={(e) => updateContact('address', e.target.value)}
                  placeholder="e.g. 402, Shivalik Heights, Drive-In Road"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">City</label>
                <input
                  type="text"
                  value={data.contact?.city || ''}
                  onChange={(e) => updateContact('city', e.target.value)}
                  placeholder="e.g. Ahmedabad"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">State & Country</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={data.contact?.state || ''}
                    onChange={(e) => updateContact('state', e.target.value)}
                    placeholder="Gujarat"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={data.contact?.country || 'India'}
                    onChange={(e) => updateContact('country', e.target.value)}
                    placeholder="India"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
