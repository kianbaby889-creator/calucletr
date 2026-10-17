import React, { useState } from 'react';
import { ResourceType } from './types/albion';
import { TAX_RATES } from './data/constants';
import { useRealtimePrices } from './hooks/useRealtimePrices';
import { HeaderNav } from './components/HeaderNav';
import { RawMaterialsSection } from './components/RawMaterialsSection';
import { RefinedProductsSection } from './components/RefinedProductsSection';
import { ProfitMatrixSection } from './components/ProfitMatrixSection';
import { InvestmentCalculatorSection } from './components/InvestmentCalculatorSection';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { DeployGuideModal } from './components/DeployGuideModal';

export default function App() {
  const {
    prices,
    updatePrice,
    resetPrices,
    connectionStatus,
    onlineCount
  } = useRealtimePrices();

  const [selectedResource, setSelectedResource] = useState<ResourceType>('leather');
  const [taxRate, setTaxRate] = useState<number>(TAX_RATES.NON_PREMIUM);
  const [forceCityBonus, setForceCityBonus] = useState(true);
  const [batchUnits, setBatchUnits] = useState(1);

  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  const handleToggleTax = () => {
    setTaxRate(prev => prev === TAX_RATES.PREMIUM ? TAX_RATES.NON_PREMIUM : TAX_RATES.PREMIUM);
  };

  const handleToggleRRR = () => {
    setForceCityBonus(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-[#070a0f] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Minimalist Top Header & Controls */}
      <HeaderNav
        selectedResource={selectedResource}
        onSelectResource={setSelectedResource}
        taxRate={taxRate}
        onToggleTax={handleToggleTax}
        forceCityBonus={forceCityBonus}
        onToggleRRR={handleToggleRRR}
        batchUnits={batchUnits}
        onChangeBatchUnits={setBatchUnits}
        connectionStatus={connectionStatus}
        onlineCount={onlineCount}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onResetPrices={resetPrices}
      />

      {/* Main Workspace: Structured Clean Sections */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 space-y-4">
        {/* Section 1: Raw Material Prices (T2 & T3 Buy Orders) */}
        <RawMaterialsSection
          resource={selectedResource}
          prices={prices}
          taxRate={taxRate}
          forceCityBonus={forceCityBonus}
          onPriceChange={updatePrice}
        />

        {/* Section 2: Refined Product Prices (T2 & T3 Refined Orders) */}
        <RefinedProductsSection
          resource={selectedResource}
          prices={prices}
          taxRate={taxRate}
          forceCityBonus={forceCityBonus}
          onPriceChange={updatePrice}
        />

        {/* Section 3: Simple Refining Profit Matrix */}
        <ProfitMatrixSection
          resource={selectedResource}
          prices={prices}
          taxRate={taxRate}
          forceCityBonus={forceCityBonus}
          batchUnits={batchUnits}
        />

        {/* Investment & Production Calculator */}
        <InvestmentCalculatorSection
          resource={selectedResource}
          prices={prices}
          taxRate={taxRate}
          forceCityBonus={forceCityBonus}
        />
      </main>

      {/* Minimal Clean Footer */}
      <footer className="border-t border-slate-900 bg-[#06080d] px-4 py-2 text-center text-[11px] font-mono text-slate-500">
        Albion Online T2-T3 Real-Time Refining Calculator • Auto-synced with Supabase & WebSockets
      </footer>

      {/* Modals */}
      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      <DeployGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}
