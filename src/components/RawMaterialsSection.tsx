import React from 'react';
import { CityId, ResourceType, AllMarketPrices, CityPriceData } from '../types/albion';
import { CITIES, RESOURCES } from '../data/constants';

interface RawMaterialsSectionProps {
  resource: ResourceType;
  prices: AllMarketPrices;
  taxRate: number;
  forceCityBonus: boolean;
  onPriceChange: (
    resource: ResourceType,
    city: CityId,
    field: keyof CityPriceData,
    value: number
  ) => void;
}

export const RawMaterialsSection: React.FC<RawMaterialsSectionProps> = ({
  resource,
  prices,
  taxRate,
  forceCityBonus,
  onPriceChange
}) => {
  const cityKeys = Object.keys(CITIES) as CityId[];
  const resourceInfo = RESOURCES[resource];

  // Determine best prices across cities
  let bestT2BuyCity: CityId = cityKeys[0];
  let lowestT2Buy = Infinity;
  let bestT2SellCity: CityId = cityKeys[0];
  let highestT2Sell = -Infinity;

  let bestT3BuyCity: CityId = cityKeys[0];
  let lowestT3Buy = Infinity;
  let bestT3SellCity: CityId = cityKeys[0];
  let highestT3Sell = -Infinity;

  for (const c of cityKeys) {
    const data = prices[resource][c] || {};
    if (data.t2RawBuyOrder > 0 && data.t2RawBuyOrder < lowestT2Buy) {
      lowestT2Buy = data.t2RawBuyOrder;
      bestT2BuyCity = c;
    }
    if (data.t2RawSellOrder > 0 && data.t2RawSellOrder > highestT2Sell) {
      highestT2Sell = data.t2RawSellOrder;
      bestT2SellCity = c;
    }
    if (data.t3RawBuyOrder > 0 && data.t3RawBuyOrder < lowestT3Buy) {
      lowestT3Buy = data.t3RawBuyOrder;
      bestT3BuyCity = c;
    }
    if (data.t3RawSellOrder > 0 && data.t3RawSellOrder > highestT3Sell) {
      highestT3Sell = data.t3RawSellOrder;
      bestT3SellCity = c;
    }
  }

  return (
    <section className="bg-[#0b0f17] border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
      {/* Section Header */}
      <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Section 1: Raw Material Prices (Buy & Sell Orders)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {resourceInfo.t2RawName} & {resourceInfo.t3RawName}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          6 Royal Cities
        </span>
      </div>

      {/* Responsive Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800/60 text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-950/40">
              <th className="py-2.5 px-4 font-medium">Royal City</th>
              <th className="py-2.5 px-3 font-medium">
                {resourceInfo.t2RawName} <span className="text-blue-400 font-semibold">(Buy Order)</span>
              </th>
              <th className="py-2.5 px-3 font-medium">
                {resourceInfo.t2RawName} <span className="text-emerald-400 font-semibold">(Sell Order)</span>
              </th>
              <th className="py-2.5 px-3 font-medium">
                {resourceInfo.t3RawName} <span className="text-blue-400 font-semibold">(Buy Order)</span>
              </th>
              <th className="py-2.5 px-3 font-medium">
                {resourceInfo.t3RawName} <span className="text-emerald-400 font-semibold">(Sell Order)</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {cityKeys.map((cityId) => {
              const city = CITIES[cityId];
              const cityPrice = prices[resource][cityId] || ({} as any);
              const hasBonus = city.bonusResource === resource;

              const isBestT2Buy = bestT2BuyCity === cityId;
              const isBestT2Sell = bestT2SellCity === cityId;
              const isBestT3Buy = bestT3BuyCity === cityId;
              const isBestT3Sell = bestT3SellCity === cityId;

              return (
                <tr
                  key={cityId}
                  className={`hover:bg-slate-900/30 transition-colors ${
                    hasBonus ? 'bg-blue-950/10' : ''
                  }`}
                >
                  {/* City Name */}
                  <td className="py-2 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-200">{city.name}</span>
                      {hasBonus && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 border border-blue-800/60">
                          +40% Bonus
                        </span>
                      )}
                    </div>
                  </td>

                  {/* T2 Raw Buy Order */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-24">
                        <input
                          type="number"
                          min="0"
                          value={cityPrice.t2RawBuyOrder ?? ''}
                          onChange={(e) =>
                            onPriceChange(resource, cityId, 't2RawBuyOrder', parseFloat(e.target.value) || 0)
                          }
                          className={`w-full bg-[#070a0f] text-right pr-5 pl-2 py-1 rounded border text-xs font-mono outline-none transition-colors ${
                            isBestT2Buy
                              ? 'border-emerald-500/70 text-emerald-300 font-bold bg-emerald-950/20'
                              : 'border-slate-800 text-slate-200 focus:border-blue-500/70'
                          }`}
                        />
                        <span className="absolute right-1.5 top-1 text-[10px] text-slate-500 font-mono">s</span>
                      </div>
                      {isBestT2Buy && (
                        <span className="text-[9px] font-mono text-emerald-400 px-1 rounded bg-emerald-950/60 border border-emerald-800/50">
                          Best
                        </span>
                      )}
                    </div>
                  </td>

                  {/* T2 Raw Sell Order */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-24">
                        <input
                          type="number"
                          min="0"
                          value={cityPrice.t2RawSellOrder ?? ''}
                          onChange={(e) =>
                            onPriceChange(resource, cityId, 't2RawSellOrder', parseFloat(e.target.value) || 0)
                          }
                          className={`w-full bg-[#070a0f] text-right pr-5 pl-2 py-1 rounded border text-xs font-mono outline-none transition-colors ${
                            isBestT2Sell
                              ? 'border-blue-500/70 text-blue-300 font-bold bg-blue-950/20'
                              : 'border-slate-800 text-slate-200 focus:border-blue-500/70'
                          }`}
                        />
                        <span className="absolute right-1.5 top-1 text-[10px] text-slate-500 font-mono">s</span>
                      </div>
                      {isBestT2Sell && (
                        <span className="text-[9px] font-mono text-blue-400 px-1 rounded bg-blue-950/60 border border-blue-800/50">
                          High
                        </span>
                      )}
                    </div>
                  </td>

                  {/* T3 Raw Buy Order */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-24">
                        <input
                          type="number"
                          min="0"
                          value={cityPrice.t3RawBuyOrder ?? ''}
                          onChange={(e) =>
                            onPriceChange(resource, cityId, 't3RawBuyOrder', parseFloat(e.target.value) || 0)
                          }
                          className={`w-full bg-[#070a0f] text-right pr-5 pl-2 py-1 rounded border text-xs font-mono outline-none transition-colors ${
                            isBestT3Buy
                              ? 'border-emerald-500/70 text-emerald-300 font-bold bg-emerald-950/20'
                              : 'border-slate-800 text-slate-200 focus:border-blue-500/70'
                          }`}
                        />
                        <span className="absolute right-1.5 top-1 text-[10px] text-slate-500 font-mono">s</span>
                      </div>
                      {isBestT3Buy && (
                        <span className="text-[9px] font-mono text-emerald-400 px-1 rounded bg-emerald-950/60 border border-emerald-800/50">
                          Best
                        </span>
                      )}
                    </div>
                  </td>

                  {/* T3 Raw Sell Order */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-24">
                        <input
                          type="number"
                          min="0"
                          value={cityPrice.t3RawSellOrder ?? ''}
                          onChange={(e) =>
                            onPriceChange(resource, cityId, 't3RawSellOrder', parseFloat(e.target.value) || 0)
                          }
                          className={`w-full bg-[#070a0f] text-right pr-5 pl-2 py-1 rounded border text-xs font-mono outline-none transition-colors ${
                            isBestT3Sell
                              ? 'border-blue-500/70 text-blue-300 font-bold bg-blue-950/20'
                              : 'border-slate-800 text-slate-200 focus:border-blue-500/70'
                          }`}
                        />
                        <span className="absolute right-1.5 top-1 text-[10px] text-slate-500 font-mono">s</span>
                      </div>
                      {isBestT3Sell && (
                        <span className="text-[9px] font-mono text-blue-400 px-1 rounded bg-blue-950/60 border border-blue-800/50">
                          High
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
