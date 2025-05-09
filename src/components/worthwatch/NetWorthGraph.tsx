"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import type { NetWorthRecord } from '@/types/worthwatch';
import { Icon } from '@/components/icons';

interface NetWorthGraphProps {
  history: NetWorthRecord[];
}

const chartConfig = {
  netWorth: {
    label: "Net Worth",
    color: "hsl(var(--primary))", // Teal
  },
} satisfies ChartConfig;

const NetWorthGraph: FC<NetWorthGraphProps> = ({ history }) => {
  const formattedHistory = history.map(record => ({
    date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    netWorth: record.netWorth,
  })).sort((a, b) => new Date(history.find(h => new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === a.date)!.date).getTime() - new Date(history.find(h => new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === b.date)!.date).getTime());


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon name="LineChart" className="mr-2 h-6 w-6 text-primary" />
          Net Worth History
        </CardTitle>
        <CardDescription>Track your net worth fluctuations over time.</CardDescription>
      </CardHeader>
      <CardContent>
        {formattedHistory.length < 2 ? (
          <p className="text-muted-foreground">Not enough data to display graph. Add at least two records.</p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedHistory} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value}
                  stroke="hsl(var(--foreground))"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  stroke="hsl(var(--foreground))"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" hideLabel />}
                />
                <Line
                  dataKey="netWorth"
                  type="monotone"
                  stroke="var(--color-netWorth)"
                  strokeWidth={3}
                  dot={true}
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
