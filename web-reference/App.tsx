import React, { useState, useEffect } from 'react';
import TUIBox from './components/TUIBox';
import GlitchText from './components/GlitchText';
import SimulationCanvas from './components/SimulationCanvas';
import { ToolMode, BrushSettings, SimulationStats } from './types';
import { 
  Play, Pause, FastForward, RotateCcw, 
  MousePointer2, Pencil, Eraser, Eye,
  Cpu, Activity, Zap, Layers, Network
} from 'lucide-react';

const App: React.FC = () => {
  // State
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1.0);
  const [toolMode, setToolMode] = useState<ToolMode>(ToolMode.DRAW);
  const [stats, setStats] = useState<SimulationStats>({ step: 0, time: 0, mass: 0, fps: 60 });
  const [brush, setBrush] = useState<BrushSettings>({ size: 10, intensity: 80 });
  const [bootSequence, setBootSequence] = useState(true);

  // Fake Boot Sequence
  useEffect(() => {
    const timer = setTimeout(() => setBootSequence(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Fake FPS Counter
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        step: playing ? prev.step + Math.ceil(speed) : prev.step,
        time: playing ? prev.time + 0.016 * speed : prev.time,
        fps: playing ? Math.floor(55 + Math.random() * 10) : 0
      }));
    }, 100); // Update stats every 100ms
    return () => clearInterval(interval);
  }, [playing, speed]);

  const togglePlay = () => setPlaying(!playing);

  if (bootSequence) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-black text-cyan-500 font-mono">
        <div className="w-64">
           <GlitchText text="INITIALIZING CORE..." className="text-xl mb-4" />
           <div className="w-full h-1 bg-gray-900 overflow-hidden">
             <div className="h-full bg-cyan-500 animate-[pulse_0.5s_infinite] w-full origin-left animate-progress"></div>
           </div>
           <div className="mt-2 text-xs text-cyan-800">
             > MOUNTING VIRTUAL DOM<br/>
             > LOADING PATTERN BUFFER<br/>
             > ESTABLISHING NEURAL LINK...
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-2 md:p-4 gap-2 md:gap-4 relative z-10">
      
      {/* --- HEADER --- */}
      <header className="flex justify-between items-center h-16 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border border-cyan-500 flex items-center justify-center bg-cyan-900/20 animate-pulse">
             <Activity className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <GlitchText as="h1" text="FLOW_LENIA :: PROTOCOL" className="text-2xl font-bold tracking-tighter text-cyan-400" />
            <div className="text-[10px] text-cyan-700 tracking-[0.2em] uppercase">
              Ver 0.9.4 // Build 2049 // Wired_Access
            </div>
          </div>
        </div>
        <div className="flex gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-green-400">
               <Network size={14} /> 
               <span>ONLINE</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-600">
               <span>LATENCY: 4ms</span>
            </div>
        </div>
      </header>

      {/* --- MAIN CONTENT GRID --- */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-[260px_1fr_260px] gap-4 min-h-0">
        
        {/* LEFT SIDEBAR: CONTROLS */}
        <aside className="flex flex-col gap-4">
          
          {/* Playback */}
          <TUIBox title="SYS.CONTROL" borderColor="cyan">
            <div className="grid grid-cols-4 gap-2 mb-4">
               <button 
                onClick={togglePlay}
                className={`flex items-center justify-center h-10 border hover:bg-cyan-900/50 transition-colors ${playing ? 'border-cyan-400 bg-cyan-900/30' : 'border-cyan-800'}`}
               >
                 {playing ? <Pause size={16} /> : <Play size={16} />}
               </button>
               <button className="flex items-center justify-center h-10 border border-cyan-800 hover:bg-cyan-900/50">
                  <Play size={16} className="fill-current text-xs ml-1" />
                  <span className="text-[10px] absolute mt-[2px] ml-[2px] w-[2px] h-3 bg-current"></span>
               </button>
               <button 
                 onClick={() => setStats({ ...stats, step: 0, time: 0 })}
                 className="flex items-center justify-center h-10 border border-cyan-800 hover:bg-cyan-900/50"
               >
                  <RotateCcw size={16} />
               </button>
               <button 
                 className="flex items-center justify-center h-10 border border-cyan-800 hover:bg-cyan-900/50 text-red-500 border-red-900"
               >
                  <div className="w-3 h-3 bg-red-500 rounded-sm animate-pulse"></div>
               </button>
            </div>
            
            <div className="space-y-2">
               <div className="flex justify-between text-[10px] uppercase text-cyan-600">
                 <span>Sim Speed</span>
                 <span>{speed.toFixed(1)}x</span>
               </div>
               <input 
                 type="range" 
                 min="0.1" 
                 max="5.0" 
                 step="0.1"
                 value={speed}
                 onChange={(e) => setSpeed(parseFloat(e.target.value))}
                 className="w-full"
               />
            </div>
          </TUIBox>

          {/* Tools */}
          <TUIBox title="TOOL.KIT" borderColor="magenta">
            <div className="grid grid-cols-2 gap-2 mb-4">
               {[
                 { id: ToolMode.VIEW, icon: Eye, label: 'VIEW' },
                 { id: ToolMode.SELECT, icon: MousePointer2, label: 'SEL' },
                 { id: ToolMode.DRAW, icon: Pencil, label: 'INJECT' },
                 { id: ToolMode.ERASE, icon: Eraser, label: 'PURGE' },
               ].map((tool) => (
                 <button
                   key={tool.id}
                   onClick={() => setToolMode(tool.id)}
                   className={`h-12 border flex flex-col items-center justify-center gap-1 transition-all
                     ${toolMode === tool.id 
                       ? 'border-fuchsia-400 bg-fuchsia-900/20 text-fuchsia-300 shadow-[0_0_10px_rgba(255,0,255,0.3)]' 
                       : 'border-fuchsia-900 text-fuchsia-800 hover:border-fuchsia-600 hover:text-fuchsia-500'}`
                   }
                 >
                   <tool.icon size={16} />
                   <span className="text-[10px] tracking-wider">{tool.label}</span>
                 </button>
               ))}
            </div>

            {/* Brush Settings */}
            <div className="space-y-4 pt-2 border-t border-fuchsia-900/50">
               <div className="space-y-1">
                 <div className="flex justify-between text-[10px] uppercase text-fuchsia-600">
                   <span>Emitter Size</span>
                   <span>{brush.size}px</span>
                 </div>
                 <input 
                   type="range" min="2" max="50"
                   value={brush.size}
                   onChange={(e) => setBrush({...brush, size: parseInt(e.target.value)})}
                   className="w-full accent-fuchsia-500"
                   style={{ '--color-cyan': 'var(--color-magenta)' } as React.CSSProperties}
                 />
               </div>
               <div className="space-y-1">
                 <div className="flex justify-between text-[10px] uppercase text-fuchsia-600">
                   <span>Potency</span>
                   <span>{brush.intensity}%</span>
                 </div>
                 <input 
                   type="range" min="10" max="100"
                   value={brush.intensity}
                   onChange={(e) => setBrush({...brush, intensity: parseInt(e.target.value)})}
                   className="w-full"
                   style={{ '--color-cyan': 'var(--color-magenta)' } as React.CSSProperties}
                 />
               </div>
            </div>
          </TUIBox>

          <TUIBox title="DEBUG.LOG" borderColor="green" className="flex-1 overflow-hidden">
             <div className="h-full overflow-y-auto text-[10px] font-mono leading-tight space-y-1 text-green-700/80 p-1">
                <div className="text-green-400">> SYSTEM READY</div>
                <div>> loaded_modules: [physics, render, audio]</div>
                <div>> memory_heap: 42%</div>
                <div className="opacity-50">> waiting for input...</div>
                {playing && <div className="animate-pulse text-green-500">> simulation_running...</div>}
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="opacity-30">> 0x00{400 + i} packet_ok</div>
                ))}
             </div>
          </TUIBox>

        </aside>

        {/* CENTER: VIEWPORT */}
        <section className="flex flex-col min-h-0 relative">
          
          {/* Top telemetry bar for canvas */}
          <div className="h-8 flex items-center justify-between px-2 mb-1 bg-cyan-950/20 border-t border-cyan-900/50 text-[10px] text-cyan-600 uppercase tracking-widest">
             <span>CAM_01 [LIVE]</span>
             <span>RES: 512x512</span>
             <span>ZOOM: 100%</span>
          </div>

          <div className="flex-1 relative border border-cyan-800 bg-black shadow-[0_0_20px_rgba(0,0,0,0.8)] overflow-hidden group">
            
            {/* Corner Markers */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-500 z-20 opacity-50"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-500 z-20 opacity-50"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-500 z-20 opacity-50"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-500 z-20 opacity-50"></div>
            
            {/* Center Crosshair */}
            <div className="absolute top-1/2 left-1/2 w-8 h-8 -ml-4 -mt-4 pointer-events-none z-20 opacity-20">
               <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500"></div>
               <div className="absolute left-1/2 top-0 h-full w-[1px] bg-cyan-500"></div>
            </div>

            <SimulationCanvas 
              playing={playing} 
              speed={speed} 
              toolMode={toolMode}
              brushSettings={brush}
              onStatsUpdate={(s) => setStats(prev => ({...prev, mass: s.mass}))}
            />

            {/* Scanlines overlay on canvas specifically */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
          </div>
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="flex flex-col gap-4">
           
           <TUIBox title="PATTERN_BANK" borderColor="cyan">
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                 {[1,2,3,4,5,6].map((i) => (
                    <button key={i} className="aspect-square border border-cyan-900 bg-cyan-950/20 hover:border-cyan-400 hover:bg-cyan-900/40 relative group overflow-hidden">
                       <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-100 transition-opacity">
                         <div className={`w-${i*2} h-${i*2} rounded-full bg-cyan-500 blur-md`}></div>
                       </div>
                       <span className="absolute bottom-1 right-1 text-[9px] text-cyan-500">PAT_{i.toString().padStart(2, '0')}</span>
                    </button>
                 ))}
              </div>
           </TUIBox>

           <TUIBox title="INFO.PANEL" borderColor="magenta" className="flex-1">
              <div className="space-y-4">
                 <div>
                    <div className="text-[10px] text-fuchsia-700 uppercase mb-1">Entity Class</div>
                    <div className="text-sm text-fuchsia-400 font-bold">ORBIUM_UNICORNIS</div>
                 </div>
                 
                 <div>
                    <div className="text-[10px] text-fuchsia-700 uppercase mb-1">Kernel Params</div>
                    <div className="grid grid-cols-2 gap-y-2 text-xs text-fuchsia-300 font-mono">
                       <div className="border-b border-fuchsia-900/50 pb-1">Mu: 0.15</div>
                       <div className="border-b border-fuchsia-900/50 pb-1">Sigma: 0.017</div>
                       <div className="border-b border-fuchsia-900/50 pb-1">Beta: [1, 0.5]</div>
                       <div className="border-b border-fuchsia-900/50 pb-1">R: 13.0</div>
                    </div>
                 </div>

                 <div className="p-2 border border-fuchsia-900/50 bg-fuchsia-950/20 mt-4">
                    <div className="flex items-center gap-2 mb-2">
                       <Zap size={12} className="text-yellow-400" />
                       <span className="text-[10px] text-fuchsia-200">WARNING</span>
                    </div>
                    <p className="text-[9px] text-fuchsia-500 leading-relaxed">
                       Unstable configuration detected. Evolution may diverge into chaotic attractors. Monitor mass conservation closely.
                    </p>
                 </div>
              </div>
           </TUIBox>

           <TUIBox title="LAYERS" borderColor="green">
              <div className="space-y-1">
                 {['Substrate', 'Trails', 'Vector_Field', 'Overlay'].map((layer, i) => (
                    <div key={layer} className="flex items-center justify-between px-2 py-1 hover:bg-green-900/20 cursor-pointer">
                       <div className="flex items-center gap-2">
                          <Layers size={12} className={i === 0 ? "text-green-400" : "text-green-800"} />
                          <span className={`text-[10px] uppercase ${i === 0 ? "text-green-300" : "text-green-800"}`}>{layer}</span>
                       </div>
                       <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-green-500 shadow-[0_0_5px_#39ff14]" : "border border-green-900"}`}></div>
                    </div>
                 ))}
              </div>
           </TUIBox>

        </aside>
      </main>

      {/* --- FOOTER: STATS --- */}
      <footer className="h-10 shrink-0 border-t border-cyan-900/50 flex items-center px-4 justify-between bg-[#080808]">
         <div className="flex gap-8 font-mono text-xs">
            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
               <span className="text-cyan-800 uppercase text-[9px]">Steps</span>
               <span className="text-cyan-400 font-['VT323'] text-xl leading-none">{stats.step.toString().padStart(8, '0')}</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
               <span className="text-cyan-800 uppercase text-[9px]">Time</span>
               <span className="text-cyan-400 font-['VT323'] text-xl leading-none">{stats.time.toFixed(2)}s</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:gap-2">
               <span className="text-fuchsia-800 uppercase text-[9px]">Mass</span>
               <span className="text-fuchsia-400 font-['VT323'] text-xl leading-none">{stats.mass.toLocaleString()}</span>
            </div>
         </div>
         
         <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-2 py-1 border border-cyan-900 rounded bg-cyan-950/30">
                <Cpu size={14} className="text-cyan-600" />
                <span className="text-[10px] text-cyan-600 font-bold">GPU.ACCEL</span>
             </div>
             <div className="text-right">
                <span className="text-[10px] text-cyan-800 block uppercase">Framerate</span>
                <span className={`text-sm font-bold ${stats.fps < 30 ? 'text-red-500' : 'text-green-500'}`}>{stats.fps} FPS</span>
             </div>
         </div>
      </footer>

      {/* GLOBAL OVERLAYS */}
      <div className="scanlines"></div>
      <div className="vignette"></div>
      
    </div>
  );
};

export default App;
