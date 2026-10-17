import React, { useState } from 'react';
import {
  Sparkles,
  Wifi,
  WifiOff,
  Users,
  Database,
  RotateCcw,
  Edit2,
  Check,
  BookOpen,
  FlaskConical
} from 'lucide-react';
import { getSavedSupabaseConfig } from '../services/supabaseClient';

interface NavbarProps {
  connectionStatus: 'connecting' | 'connected' | 'offline';
  onlineCount: number;
  crafterName: string;
  onUpdateCrafterName: (name: string) => void;
  onResetPrices: () => void;
  onOpenSupabaseModal: () => void;
  onOpenArabicModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  connectionStatus,
  onlineCount,
  crafterName,
  onUpdateCrafterName,
  onResetPrices,
  onOpenSupabaseModal,
  onOpenArabicModal
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(crafterName);
  const supabaseConfig = getSavedSupabaseConfig();
  const hasSupabase = Boolean(supabaseConfig.url && supabaseConfig.anonKey);

  const handleNameSave = () => {
    onUpdateCrafterName(nameInput);
    setIsEditingName(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-amber-900/30 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* App Title & Crest */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 via-amber-700 to-amber-950 border border-amber-500/50 flex items-center justify-center shadow-lg shadow-amber-950/50">
            <Sparkles className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold font-['Cinzel',serif] tracking-wider text-amber-100 flex items-center gap-1.5">
                ALBION ONLINE
                <span className="text-xs px-1.5 py-0.5 rounded font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  T2 & T3
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Real-Time Royal City Refining & Multi-User Arbitrage Calculator
            </p>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 text-xs">
          {/* Live Sync Status */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium transition-colors ${
              connectionStatus === 'connected'
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60 shadow-sm shadow-emerald-950'
                : connectionStatus === 'connecting'
                ? 'bg-amber-950/60 text-amber-400 border-amber-800/60'
                : 'bg-rose-950/60 text-rose-400 border-rose-800/60'
            }`}
            title="Real-time multi-user synchronization status"
          >
            {connectionStatus === 'connected' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Wifi className="w-3.5 h-3.5" />
                <span>Live Sync</span>
                <span className="opacity-40">•</span>
                <Users className="w-3 h-3 ml-0.5" />
                <span>{onlineCount} Online</span>
              </>
            ) : connectionStatus === 'connecting' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>Offline (Local)</span>
              </>
            )}
          </div>

          {/* Crafter Tag */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-slate-300">
            {isEditingName ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-24 bg-slate-950 text-slate-100 text-xs px-1.5 py-0.5 rounded border border-amber-500/50 outline-none"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                />
                <button
                  onClick={handleNameSave}
                  className="p-0.5 hover:text-emerald-400 text-slate-400"
                  aria-label="Save crafter name"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setNameInput(crafterName);
                  setIsEditingName(true);
                }}
                className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
                title="Click to change your crafter name"
              >
                <span className="text-[11px] text-slate-400">Tag:</span>
                <span className="font-semibold text-amber-200 truncate max-w-[90px]">{crafterName}</span>
                <Edit2 className="w-3 h-3 text-slate-500" />
              </button>
            )}
          </div>

          {/* Supabase Button */}
          <button
            onClick={onOpenSupabaseModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
              hasSupabase
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900/40'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-500/50 hover:text-amber-300'
            }`}
            title="Configure Supabase Database"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase</span>
            {hasSupabase && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          {/* Arabic Guide Button */}
          <button
            onClick={onOpenArabicModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:border-amber-500/50 hover:text-amber-300 text-[11px] font-medium transition-all"
            title="دليل الحساب والربط بالعربية"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>عربي (Guide)</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all market prices back to Albion Royal city defaults?')) {
                onResetPrices();
              }
            }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-800/60 transition-colors"
            title="Reset prices to Albion default benchmarks"
            aria-label="Reset prices to default"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
