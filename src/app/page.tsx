"use client";

import { useState, useEffect, useMemo } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import type { AppData, Asset, Liability, NetWorthRecord, Currency } from '@/types/worthwatch';
import { SUPPORTED_CURRENCIES } from '@/types/worthwatch';
import Header from '@/components/worthwatch/Header';
import NetWorthDisplay from '@/components/worthwatch/NetWorthDisplay';
import AssetLiabilityForm from '@/components/worthwatch/AssetLiabilityForm';
import ItemsList from '@/components/worthwatch/ItemsList';
import NetWorthGraph from '@/components/worthwatch/NetWorthGraph';
import CurrencySelector from '@/components/worthwatch/CurrencySelector';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';

const initialAppData: AppData = {
  assets: [],
  liabilities: [],
  history: [],
  currency: 'USD', // Default currency
};

export default function WorthWatchPage() {
  const [appData, setAppData] = useLocalStorage<AppData>('worthWatchData', initialAppData);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const totalAssets = useMemo(() => appData.assets.reduce((sum, asset) => sum + asset.value, 0), [appData.assets]);
  const totalLiabilities = useMemo(() => appData.liabilities.reduce((sum, liability) => sum + liability.value, 0), [appData.liabilities]);
  const netWorth = useMemo(() => totalAssets - totalLiabilities, [totalAssets, totalLiabilities]);

  const updateHistory = (currentNetWorth: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    setAppData(prevData => {
      const newHistoryEntry: NetWorthRecord = { date: today, netWorth: currentNetWorth };
      let updatedHistory = [...prevData.history];

      const todayEntryIndex = updatedHistory.findIndex(entry => entry.date === today);
      if (todayEntryIndex !== -1) {
        updatedHistory[todayEntryIndex] = newHistoryEntry;
      } else {
        updatedHistory.push(newHistoryEntry);
      }
      updatedHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      return { ...prevData, history: updatedHistory };
    });
  };
  
  const handleAddItem = (item: Asset | Liability, itemKind: 'asset' | 'liability') => {
    setAppData(prevData => {
      const updatedData = { ...prevData };
      if (itemKind === 'asset') {
        updatedData.assets = [...prevData.assets, item as Asset];
      } else {
        updatedData.liabilities = [...prevData.liabilities, item as Liability];
      }
      const newTotalAssets = itemKind === 'asset' ? (prevData.assets.reduce((sum, asset) => sum + asset.value, 0)) + item.value : (prevData.assets.reduce((sum, asset) => sum + asset.value, 0));
      const newTotalLiabilities = itemKind === 'liability' ? (prevData.liabilities.reduce((sum, liability) => sum + liability.value, 0)) + item.value : (prevData.liabilities.reduce((sum, liability) => sum + liability.value, 0));
      
      const newNetWorth = newTotalAssets - newTotalLiabilities;
      // updateHistory will be called inside this new state update to ensure it has the latest netWorth
      const today = new Date().toISOString().split('T')[0];
      const newHistoryEntry: NetWorthRecord = { date: today, netWorth: newNetWorth };
      let updatedHistory = [...prevData.history];
      const todayEntryIndex = updatedHistory.findIndex(entry => entry.date === today);
      if (todayEntryIndex !== -1) {
        updatedHistory[todayEntryIndex] = newHistoryEntry;
      } else {
        updatedHistory.push(newHistoryEntry);
      }
      updatedHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      updatedData.history = updatedHistory;

      return updatedData;
    });
    toast({ title: `${itemKind === 'asset' ? 'Asset' : 'Liability'} added`, description: `"${item.name}" has been successfully added.` });
  };

  const handleDeleteItem = (id: string, itemKind: 'asset' | 'liability') => {
    setAppData(prevData => {
      const updatedData = { ...prevData };
      let itemValue = 0;
      let currentTotalAssets = prevData.assets.reduce((sum, asset) => sum + asset.value, 0);
      let currentTotalLiabilities = prevData.liabilities.reduce((sum, liability) => sum + liability.value, 0);

      if (itemKind === 'asset') {
        const assetToRemove = prevData.assets.find(a => a.id === id);
        if (assetToRemove) itemValue = assetToRemove.value;
        updatedData.assets = prevData.assets.filter(asset => asset.id !== id);
        currentTotalAssets -= itemValue;
      } else {
        const liabilityToRemove = prevData.liabilities.find(l => l.id === id);
        if (liabilityToRemove) itemValue = liabilityToRemove.value;
        updatedData.liabilities = prevData.liabilities.filter(liability => liability.id !== id);
        currentTotalLiabilities -= itemValue;
      }
      
      const newNetWorth = currentTotalAssets - currentTotalLiabilities;
      const today = new Date().toISOString().split('T')[0];
      const newHistoryEntry: NetWorthRecord = { date: today, netWorth: newNetWorth };
      let updatedHistory = [...prevData.history];
      const todayEntryIndex = updatedHistory.findIndex(entry => entry.date === today);
      if (todayEntryIndex !== -1) {
        updatedHistory[todayEntryIndex] = newHistoryEntry;
      } else {
        updatedHistory.push(newHistoryEntry);
      }
      updatedHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      updatedData.history = updatedHistory;

      return updatedData;
    });
    toast({ title: `${itemKind === 'asset' ? 'Asset' : 'Liability'} deleted`, description: `The item has been successfully deleted.`, variant: "destructive" });
  };
  
  const handleSetCurrency = (currencyCode: string) => {
    setAppData(prevData => ({ ...prevData, currency: currencyCode }));
    toast({ title: "Currency Updated", description: `Display currency set to ${currencyCode}.` });
  };

  const handleManualSnapshot = () => {
    updateHistory(netWorth);
    toast({ title: "Net Worth Snapshot Created", description: "Current net worth has been recorded in history." });
  };

  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto p-4 md:p-8 flex-grow">
          <p>Loading WorthWatch...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8 space-y-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <NetWorthDisplay netWorth={netWorth} totalAssets={totalAssets} totalLiabilities={totalLiabilities} currency={appData.currency} />
          </div>
          <div className="md:col-span-1">
            <CurrencySelector
                selectedCurrency={appData.currency}
                onCurrencyChange={handleSetCurrency}
                currencies={SUPPORTED_CURRENCIES}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"> {/* Changed lg:grid-cols-3 to lg:grid-cols-2 */}
          <div className="lg:col-span-1"> {/* This will take full width on smaller screens, half on large */}
             <AssetLiabilityForm onAddItem={handleAddItem} currency={appData.currency} />
          </div>
          {/* FinancialTips component removed */}
          <div className="lg:col-span-1"> {/* This will take full width on smaller screens, half on large */}
            <NetWorthGraph history={appData.history} currency={appData.currency} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ItemsList items={appData.assets} itemKind="asset" onDeleteItem={handleDeleteItem} currency={appData.currency} />
          <ItemsList items={appData.liabilities} itemKind="liability" onDeleteItem={handleDeleteItem} currency={appData.currency} />
        </div>
        
        <div className="text-center mt-4">
            <Button onClick={handleManualSnapshot} variant="outline">
                Create Net Worth Snapshot
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
                Manually record current net worth to history. This is also done automatically when items are added/deleted.
            </p>
        </div>

      </main>
      <footer className="text-center py-4 text-sm text-muted-foreground border-t">
        WorthWatch &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
