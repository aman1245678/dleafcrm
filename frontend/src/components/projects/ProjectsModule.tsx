import React, { useState } from 'react';
import {
  FolderKanban,
  ChevronLeft,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  Layers,
  Users,
  Search,
  ExternalLink,
  Kanban,
  ListTodo,
  Milestone,
  CheckSquare,
  Sparkles,
  Link2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface ProjectItem {
  id: string;
  name: string;
  client: string;
  dealName?: string;
  status: 'In Progress' | 'Completed' | 'Planning' | 'On Hold';
  progress: number;
  dueDate: string;
  milestones: number;
  completedMilestones: number;
  owner: string;
}

export const ProjectsModule: React.FC = () => {
  const { deals } = useCRM();

  // Mode: 'landing' (exact Dleaf Projects unconfigured 3-illustration screen)
  // 'setup' (exact Dleaf Setup Home > Marketplace > Dleaf > Dleaf Projects Integration)
  // 'workspace' (active enterprise projects dashboard with milestones & tasks)
  const [viewMode, setViewMode] = useState<'landing' | 'setup' | 'workspace'>('landing');

  // Setup radio options
  const [portalConfigOption, setPortalConfigOption] = useState<'new_portal' | 'existing_org'>('new_portal');
  const [userEmail, setUserEmail] = useState('aman@dleafcrm.com');
  const [isConfiguring, setIsConfiguring] = useState(false);

  // Projects list
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: 'prj-101',
      name: 'Global CRM Cloud Migration',
      client: 'Acme International',
      dealName: 'Acme Enterprise License 2026',
      status: 'In Progress',
      progress: 68,
      dueDate: '15 Nov 2026',
      milestones: 5,
      completedMilestones: 3,
      owner: 'Aman'
    },
    {
      id: 'prj-102',
      name: 'Omnichannel SalesInbox Rollout',
      client: 'Zylker Tech Corp',
      dealName: 'Zylker CRM Migration',
      status: 'Planning',
      progress: 25,
      dueDate: '30 Dec 2026',
      milestones: 4,
      completedMilestones: 1,
      owner: 'Priya Sharma'
    },
    {
      id: 'prj-103',
      name: 'MCP Server AI Agent Integration',
      client: 'Nexus Data Labs',
      dealName: 'Nexus AI Copilot Deal',
      status: 'In Progress',
      progress: 84,
      dueDate: '08 Nov 2026',
      milestones: 6,
      completedMilestones: 5,
      owner: 'Aman'
    }
  ]);

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectClient, setNewProjectClient] = useState('');
  const [newProjectDue, setNewProjectDue] = useState('2026-12-15');

  const handleFinishSetup = () => {
    setIsConfiguring(true);
    setTimeout(() => {
      setIsConfiguring(false);
      setViewMode('workspace');
    }, 600);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newPrj: ProjectItem = {
      id: `prj-${Date.now()}`,
      name: newProjectName.trim(),
      client: newProjectClient.trim() || 'Internal Company',
      status: 'Planning',
      progress: 10,
      dueDate: newProjectDue,
      milestones: 3,
      completedMilestones: 0,
      owner: 'Aman'
    };

    setProjects([newPrj, ...projects]);
    setNewProjectName('');
    setNewProjectClient('');
    setIsNewProjectModalOpen(false);
  };

  /* =========================================================================
     VIEW 1: EXACT ZOHO PROJECTS LANDING SCREEN (Screenshot 1)
     crm.zoho.in/crm/org.../tab/Projects
  ========================================================================== */
  if (viewMode === 'landing') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-auto select-none">
        
        {/* Top Header Breadcrumb */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-slate-800">Projects</h1>
          </div>
          <button
            onClick={() => setViewMode('workspace')}
            className="text-xs text-[#3F7657] font-semibold hover:underline"
          >
            Direct to Active Projects
          </button>
        </div>

        {/* Center Presentation Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto w-full">
          
          {/* Main Title & Subtitle */}
          <div className="max-w-xl mb-12">
            <h2 className="text-xl sm:text-2xl font-normal text-slate-800">
              Unified Sales and Project Management
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              A smarter way to bridge the gap between sales and project tracking.{' '}
              <span className="text-sky-600 hover:underline cursor-pointer">Learn More</span>
            </p>
          </div>

          {/* 3 Hand-drawn Vector Diagram Cards: Connect | Track | Deliver */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl mb-12">
            
            {/* Card 1: Connect */}
            <div className="flex flex-col items-center text-center">
              <div className="h-44 w-full flex items-center justify-center">
                {/* Hand-drawn style plug and handshake diagram */}
                <div className="relative w-44 h-36 flex items-center justify-center">
                  <div className="absolute top-2 left-2 w-14 h-12 rounded border border-slate-400 bg-white shadow-2xs flex items-center justify-center text-lg">
                    🤝
                  </div>
                  <div className="absolute top-2 right-2 w-14 h-14 rounded border border-slate-400 bg-white shadow-2xs p-1 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-slate-500 font-mono">☰ 📄</span>
                  </div>
                  {/* Green connection wire */}
                  <div className="w-24 h-12 border-b-2 border-dashed border-emerald-500 rounded-b-full mt-6" />
                  <div className="absolute bottom-2 flex items-center gap-1 text-slate-700">
                    <span className="w-6 h-6 rounded-full border border-slate-500 flex items-center justify-center text-[10px]">🔌</span>
                    <span className="text-emerald-600 font-bold">⚡</span>
                    <span className="w-6 h-6 rounded-full border border-slate-500 flex items-center justify-center text-[10px]">🔌</span>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-800 mt-2">Connect</h3>
              <p className="text-[11.5px] text-slate-500 mt-1 max-w-[210px] leading-relaxed">
                Integrate Dleaf Projects to create and associate projects in Dleaf CRM.
              </p>
            </div>

            {/* Card 2: Track */}
            <div className="flex flex-col items-center text-center">
              <div className="h-44 w-full flex items-center justify-center">
                <div className="relative w-44 h-36 flex items-center justify-center">
                  {/* Person with clipboard examining stats */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-20 border border-slate-400 rounded-md bg-white flex flex-col items-center p-1.5">
                      <div className="w-6 h-6 rounded-full border border-slate-500 mb-1" />
                      <div className="w-8 h-8 border border-slate-300 rounded bg-slate-50 text-[8px] flex items-center justify-center">
                        📋
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="w-16 h-7 border border-slate-300 rounded bg-white p-1 text-[8px] text-slate-400">
                        📈 Analytics
                      </div>
                      <div className="w-16 h-7 border border-slate-300 rounded bg-white p-1 text-[8px] text-slate-400">
                        ⏱ Milestones
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-800 mt-2">Track</h3>
              <p className="text-[11.5px] text-slate-500 mt-1 max-w-[210px] leading-relaxed">
                Stay on top of your tasks and milestones.
              </p>
            </div>

            {/* Card 3: Deliver */}
            <div className="flex flex-col items-center text-center">
              <div className="h-44 w-full flex items-center justify-center">
                <div className="relative w-44 h-36 flex items-center justify-center">
                  {/* Clock with green check and handshake */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-2 border-slate-400 bg-white flex items-center justify-center relative shadow-xs">
                      <Clock className="w-7 h-7 text-slate-400" />
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute -top-1 -right-1 fill-emerald-100" />
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs">🤝</span>
                      <span className="text-[10px] font-bold text-slate-600">On Time Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-800 mt-2">Deliver</h3>
              <p className="text-[11.5px] text-slate-500 mt-1 max-w-[210px] leading-relaxed">
                Execute customer projects on time, every time.
              </p>
            </div>

          </div>

          {/* Green Let's Get Started Button */}
          <div className="space-y-3">
            <button
              onClick={() => setViewMode('setup')}
              className="px-6 py-2.5 bg-[#16845B] hover:bg-[#126b4a] active:scale-95 text-white font-semibold text-xs rounded-md shadow-xs transition duration-200 cursor-pointer"
            >
              Get Started
            </button>
            <div>
              <button
                onClick={() => setViewMode('workspace')}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Don't show this tab again.
              </button>
            </div>
          </div>

        </div>

      </div>
    );
  }

  /* =========================================================================
     VIEW 2: EXACT ZOHO PROJECTS INTEGRATION SETUP SCREEN (Screenshots 2 & 3)
     crm.zoho.in/crm/org.../settings/extensions/zoho/projects
  ========================================================================== */
  if (viewMode === 'setup') {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-auto select-none">
        
        {/* Top Header */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('landing')}
              className="p-1 text-slate-500 hover:text-slate-800 rounded transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-slate-700">Setup Home</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs text-slate-500">Marketplace</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs text-slate-500">Dleaf</span>
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-slate-800">Dleaf Projects Integration</span>
          </div>

          <button
            onClick={() => setViewMode('landing')}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {/* Content Box */}
        <div className="max-w-4xl mx-auto w-full p-6 sm:p-10">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-8">
            
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6">
              <button
                onClick={() => setViewMode('landing')}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="text-base font-semibold text-slate-800">
                Dleaf Projects Integration
              </h2>
            </div>

            <div className="space-y-6 max-w-xl">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Portal Configuration
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Configure your Dleaf Projects to start the integration with Dleaf CRM.
                </p>
              </div>

              {/* Radio Choices */}
              <div className="space-y-3 pt-2 text-xs text-slate-700">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="portalConfig"
                    checked={portalConfigOption === 'new_portal'}
                    onChange={() => setPortalConfigOption('new_portal')}
                    className="text-[#16845B] focus:ring-[#16845B]"
                  />
                  <span>Create a new portal with my email id ({userEmail})</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="portalConfig"
                    checked={portalConfigOption === 'existing_org'}
                    onChange={() => setPortalConfigOption('existing_org')}
                    className="text-[#16845B] focus:ring-[#16845B]"
                  />
                  <span>I already have a Dleaf Projects org with different email id</span>
                </label>
              </div>

              {/* Action buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={handleFinishSetup}
                  disabled={isConfiguring}
                  className="px-5 py-2 bg-[#153B2E] hover:bg-[#3F7657] disabled:opacity-50 text-white font-semibold text-xs rounded shadow-xs transition cursor-pointer flex items-center gap-2"
                >
                  {isConfiguring && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{isConfiguring ? 'Connecting...' : 'Authorize & Start Integration'}</span>
                </button>
                <button
                  onClick={() => setViewMode('landing')}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium rounded transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    );
  }

  /* =========================================================================
     VIEW 3: PRODUCTION READY INTEGRATED PROJECTS WORKSPACE
  ========================================================================== */
  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E5EFE4] text-[#153B2E] flex items-center justify-center font-bold text-xs">
            <FolderKanban className="w-4 h-4 text-[#3F7657]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-800">Projects Workspace</h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Connected to CRM Deals
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Active Portal: <strong>dleaf-crm.projects.dleafcrm.com</strong> (Unified Sales Sync)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('landing')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
          >
            <span>Overview</span>
          </button>
          <button
            onClick={() => setViewMode('setup')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
          >
            <span>Reconfigure</span>
          </button>
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#153B2E] text-white hover:bg-[#3F7657] transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* Projects Dashboard View */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Projects</div>
            <div className="text-2xl font-bold text-[#153B2E] mt-1">{projects.length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Milestones Due</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">4 Pending</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">On-Time Delivery</div>
            <div className="text-2xl font-bold text-emerald-700 mt-1">96.2%</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">CRM Deal Sync</div>
            <div className="text-2xl font-bold text-[#3F7657] mt-1">100% Live</div>
          </div>
        </div>

        {/* Projects Cards List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Customer Projects & Milestones ({projects.length})
            </h2>
            <span className="text-[11px] text-slate-400">Integrated with Deals and Task pipelines</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3">Project Name</th>
                  <th className="px-5 py-3">Client & Deal</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Progress</th>
                  <th className="px-5 py-3">Milestones</th>
                  <th className="px-5 py-3">Due Date</th>
                  <th className="px-5 py-3">Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3 font-semibold text-slate-900">
                      {p.name}
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-slate-800">{p.client}</div>
                      {p.dealName && (
                        <div className="text-[10px] text-emerald-700 flex items-center gap-1 mt-0.5">
                          <Link2 className="w-2.5 h-2.5" />
                          <span>{p.dealName}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'In Progress'
                          ? 'bg-sky-100 text-sky-800'
                          : p.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                          <span>{p.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#3F7657] h-full rounded-full transition-all"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-600">
                      {p.completedMilestones}/{p.milestones} completed
                    </td>
                    <td className="px-5 py-3 text-slate-600 font-mono">{p.dueDate}</td>
                    <td className="px-5 py-3 text-slate-800 font-medium">{p.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* =========================================================================
          MODAL: CREATE NEW PROJECT
      ========================================================================== */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-semibold text-slate-800 mb-4">
              Create New Customer Project
            </h3>

            <form onSubmit={handleAddProject} className="space-y-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. Enterprise Onboarding & Setup"
                  className="w-full px-3 py-1.5 rounded border border-slate-300 focus:border-[#153B2E] outline-hidden"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Client / Account Name</label>
                <input
                  type="text"
                  value={newProjectClient}
                  onChange={(e) => setNewProjectClient(e.target.value)}
                  placeholder="e.g. Acme International"
                  className="w-full px-3 py-1.5 rounded border border-slate-300 focus:border-[#153B2E] outline-hidden"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={newProjectDue}
                  onChange={(e) => setNewProjectDue(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 focus:border-[#153B2E] outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#153B2E] hover:bg-[#3F7657] text-white font-semibold rounded shadow-xs cursor-pointer"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
