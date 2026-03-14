import React from 'react';
import { ShieldCheck, FileCode, CheckCircle2, XCircle, ArrowLeft, Terminal } from 'lucide-react';

export default function AuditDetail({ project, onBack }) {
  const currentMilestone = project.milestones[project.currentMilestoneIndex];

  return (
    <div className="min-h-screen bg-slate-50 w-full p-8 lg:p-12 animate-in fade-in duration-500">
      {/* Header */}
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors mb-8">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Project Overview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Milestone Audit</h2>
            <p className="text-slate-500 text-sm font-medium mb-6">Autonomous verification in progress for milestone #{project.currentMilestoneIndex + 1}</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Milestone</p>
                <p className="font-bold text-slate-800">{currentMilestone.title}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Escrow Amount</p>
                <p className="font-bold text-blue-700 text-xl">₹{currentMilestone.payoutAmount}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="text-blue-400" size={20} /> Agent Confidence
            </h3>
            <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden mb-4">
              <div className="bg-blue-500 h-full w-[85%] animate-pulse"></div>
            </div>
            <p className="text-xs text-slate-400 font-medium">The Agent is 85% confident in the current code structure based on semantic analysis.</p>
          </div>
        </div>

        {/* Right Column: Audit Logs & Files */}
        <div className="lg:col-span-8 space-y-8">
          {/* Requirement Status */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-6">Requirement Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentMilestone.definitionOfDone.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <CheckCircle2 className="text-green-500" size={20} />
                  <span className="text-sm font-bold text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Code Inspection Simulation */}
          <div className="bg-[#0D1117] rounded-[2.5rem] p-8 border border-slate-800 shadow-2xl overflow-hidden relative">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <Terminal className="text-slate-500" size={18} />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Agent_Inspector_Log</span>
              </div>
              <span className="text-[10px] font-mono text-blue-500 bg-blue-500/10 px-2 py-1 rounded">LIVE_AUDIT</span>
            </div>

            <div className="font-mono text-sm space-y-2">
              <p className="text-blue-400"># Initializing Semantic Analysis...</p>
              <p className="text-slate-500">Scanning repository: /src/components/Form.jsx</p>
              <p className="text-green-400">✓ Found React functional component</p>
              <p className="text-green-400">✓ Validation logic detected in handleSumbit</p>
              <p className="text-amber-400">! Warning: Accessibility labels missing on input fields</p>
              <p className="text-blue-400"># Comparing code patterns against Definition of Done...</p>
              <p className="text-white mt-4 font-bold animate-pulse">{'>'} AGENT VERDICT: PENDING_FINAL_COMMIT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}