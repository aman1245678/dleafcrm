import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

interface ImportCasesWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: (count: number) => void;
}

export const ImportCasesWizard: React.FC<ImportCasesWizardProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleNext = () => {
    if (!selectedFile) {
      alert('Please select a file to import.');
      return;
    }
    if (onImportComplete) onImportComplete(5);
    alert(`Successfully processed ${selectedFile.name} and imported customer support cases.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Top Header matching Screenshot 3 */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-slate-800">Import Cases</h2>
            
            {/* Step Pipeline indicators matching Screenshot 3 */}
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Upload
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400">Actions</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400">Module - File Mapping</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400">Field Mapping</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400">Assign</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body matching Screenshot 3 */}
        <div className="p-8 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Drag & Drop File Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition ${
              isDragging
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/40 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv,.xlsx,.xls"
              className="hidden"
            />

            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-7 h-7" />
            </div>

            <p className="font-semibold text-slate-700 mb-1">
              Drag and drop the files here
            </p>
            <p className="text-slate-400 mb-2">- or -</p>

            <button
              type="button"
              className="px-4 py-1.5 border border-blue-500 text-blue-600 hover:bg-blue-50 rounded text-xs font-semibold shadow-2xs transition"
            >
              Browse Files
            </button>

            {selectedFile && (
              <div className="mt-4 px-3 py-1.5 bg-pink-50 border border-rose-200 text-[#D8086C] rounded-md font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#EE0979]" />
                <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}

            <p className="text-[11px] text-slate-400 mt-4">
              Supported file formats are XLSX, CSV and XLS
            </p>
            <p className="text-[11px] text-blue-600 hover:underline mt-1 cursor-pointer">
              Download sample file: CSV or XLSX
            </p>
          </div>

          {/* Yellow Info Box matching Screenshot 3 */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-lg space-y-1 text-slate-600 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-slate-700 font-bold">•</span>
              <span>File can be a max of 25 MB. You can import a max of 100,000 records to the Cases module.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-slate-700 font-bold">•</span>
              <span>You can't upload more than 1 file.</span>
            </div>
          </div>

          {/* What's New Box matching Screenshot 3 */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
            <h4 className="font-bold text-slate-800">What's New:</h4>
            <div className="flex items-center gap-6 text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                📊 Higher limits
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                📁 Dependent module support
              </span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1.5 font-medium">
                📦 Inventory module import
              </span>
            </div>
            <div className="pt-1">
              <button className="text-blue-600 hover:underline text-[11px]">
                Watch Video / Know more
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer matching Screenshot 3 */}
        <div className="px-6 py-3.5 border-t border-slate-200 flex items-center justify-between bg-slate-50/50 shrink-0">
          <button className="text-xs text-blue-600 hover:underline">
            Migrate Data from another CRM
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 hover:bg-slate-50 rounded transition shadow-2xs"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              className="px-5 py-1.5 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#EE0979] rounded transition shadow-xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
