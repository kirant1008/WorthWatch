
import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Icon } from '@/components/icons';

interface NetWorthDisplayProps {
  netWorth: number; // Value is expected to be in the `currency` specified
  totalAssets: number; // Value is expected to be in the `currency` specified
  totalLiabilities: number; // Value is expected to be in the `currency` specified
  currency: string; // The display currency code (e.g., "USD", "INR")
}

const NetWorthDisplay: FC<NetWorthDisplayProps> = ({ netWorth, totalAssets, totalLiabilities, currency }) => {
  // This component now assumes the passed values (netWorth, totalAssets, totalLiabilities)
  // are ALREADY in the 'currency' (display currency).
  // Conversion from BASE_CURRENCY to display currency happens in the parent (page.tsx).

  const formatCurrency = (value: number) => {
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    } catch (error) {
      console.warn(`Invalid currency code for formatting: ${currency}. Falling back to USD display style.`);
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-primary flex items-center">
          <Icon name="DollarSign" className="mr-2 h-7 w-7" />
          Current Net Worth
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={`text-5xl font-extrabold mb-4 ${netWorth >= 0 ? 'text-accent' : 'text-destructive'}`}>
          {formatCurrency(netWorth)}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <div>
            <CardDescription className="flex items-center mb-1">
              <Icon name="TrendingUp" className="mr-2 h-5 w-5 text-green-500" />
              Total Assets
            </CardDescription>
            <p className="font-semibold">{formatCurrency(totalAssets)}</p>
          </div>
          <div>
            <CardDescription className="flex items-center mb-1">
              <Icon name="TrendingDown" className="mr-2 h-5 w-5 text-red-500" />
              Total Liabilities
            </CardDescription>
            <p className="font-semibold">{formatCurrency(totalLiabilities)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetWorthDisplay;
