export type ResourceType = 'leather' | 'wood' | 'cloth' | 'metal' | 'stone';

export type CityId = 'martlock' | 'lymhurst' | 'thetford' | 'fort_sterling' | 'bridgewatch' | 'caerleon';

export interface ResourceInfo {
  id: ResourceType;
  name: string;
  nameArabic: string;
  t2RawName: string;
  t2RefinedName: string;
  t3RawName: string;
  t3RefinedName: string;
  bonusCity: CityId;
}

export interface CityPriceData {
  // RAW Materials (Buy Order & Sell Order)
  t2RawBuyOrder: number;
  t2RawSellOrder: number;
  t3RawBuyOrder: number;
  t3RawSellOrder: number;

  // REFINED Materials (Buy Order & Sell Order)
  t2RefinedBuyOrder: number;
  t2RefinedSellOrder: number;
  t3RefinedBuyOrder: number;
  t3RefinedSellOrder: number;

  // Crafting station fee in silver
  stationFee: number;

  // Backwards compatibility alias
  t2BuyOrder?: number;

  lastUpdated?: number;
  updatedBy?: string;
}

export type AllMarketPrices = Record<ResourceType, Record<CityId, CityPriceData>>;

export interface CityRefiningResult {
  cityId: CityId;
  cityName: string;
  hasCityBonus: boolean;
  effectiveRRR: number; // e.g. 0.40 or 0.152
  costPerRefined: number;
  sellPrice: number;
  netRevenuePerRefined: number;
  netProfitPerCraft: number;
  roiPercentage: number;
  isBestRefineCity: boolean;
  isBestSellCity: boolean;
  isBestBuyCity: boolean;
}

export interface CityMatrixSummary {
  bestBuyCityT2Raw: { cityId: CityId; price: number };
  bestBuyCityT3Raw: { cityId: CityId; price: number };
  bestBuyCityT2Refined: { cityId: CityId; price: number };
  bestSellCityT3Refined: { cityId: CityId; price: number; netPrice: number };
  bestRefineCity: { cityId: CityId; rrr: number };
}

export interface BatchCalculationResult {
  mode: 'silver' | 'quantity';
  inputValue: number;
  craftCycles: number;
  rawT3Needed: number;
  refinedT2Needed: number;
  rawCost: number;
  t2Cost: number;
  stationFeeCost: number;
  totalInvestment: number;
  effectiveRefinedOutput: number;
  grossRevenue: number;
  marketTaxCost: number;
  netRevenue: number;
  netProfit: number;
  roiPercentage: number;
  profitPerCraft: number;
  remainingSilver: number;
}
