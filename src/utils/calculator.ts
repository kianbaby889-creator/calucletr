import { CityId, ResourceType, CityPriceData, AllMarketPrices, CityRefiningResult, CityMatrixSummary, BatchCalculationResult } from '../types/albion';
import { CITIES, RESOURCES, RRR_PRESETS, TAX_RATES } from '../data/constants';

/**
 * Calculates effective RRR for a given city and resource
 */
export function calculateEffectiveRRR(
  cityId: CityId,
  resourceType: ResourceType,
  forceCityBonus?: boolean
): number {
  if (forceCityBonus !== undefined) {
    return forceCityBonus ? RRR_PRESETS.CITY_BONUS : RRR_PRESETS.DEFAULT;
  }
  const isBonusCity = CITIES[cityId].bonusResource === resourceType;
  return isBonusCity ? RRR_PRESETS.CITY_BONUS : RRR_PRESETS.DEFAULT;
}

/**
 * Calculate single city refining metrics for T3 material
 */
export function calculateCityRefiningMetrics(
  resourceType: ResourceType,
  cityId: CityId,
  priceData: CityPriceData,
  taxRate: number = TAX_RATES.NON_PREMIUM,
  forceCityBonus?: boolean,
  rawPriceType: 'buyOrder' | 'sellOrder' = 'buyOrder',
  refinedPriceType: 'sellOrder' | 'buyOrder' = 'sellOrder'
): CityRefiningResult {
  const rrr = calculateEffectiveRRR(cityId, resourceType, forceCityBonus);
  const hasCityBonus = CITIES[cityId].bonusResource === resourceType;

  // Recipe for T3: 2 Raw T3 + 1 Refined T2 -> 1 Refined T3
  const effectiveRawPerCraft = 2 * (1 - rrr);
  const effectiveT2PerCraft = 1 * (1 - rrr);

  const t3RawPrice = rawPriceType === 'buyOrder'
    ? (priceData.t3RawBuyOrder || 0)
    : (priceData.t3RawSellOrder || priceData.t3RawBuyOrder || 0);

  const t2RefinedPrice = rawPriceType === 'buyOrder'
    ? (priceData.t2RefinedBuyOrder || priceData.t2BuyOrder || 0)
    : (priceData.t2RefinedSellOrder || priceData.t2RefinedBuyOrder || priceData.t2BuyOrder || 0);

  const rawCost = effectiveRawPerCraft * t3RawPrice;
  const t2Cost = effectiveT2PerCraft * t2RefinedPrice;
  const stationFee = priceData.stationFee || 0;
  const costPerRefined = rawCost + t2Cost + stationFee;

  const sellPrice = refinedPriceType === 'sellOrder'
    ? (priceData.t3RefinedSellOrder || 0)
    : (priceData.t3RefinedBuyOrder || priceData.t3RefinedSellOrder || 0);

  const netRevenuePerRefined = sellPrice * (1 - taxRate);
  const netProfitPerCraft = netRevenuePerRefined - costPerRefined;
  const roiPercentage = costPerRefined > 0 ? (netProfitPerCraft / costPerRefined) * 100 : 0;

  return {
    cityId,
    cityName: CITIES[cityId].name,
    hasCityBonus,
    effectiveRRR: rrr,
    costPerRefined,
    sellPrice,
    netRevenuePerRefined,
    netProfitPerCraft,
    roiPercentage,
    isBestRefineCity: false,
    isBestSellCity: false,
    isBestBuyCity: false
  };
}

/**
 * Analyzes cities for best buy, best sell, and matrix overview
 */
export function calculateCityMatrixSummary(
  resourceType: ResourceType,
  marketPrices: AllMarketPrices,
  taxRate: number = TAX_RATES.NON_PREMIUM,
  forceCityBonus?: boolean
): CityMatrixSummary {
  const cityList = Object.keys(CITIES) as CityId[];
  const prices = marketPrices[resourceType];

  let bestBuyCityT2Raw: CityId = cityList[0];
  let lowestT2RawPrice = Infinity;

  let bestBuyCityT3Raw: CityId = cityList[0];
  let lowestT3RawPrice = Infinity;

  let bestBuyCityT2Refined: CityId = cityList[0];
  let lowestT2RefinedPrice = Infinity;

  let bestSellCityT3Refined: CityId = cityList[0];
  let highestNetSell = -Infinity;

  let bestRefineCity: CityId = RESOURCES[resourceType].bonusCity;
  let highestRRR = -1;

  for (const city of cityList) {
    const data = prices[city] || {
      t2RawBuyOrder: 0, t2RawSellOrder: 0,
      t3RawBuyOrder: 0, t3RawSellOrder: 0,
      t2RefinedBuyOrder: 0, t2RefinedSellOrder: 0,
      t3RefinedBuyOrder: 0, t3RefinedSellOrder: 0,
      stationFee: 0
    };

    if (data.t2RawBuyOrder > 0 && data.t2RawBuyOrder < lowestT2RawPrice) {
      lowestT2RawPrice = data.t2RawBuyOrder;
      bestBuyCityT2Raw = city;
    }

    if (data.t3RawBuyOrder > 0 && data.t3RawBuyOrder < lowestT3RawPrice) {
      lowestT3RawPrice = data.t3RawBuyOrder;
      bestBuyCityT3Raw = city;
    }

    const t2Price = data.t2RefinedBuyOrder || data.t2BuyOrder || 0;
    if (t2Price > 0 && t2Price < lowestT2RefinedPrice) {
      lowestT2RefinedPrice = t2Price;
      bestBuyCityT2Refined = city;
    }

    const netSell = (data.t3RefinedSellOrder || 0) * (1 - taxRate);
    if (netSell > highestNetSell) {
      highestNetSell = netSell;
      bestSellCityT3Refined = city;
    }

    const rrr = calculateEffectiveRRR(city, resourceType, forceCityBonus);
    if (rrr > highestRRR) {
      highestRRR = rrr;
      bestRefineCity = city;
    }
  }

  return {
    bestBuyCityT2Raw: { cityId: bestBuyCityT2Raw, price: lowestT2RawPrice },
    bestBuyCityT3Raw: { cityId: bestBuyCityT3Raw, price: lowestT3RawPrice },
    bestBuyCityT2Refined: { cityId: bestBuyCityT2Refined, price: lowestT2RefinedPrice },
    bestSellCityT3Refined: {
      cityId: bestSellCityT3Refined,
      price: prices[bestSellCityT3Refined]?.t3RefinedSellOrder || 0,
      netPrice: highestNetSell
    },
    bestRefineCity: { cityId: bestRefineCity, rrr: highestRRR }
  };
}

/**
 * Calculates batch refining investment and profit for either starting silver or target quantity
 */
export function calculateBatchInvestment(params: {
  mode: 'silver' | 'quantity';
  inputValue: number; // Silver amount or target craft cycles
  rawT3Price: number;
  refinedT2Price: number;
  stationFee: number;
  refinedT3SellPrice: number;
  rrr: number;
  taxRate: number;
}): BatchCalculationResult {
  const {
    mode,
    inputValue,
    rawT3Price,
    refinedT2Price,
    stationFee,
    refinedT3SellPrice,
    rrr,
    taxRate
  } = params;

  // Single base craft requires: 2 Raw T3 + 1 Refined T2 + station fee
  const baseCraftCost = (2 * rawT3Price) + (1 * refinedT2Price) + stationFee;

  let craftCycles = 0;
  let remainingSilver = 0;

  if (mode === 'silver') {
    if (baseCraftCost > 0 && inputValue > 0) {
      craftCycles = Math.floor(inputValue / baseCraftCost);
    }
  } else {
    craftCycles = Math.max(0, Math.round(inputValue));
  }

  const rawT3Needed = craftCycles * 2;
  const refinedT2Needed = craftCycles * 1;
  const rawCost = rawT3Needed * rawT3Price;
  const t2Cost = refinedT2Needed * refinedT2Price;
  const stationFeeCost = craftCycles * stationFee;
  const totalInvestment = rawCost + t2Cost + stationFeeCost;

  if (mode === 'silver') {
    remainingSilver = Math.max(0, inputValue - totalInvestment);
  }

  // Discrete compounding output with RRR
  // With RRR r, effective output multiplier is 1 / (1 - r)
  const multiplier = 1 / Math.max(0.01, (1 - rrr));
  const effectiveRefinedOutput = Math.round(craftCycles * multiplier);

  const grossRevenue = effectiveRefinedOutput * refinedT3SellPrice;
  const marketTaxCost = grossRevenue * taxRate;
  const netRevenue = grossRevenue - marketTaxCost;
  const netProfit = netRevenue - totalInvestment;
  const roiPercentage = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
  const profitPerCraft = craftCycles > 0 ? netProfit / craftCycles : 0;

  return {
    mode,
    inputValue,
    craftCycles,
    rawT3Needed,
    refinedT2Needed,
    rawCost,
    t2Cost,
    stationFeeCost,
    totalInvestment,
    effectiveRefinedOutput,
    grossRevenue,
    marketTaxCost,
    netRevenue,
    netProfit,
    roiPercentage,
    profitPerCraft,
    remainingSilver
  };
}

export function parseSilverInput(input: string): number {
  if (!input) return 0;
  const clean = input.trim().toLowerCase().replace(/,/g, '');
  if (clean.endsWith('m')) {
    const num = parseFloat(clean.slice(0, -1));
    return isNaN(num) ? 0 : Math.round(num * 1_000_000);
  }
  if (clean.endsWith('k')) {
    const num = parseFloat(clean.slice(0, -1));
    return isNaN(num) ? 0 : Math.round(num * 1_000);
  }
  if (clean.endsWith('b')) {
    const num = parseFloat(clean.slice(0, -1));
    return isNaN(num) ? 0 : Math.round(num * 1_000_000_000);
  }
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : Math.round(parsed);
}

export function formatSilver(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) return '0';
  return Math.round(amount).toLocaleString('en-US');
}

export function formatCompactSilver(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}k`;
  }
  return Math.round(amount).toString();
}
