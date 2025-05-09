// src/components/worthwatch/CurrencySelector.tsx
"use client";

import type { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Currency } from '@/types/worthwatch';
import { Icon } from '@/components/icons';

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (newCurrency: string) => void;
  currencies: Currency[];
}

const CurrencySelector: FC<CurrencySelectorProps> = ({ selectedCurrency, onCurrencyChange, currencies }) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-lg flex items-center">
          <Icon name="Coins" className="mr-2 h-5 w-5 text-primary" />
          Display Currency
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedCurrency} onValueChange={onCurrencyChange}>
          <SelectTrigger id="currency-select" aria-label="Select display currency">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {`${currency.symbol} - ${currency.name} (${currency.code})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default CurrencySelector;
