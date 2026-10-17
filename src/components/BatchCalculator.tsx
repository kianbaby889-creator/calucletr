import React, { useState } from 'react';
import { CityId, ResourceType, AllMarketPrices } from '../types/albion';
import { CITIES, RESOURCES } from '../data/constants';
import {
  calculateBatchProfit,
  calculateEffectiveRRR,
  calculateCityMatrixSummary,
  parseSilverInput,
  formatSilver,
  formatCompactSilver
} from '../utils/calculator';
import {
  Calculator,
  Coins,
  Package,
  Percent,
  TrendingUp,
  Truck,
  ArrowRight,
  ShieldCheck,
  Atom,
  HelpCircle
} from 'lucide-react';

interface BatchCalculatorProps {
  resource: ResourceType;
  prices: AllMarketPrices;
  taxRate: number;
  useCustomRRR: boolean;
  customRRR: number;
  useFocus: boolean;
  activeArbitrage: any;
}

export const BatchCalculator: React.FC<BatchCalculatorProps> = ({
  resource,
  prices,
  taxRate,
  useCustomRRR,
  customRRR,
  useFocus,
  activeArbitrage
}) => {
  const resourceInfo = RESOURCES[resource];
  const summary = calculateCityMatrixSummary(
    resource,
    prices,
    taxRate,
    useCustomRRR,
    customRRR,
    useFocus
  );

  const [inputMode, setInputMode] = useState<'silver' | 'quantity'>('silver');
  const [silverString, setSilverString] = useState('23M');
  const [rawQuantity, setRawQuantity] = useState(5000);

  // Selected route cities
  const [buyCityRaw, setBuyCityRaw] = useState<CityId>(summary.bestArbitrageRoute.buyCityRaw);
  const [buyCityT2, setBuyCityT2] = useState<CityId>(summary.bestArbitrageRoute.buyCityT2);
  const [refineCity, setRefineCity] = useState<CityId>(summary.bestArbitrageRoute.refineCity);
  const [sellCity, setSellCity] = useState<CityId>(summary.bestArbitrageRoute.sellCity);

  const cityList = Object.keys(CITIES) as CityId[];

  const startingSilver = parseSilverInput(silverString);
  const rawBuyPrice = prices[resource][buyCityRaw].t3RawBuyOrder;
  const t2BuyPrice = prices[resource][buyCityT2].t2BuyOrder;
  const stationFee = prices[resource][refineCity].stationFee;
  const refineRRR = calculateEffectiveRRR(refineCity, resource, useCustomRRR, customRRR, useFocus);
  const sellPrice = prices[resource][sellCity].t3RefinedSellOrder;

  const result = calculateBatchProfit({
    inputMode,
    startingSilver,
    rawQuantityInput: rawQuantity,
    buyCityRawPrice: rawBuyPrice,
    buyCityT2Price: t2BuyPrice,
    stationFee,
    refineRRR,
    sellPrice,
    taxRate
  });

  const isProfitable = result.netProfit > 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-xl space-y-5">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Batch Profit & Investment Calculator
              <span className="text-[11px] px-2 py-0.5 rounded font-mono font-normal bg-slate-800 text-slate-300">
                Discrete RRR Yield
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Simulate mass crafting runs, tax costs, return compounding, and mount capacity.
            </p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 self-stretch sm:self-auto">
          <button
            onClick={() => setInputMode('silver')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              inputMode === 'silver'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>By Silver (e.g. 23M)</span>
          </button>

          <button
            onClick={() => setInputMode('quantity')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              inputMode === 'quantity'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>By Raw Quantity</span>
          </button>
        </div>
      </div>

      {/* Input Controls & Route Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Quantity or Silver Input */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
          {inputMode === 'silver' ? (
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-1">
                <span>Available Capital (Silver):</span>
                <span className="text-[10px] text-amber-400/80 font-mono">Supports '23M', '500k'</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={silverString}
                  onChange={(e) => setSilverString(e.target.value)}
                  placeholder="e.g. 23M"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-mono text-base font-bold outline-none focus:border-amber-500"
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono flex items-center justify-between">
                <span>Calculated Silver:</span>
                <span className="text-slate-200 font-semibold">{formatSilver(startingSilver)} Silver</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-1">
                <span>Target Raw Materials:</span>
                <span className="text-[10px] text-slate-400">{resourceInfo.t3RawName}</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="2"
                  step="2"
                  value={rawQuantity}
                  onChange={(e) => setRawQuantity(Math.max(2, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-mono text-base font-bold outline-none focus:border-amber-500"
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono flex items-center justify-between">
                <span>Craft Cycles:</span>
                <span className="text-slate-200 font-semibold">{Math.floor(rawQuantity / 2)} crafts</span>
              </div>
            </div>
          )}

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {inputMode === 'silver' ? (
              ['5M', '10M', '23M', '50M', '100M'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setSilverString(chip)}
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium border transition-colors ${
                    silverString === chip
                      ? 'bg-amber-500/30 text-amber-300 border-amber-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {chip}
                </button>
              ))
            ) : (
              [500, 1000, 2500, 5000, 10000].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setRawQuantity(chip)}
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium border transition-colors ${
                    rawQuantity === chip
                      ? 'bg-amber-500/30 text-amber-300 border-amber-500/50'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {chip.toLocaleString()}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Route City Selectors (Span 2 cols) */}
        <div className="md:col-span-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Hauling & Refining Cities
            </span>
            <button
              onClick={() => {
                setBuyCityRaw(summary.bestArbitrageRoute.buyCityRaw);
                setBuyCityT2(summary.bestArbitrageRoute.buyCityT2);
                setRefineCity(summary.bestArbitrageRoute.refineCity);
                setSellCity(summary.bestArbitrageRoute.sellCity);
              }}
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
            >
              ⭐ Reset to Best Arbitrage Route
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {/* Buy Raw City */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">1. Buy Raw ({rawBuyPrice}s)</label>
              <select
                value={buyCityRaw}
                onChange={(e) => setBuyCityRaw(e.target.value as CityId)}
                className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-md p-1.5 text-xs outline-none focus:border-amber-500"
              >
                {cityList.map((c) => (
                  <option key={c} value={c}>
                    {CITIES[c].name} ({prices[resource][c].t3RawBuyOrder}s)
                  </option>
                ))}
              </select>
            </div>

            {/* Buy T2 City */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">2. Buy T2 ({t2BuyPrice}s)</label>
              <select
                value={buyCityT2}
                onChange={(e) => setBuyCityT2(e.target.value as CityId)}
                className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-md p-1.5 text-xs outline-none focus:border-amber-500"
              >
                {cityList.map((c) => (
                  <option key={c} value={c}>
                    {CITIES[c].name} ({prices[resource][c].t2BuyOrder}s)
                  </option>
                ))}
              </select>
            </div>

            {/* Refine City */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">
                3. Refine ({(refineRRR * 100).toFixed(1)}% RRR)
              </label>
              <select
                value={refineCity}
                onChange={(e) => setRefineCity(e.target.value as CityId)}
                className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-md p-1.5 text-xs outline-none focus:border-amber-500"
              >
                {cityList.map((c) => (
                  <option key={c} value={c}>
                    {CITIES[c].name} {CITIES[c].bonusResource === resource ? '(+40% City Bonus)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Sell City */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">4. Sell ({sellPrice}s)</label>
              <select
                value={sellCity}
                onChange={(e) => setSellCity(e.target.value as CityId)}
                className="w-full bg-slate-900 text-slate-200 border border-slate-700 rounded-md p-1.5 text-xs outline-none focus:border-amber-500"
              >
                {cityList.map((c) => (
                  <option key={c} value={c}>
                    {CITIES[c].name} ({prices[resource][c].t3RefinedSellOrder}s)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Results Dashboard Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Investment */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Investment</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-100 mt-1">
            {formatSilver(result.totalInvestment)} <span className="text-xs font-normal text-slate-400">Silver</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1.5 space-y-0.5 border-t border-slate-800/80 pt-1.5">
            <div className="flex justify-between">
              <span>Raw ({result.actualRawCrafted.toLocaleString()}):</span>
              <span className="font-mono text-slate-300">{formatCompactSilver(result.totalRawCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>T2 Refined ({result.t2Required.toLocaleString()}):</span>
              <span className="font-mono text-slate-300">{formatCompactSilver(result.totalT2Cost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Station Fees:</span>
              <span className="font-mono text-slate-300">{formatSilver(result.totalStationFee)}s</span>
            </div>
          </div>
        </div>

        {/* Refined Yield with RRR */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[11px] text-cyan-400 uppercase font-semibold flex items-center justify-between">
            <span>Refined Output</span>
            <span className="text-[10px] text-slate-400 font-mono">{(refineRRR * 100).toFixed(1)}% RRR</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-cyan-300 mt-1">
            {result.effectiveRefinedOutput.toLocaleString()}{' '}
            <span className="text-xs font-normal text-cyan-400/80">{resourceInfo.t3RefinedName}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1.5 space-y-0.5 border-t border-slate-800/80 pt-1.5">
            <div className="flex justify-between">
              <span>Base Crafts:</span>
              <span className="font-mono text-slate-300">{Math.floor(result.actualRawCrafted / 2)} items</span>
            </div>
            <div className="flex justify-between">
              <span>Bonus from RRR:</span>
              <span className="font-mono text-cyan-400 font-bold">
                +{(result.effectiveRefinedOutput - Math.floor(result.actualRawCrafted / 2)).toLocaleString()} items
              </span>
            </div>
            <div className="flex justify-between">
              <span>Yield Multiplier:</span>
              <span className="font-mono text-slate-300">
                {(1 / (1 - refineRRR)).toFixed(2)}x Output
              </span>
            </div>
          </div>
        </div>

        {/* Net Revenue & Market Taxes */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400 uppercase font-semibold flex items-center justify-between">
            <span>Net Revenue</span>
            <span className="text-[10px] text-amber-400 font-mono">{(taxRate * 100).toFixed(1)}% Tax</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-amber-300 mt-1">
            {formatSilver(result.netRevenue)} <span className="text-xs font-normal text-slate-400">Silver</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1.5 space-y-0.5 border-t border-slate-800/80 pt-1.5">
            <div className="flex justify-between">
              <span>Gross Sales:</span>
              <span className="font-mono text-slate-300">{formatCompactSilver(result.grossRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span>Market Fees:</span>
              <span className="font-mono text-rose-400">-{formatCompactSilver(result.totalMarketTax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Net Price / Unit:</span>
              <span className="font-mono text-slate-300">{(sellPrice * (1 - taxRate)).toFixed(1)}s</span>
            </div>
          </div>
        </div>

        {/* Net Profit & ROI */}
        <div
          className={`p-3.5 rounded-xl border ${
            isProfitable
              ? 'bg-gradient-to-b from-emerald-950/60 to-slate-950 border-emerald-500/60 shadow-lg shadow-emerald-950/30'
              : 'bg-gradient-to-b from-rose-950/60 to-slate-950 border-rose-500/60'
          }`}
        >
          <div className="text-[11px] uppercase font-bold flex items-center justify-between text-slate-300">
            <span>Net Profit</span>
            <span
              className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                isProfitable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {isProfitable ? '+' : ''}
              {result.roiPercentage.toFixed(1)}% ROI
            </span>
          </div>
          <div
            className={`text-lg sm:text-2xl font-black font-mono mt-1 ${
              isProfitable ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isProfitable ? '+' : ''}
            {formatSilver(result.netProfit)} <span className="text-xs font-normal opacity-70">Silver</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1.5 space-y-0.5 border-t border-slate-800/80 pt-1.5">
            <div className="flex justify-between">
              <span>Profit / Base Craft:</span>
              <span className={`font-mono font-semibold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isProfitable ? '+' : ''}
                {result.profitPerCraft.toFixed(1)}s
              </span>
            </div>
            <div className="flex justify-between">
              <span>Capital Turnover:</span>
              <span className="font-mono text-slate-300">
                {((result.grossRevenue / Math.max(1, result.totalInvestment))).toFixed(2)}x
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mount Recommendation & Weight Logistics */}
      <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
            <Truck className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">
              Transport Logistics & Capacity: <span className="text-amber-300 font-mono font-bold">~{result.estimatedWeightKg.toLocaleString()} kg</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Recommended Mount: <span className="text-slate-200 font-medium">{result.recommendedMount}</span>
            </div>
          </div>
        </div>

        {/* Science Stochastic Yield Confidence Box */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5">
          <Atom className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="text-[11px]">
            <span className="text-slate-400">95% Confidence Output Range: </span>
            <span className="font-mono text-cyan-300 font-bold">
              {result.stochasticYield.p95Low.toLocaleString()} – {result.stochasticYield.p95High.toLocaleString()} items
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
