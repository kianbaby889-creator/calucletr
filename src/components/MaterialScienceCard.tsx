import React, { useState } from 'react';
import { ResourceType } from '../types/albion';
import { RESOURCES } from '../data/constants';
import { FlaskConical, ChevronDown, ChevronUp, Cpu, Binary, Scale } from 'lucide-react';

interface MaterialScienceCardProps {
  resource: ResourceType;
}

export const MaterialScienceCard: React.FC<MaterialScienceCardProps> = ({ resource }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const resourceInfo = RESOURCES[resource];
  const { materialScience } = resourceInfo;

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 transition-all">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-left group flex-1"
        >
          <div className="p-1.5 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/60">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                Material Science & Chemical Metallurgy Spec Sheet
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                {materialScience.formula}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Reaction stoichiometry, tensile kinetics, and thermodynamic yield properties of {resourceInfo.name}.
            </p>
          </div>
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-slate-400 hover:text-slate-200"
          aria-label={isExpanded ? "Collapse science spec sheet" : "Expand science spec sheet"}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-2.5 text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-cyan-400" /> Molecular Structure & Mechanism
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {materialScience.description}
              </p>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 flex items-center gap-1">
                <Scale className="w-3 h-3 text-cyan-400" /> Physical & Mechanical Properties
              </span>
              <p className="text-[11px] font-mono text-cyan-200/90 leading-relaxed">
                {materialScience.physicalProperties}
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80 flex items-start gap-2">
            <Binary className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-semibold text-slate-200">Kinetics & Stochastic RRR Principle: </span>
              <span className="text-slate-400">{materialScience.kineticsNote}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
