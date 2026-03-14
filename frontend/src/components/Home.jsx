import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Cpu, ArrowRight, Github } from 'lucide-react';

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col">
      {/* FULL WIDTH NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="w-full px-8 lg:px-16 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
              <ShieldCheck size={28} />
            </div>
            <span className="text-3xl font-black tracking-tighter text-slate-900">COGNIZANCE.AI</span>
          </div>
          <div className="flex items-center gap-8">
            <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">Login</Link>
            <Link to="/signup" className="bg-black text-white px-8 py-3.5 rounded-2xl text-sm font-black hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10">
              Join the Future
            </Link>
          </div>
        </div>
      </nav>

      {/* FULL WIDTH HERO */}
      <section className="relative w-full flex-grow pt-48 pb-32 px-8 lg:px-16">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-full h-full -z-10">
          <div className="absolute top-0 right-[-10%] w-[60%] h-[60%] bg-blue-200/40 blur-[150px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/40 blur-[150px] rounded-full animate-pulse"></div>
        </div>

        <div className="w-full">
          <div className="mb-8 flex justify-start">
             <span className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black tracking-widest text-blue-600 shadow-sm uppercase">
               Autonomous Agent Escrow v1.0
             </span>
          </div>
          
          <h1 className="text-7xl md:text-[120px] lg:text-[140px] font-black text-slate-900 leading-[0.85] tracking-tighter mb-12">
            Automating <br />
            <span className="text-blue-600 inline-block">Human Trust.</span>
          </h1>

          <div className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
            <p className="text-xl md:text-3xl text-slate-500 font-medium leading-tight max-w-3xl">
              The first AI Agent Escrow that architects your roadmap and verifies code automatically. Stop chasing freelancers, let the Agent handle the audit.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5">
              <Link to="/signup" className="group bg-blue-600 text-white px-12 py-6 rounded-[2rem] font-black text-xl hover:bg-blue-700 transition-all flex items-center gap-3 shadow-2xl shadow-blue-500/40">
                Get Started <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FULL WIDTH FEATURES */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 border-t border-slate-200">
        <FeatureBlock 
          icon={<Cpu size={40} className="text-blue-600" />}
          title="AI Architect"
          desc="Translates human intent into technical milestones with a single prompt."
          border="border-r"
        />
        <FeatureBlock 
          icon={<Github size={40} className="text-indigo-600" />}
          title="Auto-Audit"
          desc="Autonomous semantic verification of every GitHub commit against the roadmap."
          border="border-r"
        />
        <FeatureBlock 
          icon={<Zap size={40} className="text-amber-500" />}
          title="Flash Payouts"
          desc="Escrow funds released the millisecond verification is complete. No middleman."
        />
      </section>
    </div>
  );
}

function FeatureBlock({ icon, title, desc, border = "" }) {
  return (
    <div className={`p-16 bg-white transition-all duration-500 hover:bg-slate-50 border-slate-200 ${border} group`}>
      <div className="mb-10 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">{icon}</div>
      <h3 className="text-3xl font-black text-slate-900 mb-6">{title}</h3>
      <p className="text-lg text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}