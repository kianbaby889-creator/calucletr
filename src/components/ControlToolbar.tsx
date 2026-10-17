import React from 'react';
import { Sliders, Crown, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { RRR_PRESETS, TAX_RATES } from '../data/constants';

interface ControlToolbarProps {
  useCustomRRR: boolean;
  customRRR: number;
  useFocus: boolean;
  taxRate: number;
  onToggleCustomRRR: (enabled: boolean) => void;
  onChangeCustomRRR: (val: number) => void;
  onToggleFocus: (useFocus: boolean) => void;
  onChangeTaxRate: (rate: number) => void;
}

export const ControlToolbar: React.FC<ControlToolbarProps> = ({
  useCustomRRR,
  customRRR,
  useFocus,
  taxRate,
  onToggleCustomRRR,
  onChangeCustomRRR,
  onToggleFocus,
  onChangeTaxRate
}) => {
  const isPremium = taxRate === TAX_RATES.PREMIUM;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* RRR Controls */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Resource Return Rate (RRR)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFocus(!useFocus)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                useFocus
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Toggle Albion Focus Point crafting bonus"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Use Focus {useFocus ? '(53.9%)' : '(Off)'}</span>
            </button>

            <button
              onClick={() => onToggleCustomRRR(!useCustomRRR)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                useCustomRRR
                  ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {useCustomRRR ? 'Custom Slider' : 'City Preset (Auto)'}
            </button>
          </div>
        </div>

        {useCustomRRR ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="text-slate-400 text-[11px]">Custom RRR Value:</span>
              <span className="font-bold text-amber-400">{(customRRR * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="0.5"
              value={customRRR * 100}
              onChange={(e) => onChangeCustomRRR(parseFloat(e.target.value) / 100)}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              aria-label="Custom Resource Return Rate percentage slider"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Island)</span>
              <span>15.2% (No Bonus)</span>
              <span>36.7% (City Bonus)</span>
              <span>53.9% (Focus + Bonus)</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              onClick={() => {
                onToggleCustomRRR(false);
                onToggleFocus(false);
              }}
              className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                !useCustomRRR && !useFocus
                  ? 'bg-amber-950/40 border-amber-600/70 text-amber-200 font-semibold'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] text-slate-400">Royal City Bonus</div>
              <div className="font-mono text-xs text-amber-300 font-bold">36.7%</div>
            </button>

            <button
              onClick={() => {
                onToggleCustomRRR(false);
                onToggleFocus(true);
              }}
              className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                !useCustomRRR && useFocus
                  ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold shadow-sm'
                  : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-[10px] text-slate-400">Focus + Bonus</div>
              <div className="font-mono text-xs text-amber-400 font-bold">53.9%</div>
            </button>

            <button
              onClick={() => {
                onToggleCustomRRR(true);
                onChangeCustomRRR(0.152);
              }}
              className="py-1.5 px-2 rounded-lg border bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200 text-center"
            >
              <div className="text-[10px] text-slate-400">No City Bonus</div>
              <div className="font-mono text-xs text-slate-300 font-bold">15.2%</div>
            </button>
          </div>
        )}
      </div>

      <div className="hidden md:block w-px h-12 bg-slate-800" />

      {/* Market Tax Toggle */}
      <div className="md:w-72 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            Albion Market Tax
            <span
              className="cursor-help text-slate-500 hover:text-slate-300"
              title="Premium: 4% sales tax + 2.5% order setup fee = 6.5% total. Non-Premium: 8% sales tax + 2.5% setup fee = 10.5% total."
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </span>
          <span className="text-xs font-mono font-bold text-amber-400">
            {(taxRate * 100).toFixed(1)}% Total Fee
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onChangeTaxRate(TAX_RATES.PREMIUM)}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
              isPremium
                ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-sm shadow-amber-950 ring-1 ring-amber-500/30'
                : 'bg-slate-800/80 border-slate-700/70 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Premium (6.5%)</span>
          </button>

          <button
            onClick={() => onChangeTaxRate(TAX_RATES.NON_PREMIUM)}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg border text-xs font-medium transition-all ${
              !isPremium
                ? 'bg-slate-800 border-slate-400 text-slate-100 font-semibold'
                : 'bg-slate-800/80 border-slate-700/70 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
            <span>Non-Prem (10.5%)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
