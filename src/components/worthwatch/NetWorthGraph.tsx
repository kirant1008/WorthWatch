
"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type { NetWorthRecord } from '@/types/worthwatch';
import { SUPPORTED_CURRENCIES } from '@/types/worthwatch';
import { Icon } from '@/components/icons';
import { BASE_CURRENCY, convertAmount } from '@/lib/currencyUtils';

interface NetWorthGraphProps {
  history: NetWorthRecord[]; // NetWorth values in history are in BASE_CURRENCY
  currency: string; // Display currency
}

const chartConfig = {
  netWorth: {
    label: "Net Worth",
    color: "hsl(var(--primary))", // Teal
  },
} satisfies ChartConfig;

const NetWorthGraph: FC<NetWorthGraphProps> = ({ history, currency }) => {
  const formattedHistory = history.map(record => ({
    date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }),
    // Convert netWorth from BASE_CURRENCY to display currency for the chart
    netWorth: convertAmount(record.netWorth, BASE_CURRENCY, currency),
  })).sort((a, b) => {
      // Ensure correct date sorting based on original history dates
      const dateA = history.find(h => new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) === a.date)?.date;
      const dateB = history.find(h => new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) === b.date)?.date;
      if (!dateA || !dateB) return 0;
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

  const currencySymbol = SUPPORTED_CURRENCIES.find(c => c.code === currency)?.symbol ||
                         (SUPPORTED_CURRENCIES.find(c => c.code === BASE_CURRENCY)?.symbol || '$');


  const yAxisTickFormatter = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `${currencySymbol}${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `${currencySymbol}${(value / 1000).toFixed(0)}k`;
    }
    return `${currencySymbol}${value.toFixed(0)}`;
  };
  
  const tooltipValueFormatter = (value: number) => {
     return `${currencySymbol}${Number(value).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon name="LineChart" className="mr-2 h-6 w-6 text-primary" />
          Net Worth History
        </CardTitle>
        <CardDescription>Track your net worth fluctuations over time (in {currency}).</CardDescription>
      </CardHeader>
      <CardContent>
        {formattedHistory.length < 2 ? (
          <p className="text-muted-foreground">Not enough data to display graph. Add at least two records with different dates.</p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedHistory} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="hsl(var(--foreground))"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={yAxisTickFormatter}
                  stroke="hsl(var(--foreground))"
                  domain={['auto', 'auto']} 
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent 
                    indicator="dot" 
                    formatter={(value, name, props) => [tooltipValueFormatter(Number(value)), props.payload.date]}
                    labelFormatter={(_label, payload) => payload && payload.length ? `Net Worth on ${payload[0].payload.date}` : ''}
                  />}
                />
                <Line
                  dataKey="netWorth" // This is already in display currency from formattedHistory
                  type="monotone"
                  stroke="var(--color-netWorth)"
                  strokeWidth={3}
                  dot={true}
                  name={`Net Worth (${currencySymbol})`}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default NetWorthGraph;
