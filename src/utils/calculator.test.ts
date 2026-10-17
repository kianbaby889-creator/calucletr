import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEffectiveRRR,
  calculateCityRefiningMetrics,
  calculateCityMatrixSummary,
  calculateBatchInvestment,
  parseSilverInput,
  formatSilver,
  formatCompactSilver
} from './calculator.ts';
import { DEFAULT_MARKET_PRICES, RRR_PRESETS, TAX_RATES } from '../data/constants.ts';

test('calculateEffectiveRRR returns 40% for city bonus', () => {
  const rrrMartlock = calculateEffectiveRRR('martlock', 'leather');
  assert.equal(rrrMartlock, RRR_PRESETS.CITY_BONUS); // 0.40

  const rrrBridgewatchForLeather = calculateEffectiveRRR('bridgewatch', 'leather');
  assert.equal(rrrBridgewatchForLeather, RRR_PRESETS.DEFAULT); // 0.152
});

test('calculateCityRefiningMetrics computes correct cost, revenue, and net profit', () => {
  const priceData = {
    t2RawBuyOrder: 15,
    t2RawSellOrder: 18,
    t3RawBuyOrder: 30,
    t3RawSellOrder: 36,
    t2RefinedBuyOrder: 20,
    t2RefinedSellOrder: 25,
    t3RefinedBuyOrder: 130,
    t3RefinedSellOrder: 150,
    stationFee: 5
  };
  // Martlock + Leather (40% RRR)
  // Raw cost: 2 * (1 - 0.40) * 30 = 36
  // T2 cost: 1 * (1 - 0.40) * 20 = 12
  // Station fee: 5
  // Total cost = 36 + 12 + 5 = 53
  // Net revenue at 6.5% tax: 150 * (1 - 0.065) = 140.25
  // Net profit: 140.25 - 53 = 87.25
  const result = calculateCityRefiningMetrics('leather', 'martlock', priceData, TAX_RATES.PREMIUM);
  assert.equal(result.costPerRefined, 53);
  assert.equal(result.netRevenuePerRefined, 140.25);
  assert.equal(result.netProfitPerCraft, 87.25);
  assert.ok(result.roiPercentage > 160);
});

test('calculateBatchInvestment calculates Mode A (Silver Investment) accurately', () => {
  const batch = calculateBatchInvestment({
    mode: 'silver',
    inputValue: 23_000_000,
    rawT3Price: 34,
    refinedT2Price: 22,
    stationFee: 6,
    refinedT3SellPrice: 125,
    rrr: 0.40,
    taxRate: 0.065
  });

  // Base craft cost: 2*34 + 1*22 + 6 = 68 + 22 + 6 = 96
  // Craft cycles: floor(23,000,000 / 96) = 239,583
  assert.equal(batch.craftCycles, 239583);
  assert.equal(batch.rawT3Needed, 239583 * 2);
  assert.equal(batch.refinedT2Needed, 239583);
  assert.ok(batch.totalInvestment <= 23_000_000);
  assert.ok(batch.effectiveRefinedOutput > batch.craftCycles); // RRR multiplier 1.67x
  assert.ok(batch.netProfit > 0);
  assert.ok(batch.roiPercentage > 0);
});

test('calculateBatchInvestment calculates Mode B (Target Quantity) accurately', () => {
  const batch = calculateBatchInvestment({
    mode: 'quantity',
    inputValue: 100_000,
    rawT3Price: 34,
    refinedT2Price: 22,
    stationFee: 6,
    refinedT3SellPrice: 125,
    rrr: 0.40,
    taxRate: 0.065
  });

  assert.equal(batch.craftCycles, 100_000);
  assert.equal(batch.rawT3Needed, 200_000);
  assert.equal(batch.refinedT2Needed, 100_000);
  assert.equal(batch.totalInvestment, 9_600_000);
  assert.ok(batch.effectiveRefinedOutput > 100_000);
  assert.ok(batch.netProfit > 0);
});

test('parseSilverInput parses shorthand strings correctly', () => {
  assert.equal(parseSilverInput('23M'), 23_000_000);
  assert.equal(parseSilverInput('500k'), 500_000);
  assert.equal(parseSilverInput('1.5b'), 1_500_000_000);
  assert.equal(parseSilverInput('23,000,000'), 23_000_000);
});

test('formatSilver and formatCompactSilver output clean strings', () => {
  assert.equal(formatSilver(125000), '125,000');
  assert.equal(formatCompactSilver(23500000), '23.50M');
  assert.equal(formatCompactSilver(45000), '45.0k');
});
