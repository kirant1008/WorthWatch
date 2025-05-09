import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Icon } from '@/components/icons';

interface NetWorthDisplayProps {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  currency: string;
}

const NetWorthDisplay: FC<NetWorthDisplayProps> = ({ netWorth, totalAssets, totalLiabilities, currency }) => {
  const formatCurrency = (value: number) => {
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(value);
    } catch (error) {
      console.warn(`Invalid currency code: ${currency}. Falling back to USD display.`);
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
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
