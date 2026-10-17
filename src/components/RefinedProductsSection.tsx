import React from 'react';
import { CityId, ResourceType, AllMarketPrices, CityPriceData } from '../types/albion';
import { CITIES, RESOURCES } from '../data/constants';

interface RefinedProductsSectionProps {
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

export const RefinedProductsSection: React.FC<RefinedProductsSectionProps> = ({
  resource,
  prices,
  taxRate,
  forceCityBonus,
  onPriceChange
}) => {
  const cityKeys = Object.keys(CITIES) as CityId[];
  const resourceInfo = RESOURCES[resource];

  // Calculate best prices across cities
  let bestT2RefinedBuyCity: CityId = cityKeys[0];
  let lowestT2RefinedBuy = Infinity;
  let bestT2RefinedSellCity: CityId = cityKeys[0];
  let highestT2RefinedSell = -Infinity;

  let bestT3RefinedBuyCity: CityId = cityKeys[0];
  let lowestT3RefinedBuy = Infinity;
  let bestT3RefinedSellCity: CityId = cityKeys[0];
  let highestT3RefinedSell = -Infinity;

  for (const c of cityKeys) {
    const data = prices[resource][c] || {};
    const t2Buy = data.t2RefinedBuyOrder || data.t2BuyOrder || 0;
    const t2Sell = data.t2RefinedSellOrder || 0;
    const t3Buy = data.t3RefinedBuyOrder || 0;
    const t3Sell = data.t3RefinedSellOrder || 0;

    if (t2Buy > 0 && t2Buy < lowestT2RefinedBuy) {
      lowestT2RefinedBuy = t2Buy;
      bestT2RefinedBuyCity = c;
    }
    if (t2Sell > 0 && t2Sell > highestT2RefinedSell) {
      highestT2RefinedSell = t2Sell;
      bestT2RefinedSellCity = c;
    }
    if (t3Buy > 0 && t3Buy < lowestT3RefinedBuy) {
      lowestT3RefinedBuy = t3Buy;
      bestT3RefinedBuyCity = c;
    }
    if (t3Sell > 0 && t3Sell > highestT3RefinedSell) {
      highestT3RefinedSell = t3Sell;
      bestT3RefinedSellCity = c;
    }
  }

  return (
    <section className="bg-[#0b0f17] border border-slate-800/80 rounded-xl overflow-hidden shadow-sm">
      {/* Section Header */}
      <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Section 2: Refined Product Prices (Buy & Sell Orders)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {resourceInfo.t2RefinedName} & {resourceInfo.t3RefinedName}
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          Station Fee & Market Orders
        </span>
      </div>

      {/* Responsive Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800/60 text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-950/40">
              <th className="py-2.5 px-4 font-medium">Royal City</th>
              <th className="py-2.5 px-3 font-medium">
                {resourceInfo.t2RefinedName} <span className="text-blue-400 font-semibold">(Buy Order)</span>
              </th>
              <th className="py-2.5 px-3 font-medium">
                {resourceInfo.t2RefinedName} <span className="text-emerald-400 font-semibold">(Sell Order)</span>
              </th>
              <th className="py-2.5 px-3 font-medium">
                {resourceInfo.t3RefinedName} <span className="text-blue-400 font-semibold">(Buy Order)</span>
              </th>
              <th className="py-2.5 px-3 font-medium">
                {resourceInfo.t3RefinedName} <span className="text-emerald-400 font-semibold">(Sell Order)</span>
              </th>
              <th className="py-2.5 px-3 font-medium">Station Fee</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {cityKeys.map((cityId) => {
              const city = CITIES[cityId];
              const cityPrice = prices[resource][cityId] || ({} as any);
              const hasBonus = city.bonusResource === resource;

              const isBestT2Buy = bestT2RefinedBuyCity === cityId;
              const isBestT2Sell = bestT2RefinedSellCity === cityId;
              const isBestT3Buy = bestT3RefinedBuyCity === cityId;
              const isBestT3Sell = bestT3RefinedSellCity === cityId;

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

                  {/* T2 Refined Buy Order */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-22">
                        <input
                          type="number"
                          min="0"
                          value={cityPrice.t2RefinedBuyOrder ?? cityPrice.t2BuyOrder ?? ''}
                          onChange={(e) =>
                            onPriceChange(resource, cityId, 't2RefinedBuyOrder', parseFloat(e.target.value) || 0)
                          }
                          className={`w-full bg-[#070a0f] text-right pr-5 pl-1.5 py-1 rounded border text-xs font-mono outline-none transition-colors ${
                            isBestT2Buy
                              ? 'border-blue-500/70 text-blue-300 font-bold bg-blue-950/20'
                              : 'border-slate-800 text-slate-200 focus:border-blue-500/70'
                          }`}
                        />
                        <span className="absolute right-1.5 top-1 text-[10px] text-slate-500 font-mono">s</span>
                      </div>
                      {isBestT2Buy && (
                        <span className="text-[9px] font-mono text-blue-400 px-1 rounded bg-blue-950/60 border border-blue-800/50">
                          Best
                        </span>
                      )}
                    </div>
                  </td>

                  {/* T2 Refined Sell Order */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-22">
                        <input
                          type="number"
                          min="0"
                          value={cityPrice.t2RefinedSellOrder ?? ''}
                          onChange={(e) =>
                            onPriceChange(resource, cityId, 't2RefinedSellOrder', parseFloat(e.target.value) || 0)
                          }
                          className={`w-full bg-[#070a0f] text-right pr-5 pl-1.5 py-1 rounded border text-xs font-mono outline-none transition-colors ${
                            isBestT2Sell
                              ? 'border-emerald-500/70 text-emerald-300 font-bold bg-emerald-950/20'
                              : 'border-slate-800 text-slate-200 focus:border-blue-500/70'
                          }`}
                        />
                        <span className="absolute right-1.5 top-1 text-[10px] text-slate-500 font-mono">s</span>
                      </div>
                      {isBestT2Sell && (
                        <span className="text-[9px] font-mono text-emerald-400 px-1 rounded bg-emerald-950/60 border border-emerald-800/50">
                          High
                        </span>
                      )}
                    </div>
                  </td>

                  {/* T3 Refined Buy Order */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-22">
                        <input
                          type="number"
                          min="0"
                          value={cityPrice.t3RefinedBuyOrder ?? ''}
                          onChange={(e) =>
                            onPriceChange(resource, cityId, 't3RefinedBuyOrder', parseFloat(e.target.value) || 0)
                          }
                          className={`w-full bg-[#070a0f] text-right pr-5 pl-1.5 py-1 rounded border text-xs font-mono outline-none transition-colors ${
                            isBestT3Buy
                              ? 'border-blue-500/70 text-blue-300 font-bold bg-blue-950/20'
                              : 'border-slate-800 text-slate-200 focus:border-blue-500/70'
                          }`}
                        />
                        <span className="absolute right-1.5 top-1 text-[10px] text-slate-500 font-mono">s</span>
                      </div>
                      {isBestT3Buy && (
                        <span className="text-[9px] font-mono text-blue-400 px-1 rounded bg-blue-950/60 border border-blue-800/50">
                          Best
                        </span>
                      )}
                    </div>
                  </td>

                  {/* T3 Refined Sell Order */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-22">
                        <input
                          type="number"
                          min="0"
                          value={cityPrice.t3RefinedSellOrder ?? ''}
                          onChange={(e) =>
                            onPriceChange(resource, cityId, 't3RefinedSellOrder', parseFloat(e.target.value) || 0)
                          }
                          className={`w-full bg-[#070a0f] text-right pr-5 pl-1.5 py-1 rounded border text-xs font-mono outline-none transition-colors ${
                            isBestT3Sell
                              ? 'border-emerald-500/70 text-emerald-300 font-bold bg-emerald-950/20'
                              : 'border-slate-800 text-slate-200 focus:border-blue-500/70'
                          }`}
                        />
                        <span className="absolute right-1.5 top-1 text-[10px] text-slate-500 font-mono">s</span>
                      </div>
                      {isBestT3Sell && (
                        <span className="text-[9px] font-mono text-emerald-400 px-1 rounded bg-emerald-950/60 border border-emerald-800/50">
                          Best
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Crafting Station Fee */}
                  <td className="py-2 px-3">
                    <div className="relative w-20">
                      <input
                        type="number"
                        min="0"
                        value={cityPrice.stationFee ?? ''}
                        onChange={(e) =>
                          onPriceChange(resource, cityId, 'stationFee', parseFloat(e.target.value) || 0)
                        }
                        className="w-full bg-[#070a0f] text-right pr-5 pl-1.5 py-1 rounded border border-slate-800 text-slate-300 text-xs font-mono outline-none focus:border-blue-500/70"
                      />
                      <span className="absolute right-1.5 top-1 text-[10px] text-slate-500 font-mono">s</span>
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
