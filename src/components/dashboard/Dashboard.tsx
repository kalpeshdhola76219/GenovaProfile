import React, { useState, useEffect } from 'react';
import { DocumentData, DocumentType } from '../../types/document';
import { storageService } from '../../services/storageService';
import { getTemplateById } from '../../templates/registry';
import {
  FileText,
  Heart,
  Plus,
  Copy,
  Trash2,
  Edit,
  Calendar,
  Sparkles,
  Search,
  Check,
  AlertTriangle,
  RotateCcw,
  Mail,
} from 'lucide-react';
import { BUSINESS } from '../../config/business';

interface DashboardProps {
  onOpenDocument: (doc: DocumentData) => void;
  onCreateNew: (type: DocumentType) => void;
  onBrowseTemplates: (type?: DocumentType) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onOpenDocument,
  onCreateNew,
  onBrowseTemplates,
}) => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadDocs = () => {
    const list = storageService.getDocuments();
    setDocuments(list);
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDuplicate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const dup = storageService.duplicateDocument(id);
    if (dup) {
      loadDocs();
      showNotice('Document duplicated successfully!');
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storageService.deleteDocument(id);
    setDeleteConfirmId(null);
    loadDocs();
    showNotice('Document removed.');
  };

  const handleStartRename = (doc: DocumentData, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(doc.id);
    setEditingTitle(doc.title);
  };

  const handleSaveRename = (id: string, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    if (editingTitle.trim()) {
      storageService.renameDocument(id, editingTitle.trim());
      loadDocs();
      showNotice('Document renamed.');
    }
    setEditingId(null);
  };

  const handleResetDemo = () => {
    storageService.resetToDemo();
    loadDocs();
    showNotice('Reset documents to realistic demo samples.');
  };

  const filteredDocs = documents.filter((d) => {
    if (!searchQuery.trim()) return true;
    return d.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notice */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Header Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            My Documents
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, manage and customize your professional documents.
          </p>
        </div>

        {/* Action Buttons: Create New */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onCreateNew('resume')}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0066FF] rounded-xl hover:bg-[#0055D6] transition-colors inline-flex items-center gap-1.5 shadow-sm shadow-indigo-100 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>+ Resume</span>
          </button>
          <button
            type="button"
            onClick={() => onCreateNew('cover-letter')}
            className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Mail className="w-4 h-4 text-emerald-600" />
            <span>+ Cover Letter</span>
          </button>
          <button
            type="button"
            onClick={() => onCreateNew('biodata')}
            className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-rose-600" />
            <span>+ Matrimonial Profile</span>
          </button>
          <button
            type="button"
            onClick={() => { window.location.hash = 'restore'; }}
            className="px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            title="Restore a purchased document from another phone or browser"
          >
            <RotateCcw className="w-4 h-4 text-indigo-600" />
            <span>Restore Purchase</span>
          </button>
        </div>
      </div>

      {/* Search and Secondary Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your documents..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-2xs"
          />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={handleResetDemo}
            className="px-3 py-1.5 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            title="Load realistic sample documents"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            Reset Demo Documents
          </button>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#0066FF] mx-auto flex items-center justify-center">
            <FileText className="w-6 h-6 stroke-1.5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Your documents will appear here.</h3>
            <p className="text-xs text-slate-500 mt-1">
              Create. Customize. Download. Start by creating your first document with {BUSINESS.name}.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onCreateNew('resume')}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#0066FF] rounded-xl hover:bg-[#0055D6] shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your First Document
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((docItem) => {
            const template = getTemplateById(docItem.templateId);
            return (
              <div
                key={docItem.id}
                onClick={() => onOpenDocument(docItem)}
                className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:border-slate-300"
              >
                {/* Card Top: Type Badge & Last Modified */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {docItem.type === 'biodata' ? (
                      <span className="text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-500" /> Matrimonial Profile
                      </span>
                    ) : docItem.type === 'cover-letter' ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                        <Mail className="w-3 h-3 text-emerald-500" /> Cover Letter
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                        <FileText className="w-3 h-3 text-indigo-500" /> Resume
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400">&bull; {template?.name || 'Standard'}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(docItem.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Card Body: Title (Editable) */}
                <div>
                  {editingId === docItem.id ? (
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(docItem.id, e)}
                        className="px-2 py-1 text-xs font-bold border border-slate-300 rounded w-full bg-white"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={(e) => handleSaveRename(docItem.id, e)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {docItem.title}
                    </h3>
                  )}
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {docItem.personal.fullName ? `Candidate: ${docItem.personal.fullName}` : 'Draft document without full details'}
                    {docItem.personal.professionalTitle ? ` &bull; ${docItem.personal.professionalTitle}` : ''}
                  </p>
                </div>

                {/* Card Footer: Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="font-semibold text-indigo-600 group-hover:underline inline-flex items-center gap-1">
                    <Edit className="w-3.5 h-3.5" /> Open Editor
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => handleStartRename(docItem, e)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Rename"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDuplicate(docItem.id, e)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmId(docItem.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation Modal inline */}
                {deleteConfirmId === docItem.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-xs"
                  >
                    <p className="font-semibold text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" /> Delete this document permanently?
                    </p>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="px-2.5 py-1 text-slate-600 bg-white border border-slate-300 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(docItem.id, e)}
                        className="px-2.5 py-1 text-white bg-rose-600 rounded font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
