import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Activity, Map as MapIcon, AlertTriangle, Cpu, Siren, 
  Wind, Database, Globe, CheckCircle2, Clock, TrendingUp, Search, 
  Radio, Satellite, Truck, HeartPulse, Users, BarChart3, PieChart as PieIcon, 
  ShieldCheck, Navigation, ChevronRight, Sun, Moon, DatabaseZap, Zap, Info
} from 'lucide-react';
import { MapContainer, TileLayer, Circle, Popup, Polyline } from 'react-leaflet';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';

// --- DATA SEEDING ---
const SECTOR_DATA = [
  { id: 'S-07', label: 'Connaught', risk: 84, nodes: 1240, status: 'CRITICAL', color: '#ef4444', pos: [28.6139, 77.2090] },
  { id: 'S-12', label: 'Govt Dist', risk: 42, nodes: 890, status: 'WARNING', color: '#f59e0b', pos: [28.6239, 77.2190] },
  { id: 'S-02', label: 'East Res', risk: 12, nodes: 2100, status: 'STABLE', color: '#22c55e', pos: [28.6039, 77.1990] },
];

const INTEGRITY_TRENDS = [{t:'08:00',v:95},{t:'09:00',v:82},{t:'10:00',v:45},{t:'11:00',v:38},{t:'12:00',v:32}];
const MISSION_LOGS = [
  { id: 'M-1', task: 'Evacuate Sector 7', progress: 65, priority: 'High' },
  { id: 'M-2', task: 'Medical Drop: Sector 12', progress: 30, priority: 'Critical' },
  { id: 'M-3', task: 'UAV Mapping: East', progress: 100, priority: 'Normal' },
];

// --- UI COMPONENTS ---
const GlassCard = ({ children, title, icon: Icon, className }) => (
  <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-xl relative overflow-hidden transition-all duration-300 ${className}`}>
    {title && (
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-white/5 pb-4">
        {Icon && <Icon size={18} className="text-cyan-600" />}
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

// --- TAB 1: OVERALL SITUATION (HOME) ---
const HomeOverview = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
    {/* KPI Row */}
    <div className="grid grid-cols-4 gap-6">
      {[
        { l: 'Structural Failures', v: '142', c: 'text-red-500', i: AlertTriangle },
        { l: 'Mesh Connectivity', v: '94%', c: 'text-cyan-600', i: Radio },
        { l: 'Lives Secured', v: '2.4k', c: 'text-green-600', i: CheckCircle2 },
        { l: 'Triage Coverage', v: '82%', c: 'text-yellow-600', i: TrendingUp },
      ].map((stat, i) => (
        <GlassCard key={i} className="border-l-4" style={{ borderLeftColor: stat.c.includes('red') ? '#ef4444' : stat.c.includes('cyan') ? '#0891b2' : stat.c.includes('green') ? '#16a34a' : '#ca8a04' }}>
          <div className="flex items-center gap-4">
            <stat.i size={28} className={stat.c} />
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.l}</p>
              <p className={`text-2xl font-mono font-black ${stat.c}`}>{stat.v}</p>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>

    {/* Analytics Grid */}
    <div className="grid grid-cols-12 gap-8">
      <GlassCard title="City-Wide Stability index" icon={Activity} className="col-span-8">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={INTEGRITY_TRENDS}>
              <defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="t" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Area type="monotone" dataKey="v" stroke="#06b6d4" fill="url(#gr)" strokeWidth={4} />
              <Tooltip />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard title="Mission Progress" icon={Siren} className="col-span-4 flex flex-col justify-between">
        <div className="space-y-6">
          {MISSION_LOGS.slice(0, 3).map((m, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                <span className="text-slate-500">{m.task}</span>
                <span className="text-cyan-600">{m.progress}%</span>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500" style={{ width: `${m.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Full Ops Log</button>
      </GlassCard>
    </div>

    {/* Regional Stats */}
    <div className="grid grid-cols-3 gap-8">
       {SECTOR_DATA.map(s => (
         <GlassCard key={s.id} className="p-4 border-b-4" style={{ borderBottomColor: s.color }}>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">{s.id}</p>
            <h4 className="text-sm font-black text-slate-700 uppercase tracking-tighter mb-4">{s.label}</h4>
            <div className="flex justify-between items-end">
               <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase">Risk</p>
                  <p className="text-xl font-mono font-black" style={{ color: s.color }}>{s.risk}%</p>
               </div>
               <div className="text-right">
                  <p className="text-[8px] font-bold text-slate-400 uppercase">Nodes</p>
                  <p className="text-xs font-mono font-bold text-slate-700">{s.nodes}</p>
               </div>
            </div>
         </GlassCard>
       ))}
    </div>
  </motion.div>
);

// --- TAB 4: INTELLIGENCE (DATA FUSION) ---
const DataIntelligence = () => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-2 gap-8 h-full pb-20">
    <GlassCard title="Multi-Source Ingestion Matrix" icon={Database}>
      <div className="space-y-4">
        {[
          { n: 'Sentinel-2 Satellite', s: 'Synced', l: '100%', i: Globe, c: 'text-green-500' },
          { n: 'UAV Swarm Alpha', s: 'Active', l: '94%', i: Wind, c: 'text-cyan-500' },
          { n: 'P2P Citizen Mesh', s: 'Congested', l: '82%', i: Radio, c: 'text-yellow-500' },
          { n: 'Govt Infrastructure', s: 'Offline', l: '0%', i: DatabaseZap, c: 'text-red-500' },
        ].map((item, idx) => (
          <div key={idx} className="flex justify-between items-center p-5 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-4">
              <item.i size={20} className={item.c} />
              <div>
                <p className="text-xs font-black text-slate-800 uppercase">{item.n}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{item.s}</p>
              </div>
            </div>
            <span className="text-sm font-mono text-slate-900 font-black">{item.l}</span>
          </div>
        ))}
      </div>
    </GlassCard>

    <div className="flex flex-col gap-8">
      <GlassCard title="AI Signal Analysis" icon={Zap}>
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <Activity size={48} className="text-cyan-500 mb-4 animate-pulse" />
          <p className="text-xs font-mono text-slate-500">PROCESSING_TELEMETRY: 104Hz</p>
          <p className="text-[10px] text-slate-400 mt-2 italic font-serif">Synthesizing FFT Spectral Peaks for Structural Triage...</p>
        </div>
      </GlassCard>
      <div className="flex-1 bg-slate-900 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center text-white border-4 border-white shadow-2xl">
         <ShieldCheck size={40} className="text-green-400 mb-4" />
         <h4 className="text-sm font-black uppercase tracking-[0.4em]">Encrypted_Hub_Link</h4>
         <p className="text-[9px] text-slate-500 mt-2 uppercase font-bold tracking-widest">AES-256 Tunnel Established</p>
      </div>
    </div>
  </motion.div>
);

// --- MAIN APP SHELL ---
export default function OmegaDashboard() {
  const [activeTab, setActiveTab] = useState('HOME');
  const [dark, setDark] = useState(false);
  const [logs, setLogs] = useState([
    { t: '12:04', n: 'X788', m: 'Structural Pulse: 34% Integrity Drop' },
    { t: '12:03', n: 'UAV-1', m: 'Sector 7 Thermal Scan Complete' },
    { t: '11:58', n: 'SAT-L', m: 'Change Detection: Zone 4 Red-Tagged' }
  ]);

  return (
    <div className={`${dark ? 'dark' : ''} h-screen w-screen bg-[#F1F5F9] dark:bg-[#020617] text-slate-900 dark:text-slate-200 flex overflow-hidden transition-all duration-500 font-sans`}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/5 flex flex-col py-10 z-50 shadow-2xl">
        <div className="px-8 mb-16 flex items-center gap-4">
          <div className="p-3 bg-cyan-600 rounded-2xl shadow-xl shadow-cyan-600/20"><ShieldAlert size={24} className="text-white" /></div>
          <h1 className="font-black italic text-xl text-slate-900 dark:text-white uppercase tracking-widest leading-none font-serif">QuakeLens</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'HOME', icon: Activity, label: 'Overview' },
            { id: 'GIS', icon: MapIcon, label: 'Tactical GIS' },
            { id: 'PLAN', icon: Cpu, label: 'AI Operations' },
            { id: 'INTELLIGENCE', icon: Database, label: 'Intelligence' }
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest ${activeTab === item.id ? 'bg-cyan-600/10 text-cyan-600 border border-cyan-600/20 shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
        <button onClick={() => setDark(!dark)} className="mt-auto mx-8 p-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-cyan-600 transition-all flex justify-center">
          {dark ? <Sun size={24}/> : <Moon size={24}/>}
        </button>
      </aside>

      {/* MAIN INTERFACE AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 border-b border-slate-200 dark:border-white/5 flex justify-between items-center px-12 bg-white/60 dark:bg-slate-950/40 backdrop-blur-xl z-40">
          <div>
            <h1 className="text-2xl font-black italic uppercase text-slate-900 dark:text-white tracking-widest leading-none">OMEGA-C2 <span className="text-cyan-600 opacity-60 font-light underline underline-offset-8">COMMAND</span></h1>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">Strategic Status: Operational // New Delhi Sector</p>
          </div>
          <button className="bg-red-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-600/20 active:scale-95 transition-all">Broadcast SOS</button>
        </header>

        <main className="flex-1 overflow-y-auto p-12 relative hide-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'HOME' && <HomeOverview />}
            {activeTab === 'INTELLIGENCE' && <DataIntelligence />}
            {activeTab === 'GIS' && (
              <motion.div key="g" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[750px] w-full bg-slate-900 rounded-[3rem] overflow-hidden relative shadow-2xl border-4 border-slate-200 dark:border-white/5 mb-20">
                 <MapContainer center={[28.6139, 77.2090]} zoom={13} zoomControl={false} style={{ height: '100%' }}>
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                    {SECTOR_DATA.map(s => (
                      <Circle key={s.id} center={s.pos} radius={850} pathOptions={{ color: 'white', weight: 1, fillColor: s.color, fillOpacity: 0.6 }}>
                        <Popup><div className="text-xs font-mono uppercase font-bold tracking-tighter"><strong>{s.label}</strong><br/>Risk: {s.risk}%</div></Popup>
                      </Circle>
                    ))}
                 </MapContainer>
              </motion.div>
            )}
            {activeTab === 'PLAN' && (
              <motion.div key="p" initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
                 {MISSION_LOGS.map((t, i) => (
                   <GlassCard key={i} className="flex justify-between items-center p-8 group hover:border-cyan-500/30 transition-all cursor-pointer">
                      <div><span className={`text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest ${t.priority==='Critical'?'bg-red-500 text-white':'bg-cyan-600/10 text-cyan-600'}`}>{t.priority}</span><h4 className="text-slate-800 dark:text-white text-lg font-black uppercase mt-2 italic tracking-tight">{t.task}</h4></div>
                      <div className="flex items-center gap-10">
                        <div className="text-right"><p className="text-[10px] opacity-40 font-bold uppercase tracking-widest">Progress</p><p className="text-2xl font-mono font-black text-cyan-600">{t.progress}%</p></div>
                        <ChevronRight size={20} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                      </div>
                   </GlassCard>
                 ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* TELEMETRY FEED (RIGHT PANEL) */}
      <aside className="w-96 bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-white/5 flex flex-col p-8 overflow-hidden z-50">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-3"><Siren size={14} className="text-cyan-600 animate-bounce" /> Tactical Telemetry</h3>
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide">
          {logs.map((log, i) => (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={i} className="p-5 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/5 group hover:border-cyan-500/30 transition-all cursor-default shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-cyan-600 font-mono font-black text-[10px]">[{log.t}]</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-white tracking-tighter underline">NODE_778X</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 italic font-medium leading-relaxed tracking-tight uppercase font-mono">{log.m}</p>
            </motion.div>
          ))}
        </div>
      </aside>

    </div>
  );
}