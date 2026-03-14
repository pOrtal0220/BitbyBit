import React, { useState, useEffect } from 'react';
import { createProject, getMyProjects, fundProject } from '../api';
import { 
  Brain, Wallet, CheckCircle, Plus, Layout, Zap, 
  Shield, History, Briefcase, LogOut 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmployerSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [desc, setDesc] = useState('');
  const [budget, setBudget] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState({ fullName: 'Employer', email: '' });

  // 1. Initial Load: Get User and Projects
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setUser(storedUser);
      loadProjects(storedUser.email); // Pass email directly to avoid state lag
    } else {
      navigate('/login');
    }
  }, []);

  const loadProjects = async (email) => {
    const userId = email || user.email;
    if (!userId) return;

    try {
      const { data } = await getMyProjects('employer', userId);
      // Ensure we are setting an array even if data is null
      setProjects(data.projects || []);
      console.log("Projects Loaded:", data.projects);
    } catch (err) {
      console.error("Sync Error:", err);
    }
  };

  const handleArchitect = async () => {
    if (!desc || !user.email) return;
    setLoading(true);
    try {
      const response = await createProject({ 
        description: desc, 
        budget: Number(budget), 
        employerId: user.email 
      });
      console.log("AI Response:", response.data);
      setDesc('');
      await loadProjects(user.email);
      setActiveTab('myprojects');
    } catch (err) { 
      console.error("Architect Error:", err);
      alert("AI Agent is syncing. Please try again."); 
    }
    setLoading(false);
  };

  // --- DYNAMIC CONTENT MAPPING ---
  const tabContent = {
    dashboard: { title: "Dashboard", sub: `Welcome, ${user.fullName}. Monitoring human intent and machine verification.` },
    agents: { title: "Active Agents", sub: "Live tracking of autonomous nodes auditing repositories." },
    vault: { title: "Escrow Vault", sub: "Secure capital management and cryptographic fund locking." },
    history: { title: "Payment History", sub: "Transparent ledger of all autonomous disbursements." },
    myprojects: { title: "My Projects", sub: "Full lifecycle management of your architected enterprises." }
  };

  // Calculations
  const totalEscrow = projects.filter(p => p.status !== 'DRAFT').reduce((s, p) => s + p.totalBudget, 0);
  const paidMilestones = projects.flatMap(p => (p.milestones || []).filter(m => m.status === 'PAID').map(m => ({ ...m, pTitle: p.description, pDate: p.updatedAt })));

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex">
      {/* SIDEBAR */}
      <aside className="w-20 lg:w-72 bg-white border-r border-slate-200 flex flex-col py-10 px-6 sticky top-0 h-screen shadow-sm">
        <div className="text-blue-600 mb-16 flex items-center gap-3 px-2 font-black text-2xl tracking-tighter cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <Shield size={36} fill="currentColor" /> <span className="hidden lg:block text-slate-900 uppercase">COGNIZANCE</span>
        </div>
        <nav className="flex flex-col gap-3 w-full">
          <NavItem icon={<Layout size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Zap size={20}/>} label="Active Agents" active={activeTab === 'agents'} onClick={() => setActiveTab('agents')} />
          <NavItem icon={<Wallet size={20}/>} label="Escrow Vault" active={activeTab === 'vault'} onClick={() => setActiveTab('vault')} />
          <NavItem icon={<History size={20}/>} label="Payment History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <NavItem icon={<Briefcase size={20}/>} label="My Projects" active={activeTab === 'myprojects'} onClick={() => setActiveTab('myprojects')} />
        </nav>
        <button onClick={() => { localStorage.removeItem('currentUser'); navigate('/login'); }} className="mt-auto flex items-center gap-4 p-4 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-all">
          <LogOut size={20} /> <span className="hidden lg:block">Sign Out</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 lg:p-20 overflow-x-hidden">
        <header className="mb-16">
          <div className="flex items-center gap-2 mb-4 text-blue-600 font-black text-[10px] uppercase tracking-widest">
            <span className="h-1 w-8 bg-blue-600 rounded-full"></span> Enterprise Command Center
          </div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter capitalize leading-none">{tabContent[activeTab].title}</h1>
          <p className="text-slate-400 font-medium mt-6 text-xl max-w-2xl leading-relaxed">{tabContent[activeTab].sub}</p>
        </header>

        <div className="w-full max-w-[1600px]">
          {activeTab === 'dashboard' && <DashboardView totalEscrow={totalEscrow} paidCount={paidMilestones.length} activeCount={projects.filter(p => p.status !== 'DRAFT').length} desc={desc} setDesc={setDesc} budget={budget} setBudget={setBudget} handleArchitect={handleArchitect} loading={loading} />}
          {activeTab === 'agents' && <AgentsView agents={projects.filter(p => p.status !== 'DRAFT' && p.status !== 'COMPLETED')} />}
          {activeTab === 'vault' && <VaultView projects={projects.filter(p => p.status !== 'DRAFT')} />}
          {activeTab === 'history' && <HistoryView history={paidMilestones} />}
          {activeTab === 'myprojects' && <ProjectsView projects={projects} onFund={() => loadProjects(user.email)} />}
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const DashboardView = ({ totalEscrow, paidCount, activeCount, desc, setDesc, budget, setBudget, handleArchitect, loading }) => (
  <div className="space-y-10 animate-in fade-in duration-700">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <StatCard icon={<Shield className="text-blue-600"/>} label="Escrow Protection" value={`₹${totalEscrow.toLocaleString()}`} color="bg-blue-50" />
      <StatCard icon={<Zap className="text-amber-500"/>} label="Active Agents" value={activeCount} color="bg-amber-50" />
      <StatCard icon={<CheckCircle className="text-green-500"/>} label="Verified Milestones" value={paidCount} color="bg-green-50" />
    </div>
    <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl relative overflow-hidden">
      <div className="flex items-center gap-4 mb-8 text-blue-600 font-black text-2xl tracking-tighter"><Brain /> AI Architect</div>
      <textarea className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] min-h-[160px] outline-none mb-4 font-medium" placeholder="Describe project vision (e.g. Build an e-commerce app with React)..." value={desc} onChange={e => setDesc(e.target.value)} />
      <div className="flex gap-4">
        <div className="flex-1 relative">
           <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
           <input type="number" className="w-full pl-10 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xl outline-none focus:border-blue-500" value={budget} onChange={e => setBudget(e.target.value)} />
        </div>
        <button onClick={handleArchitect} disabled={loading || !desc} className="flex-[2] bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl py-5 transition-all disabled:opacity-50">
          {loading ? "AI GENERATING ROADMAP..." : "LAUNCH PROJECT"}
        </button>
      </div>
    </div>
  </div>
);

const AgentsView = ({ agents }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8">
    {agents.length === 0 ? <EmptyState msg="No active agents. Initialize escrow to start monitoring." /> : agents.map(p => (
      <div key={p._id} className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative group">
        <div className="flex justify-between mb-6"><Zap className="text-blue-400" /> <span className="text-[10px] font-black bg-blue-500 text-white px-3 py-1 rounded-full animate-pulse tracking-widest">Live Monitoring</span></div>
        <h4 className="text-xl font-bold text-white mb-4 leading-tight">{p.description}</h4>
        <div className="flex items-center gap-3 text-xs font-bold text-slate-400 border-t border-slate-800 pt-6"><Shield size={14} className="text-blue-500" /> AGENT STATUS: SCANNING REPOSITORY</div>
      </div>
    ))}
  </div>
);

const VaultView = ({ projects }) => (
  <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/30">
    <table className="w-full text-left">
      <thead className="bg-slate-50 border-b border-slate-200">
        <tr>
          <th className="p-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Project Name</th>
          <th className="p-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Locked Amount</th>
          <th className="p-8 text-[11px] font-black uppercase text-slate-400 tracking-widest">Vault Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {projects.length === 0 ? <tr><td colSpan="3" className="p-20 text-center text-slate-400 font-bold">Vault Empty</td></tr> : projects.map(p => (
          <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
            <td className="p-8 font-bold text-slate-800 text-lg">{p.description}</td>
            <td className="p-8 font-black text-blue-600 text-xl">₹{p.totalBudget.toLocaleString()}</td>
            <td className="p-8">
              <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-600">
                ESCROW_SECURED
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const HistoryView = ({ history }) => (
  <div className="space-y-6 max-w-4xl">
    {history.length === 0 ? <EmptyState msg="No payouts recorded yet. Payments occur after AI verification." /> : history.map((h, i) => (
      <div key={i} className="bg-white p-8 rounded-[2rem] flex justify-between items-center border border-slate-100 shadow-sm animate-in slide-in-from-left-4">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-green-50 text-green-600 rounded-2xl"><History size={24}/></div>
          <div><p className="text-xl font-bold text-slate-900">{h.title}</p><p className="text-sm text-slate-400 font-medium">{h.pTitle} • {new Date(h.pDate).toLocaleDateString()}</p></div>
        </div>
        <div className="text-right font-black text-slate-900 text-xl">-₹{h.payoutAmount.toLocaleString()}</div>
      </div>
    ))}
  </div>
);

const ProjectsView = ({ projects, onFund }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {projects.length === 0 ? <div className="col-span-full"><EmptyState msg="No projects found. Launch one using the AI Architect!" /></div> : projects.map(p => (
      <div key={p._id} className="bg-white p-8 rounded-[3rem] border border-slate-200 hover:border-blue-300 transition-all group shadow-sm flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all"><Briefcase size={24} /></div>
          <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{p.totalBudget.toLocaleString()}</span>
        </div>
        
        <h4 className="text-xl font-bold text-slate-800 mb-6 leading-snug h-14 overflow-hidden">{p.description}</h4>

        {/* --- AI ROADMAP SECTION --- */}
        <div className="flex-1 mb-8 overflow-y-auto max-h-64 pr-2">
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Brain size={12} /> AI Generated Roadmap
          </p>
          <div className="space-y-3">
            {p.milestones && p.milestones.length > 0 ? (
              p.milestones.map((m, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-black bg-white border border-slate-200 w-5 h-5 flex items-center justify-center rounded-md shrink-0">
                    {idx + 1}
                  </span>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-700 leading-tight truncate">{m.title}</p>
                    <p className="text-[9px] font-medium text-slate-400 mt-1 italic">Payout: ₹{m.payoutAmount}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-slate-400 italic">No milestones generated.</p>
            )}
          </div>
        </div>

        {p.status === 'DRAFT' ? (
          <button onClick={() => fundProject(p._id).then(onFund)} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">
            APPROVE & LOCK ESCROW
          </button>
        ) : (
          <div className="w-full text-center py-4 bg-green-50 rounded-2xl text-[10px] font-black text-green-600 tracking-[0.2em] uppercase border border-green-100">
            FUNDS SECURED
          </div>
        )}
      </div>
    ))}
  </div>
);

// Helpers
function NavItem({ icon, label, active, onClick }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-5 p-5 rounded-2xl cursor-pointer transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40 translate-x-2' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}>{icon} <span className="hidden lg:block font-black text-[11px] uppercase tracking-widest">{label}</span></div>
  );
}
function StatCard({ icon, label, value, color }) {
  return (
    <div className={`p-8 rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 bg-white`}><div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6`}>{icon}</div><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p><p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p></div>
  );
}
function EmptyState({ msg }) {
  return (
    <div className="p-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-400 font-bold uppercase tracking-widest text-xs leading-loose">{msg}</div>
  );
}