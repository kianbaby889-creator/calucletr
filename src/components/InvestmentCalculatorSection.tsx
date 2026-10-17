import React, { useState } from 'react';
import { CityId, ResourceType, AllMarketPrices } from '../types/albion';
import { CITIES, RESOURCES } from '../data/constants';
import {
  calculateBatchInvestment,
  calculateCityMatrixSummary,
  calculateEffectiveRRR,
  parseSilverInput,
  formatSilver,
  formatCompactSilver
} from '../utils/calculator';
import { Calculator, ArrowRight, Coins, Package } from 'lucide-react';

interface InvestmentCalculatorSectionProps {
  resource: ResourceType;
  prices: AllMarketPrices;
  taxRate: number;
  forceCityBonus: boolean;
}

export const InvestmentCalculatorSection: React.FC<InvestmentCalculatorSectionProps> = ({
  resource,
  prices,
  taxRate,
  forceCityBonus
}) => {
  const resourceInfo = RESOURCES[resource];
  const summary = calculateCityMatrixSummary(resource, prices, taxRate, forceCityBonus);
  const cityList = Object.keys(CITIES) as CityId[];

  const [mode, setMode] = useState<'silver' | 'quantity'>('silver');
  const [silverInput, setSilverInput] = useState('23M');
  const [quantityInput, setQuantityInput] = useState(10000);

  // Strategic City and Price Choices
  const [buyCityRaw, setBuyCityRaw] = useState<CityId>(summary.bestBuyCityT3Raw.cityId);
  const [buyCityT2, setBuyCityT2] = useState<CityId>(summary.bestBuyCityT2Refined.cityId);
  const [refineCity, setRefineCity] = useState<CityId>(summary.bestRefineCity.cityId);
  const [sellCity, setSellCity] = useState<CityId>(summary.bestSellCityT3Refined.cityId);

  // Buy/Sell Order Strategy
  const [rawOrderType, setRawOrderType] = useState<'buyOrder' | 'sellOrder'>('buyOrder');
  const [sellOrderType, setSellOrderType] = useState<'sellOrder' | 'buyOrder'>('sellOrder');

  // Lookup prices based on order strategy
  const rawCityData = prices[resource][buyCityRaw] || ({} as any);
  const t2CityData = prices[resource][buyCityT2] || ({} as any);
  const refineCityData = prices[resource][refineCity] || ({} as any);
  const sellCityData = prices[resource][sellCity] || ({} as any);

  const rawT3Price = rawOrderType === 'buyOrder'
    ? (rawCityData.t3RawBuyOrder || 0)
    : (rawCityData.t3RawSellOrder || rawCityData.t3RawBuyOrder || 0);

  const refinedT2Price = rawOrderType === 'buyOrder'
    ? (t2CityData.t2RefinedBuyOrder || t2CityData.t2BuyOrder || 0)
    : (t2CityData.t2RefinedSellOrder || t2CityData.t2RefinedBuyOrder || 0);

  const stationFee = refineCityData.stationFee || 6;
  const rrr = calculateEffectiveRRR(refineCity, resource, forceCityBonus);

  const refinedT3SellPrice = sellOrderType === 'sellOrder'
    ? (sellCityData.t3RefinedSellOrder || 0)
    : (sellCityData.t3RefinedBuyOrder || sellCityData.t3RefinedSellOrder || 0);

  const inputValue = mode === 'silver' ? parseSilverInput(silverInput) : quantityInput;

  const result = calculateBatchInvestment({
    mode,
    inputValue,
    rawT3Price,
    refinedT2Price,
    stationFee,
    refinedT3SellPrice,
    rrr,
    taxRate
  });

  const isProfitable = result.netProfit > 0;

  return (
    <section className="bg-[#0b0f17] border border-slate-800/80 rounded-xl overflow-hidden shadow-sm space-y-3">
      {/* Header */}
      <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Investment & Production Calculator
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            (Option A: Silver Budget • Option B: Target Quantity)
          </span>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setMode('silver')}
            className={`px-3 py-1 rounded font-medium transition-all ${
              mode === 'silver'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Option A: Invest Silver (e.g. 23M)
          </button>
          <button
            onClick={() => setMode('quantity')}
            className={`px-3 py-1 rounded font-medium transition-all ${
              mode === 'quantity'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Option B: Target Craft Quantity
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Input & Routing Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Main User Input */}
          <div className="bg-[#070a0f] p-3 rounded-lg border border-slate-800 space-y-2">
            {mode === 'silver' ? (
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Total Silver to Invest:
                </label>
                <input
                  type="text"
                  value={silverInput}
                  onChange={(e) => setSilverInput(e.target.value)}
                  placeholder="e.g. 23M or 5,000,000"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-blue-300 font-mono text-sm font-bold outline-none focus:border-blue-500"
                />
                <div className="flex gap-1.5 pt-1">
                  {['5M', '10M', '23M', '50M'].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setSilverInput(chip)}
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                        silverInput === chip
                          ? 'bg-blue-950 text-blue-300 border-blue-700'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Target Units to Craft:
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantityInput}
                  onChange={(e) => setQuantityInput(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-blue-300 font-mono text-sm font-bold outline-none focus:border-blue-500"
                />
                <div className="flex gap-1.5 pt-1">
                  {[1000, 10000, 50000, 100000].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setQuantityInput(chip)}
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
                        quantityInput === chip
                          ? 'bg-blue-950 text-blue-300 border-blue-700'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {chip.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* City Route Selection */}
          <div className="md:col-span-2 bg-[#070a0f] p-3 rounded-lg border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Hauling & Crafting Cities:</span>
              <button
                onClick={() => {
                  setBuyCityRaw(summary.bestBuyCityT3Raw.cityId);
                  setBuyCityT2(summary.bestBuyCityT2Refined.cityId);
                  setRefineCity(summary.bestRefineCity.cityId);
                  setSellCity(summary.bestSellCityT3Refined.cityId);
                }}
                className="text-blue-400 hover:underline"
              >
                Reset to Optimal Cities
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">1. Buy Raw T3:</span>
                <select
                  value={buyCityRaw}
                  onChange={(e) => setBuyCityRaw(e.target.value as CityId)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded p-1 text-xs outline-none focus:border-blue-500"
                >
                  {cityList.map((c) => (
                    <option key={c} value={c}>{CITIES[c].name}</option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">2. Buy Refined T2:</span>
                <select
                  value={buyCityT2}
                  onChange={(e) => setBuyCityT2(e.target.value as CityId)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded p-1 text-xs outline-none focus:border-blue-500"
                >
                  {cityList.map((c) => (
                    <option key={c} value={c}>{CITIES[c].name}</option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">3. Refine (RRR):</span>
                <select
                  value={refineCity}
                  onChange={(e) => setRefineCity(e.target.value as CityId)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded p-1 text-xs outline-none focus:border-blue-500"
                >
                  {cityList.map((c) => (
                    <option key={c} value={c}>
                      {CITIES[c].name} {CITIES[c].bonusResource === resource ? '(+40%)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">4. Sell City:</span>
                <select
                  value={sellCity}
                  onChange={(e) => setSellCity(e.target.value as CityId)}
                  className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded p-1 text-xs outline-none focus:border-blue-500"
                >
                  {cityList.map((c) => (
                    <option key={c} value={c}>{CITIES[c].name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price Strategy Toggles */}
            <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-800/80 text-[11px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Raw Buy Strategy:</span>
                <button
                  onClick={() => setRawOrderType('buyOrder')}
                  className={`px-1.5 py-0.5 rounded ${
                    rawOrderType === 'buyOrder'
                      ? 'bg-blue-950 text-blue-300 border border-blue-700'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Buy Order ({rawT3Price}s)
                </button>
                <button
                  onClick={() => setRawOrderType('sellOrder')}
                  className={`px-1.5 py-0.5 rounded ${
                    rawOrderType === 'sellOrder'
                      ? 'bg-blue-950 text-blue-300 border border-blue-700'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Direct Buy ({rawT3Price}s)
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Refined Sell Strategy:</span>
                <button
                  onClick={() => setSellOrderType('sellOrder')}
                  className={`px-1.5 py-0.5 rounded ${
                    sellOrderType === 'sellOrder'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Sell Order ({refinedT3SellPrice}s)
                </button>
                <button
                  onClick={() => setSellOrderType('buyOrder')}
                  className={`px-1.5 py-0.5 rounded ${
                    sellOrderType === 'buyOrder'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Direct Sell ({refinedT3SellPrice}s)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Card 1: Total Investment */}
          <div className="bg-[#070a0f] p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Total Silver Required
            </span>
            <div className="text-base sm:text-lg font-bold font-mono text-slate-100 mt-0.5">
              {formatSilver(result.totalInvestment)} <span className="text-[11px] font-normal text-slate-500">Silver</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500 mt-1 space-y-0.5">
              <div>Raw T3: {formatCompactSilver(result.rawCost)}</div>
              <div>Refined T2: {formatCompactSilver(result.t2Cost)}</div>
              <div>Station Fee: {formatSilver(result.stationFeeCost)}s</div>
              {mode === 'silver' && (
                <div className="text-slate-400">Remaining: {formatSilver(result.remainingSilver)}s</div>
              )}
            </div>
          </div>

          {/* Card 2: Materials Needed */}
          <div className="bg-[#070a0f] p-3 rounded-lg border border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Materials Needed
            </span>
            <div className="text-base sm:text-lg font-bold font-mono text-blue-400 mt-0.5">
              {result.craftCycles.toLocaleString()} <span className="text-[11px] font-normal text-slate-500">Base Crafts</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-1 space-y-0.5">
              <div>T3 Raw: {result.rawT3Needed.toLocaleString()} items</div>
              <div>T2 Refined: {result.refinedT2Needed.toLocaleString()} items</div>
              <div>Ratio: 2 Raw : 1 Refined</div>
            </div>
          </div>

          {/* Card 3: Estimated Output */}
          <div className="bg-[#070a0f] p-3 rounded-lg border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Estimated Refined Output
              </span>
              <span className="text-[10px] font-mono text-blue-400">
                {(rrr * 100).toFixed(0)}% RRR
              </span>
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-blue-300 mt-0.5">
              {result.effectiveRefinedOutput.toLocaleString()} <span className="text-[11px] font-normal text-slate-500">Units</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-1 space-y-0.5">
              <div>Gross Value: {formatCompactSilver(result.grossRevenue)}s</div>
              <div className="text-rose-400">Taxes ({(taxRate * 100).toFixed(1)}%): -{formatCompactSilver(result.marketTaxCost)}s</div>
              <div>Net Revenue: {formatCompactSilver(result.netRevenue)}s</div>
            </div>
          </div>

          {/* Card 4: Net Profit & ROI */}
          <div
            className={`p-3 rounded-lg border ${
              isProfitable
                ? 'bg-emerald-950/20 border-emerald-500/50'
                : 'bg-rose-950/20 border-rose-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300">
                Net Profit
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  isProfitable ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                }`}
              >
                {isProfitable ? '+' : ''}{result.roiPercentage.toFixed(1)}% ROI
              </span>
            </div>
            <div
              className={`text-base sm:text-lg font-bold font-mono mt-0.5 ${
                isProfitable ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isProfitable ? '+' : ''}{formatSilver(result.netProfit)} <span className="text-[11px] font-normal opacity-80">Silver</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-1 space-y-0.5">
              <div>Profit / Craft: +{result.profitPerCraft.toFixed(1)}s</div>
              <div>Multiplier: {(result.effectiveRefinedOutput / Math.max(1, result.craftCycles)).toFixed(2)}x yield</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
