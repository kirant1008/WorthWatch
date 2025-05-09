"use client";

import { useState, useEffect, useMemo } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import type { AppData, Asset, Liability, NetWorthRecord } from '@/types/worthwatch';
import Header from '@/components/worthwatch/Header';
import NetWorthDisplay from '@/components/worthwatch/NetWorthDisplay';
import AssetLiabilityForm from '@/components/worthwatch/AssetLiabilityForm';
import ItemsList from '@/components/worthwatch/ItemsList';
import NetWorthGraph from '@/components/worthwatch/NetWorthGraph';
import FinancialTips from '@/components/worthwatch/FinancialTips';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button'; // For manual snapshot

const initialAppData: AppData = {
  assets: [],
  liabilities: [],
  history: [],
  financialGoals: "",
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
        // Update today's entry if it exists
        updatedHistory[todayEntryIndex] = newHistoryEntry;
      } else {
        // Add new entry
        updatedHistory.push(newHistoryEntry);
      }
      // Keep history sorted by date (optional, graph can sort too)
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
      const newTotalAssets = itemKind === 'asset' ? totalAssets + item.value : totalAssets;
      const newTotalLiabilities = itemKind === 'liability' ? totalLiabilities + item.value : totalLiabilities;
      updateHistory(newTotalAssets - newTotalLiabilities); // Update history after state is set
      return updatedData;
    });
    toast({ title: `${itemKind === 'asset' ? 'Asset' : 'Liability'} added`, description: `"${item.name}" has been successfully added.` });
  };

  const handleDeleteItem = (id: string, itemKind: 'asset' | 'liability') => {
    setAppData(prevData => {
      const updatedData = { ...prevData };
      let itemValue = 0;
      if (itemKind === 'asset') {
        const assetToRemove = prevData.assets.find(a => a.id === id);
        if (assetToRemove) itemValue = assetToRemove.value;
        updatedData.assets = prevData.assets.filter(asset => asset.id !== id);
      } else {
        const liabilityToRemove = prevData.liabilities.find(l => l.id === id);
        if (liabilityToRemove) itemValue = liabilityToRemove.value;
        updatedData.liabilities = prevData.liabilities.filter(liability => liability.id !== id);
      }
      const newTotalAssets = itemKind === 'asset' ? totalAssets - itemValue : totalAssets;
      const newTotalLiabilities = itemKind === 'liability' ? totalLiabilities - itemValue : totalLiabilities;
      updateHistory(newTotalAssets - newTotalLiabilities);
      return updatedData;
    });
    toast({ title: `${itemKind === 'asset' ? 'Asset' : 'Liability'} deleted`, description: `The item has been successfully deleted.`, variant: "destructive" });
  };
  
  const handleUpdateFinancialGoals = (goals: string) => {
    setAppData(prevData => ({ ...prevData, financialGoals: goals }));
  };

  const handleManualSnapshot = () => {
    updateHistory(netWorth);
    toast({ title: "Net Worth Snapshot Created", description: "Current net worth has been recorded in history." });
  };

  // Effect to update history whenever netWorth changes (debounced or throttled in a real app if too frequent)
  // For this version, it updates on add/delete. A manual snapshot button is also good.
  // useEffect(() => {
  //  if(isClient) updateHistory(netWorth);
  //}, [netWorth, isClient]); // Careful with this, might run too often. Controlled updates are better.


  if (!isClient) {
    // Render a loading state or null on the server to avoid hydration mismatch
    // as localStorage is not available on the server.
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
        <NetWorthDisplay netWorth={netWorth} totalAssets={totalAssets} totalLiabilities={totalLiabilities} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
             <AssetLiabilityForm onAddItem={handleAddItem} />
          </div>
          <div className="lg:col-span-2">
            <FinancialTips 
              totalAssets={totalAssets} 
              totalLiabilities={totalLiabilities}
              currentFinancialGoals={appData.financialGoals}
              onUpdateFinancialGoals={handleUpdateFinancialGoals}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ItemsList items={appData.assets} itemKind="asset" onDeleteItem={handleDeleteItem} />
          <ItemsList items={appData.liabilities} itemKind="liability" onDeleteItem={handleDeleteItem} />
        </div>
        
        <NetWorthGraph history={appData.history} />

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
