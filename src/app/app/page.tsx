"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Terminal, Brain, HardDrive, Target, Layers2, Menu, Activity, VolumeX, Trash2, Maximize2, Layers, ArrowRight, X, Mic, Clock, Lock, Sparkles, Shield, Database, RefreshCw, Zap, Radio, Globe, Paperclip, CreditCard, LogOut, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── TYPES ──────────────────────────────────────────────────────────────────
interface ChatMsg { 
  role: 'system' | 'assistant' | 'user' | 'tool'; 
  content: string; 
  status?: string; 
  hasCode?: boolean;
  image?: string; 
  engine?: string;
  iterations?: number;
  criticScore?: number;
  timestamp: Date;
}

interface LeadStatus {
  active: boolean;
  count: number;
  lastFound: string;
  intensity: number;
}

// ─── MOCK DATA ──────────────────────────────────────────────────────────────
const MARKETPLACE_SKILLS = [
  { name: "AEGIS Lead Sniper", desc: "Extracción autónoma de leads via LinkedIn & Google Maps", uri: "mcp://lead-sniper", icon: Target, capabilities: ["search", "leads"] },
  { name: "Neural Scraper V4", desc: "Reader mode avanzado con bypass de bot-detection", uri: "mcp://scraper-v4", icon: Globe, capabilities: ["scrape", "bypass"] },
  { name: "Vortex Memory Hub", desc: "Indexación semántica de documentos locales y nube", uri: "mcp://vortex", icon: Database, capabilities: ["memory", "vector"] },
  { name: "Auto-DevOps Bot", desc: "Despliegue automático a Vercel, Supabase y Render", uri: "mcp://deploy", icon: Zap, capabilities: ["deploy", "ci-cd"] },
];

export default function SuperFunctionalDashboard() {
  const [activeTab, setActiveTab] = useState('nexus');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isSplitView, setIsSplitView] = useState(true);
  const [artifactContent, setArtifactContent] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  
  // Chat & Engine State
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentEngine, setCurrentEngine] = useState('AEGIS-v10_READY');
  const [stats, setStats] = useState({ 
    totalMessages: 0, 
    totalKnowledge: 0, 
    totalFiles: 0, 
    totalCronJobs: 0, 
    totalSkills: 4, 
    activeCronJobs: 1,
    tokenUsage: 14520,
    cpuLoad: 12
  });

  const [leadStatus] = useState<LeadStatus>({
    active: true,
    count: 428,
    lastFound: "Software Developer @ Madrid",
    intensity: 75
  });

  const [isListening, setIsListening] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const [attachments, setAttachments] = useState<{name: string, url: string, type: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ─── VOICE LOGIC ───────────────────────────────────────────────────────────
  const speak = async (text: string) => {
    if (!text) return;
    try {
      setIsSpeaking(true);
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: text.replace(/[#*`]/g, '').substring(0, 1000),
          voice: 'es-MX-DaliaNeural' // Voz femenina imponente y limpia (ALICE)
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        if (audioRef.current) {
          audioRef.current.src = url;
          audioRef.current.load(); // Ensure it's loaded
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(e => {
              console.error("Playback failed (Silent mode?):", e);
              setIsSpeaking(false);
            });
          }
          audioRef.current.onended = () => setIsSpeaking(false);
        }
      } else {
        console.warn("TTS API Unavailable — Skipping voice to avoid bad quality fallback.");
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error("Audio Error:", err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // ─── STT LOGIC (Voice to Text) ──────────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'es-ES';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((result: any) => result[0])
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((result: any) => result.transcript)
          .join('');
        setInputValue(transcript);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInputValue('');
      recognitionRef.current?.start();
    }
  };

  const repeatLastMessage = () => {
    const lastBotMsg = [...messages].reverse().find(m => m.role === 'assistant');
    if (lastBotMsg) {
      const textToSpeak = lastBotMsg.content.replace(/```[\s\S]*?```/g, '').trim();
      speak(textToSpeak || "Proceso completado.");
    }
  };

  // ─── INITIALIZATION ────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('og_v10_chat');
    if (saved) {
      const parsed = JSON.parse(saved).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      setMessages(parsed);
    } else {
      setMessages([
        { 
          role: 'assistant', 
          content: "# ALICE AI — SISTEMA OPERATIVO v10.1\n\nNivel de acceso: **ADMINISTRADOR_SISTEMATICO**.\n\nHola, soy **Alice**. He activado mi núcleo de inteligencia **AEGIS-V10**. Estoy lista para procesar tus comandos, extraer leads o construir interfaces tácticas. ¿Qué protocolo iniciamos hoy?",
          timestamp: new Date(),
          engine: "ALICE-v10:llama-3.3-70b"
        }
      ]);
    }

    // Pseudo-realtime CPU update
    const interval = setInterval(() => {
      setStats(prev => ({ 
        ...prev, 
        cpuLoad: Math.floor(Math.random() * 20) + 5,
        tokenUsage: prev.tokenUsage + Math.floor(Math.random() * 5)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      // FIX: podar localStorage para no superar la quota (~5MB)
      // mantener solo los últimos 50 mensajes
      const toStore = messages.slice(-50);
      try {
        localStorage.setItem('og_v10_chat', JSON.stringify(toStore));
      } catch (e) {
        // Quota exceeded — limpiar y reintentar con menos mensajes
        console.warn('LocalStorage lleno, limpiando...', e);
        localStorage.removeItem('og_v10_chat');
        try {
          localStorage.setItem('og_v10_chat', JSON.stringify(toStore.slice(-20)));
        } catch {}
      }
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // ─── CHAT LOGIC ───────────────────────────────────────────────────────────
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    const val = inputValue.trim();
    if (isProcessing || (!val && attachments.length === 0)) return;

    setIsProcessing(true);
    setInputValue('');
    stopSpeaking();
    
    let finalContent = val || "Analiza los archivos adjuntos.";
    if (attachments.length > 0) {
      finalContent += '\n\n[ARCHIVOS DE USUARIO CARGADOS EN MEMORIA: ' + attachments.map(a => a.name).join(', ') + ']';
    }

    setAttachments([]);

    const newUserMsg: ChatMsg = { 
      role: 'user', 
      content: finalContent, 
      timestamp: new Date() 
    };

    setMessages(prev => [...prev, newUserMsg]);

    // Create a placeholder bot message that will be streamed into
    const placeholderMsg: ChatMsg = {
      role: 'assistant',
      content: '',
      engine: 'ALICE-v10:deepseek-chat',
      iterations: 1,
      criticScore: 10,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, placeholderMsg]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, newUserMsg].slice(-10) 
        })
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }

      // ─── SSE STREAM READER ───────────────────────────────────────────
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let engineName = 'ALICE-v10:deepseek-chat';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process SSE lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          
          const data = trimmed.slice(6); // Remove "data: "
          
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            
            // Check if this is our engine info event
            if (parsed.engine && !parsed.choices) {
              engineName = parsed.engine;
              continue;
            }

            // Standard OpenAI-compatible SSE chunk
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              accumulated += delta;
              // Update the last message in state with accumulated text
              setMessages(prev => {
                const updated = [...prev];
                const lastMsg = updated[updated.length - 1];
                if (lastMsg && lastMsg.role === 'assistant') {
                  updated[updated.length - 1] = {
                    ...lastMsg,
                    content: accumulated,
                    engine: engineName,
                  };
                }
                return updated;
              });
            }
          } catch {
            // Skip malformed JSON chunks
          }
        }
      }

      // ─── POST-STREAM: Extract artifacts and speak ────────────────────
      const finalContent2 = accumulated;
      setCurrentEngine(engineName);

      // Save assistant message to memory
      fetch('/api/chat', { method: 'OPTIONS' }).catch(() => {}); // no-op, memory saved server-side

      // Neural Extraction Engine
      const extractArtifact = (content: string) => {
        const codeBlockRegex = /```(?:html|javascript|js|css)?\s*([\s\S]*?)```/gi;
        let match;
        let combined = "";
        let foundAnything = false;

        while ((match = codeBlockRegex.exec(content)) !== null) {
          const block = match[1].trim();
          const tag = (match[0].split('\n')[0] || '').toLowerCase();
          
          if (tag.includes("html")) combined += block + "\n";
          else if (tag.includes("javascript") || tag.includes("js")) combined += `<script>${block}</script>\n`;
          else if (tag.includes("css")) combined += `<style>${block}</style>\n`;
          else combined += block + "\n";
          foundAnything = true;
        }

        if (!foundAnything) {
          const htmlMatch = content.match(/<html[\s\S]*?<\/html>/i);
          if (htmlMatch) combined = htmlMatch[0];
          else if (content.includes('<div') && content.includes('</div>')) combined = content;
        }
        return combined;
      };

      const extracted = extractArtifact(finalContent2);
      if (extracted && extracted.length > 20) {
        setArtifactContent(extracted);
        setShowPreview(true);
        setIsSplitView(true);
      }

      if (autoSpeak) {
        const textToSpeak = finalContent2.replace(/```[\s\S]*?```/g, '').trim();
        speak(textToSpeak || "Proceso completado.");
      }

    } catch (err) {
      console.error("Kernel Error:", err);
      // Update placeholder with error
      setMessages(prev => {
        const updated = [...prev];
        const lastMsg = updated[updated.length - 1];
        if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.content) {
          updated[updated.length - 1] = { ...lastMsg, content: '❌ Error de conexión con el motor.' };
        }
        return updated;
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── UI COMPONENTS ──────────────────────────────────────────────────────────
  const NavButton = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => {
    const active = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`relative w-full flex items-center gap-4 px-6 py-4 rounded-3xl transition-all duration-500 overflow-hidden group ${active ? 'bg-gladiator-green text-black shadow-neon scale-105 z-10' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
      >
        <Icon size={22} className={active ? 'text-black' : 'group-hover:text-gladiator-green transition-colors'} />
        <span className="text-[11px] font-black uppercase tracking-[0.3em]">{label}</span>
        {active && <motion.div layoutId="nav-glow" className="absolute inset-0 bg-white/20 -z-10" />}
      </button>
    );
  };

  // User menu — muestra email + plan + logout
  const UserMenu = () => {
    const { data: session } = useSession();
    if (!session?.user) return null;
    const plan = (session as any)?.plan ?? 'free';
    const planColor = plan === 'free' ? 'text-gray-400' : plan === 'pro' ? 'text-emerald-400' : 'text-violet-400';
    return (
      <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-violet-500 flex items-center justify-center text-black text-xs font-bold">
          {(session.user.name || session.user.email || '?').charAt(0).toUpperCase()}
        </div>
        <div className="hidden md:flex flex-col">
          <span className="text-xs text-white truncate max-w-[120px]">{session.user.email}</span>
          <span className={`text-[9px] uppercase tracking-widest font-bold ${planColor}`}>{plan}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          aria-label="Cerrar sesión"
          className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
        >
          <LogOut size={14} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#050508] text-gray-200 overflow-hidden font-sans selection:bg-gladiator-green selection:text-black">
      <audio ref={audioRef} className="hidden" aria-hidden="true" />
      {/* Skip link para usuarios de teclado/lectores de pantalla */}
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      {/* 🔮 FX OVERLAYS */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-gladiator-purple/5 via-transparent to-gladiator-green/5 pointer-events-none"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-0 w-full h-[1px] bg-gladiator-green/30 animate-scanline"></div>
      </div>

      {/* 🧬 SIDEBAR */}
      <aside className={`fixed md:relative z-50 w-72 h-full bg-[#0a0a0f]/95 backdrop-blur-3xl border-r border-white/5 flex flex-col transition-transform duration-500 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8">
           <div className="p-4 bg-black/40 border border-white/10 rounded-[2rem] flex items-center gap-4">
              <div className="w-12 h-12 bg-gladiator-green rounded-xl flex items-center justify-center shadow-glow">
                 <Radio size={24} className="text-black" />
              </div>
              <div className="flex flex-col">
                 <span className="text-xs font-black text-white italic tracking-tighter">ALICE OS</span>
                 <span className="text-[9px] text-gladiator-green uppercase tracking-[0.2em] font-mono">v10.1_NEURAL_CORE</span>
              </div>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
           <NavButton id="nexus" label="CHAT" icon={Terminal} />
           <NavButton id="sniper" label="PROSPECTOS" icon={Target} />
           <NavButton id="nexus-engine" label="SKILLS" icon={Layers2} />
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
           <div className="p-5 glass-premium rounded-3xl border-gladiator-purple/20">
              <div className="flex items-center justify-between mb-3">
                 <span className="text-[10px] font-black uppercase text-gray-500">Kernel_Load</span>
                 <span className="text-[10px] font-mono text-gladiator-purple">{stats.cpuLoad}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-gladiator-purple transition-all" style={{ width: `${stats.cpuLoad}%` }}></div>
              </div>
           </div>
           
           <div className="flex gap-2">
              <button 
                onClick={() => {
                  const next = !autoSpeak;
                  setAutoSpeak(next);
                  if (next) speak("Voz de Alice activada.");
                }}
                aria-label={autoSpeak ? "Desactivar voz de Alice" : "Activar voz de Alice"}
                aria-pressed={autoSpeak}
                className={`flex-1 py-4 rounded-2xl border transition-all flex items-center justify-center gap-2 ${autoSpeak ? 'bg-gladiator-green text-black border-gladiator-green' : 'bg-white/5 border-white/10 text-gray-500'}`}
              >
                {autoSpeak ? <Activity size={16} className="animate-pulse" /> : <VolumeX size={16} />}
                <span className="text-[9px] font-black uppercase tracking-widest">{autoSpeak ? 'ALICE_VOICE_ON' : 'ALICE_VOICE_OFF'}</span>
              </button>
              <button 
                onClick={() => setMessages([])} 
                aria-label="Borrar conversación"
                className="p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500 transition-all hover:text-white"
              >
                 <Trash2 size={16} />
              </button>
           </div>
        </div>
      </aside>

      {/* 🚀 MAIN CONTENT */}
      <main className="flex-1 flex flex-col relative min-w-0">
        {/* TOP HUD */}
        <div className="h-10 bg-gladiator-green border-b border-black flex items-center overflow-hidden z-20">
          <div className="animate-marquee whitespace-nowrap flex gap-16 text-[11px] font-[900] uppercase tracking-[0.5em] text-black italic">
            <span>Alice_OS_v10.1_Active</span>
            <span>Uplink_Established:Secure</span>
            <span>Lead_Sniper:Tracking_{leadStatus.count}_Targets</span>
            <span>Neural_Graph_Nodes:_{stats.totalKnowledge}_Indexed</span>
            <span>System_Health:98.4%</span>
            <span>Neural_Voice:Alice_Neural_v2</span>
          </div>
        </div>

        <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 bg-[#0a0a0f]/80 backdrop-blur-xl z-20">
           <div className="flex items-center gap-6">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? "Cerrar menú lateral" : "Abrir menú lateral"} aria-expanded={sidebarOpen} className="md:hidden p-3 bg-white/5 rounded-xl"><Menu size={20}/></button>
              <div>
                <h2 className="text-3xl font-[950] text-white italic tracking-tighter uppercase">{activeTab}</h2>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 rounded-full bg-gladiator-green shadow-glow animate-pulse"></div>
                   <span className="text-[10px] font-mono text-gray-500">{currentEngine}</span>
                   {isSpeaking && <motion.div animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.3 }} className="w-4 h-2 bg-gladiator-green rounded-full ml-2" />}
                </div>
              </div>
           </div>

           <div className="flex items-center gap-4 md:gap-8">
              <div className="hidden lg:flex flex-col items-end">
                 <span className="text-[10px] font-black text-gladiator-purple tracking-widest uppercase mb-1">Total_Tokens</span>
                 <span className="text-sm font-mono text-white">{stats.tokenUsage.toLocaleString()} Units</span>
              </div>

              {/* Nav links principales */}
              <div className="hidden md:flex items-center gap-2">
                 <Link
                   href="/app/predict"
                   className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-wider"
                   aria-label="Lanzar simulación de viabilidad"
                 >
                   <TrendingUp size={14} className="text-emerald-400" />
                   Simular
                 </Link>
                 <Link
                   href="/app/billing"
                   className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-wider"
                   aria-label="Gestionar suscripción"
                 >
                   <CreditCard size={14} className="text-violet-400" />
                   Plan
                 </Link>
              </div>

              {/* User menu */}
              <UserMenu />

              <div className="h-10 w-px bg-white/10 hidden lg:block"></div>
              {artifactContent && (
                <div className="flex items-center gap-3 bg-white/5 p-2 rounded-full border border-white/10">
                   <button 
                     onClick={() => setIsSplitView(false)} 
                     className={`p-3 rounded-full transition-all ${!isSplitView ? 'bg-gladiator-green text-black' : 'text-gray-500'}`}
                   >
                      <Maximize2 size={16} />
                   </button>
                   <button 
                     onClick={() => { setIsSplitView(true); setShowPreview(true); }} 
                     className={`p-3 rounded-full transition-all ${isSplitView ? 'bg-gladiator-green text-black' : 'text-gray-500'}`}
                   >
                      <Layers size={16} />
                   </button>
                   <button onClick={() => setShowPreview(!showPreview)} className={`px-6 py-2 rounded-full text-[9px] font-black tracking-widest uppercase ${showPreview ? 'text-gladiator-green' : 'text-white'}`}>
                      {showPreview ? 'STUDIO_ACTIVE' : 'PREVIEW'}
                   </button>
                </div>
              )}
            </div>
        </header>

        <div className="flex-1 overflow-hidden relative flex" id="main-content">
           {/* TAB CONTENT (LEFT SIDE IN SPLIT VIEW) */}
           <div className={`flex flex-col transition-all duration-700 ${showPreview && isSplitView ? 'w-1/2 border-r border-white/10' : 'w-full'}`}>
              <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'nexus' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col gap-6 max-w-5xl mx-auto">
                        {/* CHAT MESSAGES */}
                        <div className="flex-1 glass-card rounded-[2.5rem] p-6 overflow-y-auto space-y-8 flex flex-col relative border-white/5 shadow-2xl custom-scrollbar">
                            <div className="sticky top-0 right-0 flex justify-end gap-4 opacity-50 z-10">
                              <Lock size={12} className="text-gladiator-green" />
                              <span className="text-[9px] font-mono bg-black/50 px-2 py-1 rounded">E2E_ENCRYPTED</span>
                            </div>

                            {messages.map((m, i) => (
                              <motion.div key={i} initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xl ${m.role === 'user' ? 'bg-gladiator-purple' : 'bg-gladiator-green/20 border border-gladiator-green'}`}>
                                    {m.role === 'user' ? <Terminal size={18} className="text-white" /> : <Sparkles size={18} className="text-gladiator-green" />}
                                  </div>
                                  <div className={`p-5 rounded-3xl max-w-[90%] relative ${m.role === 'user' ? 'bg-gladiator-purple/10 border border-gladiator-purple/30 text-white' : 'bg-white/5 border border-white/10 text-gray-200 shadow-xl'}`}>
                                    {m.role === 'assistant' && (
                                      <div className="flex gap-4 mb-3 border-b border-white/5 pb-2 text-[8px] font-black uppercase tracking-widest">
                                          <div className="flex items-center gap-2">
                                            <Clock size={10} className="text-gladiator-green" />
                                            <span className="text-gladiator-green">{m.timestamp.toLocaleTimeString()}</span>
                                          </div>
                                          {m.criticScore && (
                                            <div className="flex items-center gap-2">
                                              <Shield size={10} className={m.criticScore > 7 ? 'text-blue-500' : 'text-red-500'} />
                                              <span className={m.criticScore > 7 ? 'text-blue-500' : 'text-red-500'}>Kernel: {m.criticScore}/10</span>
                                            </div>
                                          )}
                                          <div className="flex-1 text-right text-gray-600 font-mono">{m.engine}</div>
                                      </div>
                                    )}
                                    <div className="prose prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                        {m.content}
                                    </div>
                                    {m.role === 'assistant' && m.content && /```(?:html|css|javascript|js)[\s\S]*?```/i.test(m.content) && (
                                        <button onClick={() => { 
                                          const codeBlockRegex = /```(?:html|javascript|js|css)?\s*([\s\S]*?)```/gi;
                                          let match2;
                                          let combined2 = "";
                                          while ((match2 = codeBlockRegex.exec(m.content)) !== null) {
                                            const block = match2[1].trim();
                                            const tag = (match2[0].split('\n')[0] || '').toLowerCase();
                                            if (tag.includes("html")) combined2 += block + "\n";
                                            else if (tag.includes("javascript") || tag.includes("js")) combined2 += `<script>${block}</script>\n`;
                                            else if (tag.includes("css")) combined2 += `<style>${block}</style>\n`;
                                            else combined2 += block + "\n";
                                          }
                                          if (!combined2) {
                                            const htmlMatch2 = m.content.match(/<html[\s\S]*?<\/html>/i);
                                            if (htmlMatch2) combined2 = htmlMatch2[0];
                                          }
                                          if (combined2) {
                                            setArtifactContent(combined2); 
                                            setShowPreview(true); 
                                            setIsSplitView(true); 
                                          }
                                        }} className="mt-4 flex items-center gap-3 bg-gladiator-green/20 border border-gladiator-green/50 text-gladiator-green px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gladiator-green hover:text-black transition-all">
                                          <Maximize2 size={14} /> Open_Playground
                                        </button>
                                    )}
                                  </div>
                              </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* INPUT BOX */}
                        <div className="relative">
                          {attachments.length > 0 && (
                            <div className="absolute -top-12 left-4 flex gap-2 overflow-x-auto pb-2 z-10 w-[calc(100%-80px)]">
                              {attachments.map((file, i) => (
                                <div key={i} className="relative group bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20 flex items-center gap-2 flex-shrink-0 animate-fade-in shadow-xl">
                                  {file.type.startsWith('image/') ? (
                                    <div className="w-6 h-6 rounded overflow-hidden">
                                      <img src={file.url} alt="attached" className="w-full h-full object-cover" />
                                    </div>
                                  ) : (
                                    <Paperclip size={14} className="text-[#c9a96e]" />
                                  )}
                                  <span className="text-[10px] text-white max-w-[80px] truncate font-medium">{file.name}</span>
                                  <button type="button" onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <X size={10} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="glass-card rounded-[2rem] p-4 border-white/5 shadow-2xl">
                              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-3">
                                <input 
                                  type="file" 
                                  multiple 
                                  className="hidden" 
                                  ref={fileInputRef} 
                                  onChange={(e) => {
                                    if (e.target.files) {
                                      const newFiles = Array.from(e.target.files).map(f => ({
                                        name: f.name,
                                        type: f.type,
                                        url: URL.createObjectURL(f)
                                      }));
                                      setAttachments(prev => [...prev, ...newFiles]);
                                    }
                                  }} 
                                />
                                <button type="button" onClick={() => fileInputRef.current?.click()} aria-label="Adjuntar archivos" className="p-4 bg-white/5 rounded-2xl text-gray-400 hover:text-gladiator-green hover:shadow-neon transition-all hover:bg-white/10" title="Adjuntar archivos">
                                    <Paperclip size={22} className="" />
                                </button>
                              <div className="flex-1 relative">
                                <input 
                                  value={inputValue}
                                  onChange={(e) => setInputValue(e.target.value)}
                                  onKeyDown={handleKeyDown}
                                  aria-label="Mensaje para Alice"
                                  placeholder={isListening ? "Escuchando a Alice..." : "Entrada de comando operacional..."}
                                  className={`w-full bg-black/60 border ${isListening ? 'border-gladiator-green shadow-neon' : 'border-white/10'} rounded-2xl py-4 px-6 outline-none focus:border-gladiator-green transition-all text-sm placeholder:text-gray-700 font-medium`}
                                />
                                {isProcessing && <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 h-1 bg-gladiator-green rounded-full" />
                                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1 h-1 bg-gladiator-green rounded-full" />
                                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1 h-1 bg-gladiator-green rounded-full" />
                                </div>}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button 
                                  type="button"
                                  onClick={toggleListening}
                                  aria-label={isListening ? "Detener escucha por voz" : "Iniciar escucha por voz"}
                                  aria-pressed={isListening}
                                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 text-white shadow-lg pulse-red' : 'bg-white/5 text-gray-400 hover:text-gladiator-green'}`}
                                >
                                   <Mic size={22} className={isListening ? 'animate-pulse' : ''} />
                                </button>
                                
                                <button 
                                  type="button"
                                  onClick={repeatLastMessage}
                                  aria-label="Repetir última respuesta en voz"
                                  className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 text-gray-400 hover:text-gladiator-green transition-all"
                                  title="Repetir última respuesta"
                                >
                                   <RefreshCw size={22} />
                                </button>

                                <button type="submit" disabled={isProcessing} aria-label={isProcessing ? "Procesando mensaje" : "Enviar mensaje"} className={`w-16 h-14 rounded-2xl flex items-center justify-center transition-all ${isProcessing ? 'bg-white/10' : 'bg-gladiator-green shadow-glow hover:scale-105 active:scale-95'}`}>
                                    {isProcessing ? <RefreshCw size={22} className="text-gray-500 animate-spin" /> : <Zap size={22} className="text-black" fill="black" />}
                                </button>
                              </div>
                            </form>
                          </div>
                      </div>
                      </motion.div>
                  )}

                  {activeTab === 'sniper' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto space-y-8">
                          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-1 p-8 glass-premium rounded-[2.5rem] border-gladiator-green/20 flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-gladiator-green rounded-2xl flex items-center justify-center shadow-neon mb-6">
                                  <Target size={40} className="text-black" />
                                </div>
                                <h3 className="text-2xl font-[950] text-white tracking-tighter uppercase mb-2">Lead_Sniper</h3>
                                <div className="mt-6 w-full space-y-3">
                                  <button className="w-full py-4 bg-gladiator-green text-black font-black uppercase tracking-widest rounded-xl text-[10px]">Start_Campaign</button>
                                  <button className="w-full py-4 bg-white/5 border border-white/10 font-black uppercase tracking-widest rounded-xl text-[10px]">Export_CSV</button>
                                </div>
                            </div>
                            <div className="lg:col-span-3 p-8 glass-premium rounded-[2.5rem] border-white/5">
                                <h4 className="text-2xl font-[950] italic text-white uppercase tracking-tighter mb-6">Live_Feed</h4>
                                <div className="space-y-3">
                                  {[1,2,3,4].map(i => (
                                    <div key={i} className="p-4 bg-white/5 rounded-2xl flex items-center justify-between border border-transparent hover:border-gladiator-green/20 transition-all group">
                                        <div className="flex items-center gap-4">
                                          <div className="w-2 h-2 rounded-full bg-gladiator-green group-hover:animate-ping"></div>
                                          <span className="font-black text-white uppercase tracking-wider text-[10px]">Target_Entity_{i}28B</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-gladiator-green">MATCH: 0.8{i}</span>
                                    </div>
                                  ))}
                                </div>
                            </div>
                          </div>
                      </motion.div>
                  )}

                 {activeTab === 'nexus-engine' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-40">
                        {MARKETPLACE_SKILLS.map((s, i) => (
                          <div key={i} className="p-12 glass-premium rounded-[3.5rem] flex flex-col justify-between border-white/5 hover:border-gladiator-green/30 transition-all shadow-3xl group">
                             <div>
                                <div className="w-20 h-20 rounded-3xl bg-black border border-white/10 flex items-center justify-center mb-8 group-hover:bg-gladiator-green transition-all shadow-xl">
                                   <s.icon size={32} className="text-gladiator-green group-hover:text-black"/>
                                </div>
                                <h5 className="text-3xl font-[950] text-white mb-6 leading-tight uppercase tracking-tight">{s.name}</h5>
                                <p className="text-gray-500 leading-relaxed font-medium mb-10 text-lg">{s.desc}</p>
                             </div>
                             <button className="w-full py-6 bg-gladiator-green text-black text-[11px] font-[950] uppercase tracking-[0.3em] rounded-3xl hover:shadow-neon transition-all">Enable_Channel</button>
                          </div>
                        ))}
                    </motion.div>
                 )}

                 {/* Tab vacío 'intelligence' eliminado — volver a habilitar cuando tenga contenido real */}
              </AnimatePresence>
              </div>
           </div>

           {/* 🎞️ PLAYGROUND / STUDIO (RIGHT SIDE IN SPLIT VIEW OR FULL OVERLAY) */}
           <AnimatePresence>
              {showPreview && (
                  <motion.div 
                    initial={{ x: '100%' }} 
                    animate={{ x: 0 }} 
                    exit={{ x: '100%' }} 
                    transition={{ type: 'spring', damping: 30 }} 
                    className={`${isSplitView ? 'relative w-1/2' : 'fixed inset-0 z-[100]'} bg-black flex flex-col border-l-2 border-gladiator-green shadow-[-20px_0_50px_rgba(0,0,0,0.8)]`}
                  >
                    <div className="h-20 bg-black border-b border-white/5 flex items-center justify-between px-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gladiator-green rounded-xl flex items-center justify-center shadow-glow">
                             <Layers size={20} className="text-black" />
                          </div>
                          <div>
                              <span className="text-lg font-black text-white italic uppercase tracking-tighter">Alice_Playground</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[8px] text-gladiator-green font-mono uppercase">V10_Rendering_Core</span>
                                <div className="w-1 h-1 bg-gladiator-green rounded-full animate-ping" />
                              </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <button onClick={() => setIsSplitView(!isSplitView)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-gray-400">
                              {isSplitView ? <Maximize2 size={18}/> : <ArrowRight size={18}/>}
                           </button>
                           <button onClick={() => setShowPreview(false)} className="p-3 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"><X size={18}/></button>
                        </div>
                    </div>
                    <div className="flex-1 bg-white relative">
                        <iframe 
                          title="Alice_Studio_Kernel"
                          className="w-full h-full border-0"
                          srcDoc={`
                            <!DOCTYPE html>
                            <html lang='es'>
                            <head>
                              <meta charset="UTF-8">
                              <script src='https://cdn.tailwindcss.com'></script>
                              <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                              <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
                              <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
                              <link href='https://fonts.googleapis.com/css2?family=Outfit:wght@400;900&display=swap' rel='stylesheet'/>
                              <style>
                                body { 
                                  margin: 0; 
                                  font-family: 'Outfit', sans-serif; 
                                  background: #050508; 
                                  color: #fff; 
                                  min-height: 100vh;
                                  overflow-x: hidden;
                                }
                                ::-webkit-scrollbar { width: 4px; }
                                ::-webkit-scrollbar-track { background: #050508; }
                                ::-webkit-scrollbar-thumb { background: #00ff88; border-radius: 10px; }
                                .gladiator-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 24px; backdrop-filter: blur(10px); }
                                .neon-text { color: #00ff88; text-shadow: 0 0 10px rgba(0,255,136,0.5); }
                              </style>
                            </head>
                            <body>
                              ${artifactContent}
                              <script>
                                // Auto-init for common patterns
                                document.querySelectorAll('canvas').forEach(canvas => {
                                  if (canvas.id && typeof Chart !== 'undefined' && !canvas.chart) {
                                    console.log('Detected canvas, ready for rendering.');
                                  }
                                });
                              </script>
                            </body>
                            </html>
                          `}
                        />

                        {/* Control temporal para refrescar */}
                        <div className="absolute bottom-4 right-4 flex gap-2">
                           <button onClick={() => { const c = artifactContent; setArtifactContent(''); setTimeout(() => setArtifactContent(c), 10); }} className="p-4 bg-gladiator-green text-black rounded-full shadow-neon hover:scale-110 transition-all">
                              <RefreshCw size={20} />
                           </button>
                        </div>
                    </div>
                  </motion.div>
              )}
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
