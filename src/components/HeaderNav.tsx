import React from 'react';
import { ResourceType } from '../types/albion';
import { RESOURCES, TAX_RATES } from '../data/constants';
import { Database, BookOpen, RotateCcw, Wifi, WifiOff } from 'lucide-react';

interface HeaderNavProps {
  selectedResource: ResourceType;
  onSelectResource: (res: ResourceType) => void;
  taxRate: number;
  onToggleTax: () => void;
  forceCityBonus: boolean;
  onToggleRRR: () => void;
  batchUnits: number;
  onChangeBatchUnits: (units: number) => void;
  connectionStatus: 'connecting' | 'connected' | 'offline';
  onlineCount: number;
  onOpenSupabase: () => void;
  onOpenGuide: () => void;
  onResetPrices: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  selectedResource,
  onSelectResource,
  taxRate,
  onToggleTax,
  forceCityBonus,
  onToggleRRR,
  batchUnits,
  onChangeBatchUnits,
  connectionStatus,
  onlineCount,
  onOpenSupabase,
  onOpenGuide,
  onResetPrices
}) => {
  const resourceKeys: ResourceType[] = ['leather', 'wood', 'cloth', 'metal', 'stone'];
  const isPremium = taxRate === TAX_RATES.PREMIUM;

  return (
    <header className="border-b border-slate-800/80 bg-[#090d14]/95 backdrop-blur-md sticky top-0 z-30 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Live Status */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 shadow-sm shadow-blue-500/50" />
            <h1 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
              Albion Refining <span className="text-blue-400 font-mono text-xs">T2 & T3</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono border ${
                connectionStatus === 'connected'
                  ? 'bg-blue-950/40 text-blue-400 border-blue-800/50'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {connectionStatus === 'connected' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  <span>Sync ({onlineCount})</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-slate-500" />
                  <span>Local</span>
                </>
              )}
            </div>

            <button
              onClick={onOpenSupabase}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-blue-300 border border-slate-800 transition-colors"
              title="Supabase Database Settings"
              aria-label="Supabase Settings"
            >
              <Database className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenGuide}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-blue-300 border border-slate-800 transition-colors"
              title="دليل المستخدم وطريقة النشر بالعربية"
              aria-label="دليل الاستخدام"
            >
              <BookOpen className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all prices to Albion Royal defaults?')) {
                  onResetPrices();
                }
              }}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
              title="Reset default prices"
              aria-label="Reset prices"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Resource Selection Tabs */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800/80 w-full md:w-auto overflow-x-auto">
          {resourceKeys.map((resKey) => {
            const isSelected = selectedResource === resKey;
            return (
              <button
                key={resKey}
                onClick={() => onSelectResource(resKey)}
                className={`flex-1 md:flex-initial px-3 py-1 rounded text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {RESOURCES[resKey].name}
              </button>
            );
          })}
        </div>

        {/* Quick Toggles: Tax & RRR & Batch */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end text-xs">
          {/* RRR Toggle */}
          <button
            onClick={onToggleRRR}
            className={`px-2.5 py-1 rounded border text-xs font-mono font-medium transition-colors ${
              forceCityBonus
                ? 'bg-blue-950/70 border-blue-500/70 text-blue-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
            title="Toggle between 40% City Bonus RRR and 15.2% Default RRR"
          >
            RRR: {forceCityBonus ? '40% Bonus' : 'Default'}
          </button>

          {/* Tax Toggle */}
          <button
            onClick={onToggleTax}
            className={`px-2.5 py-1 rounded border text-xs font-mono font-medium transition-colors ${
              isPremium
                ? 'bg-blue-950/70 border-blue-500/70 text-blue-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
            }`}
            title="Toggle between Premium 6.5% and Non-Premium 10.5%"
          >
            Tax: {isPremium ? 'Prem (6.5%)' : 'Non-Prem (10.5%)'}
          </button>

          {/* Batch Multiplier */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 font-mono text-[11px] text-slate-400">
            <span className="text-slate-500 mr-1">Qty:</span>
            {[1, 100, 1000].map((qty) => (
              <button
                key={qty}
                onClick={() => onChangeBatchUnits(qty)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  batchUnits === qty ? 'bg-blue-600 text-white font-bold' : 'hover:text-slate-200'
                }`}
              >
                {qty}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
