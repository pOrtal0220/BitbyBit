import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { getMyProjects, getExploreProjects, joinProject, verifyWork } from '../api';
import { 
  Code, ShieldCheck, Github, Terminal, CheckCircle, Zap, 
  ExternalLink, User, CircleDot, Layout, Globe, CreditCard, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FreelancerSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('explore'); 
  const [user, setUser] = useState({ fullName: 'Freelancer', email: '' });
  const [myProjects, setMyProjects] = useState([]);
  const [exploreProjects, setExploreProjects] = useState([]);
  const [githubUrl, setGithubUrl] = useState('');
  const [auditing, setAuditing] = useState(false);
  const [auditLog, setAuditLog] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setUser(storedUser);
      loadAllData(storedUser.email);
    }
  }, []);

  const loadAllData = async (email) => {
    try {
      const exploreRes = await getExploreProjects();
      setExploreProjects(exploreRes.data.projects || []);

      const myRes = await getMyProjects('freelancer', email);
      setMyProjects(myRes.data.projects || []);
    } catch (err) {
      console.error("Data Sync Error");
    }
  };

  const handleJoin = async (projectId) => {
    try {
      await joinProject(projectId, user.email);
      alert("Project Claimed! Initializing Workspace...");
      await loadAllData(user.email);
      setActiveTab('workspace');
    } catch (err) {
      alert("Could not claim project.");
    }
  };

  const handleVerify = async (id, milestoneId) => {
    setAuditing(true);
    setAuditLog(["Initializing AI Auditor...", "Analyzing Repository...", "Verifying Requirements..."]);
    
    try {
      const { data } = await verifyWork(id, milestoneId);
      
      if (data.project.status === 'COMPLETED') {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#10b981', '#ffffff']
        });

        setAuditLog(prev => [...prev, "🚀 PROJECT FULLY ARCHITECTED", "STATUS: ARCHIVED TO HISTORY"]);
        alert("CONGRATULATIONS! Project fully completed and funds released.");
      } else {
        setAuditLog(prev => [...prev, "✓ MILESTONE PAID", "STATUS: PROCEEDING TO NEXT PHASE"]);
      }

      await loadAllData(user.email);
    } catch (err) {
      setAuditLog(prev => [...prev, "✖ AUDIT_TIMEOUT: Re-sync node."]);
    } finally {
      setAuditing(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F1A] text-slate-300 flex">
      {/* --- SIDEBAR --- */}
      <aside className="w-20 lg:w-64 bg-[#111827] border-r border-slate-800 flex flex-col items-center lg:items-start py-10 px-4 sticky top-0 h-screen">
        <div className="text-blue-500 mb-16 flex items-center gap-3 px-2">
          <Terminal size={28} />
          <span className="hidden lg:block font-black text-white text-xl">COGNIZANCE</span>
        </div>
        
        <nav className="flex flex-col gap-4 w-full">
          <NavItem icon={<Globe size={20}/>} label="Explore" active={activeTab === 'explore'} onClick={() => setActiveTab('explore')} />
          <NavItem icon={<Layout size={20}/>} label="Workspace" active={activeTab === 'workspace'} onClick={() => setActiveTab('workspace')} />
          <NavItem icon={<CreditCard size={20}/>} label="Payments" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
          <NavItem icon={<Clock size={20}/>} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
        </nav>

        <button onClick={() => navigate('/login')} className="mt-auto flex items-center gap-4 p-4 text-red-500 font-bold text-[10px] uppercase">
          <CircleDot size={12} className="text-red-500" /> Sign Out
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8 lg:p-14 overflow-x-hidden">
        <header className="mb-14 flex justify-between items-end border-b border-slate-800 pb-10">
          <div>
            <h1 className="text-4xl font-black text-white">
              Instance: <span className="italic text-blue-400">{user.fullName}</span>
            </h1>
            <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-2">
              Node Path: {activeTab} // Active_Status: Online
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-8 py-4 rounded-3xl text-right">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Earned</p>
             <p className="text-2xl font-black text-green-400">₹{myProjects.flatMap(p => p.milestones).filter(m => m.status === 'PAID').reduce((s, m) => s + m.payoutAmount, 0)}</p>
          </div>
        </header>

        {/* --- EXPLORE VIEW --- */}
        {activeTab === 'explore' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
            {exploreProjects.length === 0 ? <EmptyState msg="Scanning network for available contracts..." /> : exploreProjects.map(p => (
              <div key={p._id} className="bg-[#161B22] border border-slate-800 p-8 rounded-[2.5rem] flex flex-col">
                <div className="flex justify-between items-start mb-6">
                   <h3 className="text-xl font-bold text-white">{p.description}</h3>
                   <span className="text-2xl font-black text-blue-400 tracking-tighter">₹{p.totalBudget}</span>
                </div>
                <div className="flex-1 space-y-2 mb-8">
                   {p.milestones.map((m, i) => (
                     <div key={i} className="text-[10px] bg-black/40 p-2 rounded-lg flex justify-between text-slate-400">
                        <span>{m.title}</span> <span className="text-white font-bold italic">₹{m.payoutAmount}</span>
                     </div>
                   ))}
                </div>
                <button onClick={() => handleJoin(p._id)} className="w-full bg-blue-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all">Claim Contract</button>
              </div>
            ))}
          </div>
        )}

        {/* --- WORKSPACE VIEW (Active only) --- */}
        {activeTab === 'workspace' && (
           <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
             <div className="xl:col-span-7 space-y-8">
                {myProjects.filter(p => p.status !== 'COMPLETED').length === 0 ? <EmptyState msg="No active modules. Claim a contract from Explore." /> : myProjects.filter(p => p.status !== 'COMPLETED').map(p => (
                  <div key={p._id} className="bg-[#161B22] border border-slate-800 p-8 rounded-[2.5rem]">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><Zap className="text-amber-500" size={20}/> {p.description}</h2>
                    <div className="space-y-4 mb-8">
                       {p.milestones.map((m, i) => (
                         <div key={i} className={`p-5 rounded-2xl border ${m.status === 'PAID' ? 'bg-green-500/10 border-green-500/20' : 'bg-black/20 border-slate-800'}`}>
                            <div className="flex justify-between items-center">
                               <div>
                                 <p className={`font-bold ${m.status === 'PAID' ? 'text-green-400' : 'text-slate-200'}`}>{m.title}</p>
                                 <p className="text-[10px] text-slate-500 italic mt-1">{m.definitionOfDone.join(" • ")}</p>
                               </div>
                               {m.status === 'PAID' ? <CheckCircle className="text-green-500" /> : <span className="text-xs font-black">₹{m.payoutAmount}</span>}
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="flex gap-4">
                      <input className="flex-1 bg-black border border-slate-800 rounded-xl px-4 text-xs font-mono" placeholder="GitHub URL" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} />
                      <button onClick={() => handleVerify(p._id, p.milestones[p.currentMilestoneIndex]._id)} disabled={auditing} className="bg-blue-600 px-6 py-4 rounded-xl font-black text-[10px] uppercase">Audit & Pay</button>
                    </div>
                  </div>
                ))}
             </div>
             <div className="xl:col-span-5">
                <LogConsole auditing={auditing} logs={auditLog} />
             </div>
           </div>
        )}

        {/* --- HISTORY VIEW (Completed only) --- */}
        {activeTab === 'history' && (
          <div className="space-y-6 max-w-4xl animate-in slide-in-from-bottom-8">
            {myProjects.filter(p => p.status === 'COMPLETED').length === 0 ? (
              <EmptyState msg="No completed projects in the archive yet." />
            ) : (
              myProjects.filter(p => p.status === 'COMPLETED').map(p => (
                <div key={p._id} className="bg-[#161B22] border border-green-500/20 p-8 rounded-[2rem] flex justify-between items-center group hover:border-green-500 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-green-500/10 text-green-500 rounded-2xl"><CheckCircle size={32}/></div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{p.description}</h3>
                      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                        Node_Status: Fully_Deployed // Hash: {p._id.substring(0,12)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right font-black text-white text-2xl">₹{p.totalBudget}</div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'payments' && <div className="p-10 text-center text-slate-600 font-bold border border-slate-800 rounded-[2rem]">Stablecoin disbursement portal coming soon.</div>}
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function NavItem({ icon, label, active, onClick }) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
      {icon} <span className="hidden lg:block font-bold text-[10px] uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

function LogConsole({ auditing, logs }) {
  return (
    <div className="bg-black p-8 rounded-[2rem] border border-slate-800 h-full font-mono text-sm relative overflow-hidden min-h-[400px]">
      <div className="flex items-center justify-between mb-6 text-[10px] font-bold text-slate-500 border-b border-slate-800 pb-4">
        <span>AGENT_INTEL_LOG</span> <div className={`w-2 h-2 rounded-full ${auditing ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></div>
      </div>
      <div className="space-y-3">
        {logs.map((l, i) => <div key={i} className={`flex gap-3 ${l.includes('✓') || l.includes('PROJECT') ? 'text-green-400 font-bold' : 'text-blue-400'}`}><span className="text-slate-700">{'>'}</span> {l}</div>)}
      </div>
    </div>
  );
}

function EmptyState({ msg }) {
  return (
    <div className="p-20 bg-slate-900/50 border border-slate-800 rounded-[3rem] text-center font-bold text-slate-600 uppercase tracking-widest text-[10px]">{msg}</div>
  );
}