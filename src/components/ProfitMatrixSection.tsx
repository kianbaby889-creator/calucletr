import React from 'react';
import { CityId, ResourceType, AllMarketPrices } from '../types/albion';
import { CITIES, RESOURCES } from '../data/constants';
import {
  calculateCityRefiningMetrics,
  calculateCityMatrixSummary,
  calculateEffectiveRRR,
  formatSilver
} from '../utils/calculator';
import { TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

interface ProfitMatrixSectionProps {
  resource: ResourceType;
  prices: AllMarketPrices;
  taxRate: number;
  forceCityBonus: boolean;
  batchUnits: number;
}

export const ProfitMatrixSection: React.FC<ProfitMatrixSectionProps> = ({
  resource,
  prices,
  taxRate,
  forceCityBonus,
  batchUnits
}) => {
  const cityKeys = Object.keys(CITIES) as CityId[];
  const resourceInfo = RESOURCES[resource];
  const summary = calculateCityMatrixSummary(resource, prices, taxRate, forceCityBonus);

  // Compute metrics for each city
  const cityMetrics = cityKeys.map((cityId) => {
    const data = prices[resource][cityId] || { t2RawBuyOrder: 0, t3RawBuyOrder: 0, t2BuyOrder: 0, t3RefinedSellOrder: 0, stationFee: 0 };
    return calculateCityRefiningMetrics(resource, cityId, data, taxRate, forceCityBonus);
  });

  // Find best local profit city
  const bestLocalCity = [...cityMetrics].sort((a, b) => b.netProfitPerCraft - a.netProfitPerCraft)[0];

  // Inter-city arbitrage calculation:
  // Buy T3 Raw at summary.bestBuyCityT3Raw
  // Buy T2 Refined at summary.bestBuyCityT2Refined
  // Refine at summary.bestRefineCity (bonus city)
  // Sell at summary.bestSellCityT3Refined
  const arbRawPrice = summary.bestBuyCityT3Raw.price;
  const arbT2Price = summary.bestBuyCityT2Refined.price;
  const arbRefineRRR = calculateEffectiveRRR(summary.bestRefineCity.cityId, resource, forceCityBonus);
  const arbStationFee = prices[resource][summary.bestRefineCity.cityId]?.stationFee || 6;
  const arbSellPrice = summary.bestSellCityT3Refined.price;

  const arbCostPerUnit = (2 * arbRawPrice + 1 * arbT2Price) * (1 - arbRefineRRR) + arbStationFee;
  const arbNetRevenuePerUnit = arbSellPrice * (1 - taxRate);
  const arbProfitPerUnit = arbNetRevenuePerUnit - arbCostPerUnit;
  const arbRoi = arbCostPerUnit > 0 ? (arbProfitPerUnit / arbCostPerUnit) * 100 : 0;

  return (
    <section className="bg-[#0b0f17] border border-slate-800/80 rounded-xl overflow-hidden shadow-sm space-y-3">
      {/* Section Header */}
      <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Section 3: Simple Refining Profit Matrix
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            (Quantity: {batchUnits.toLocaleString()} units)
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Formula: (2x Raw T3 + 1x T2 Refined) × (1 - RRR) + Fee
        </div>
      </div>

      {/* Inter-City Arbitrage Banner (Quick Decision Maker) */}
      <div className="mx-4 p-3 rounded-lg bg-blue-950/20 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-slate-300">
            <span className="text-slate-400">Optimal Route:</span>
            <span>Buy Raw in <strong className="text-emerald-400">{CITIES[summary.bestBuyCityT3Raw.cityId].name}</strong> ({arbRawPrice}s)</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span>Refine in <strong className="text-blue-400">{CITIES[summary.bestRefineCity.cityId].name}</strong> ({(arbRefineRRR * 100).toFixed(0)}% RRR)</span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span>Sell in <strong className="text-emerald-400">{CITIES[summary.bestSellCityT3Refined.cityId].name}</strong> ({arbSellPrice}s)</span>
          </div>
        </div>

        <div className="text-right self-end sm:self-auto font-mono">
          <span className="text-slate-400 text-[11px] mr-1.5">Net Profit:</span>
          <span className="font-bold text-emerald-400 text-sm">
            +{formatSilver(arbProfitPerUnit * batchUnits)} Silver
          </span>
          <span className="ml-1.5 text-[11px] text-emerald-400/80">
            (+{arbRoi.toFixed(1)}% ROI)
          </span>
        </div>
      </div>

      {/* Profit Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800/60 text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-950/40">
              <th className="py-2.5 px-4 font-medium">Refining City</th>
              <th className="py-2.5 px-4 font-medium">RRR Applied</th>
              <th className="py-2.5 px-4 font-medium">Raw Input Cost</th>
              <th className="py-2.5 px-4 font-medium">Refined Value</th>
              <th className="py-2.5 px-4 font-medium">Net Revenue</th>
              <th className="py-2.5 px-4 font-medium text-right">Net Profit</th>
              <th className="py-2.5 px-4 font-medium text-right">ROI %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {cityMetrics.map((metrics) => {
              const isBest = bestLocalCity.cityId === metrics.cityId && metrics.netProfitPerCraft > 0;
              const isProfitable = metrics.netProfitPerCraft > 0;

              return (
                <tr
                  key={metrics.cityId}
                  className={`hover:bg-slate-900/30 transition-colors ${
                    isBest ? 'bg-emerald-950/20 font-medium' : ''
                  }`}
                >
                  {/* City */}
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isBest ? 'text-emerald-300' : 'text-slate-200'}`}>
                        {metrics.cityName}
                      </span>
                      {metrics.hasCityBonus && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 border border-blue-800/60">
                          Bonus
                        </span>
                      )}
                      {isBest && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-bold">
                          Best Local
                        </span>
                      )}
                    </div>
                  </td>

                  {/* RRR */}
                  <td className="py-2.5 px-4 font-mono text-slate-300">
                    {(metrics.effectiveRRR * 100).toFixed(1)}%
                  </td>

                  {/* Raw Input Cost */}
                  <td className="py-2.5 px-4 font-mono text-slate-300">
                    {formatSilver(metrics.costPerRefined * batchUnits)}s
                  </td>

                  {/* Refined Gross Value */}
                  <td className="py-2.5 px-4 font-mono text-slate-300">
                    {formatSilver(metrics.sellPrice * batchUnits)}s
                  </td>

                  {/* Net Revenue after Tax */}
                  <td className="py-2.5 px-4 font-mono text-slate-300">
                    {formatSilver(metrics.netRevenuePerRefined * batchUnits)}s
                  </td>

                  {/* Net Profit */}
                  <td className="py-2.5 px-4 font-mono text-right font-semibold">
                    <span className={isProfitable ? 'text-emerald-400' : 'text-rose-400'}>
                      {isProfitable ? '+' : ''}
                      {formatSilver(metrics.netProfitPerCraft * batchUnits)} Silver
                    </span>
                  </td>

                  {/* ROI % */}
                  <td className="py-2.5 px-4 font-mono text-right">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        isProfitable
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                          : 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                      }`}
                    >
                      {isProfitable ? '+' : ''}
                      {metrics.roiPercentage.toFixed(1)}%
                    </span>
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
