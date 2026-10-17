import React from 'react';
import { ResourceType } from '../types/albion';
import { RESOURCES, CITIES } from '../data/constants';
import { Shield, Trees, Shirt, Hammer, Mountain } from 'lucide-react';

interface ResourceSelectorProps {
  selectedResource: ResourceType;
  onSelectResource: (resource: ResourceType) => void;
}

const RESOURCE_ICONS: Record<ResourceType, React.ReactNode> = {
  leather: <Shield className="w-5 h-5" />,
  wood: <Trees className="w-5 h-5" />,
  cloth: <Shirt className="w-5 h-5" />,
  metal: <Hammer className="w-5 h-5" />,
  stone: <Mountain className="w-5 h-5" />
};

export const ResourceSelector: React.FC<ResourceSelectorProps> = ({
  selectedResource,
  onSelectResource
}) => {
  const resourceKeys = Object.keys(RESOURCES) as ResourceType[];

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
          Refineable Resource Tier 2 & 3
        </h2>
        <span className="text-[11px] text-amber-400/90 font-mono">
          Strictly T2 (Raw→Refined) & T3 (2xRaw + 1xT2)
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
        {resourceKeys.map((resKey) => {
          const res = RESOURCES[resKey];
          const isSelected = selectedResource === resKey;
          const bonusCity = CITIES[res.bonusCity];

          return (
            <button
              key={resKey}
              onClick={() => onSelectResource(resKey)}
              className={`relative text-left p-3 rounded-xl border transition-all duration-150 flex flex-col justify-between overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-b from-slate-900 via-amber-950/20 to-slate-900 border-amber-500 shadow-md shadow-amber-950/40 ring-1 ring-amber-500/40'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
              }`}
            >
              {/* Highlight strip if selected */}
              {isSelected && (
                <div
                  className="absolute top-0 left-0 right-0 h-1 bg-amber-500 shadow-sm"
                  style={{ backgroundColor: res.accentHex }}
                />
              )}

              {/* Resource Header */}
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                  }`}
                  style={{ color: isSelected ? res.accentHex : undefined }}
                >
                  {RESOURCE_ICONS[resKey]}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                  T2 & T3
                </span>
              </div>

              {/* Titles */}
              <div>
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                  {res.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  {res.t3RawName} → {res.t3RefinedName}
                </p>
              </div>

              {/* Bonus City Tag */}
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">City Bonus:</span>
                <span
                  className="font-semibold px-1.5 py-0.5 rounded text-[10px] bg-slate-800"
                  style={{ color: bonusCity.borderHex }}
                >
                  {bonusCity.name} (+40%)
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
