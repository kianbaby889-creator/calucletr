import React from 'react';
import { CityId, ResourceType, AllMarketPrices } from '../types/albion';
import { CITIES, RESOURCES } from '../data/constants';
import {
  calculateCityRefiningMetrics,
  calculateCityMatrixSummary,
  calculateEffectiveRRR,
  formatSilver
} from '../utils/calculator';
import {
  TrendingUp,
  Award,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Factory,
  Coins,
  ArrowUpRight
} from 'lucide-react';

interface CityMatrixTableProps {
  resource: ResourceType;
  prices: AllMarketPrices;
  taxRate: number;
  useCustomRRR: boolean;
  customRRR: number;
  useFocus: boolean;
  onPriceChange: (
    resource: ResourceType,
    city: CityId,
    field: 't2BuyOrder' | 't3RawBuyOrder' | 't3RefinedSellOrder' | 'stationFee',
    value: number
  ) => void;
  onSelectArbitrageRoute: (arbitrage: any) => void;
}

export const CityMatrixTable: React.FC<CityMatrixTableProps> = ({
  resource,
  prices,
  taxRate,
  useCustomRRR,
  customRRR,
  useFocus,
  onPriceChange,
  onSelectArbitrageRoute
}) => {
  const cityKeys = Object.keys(CITIES) as CityId[];
  const resourceInfo = RESOURCES[resource];
  const summary = calculateCityMatrixSummary(
    resource,
    prices,
    taxRate,
    useCustomRRR,
    customRRR,
    useFocus
  );

  return (
    <div className="space-y-4">
      {/* Inter-City Transport Arbitrage Route Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border border-amber-600/50 rounded-xl p-3.5 sm:p-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Optimal Inter-City Arbitrage Route
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Cross-Royal City Hauling Strategy
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200">
              <span className="text-slate-400">Buy Raw at</span>
              <span className="text-emerald-400 font-bold underline decoration-emerald-500/50">
                {CITIES[summary.bestArbitrageRoute.buyCityRaw].name}
              </span>
              <span className="text-slate-400">({summary.bestBuyCityRaw.price}s)</span>

              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />

              <span className="text-slate-400">Refine at</span>
              <span className="text-cyan-400 font-bold underline decoration-cyan-500/50">
                {CITIES[summary.bestArbitrageRoute.refineCity].name}
              </span>
              <span className="text-slate-400">
                ({(summary.bestRefineCity.rrr * 100).toFixed(1)}% RRR)
              </span>

              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />

              <span className="text-slate-400">Sell at</span>
              <span className="text-amber-400 font-bold underline decoration-amber-500/50">
                {CITIES[summary.bestArbitrageRoute.sellCity].name}
              </span>
              <span className="text-slate-400">({summary.bestSellCity.price}s)</span>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Estimated Net Profit</div>
              <div className="text-base sm:text-lg font-mono font-black text-emerald-400 flex items-center justify-end gap-1">
                +{formatSilver(summary.bestArbitrageRoute.profitPerUnit)} Silver
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  +{summary.bestArbitrageRoute.roi.toFixed(1)}% ROI
                </span>
              </div>
            </div>

            <button
              onClick={() => onSelectArbitrageRoute(summary.bestArbitrageRoute)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-amber-950 transition-colors"
              title="Load this route into the Batch Calculator"
            >
              <span>Batch Trade</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Cities (Responsive for desktop & mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {cityKeys.map((cityId) => {
          const cityConfig = CITIES[cityId];
          const cityPrice = prices[resource][cityId];
          const metrics = calculateCityRefiningMetrics(
            resource,
            cityId,
            cityPrice,
            taxRate,
            useCustomRRR,
            customRRR,
            useFocus
          );

          const isBestBuyRaw = summary.bestBuyCityRaw.cityId === cityId;
          const isBestBuyT2 = summary.bestBuyCityT2.cityId === cityId;
          const isBestRefine = summary.bestRefineCity.cityId === cityId;
          const isBestSell = summary.bestSellCity.cityId === cityId;

          const isProfitable = metrics.netProfitPerCraft > 0;

          return (
            <div
              key={cityId}
              className={`rounded-xl border transition-all duration-150 flex flex-col justify-between overflow-hidden shadow-lg ${
                metrics.hasCityBonus
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-amber-500/60 ring-1 ring-amber-500/20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* City Card Header */}
              <div className="p-3.5 border-b border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cityConfig.borderHex }}
                  />
                  <div>
                    <h3 className="font-bold text-slate-100 flex items-center gap-1.5 text-sm">
                      {cityConfig.name}
                      <span className="text-[10px] text-slate-400 font-medium font-['Cairo',sans-serif] px-1.5 py-0.2 rounded bg-slate-900/90 border border-slate-800">
                        {cityConfig.nameArabic}
                      </span>
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      {metrics.hasCityBonus ? (
                        <span className="text-amber-400 font-semibold flex items-center gap-0.5">
                          ⭐ Refining Bonus (+40%)
                        </span>
                      ) : cityId === 'caerleon' ? (
                        <span className="text-rose-400 font-semibold">Red Zone / Black Market Hub</span>
                      ) : (
                        <span>Standard Royal Station</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-mono">Effective RRR</span>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    {(metrics.effectiveRRR * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Best In Category Badges */}
              <div className="px-3.5 pt-2 flex flex-wrap gap-1">
                {isBestBuyRaw && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-600/60 flex items-center gap-1">
                    <ShoppingBag className="w-2.5 h-2.5" /> Best Buy Raw
                  </span>
                )}
                {isBestRefine && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-600/60 flex items-center gap-1">
                    <Factory className="w-2.5 h-2.5" /> Best Refine
                  </span>
                )}
                {isBestSell && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/90 text-amber-300 border border-amber-600/60 flex items-center gap-1">
                    <Coins className="w-2.5 h-2.5" /> Best Sell
                  </span>
                )}
              </div>

              {/* City Input Fields */}
              <div className="p-3.5 space-y-2.5 text-xs">
                {/* T2 Buy Order Input */}
                <div className="flex items-center justify-between gap-2">
                  <label className="text-slate-400 text-[11px] flex-1">
                    T2 Buy: <span className="text-slate-300 font-medium">{resourceInfo.t2RefinedName}</span>
                  </label>
                  <div className="relative w-28">
                    <input
                      type="number"
                      min="0"
                      value={cityPrice.t2BuyOrder}
                      onChange={(e) =>
                        onPriceChange(resource, cityId, 't2BuyOrder', parseFloat(e.target.value) || 0)
                      }
                      className={`w-full bg-slate-950 text-right pr-6 pl-2 py-1 rounded border text-xs font-mono font-medium outline-none transition-colors ${
                        isBestBuyT2
                          ? 'border-emerald-500/70 text-emerald-300 bg-emerald-950/20'
                          : 'border-slate-800 text-slate-200 focus:border-amber-500/60'
                      }`}
                    />
                    <span className="absolute right-2 top-1 text-[10px] text-slate-500 font-mono">s</span>
                  </div>
                </div>

                {/* T3 Raw Buy Order Input */}
                <div className="flex items-center justify-between gap-2">
                  <label className="text-slate-400 text-[11px] flex-1">
                    T3 Raw Buy: <span className="text-slate-300 font-medium">{resourceInfo.t3RawName}</span>
                  </label>
                  <div className="relative w-28">
                    <input
                      type="number"
                      min="0"
                      value={cityPrice.t3RawBuyOrder}
                      onChange={(e) =>
                        onPriceChange(resource, cityId, 't3RawBuyOrder', parseFloat(e.target.value) || 0)
                      }
                      className={`w-full bg-slate-950 text-right pr-6 pl-2 py-1 rounded border text-xs font-mono font-medium outline-none transition-colors ${
                        isBestBuyRaw
                          ? 'border-emerald-500/70 text-emerald-300 bg-emerald-950/20 font-bold'
                          : 'border-slate-800 text-slate-200 focus:border-amber-500/60'
                      }`}
                    />
                    <span className="absolute right-2 top-1 text-[10px] text-slate-500 font-mono">s</span>
                  </div>
                </div>

                {/* T3 Refined Sell Order Input */}
                <div className="flex items-center justify-between gap-2">
                  <label className="text-slate-400 text-[11px] flex-1">
                    T3 Sell: <span className="text-slate-300 font-medium">{resourceInfo.t3RefinedName}</span>
                  </label>
                  <div className="relative w-28">
                    <input
                      type="number"
                      min="0"
                      value={cityPrice.t3RefinedSellOrder}
                      onChange={(e) =>
                        onPriceChange(resource, cityId, 't3RefinedSellOrder', parseFloat(e.target.value) || 0)
                      }
                      className={`w-full bg-slate-950 text-right pr-6 pl-2 py-1 rounded border text-xs font-mono font-medium outline-none transition-colors ${
                        isBestSell
                          ? 'border-amber-500/70 text-amber-300 bg-amber-950/20 font-bold'
                          : 'border-slate-800 text-slate-200 focus:border-amber-500/60'
                      }`}
                    />
                    <span className="absolute right-2 top-1 text-[10px] text-slate-500 font-mono">s</span>
                  </div>
                </div>

                {/* Crafting Station Fee Input */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                  <label className="text-slate-500 text-[10px] flex-1">Station Fee / Craft:</label>
                  <div className="relative w-20">
                    <input
                      type="number"
                      min="0"
                      value={cityPrice.stationFee}
                      onChange={(e) =>
                        onPriceChange(resource, cityId, 'stationFee', parseFloat(e.target.value) || 0)
                      }
                      className="w-full bg-slate-950/80 text-right pr-5 pl-1.5 py-0.5 rounded border border-slate-800 text-[11px] font-mono text-slate-400 focus:border-slate-600 outline-none"
                    />
                    <span className="absolute right-1.5 top-0.5 text-[9px] text-slate-600 font-mono">s</span>
                  </div>
                </div>
              </div>

              {/* Local City Profitability Footer */}
              <div className="p-3 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Local Craft Cost</div>
                  <div className="font-mono text-xs font-semibold text-slate-300">
                    {metrics.costPerRefined.toFixed(1)} Silver
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Net Local Margin</div>
                  <div
                    className={`font-mono text-xs font-bold flex items-center justify-end gap-1 ${
                      isProfitable ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isProfitable ? '+' : ''}
                    {metrics.netProfitPerCraft.toFixed(1)}s
                    <span className="text-[10px] opacity-80">
                      ({metrics.roiPercentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
