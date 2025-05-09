"use client";

import type { FC } from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getFinancialTips } from '@/ai/flows/financial-tips';
import type { FinancialTipsInput, FinancialTipsOutput } from '@/ai/flows/financial-tips';
import { Icon } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';


interface FinancialTipsProps {
  totalAssets: number;
  totalLiabilities: number;
  currentFinancialGoals: string;
  onUpdateFinancialGoals: (goals: string) => void;
}

const FinancialTips: FC<FinancialTipsProps> = ({ totalAssets, totalLiabilities, currentFinancialGoals, onUpdateFinancialGoals }) => {
  const [tipsOutput, setTipsOutput] = useState<FinancialTipsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetTips = async () => {
    setIsLoading(true);
    setError(null);
    setTipsOutput(null);

    const input: FinancialTipsInput = {
      assets: totalAssets,
      liabilities: totalLiabilities,
      financialGoals: currentFinancialGoals,
    };

    try {
      const result = await getFinancialTips(input);
      setTipsOutput(result);
    } catch (e) {
      console.error("Error fetching financial tips:", e);
      setError("Failed to generate financial tips. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon name="Bot" className="mr-2 h-6 w-6 text-primary" />
          AI Financial Advisor
        </CardTitle>
        <CardDescription>Get personalized financial tips based on your data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="financialGoals">Your Financial Goals</Label>
          <Textarea
            id="financialGoals"
            value={currentFinancialGoals}
            onChange={(e) => onUpdateFinancialGoals(e.target.value)}
            placeholder="e.g., Save for a down payment, pay off debt, invest for retirement..."
            className="min-h-[100px]"
          />
        </div>
        
        <Button onClick={handleGetTips} disabled={isLoading || !currentFinancialGoals} className="w-full">
          {isLoading ? (
            <>
              <Icon name="Bot" className="mr-2 animate-spin" /> Generating Tips...
            </>
          ) : (
            <>
              <Icon name="Bot" className="mr-2" /> Get Financial Tips
            </>
          )}
        </Button>

        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <Icon name="FileWarning" className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {tipsOutput && tipsOutput.tips.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-lg">Here are your personalized tips:</h4>
            <ul className="list-disc list-inside space-y-2 bg-accent/20 p-4 rounded-md">
              {tipsOutput.tips.map((tip, index) => (
                <li key={index} className="text-sm">{tip}</li>
              ))}
            </ul>
          </div>
        )}
         {tipsOutput && tipsOutput.tips.length === 0 && !isLoading && (
           <p className="text-muted-foreground">No specific tips generated. Try refining your goals.</p>
         )}
      </CardContent>
    </Card>
  );
};

export default FinancialTips;
