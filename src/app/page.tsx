
"use client";

import { useState, useEffect, useMemo } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import type { AppData, Asset, Liability, NetWorthRecord } from '@/types/worthwatch';
import { SUPPORTED_CURRENCIES } from '@/types/worthwatch';
import Header from '@/components/worthwatch/Header';
import NetWorthDisplay from '@/components/worthwatch/NetWorthDisplay';
import AssetLiabilityForm from '@/components/worthwatch/AssetLiabilityForm';
import ItemsList from '@/components/worthwatch/ItemsList';
import NetWorthGraph from '@/components/worthwatch/NetWorthGraph';
import CurrencySelector from '@/components/worthwatch/CurrencySelector';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { BASE_CURRENCY, convertAmount } from '@/lib/currencyUtils';

const initialAppData: AppData = {
  assets: [], // Values will be stored in BASE_CURRENCY (USD)
  liabilities: [], // Values will be stored in BASE_CURRENCY (USD)
  history: [], // NetWorth will be stored in BASE_CURRENCY (USD)
  currency: 'USD', // Default display currency
};

export default function WorthWatchPage() {
  const [appData, setAppData] = useLocalStorage<AppData>('worthWatchData', initialAppData);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // All calculations are done in BASE_CURRENCY
  const totalAssetsInBase = useMemo(() => appData.assets.reduce((sum, asset) => sum + asset.value, 0), [appData.assets]);
  const totalLiabilitiesInBase = useMemo(() => appData.liabilities.reduce((sum, liability) => sum + liability.value, 0), [appData.liabilities]);
  const netWorthInBase = useMemo(() => totalAssetsInBase - totalLiabilitiesInBase, [totalAssetsInBase, totalLiabilitiesInBase]);

  const updateHistory = (currentNetWorthInBase: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    setAppData(prevData => {
      const newHistoryEntry: NetWorthRecord = { date: today, netWorth: currentNetWorthInBase }; // Stored in BASE_CURRENCY
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
  
  const handleAddItem = (itemData: Omit<Asset | Liability, 'id' | 'dateAdded'>, itemKind: 'asset' | 'liability') => {
    // itemData.value is in the current display currency (appData.currency)
    const valueInBaseCurrency = convertAmount(itemData.value, appData.currency, BASE_CURRENCY);

    const newItem = {
      ...itemData,
      id: Date.now().toString(),
      value: valueInBaseCurrency, // Store value in BASE_CURRENCY
      dateAdded: new Date().toISOString(),
    };

    setAppData(prevData => {
      const updatedData = { ...prevData };
      if (itemKind === 'asset') {
        updatedData.assets = [...prevData.assets, newItem as Asset];
      } else {
        updatedData.liabilities = [...prevData.liabilities, newItem as Liability];
      }

      // Recalculate totals in BASE_CURRENCY
      const newTotalAssetsInBase = updatedData.assets.reduce((sum, asset) => sum + asset.value, 0);
      const newTotalLiabilitiesInBase = updatedData.liabilities.reduce((sum, liability) => sum + liability.value, 0);
      const newNetWorthInBase = newTotalAssetsInBase - newTotalLiabilitiesInBase;
      
      // Update history with BASE_CURRENCY net worth
      const today = new Date().toISOString().split('T')[0];
      const newHistoryEntry: NetWorthRecord = { date: today, netWorth: newNetWorthInBase };
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
    toast({ title: `${itemKind === 'asset' ? 'Asset' : 'Liability'} added`, description: `"${newItem.name}" has been successfully added.` });
  };

  const handleDeleteItem = (id: string, itemKind: 'asset' | 'liability') => {
    setAppData(prevData => {
      const updatedData = { ...prevData };
      if (itemKind === 'asset') {
        updatedData.assets = prevData.assets.filter(asset => asset.id !== id);
      } else {
        updatedData.liabilities = prevData.liabilities.filter(liability => liability.id !== id);
      }
      
      // Recalculate totals in BASE_CURRENCY
      const newTotalAssetsInBase = updatedData.assets.reduce((sum, asset) => sum + asset.value, 0);
      const newTotalLiabilitiesInBase = updatedData.liabilities.reduce((sum, liability) => sum + liability.value, 0);
      const newNetWorthInBase = newTotalAssetsInBase - newTotalLiabilitiesInBase;

      // Update history with BASE_CURRENCY net worth
      const today = new Date().toISOString().split('T')[0];
      const newHistoryEntry: NetWorthRecord = { date: today, netWorth: newNetWorthInBase };
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
    updateHistory(netWorthInBase); // Pass netWorthInBase
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
  
  // Convert base currency values to display currency for passing to components
  const netWorthForDisplay = convertAmount(netWorthInBase, BASE_CURRENCY, appData.currency);
  const totalAssetsForDisplay = convertAmount(totalAssetsInBase, BASE_CURRENCY, appData.currency);
  const totalLiabilitiesForDisplay = convertAmount(totalLiabilitiesInBase, BASE_CURRENCY, appData.currency);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 md:p-8 space-y-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <NetWorthDisplay 
              netWorth={netWorthForDisplay} 
              totalAssets={totalAssetsForDisplay} 
              totalLiabilities={totalLiabilitiesForDisplay} 
              currency={appData.currency} 
            />
          </div>
          <div className="md:col-span-1">
            <CurrencySelector
                selectedCurrency={appData.currency}
                onCurrencyChange={handleSetCurrency}
                currencies={SUPPORTED_CURRENCIES}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1">
             <AssetLiabilityForm 
               onAddItem={(itemData, itemKind) => handleAddItem(itemData, itemKind)} 
               currency={appData.currency} 
              />
          </div>
          <div className="lg:col-span-1">
            {/* Pass history (netWorth in BASE_CURRENCY) and display currency to graph */}
            <NetWorthGraph history={appData.history} currency={appData.currency} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pass assets (values in BASE_CURRENCY) and display currency to list */}
          <ItemsList items={appData.assets} itemKind="asset" onDeleteItem={handleDeleteItem} currency={appData.currency} />
          {/* Pass liabilities (values in BASE_CURRENCY) and display currency to list */}
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
