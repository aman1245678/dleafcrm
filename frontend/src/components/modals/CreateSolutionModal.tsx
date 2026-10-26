import React, { useState } from 'react';
import {
  X,
  Search,
  Lock,
  User,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Solution } from '../../types/crm';
import { api } from '../../services/api';

interface CreateSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSolutionCreated?: () => void;
}

export const CreateSolutionModal: React.FC<CreateSolutionModalProps> = ({
  isOpen,
  onClose,
  onSolutionCreated,
}) => {
  const { products } = useCRM();

  // Solution Information matching Screenshot 4
  const [solutionOwner, setSolutionOwner] = useState('Aman kumar');
  const [solutionTitle, setSolutionTitle] = useState('');
  const [productName, setProductName] = useState('');
  const [status, setStatus] = useState('Draft');

  // Description Information
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!solutionTitle.trim()) {
      alert('Please enter Solution Title');
      return;
    }

    const payload: Omit<Solution, 'id' | 'solutionNumber' | 'createdTime'> = {
      solutionTitle: solutionTitle.trim(),
      owner: solutionOwner,
      productName: productName.trim(),
      status,
      question: question.trim(),
      answer: answer.trim(),
    };

    try {
      await api.createSolution(payload);
      if (onSolutionCreated) onSolutionCreated();
      onClose();
    } catch (err) {
      console.error(err);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header matching Screenshot 4 */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-slate-800">Create Solution</h2>
            <button className="text-xs text-blue-600 hover:underline">Edit Page Layout</button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 rounded hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded hover:bg-slate-50 transition"
            >
              Save and New
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-1.5 text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#EE0979] rounded shadow-xs transition"
            >
              Save
            </button>
          </div>
        </div>

        {/* Form Body matching Screenshot 4 Layout */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Section: Solution Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
              Solution Information
            </h3>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3.5">
              {/* Row 1: Solution Number (locked) & Solution Owner */}
              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600">Solution Number</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    disabled
                    placeholder="Auto-generated"
                    className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 text-slate-400 rounded text-xs cursor-not-allowed pr-8"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600">Solution Owner</label>
                <div className="flex-1 flex gap-1.5">
                  <select
                    value={solutionOwner}
                    onChange={(e) => setSolutionOwner(e.target.value)}
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-hidden focus:border-blue-600"
                  >
                    <option value="Aman kumar">Aman kumar</option>
                    <option value="Admin User">Admin User</option>
                  </select>
                  <div className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center bg-slate-50 text-slate-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Row 2: Solution Title (Mandatory) & Product Name */}
              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600 flex items-center justify-end gap-1">
                  <span className="w-1 h-3 bg-red-500 inline-block rounded-xs"></span>
                  Solution Title
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    value={solutionTitle}
                    onChange={(e) => setSolutionTitle(e.target.value)}
                    placeholder="Enter solution title..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600">Product Name</label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    list="solutionProductsList"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Select or enter product..."
                    className="w-full px-3 py-1.5 pr-8 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600"
                  />
                  <Layers className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                  <datalist id="solutionProductsList">
                    {products.map((p) => (
                      <option key={p.id} value={p.name} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Row 3: Status */}
              <div className="flex items-center">
                <label className="w-32 text-right pr-4 text-slate-600">Status</label>
                <div className="flex-1">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white text-xs focus:outline-hidden focus:border-blue-600"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Description Information (Question & Answer with mandatory red indicators) */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b pb-1">
              Description Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-start">
                <label className="w-32 text-right pr-4 text-slate-600 pt-1 flex items-center justify-end gap-1">
                  <span className="w-1 h-3 bg-red-500 inline-block rounded-xs"></span>
                  Question
                </label>
                <div className="flex-1">
                  <textarea
                    rows={3}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Common issue question or customer inquiry..."
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-start">
                <label className="w-32 text-right pr-4 text-slate-600 pt-1 flex items-center justify-end gap-1">
                  <span className="w-1 h-3 bg-red-500 inline-block rounded-xs"></span>
                  Answer
                </label>
                <div className="flex-1">
                  <textarea
                    rows={4}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Detailed troubleshooting guide and resolution..."
                    className="w-full px-3 py-2 border border-slate-300 rounded text-xs focus:outline-hidden focus:border-blue-600 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
