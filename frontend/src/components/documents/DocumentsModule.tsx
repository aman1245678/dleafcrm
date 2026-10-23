import React, { useState, useEffect, useRef } from 'react';
import {
  Folder,
  FolderOpen,
  FileText,
  Upload,
  Plus,
  Trash2,
  Trash,
  ChevronDown,
  Search,
  SlidersHorizontal,
  ChevronRight,
  MoreVertical,
  Music,
  Video,
  Image as ImageIcon,
  Star,
  File,
  X,
  Check,
  RotateCcw,
  Download,
  Eye,
} from 'lucide-react';
import { api } from '../../services/api';

interface DocumentRecord {
  id: string;
  name: string;
  category: 'Documents' | 'Pictures' | 'Music' | 'Videos' | 'Favorites';
  folder: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  modifiedTime: string;
  isFavorite: boolean;
  isTrash: boolean;
}

export const DocumentsModule: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [activeCategory, setActiveCategory] = useState<
    'All Files' | 'Documents' | 'Pictures' | 'Music' | 'Videos' | 'Favorites' | 'Trash'
  >('All Files');
  const [activeFolder, setActiveFolder] = useState<string>('Document Library');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateDocModal, setShowCreateDocModal] = useState(false);

  // Form states
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadCategory, setUploadCategory] = useState<DocumentRecord['category']>('Documents');
  const [docContent, setDocContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load documents from backend
  const fetchDocs = async () => {
    try {
      const isTrash = activeCategory === 'Trash';
      const isFavorite = activeCategory === 'Favorites';
      const cat =
        activeCategory !== 'All Files' && activeCategory !== 'Trash' && activeCategory !== 'Favorites'
          ? activeCategory
          : undefined;

      const res = await api.documents.getAll({
        category: cat,
        folder: activeCategory === 'Trash' ? undefined : activeFolder,
        isTrash,
        isFavorite: isFavorite ? true : undefined,
        search: searchQuery || undefined,
      });

      if (res.success && Array.isArray(res.data)) {
        setDocuments(res.data);
      }
    } catch (e) {
      console.error('Failed to load documents:', e);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [activeCategory, activeFolder, searchQuery]);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    try {
      const res = await api.documents.create({
        name: uploadFileName.trim(),
        category: uploadCategory,
        folder: activeFolder,
        size: '180 KB',
      });
      if (res.success) {
        setUploadFileName('');
        setShowUploadModal(false);
        fetchDocs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNativeFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let cat: DocumentRecord['category'] = 'Documents';
    if (file.type.startsWith('image/')) cat = 'Pictures';
    else if (file.type.startsWith('audio/')) cat = 'Music';
    else if (file.type.startsWith('video/')) cat = 'Videos';

    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

    try {
      await api.documents.create({
        name: file.name,
        category: cat,
        folder: activeFolder,
        size: sizeFormatted,
      });
      fetchDocs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, permanent: boolean = false) => {
    try {
      await api.documents.delete(id, permanent);
      fetchDocs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await api.documents.restore(id);
      fetchDocs();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async (doc: DocumentRecord) => {
    try {
      await api.documents.update(doc.id, { isFavorite: !doc.isFavorite });
      fetchDocs();
    } catch (err) {
      console.error(err);
    }
  };

  // Category left items matching Screenshot
  const categories: { id: typeof activeCategory; label: string; icon: any }[] = [
    { id: 'All Files', label: 'All Files', icon: FileText },
    { id: 'Documents', label: 'Documents', icon: File },
    { id: 'Pictures', label: 'Pictures', icon: ImageIcon },
    { id: 'Music', label: 'Music', icon: Music },
    { id: 'Videos', label: 'Videos', icon: Video },
    { id: 'Favorites', label: 'Favorites', icon: Star },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f4f6f9] overflow-hidden select-none">
      {/* Top Main Navigation Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
        <span className="font-bold text-base text-slate-800">Documents</span>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search records"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs w-52 focus:outline-hidden focus:bg-white focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <span className="cursor-pointer hover:text-slate-800 font-semibold">+</span>
            <span className="cursor-pointer hover:text-slate-800">Aa</span>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Left Explorer Tree + Right Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Explorer Sidebar matching Screenshot */}
        <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 text-xs">
          {/* Top Action Buttons (Create ▼ | Upload ▼) */}
          <div className="p-3 border-b border-slate-200 flex items-center gap-2">
            {/* Create Dropdown */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => {
                  setShowCreateDropdown(!showCreateDropdown);
                  setShowUploadDropdown(false);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-semibold text-slate-700 flex items-center justify-between cursor-pointer"
              >
                <span>Create</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showCreateDropdown && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded shadow-lg z-30 py-1 text-xs">
                  <button
                    onClick={() => {
                      setShowCreateDocModal(true);
                      setShowCreateDropdown(false);
                    }}
                    className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Dleaf Writer Document</span>
                  </button>
                  <button
                    onClick={() => {
                      setUploadCategory('Spreadsheets' as any);
                      setShowUploadModal(true);
                      setShowCreateDropdown(false);
                    }}
                    className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <File className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dleaf Sheet</span>
                  </button>
                </div>
              )}
            </div>

            {/* Upload Dropdown */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => {
                  setShowUploadDropdown(!showUploadDropdown);
                  setShowCreateDropdown(false);
                }}
                className="w-full px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-semibold text-slate-700 flex items-center justify-between cursor-pointer"
              >
                <span>Upload</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {showUploadDropdown && (
                <div className="absolute top-full left-0 mt-1 w-44 bg-white border border-slate-200 rounded shadow-lg z-30 py-1 text-xs">
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setShowUploadDropdown(false);
                    }}
                    className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                    <span>Browse Local Files...</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowUploadModal(true);
                      setShowUploadDropdown(false);
                    }}
                    className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-500" />
                    <span>Quick Upload File</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Categories Section */}
          <div className="p-2 space-y-0.5 border-b border-slate-100">
            {categories.map((c) => {
              const Icon = c.icon;
              const isSelected = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`w-full px-2.5 py-1.5 rounded flex items-center gap-2 font-medium transition cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{c.label}</span>
                </button>
              );
            })}
          </div>

          {/* FOLDERS Section matching Screenshot */}
          <div className="p-2 flex-1">
            <div className="px-2 py-1 flex items-center justify-between text-[11px] font-semibold text-slate-500 tracking-wider">
              <span>FOLDERS</span>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                title="Folder Options"
              >
                ▲
              </button>
            </div>

            <div className="mt-1 space-y-0.5">
              <button
                onClick={() => {
                  setActiveFolder('Document Library');
                  if (activeCategory === 'Trash') setActiveCategory('All Files');
                }}
                className={`w-full px-2.5 py-1.5 rounded flex items-center gap-2 font-medium transition cursor-pointer ${
                  activeFolder === 'Document Library' && activeCategory !== 'Trash'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Folder className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">Document Library</span>
              </button>
            </div>
          </div>

          {/* Trash Bottom Item matching Screenshot */}
          <div className="p-2 border-t border-slate-200">
            <button
              onClick={() => setActiveCategory('Trash')}
              className={`w-full px-2.5 py-1.5 rounded flex items-center gap-2 font-medium transition cursor-pointer ${
                activeCategory === 'Trash'
                  ? 'bg-rose-50 text-rose-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Trash className="w-3.5 h-3.5 text-slate-400" />
              <span>Trash</span>
            </button>
          </div>
        </aside>

        {/* Right Content Area: Exact Dleaf CRM Document Table or Empty State */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
          {/* Top Sort / Column Header strip matching screenshot */}
          <div className="px-4 py-1.5 bg-[#f8fafc] border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-800">
                {activeCategory === 'Trash' ? 'Trash' : activeFolder}
              </span>
              <span className="text-[11px] text-slate-400">
                ({documents.length} {documents.length === 1 ? 'file' : 'files'})
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <span className="cursor-pointer hover:text-slate-600">▲</span>
            </div>
          </div>

          {/* Document Content */}
          <div className="flex-1 overflow-auto">
            {documents.length === 0 ? (
              /* Empty State matching Screenshot */
              <div className="h-full flex flex-col items-center justify-center p-8 select-none">
                <p className="text-xs text-slate-500 mb-3">You have no documents.</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-1.5 bg-[#f1f5f9] hover:bg-slate-200 border border-slate-300 rounded text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs"
                >
                  Upload
                </button>
              </div>
            ) : (
              /* Populated Document Table */
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold sticky top-0 select-none">
                  <tr>
                    <th className="py-2.5 px-4 w-10"></th>
                    <th className="py-2.5 px-4">Name</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Folder</th>
                    <th className="py-2.5 px-4">Size</th>
                    <th className="py-2.5 px-4">Uploaded By</th>
                    <th className="py-2.5 px-4">Modified</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition group">
                      <td className="py-2.5 px-4">
                        <button
                          onClick={() => toggleFavorite(doc)}
                          className="text-slate-300 hover:text-amber-500 cursor-pointer"
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              doc.isFavorite ? 'text-amber-500 fill-amber-500' : ''
                            }`}
                          />
                        </button>
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="truncate max-w-xs">{doc.name}</span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium border border-slate-200">
                          {doc.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{doc.folder}</td>
                      <td className="py-2.5 px-4 text-slate-600 font-mono text-[11px]">{doc.size}</td>
                      <td className="py-2.5 px-4 text-slate-600">{doc.uploadedBy}</td>
                      <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">
                        {doc.uploadDate}
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {doc.isTrash ? (
                            <>
                              <button
                                onClick={() => handleRestore(doc.id)}
                                className="p-1 text-blue-600 hover:text-blue-800 cursor-pointer"
                                title="Restore File"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(doc.id, true)}
                                className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                                title="Permanently Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleDelete(doc.id, false)}
                              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Move to Trash"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Bottom strip matching scroll arrows in screenshot */}
          <div className="px-4 py-1.5 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <span className="text-[11px]">Dleaf WorkDrive Cloud Sync Active</span>
            <span className="cursor-pointer hover:text-slate-800">▲</span>
          </div>
        </div>
      </div>

      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleNativeFileSelect}
        className="hidden"
      />

      {/* Upload File Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4 select-none">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">Upload to Document Library</span>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFileUpload} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4_Executive_Sales_Deck.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-hidden focus:border-blue-500"
                >
                  <option value="Documents">Documents</option>
                  <option value="Pictures">Pictures</option>
                  <option value="Music">Music</option>
                  <option value="Videos">Videos</option>
                </select>
              </div>

              <div className="pt-2 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#153B2E] hover:bg-[#3F7657] text-white rounded font-semibold shadow-xs"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Dleaf Document Modal */}
      {showCreateDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-2xs p-4 select-none">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">Create Dleaf Document</span>
              <button
                onClick={() => setShowCreateDocModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g. Service Level Agreement 2026.docx"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Content Editor</label>
                <textarea
                  rows={5}
                  placeholder="Draft your document text here..."
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="pt-2 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateDocModal(false)}
                  className="px-4 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!uploadFileName.trim()) return;
                    await api.documents.create({
                      name: uploadFileName.trim(),
                      category: 'Documents',
                      folder: activeFolder,
                      size: '45 KB',
                    });
                    setUploadFileName('');
                    setDocContent('');
                    setShowCreateDocModal(false);
                    fetchDocs();
                  }}
                  className="px-5 py-1.5 bg-[#153B2E] hover:bg-[#3F7657] text-white rounded font-semibold shadow-xs"
                >
                  Save & Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
