
"use client";
import type { FC } from 'react';
import type { Item as ItemType } from '@/types/worthwatch';
import { ASSET_TYPES, LIABILITY_TYPES } from '@/types/worthwatch';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Icon, type IconName } from '@/components/icons';
import { BASE_CURRENCY, convertAmount } from '@/lib/currencyUtils';

interface ItemsListProps {
  items: ItemType[]; // Item values are in BASE_CURRENCY
  itemKind: 'asset' | 'liability';
  onDeleteItem: (id: string, itemKind: 'asset' | 'liability') => void;
  currency: string; // Display currency
}

const ItemsList: FC<ItemsListProps> = ({ items, itemKind, onDeleteItem, currency }) => {
  const title = itemKind === 'asset' ? 'Assets' : 'Liabilities';
  const itemIconName = itemKind === 'asset' ? 'TrendingUp' : 'ShieldAlert';
  const itemTypes = itemKind === 'asset' ? ASSET_TYPES : LIABILITY_TYPES;

  const getItemIcon = (type: string): IconName => {
    const foundType = itemTypes.find(t => t.value === type);
    return foundType ? foundType.icon as IconName : 'HelpCircle';
  };

  const formatForDisplay = (valueInDisplayCurrency: number) => {
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valueInDisplayCurrency);
    } catch (error) {
      console.warn(`Invalid currency code for formatting: ${currency}. Falling back to USD display style.`);
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valueInDisplayCurrency);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon name={itemIconName as IconName} className={`mr-2 h-6 w-6 ${itemKind === 'asset' ? 'text-green-500' : 'text-red-500'}`} />
          {title}
        </CardTitle>
        <CardDescription>A list of your current {itemKind.toLowerCase()}s.</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground">No {itemKind.toLowerCase()}s added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px] sm:w-[100px]">Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  // Convert item.value from BASE_CURRENCY to display currency
                  const valueInDisplayCurrency = convertAmount(item.value, BASE_CURRENCY, currency);
                  return (
                    <TableRow key={item.id}>
                      <TableCell><Icon name={getItemIcon(item.type)} className="h-5 w-5 text-muted-foreground" /></TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell className="text-right">{formatForDisplay(valueInDisplayCurrency)}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Delete item">
                              <Icon name="Trash2" className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the item "{item.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => onDeleteItem(item.id, itemKind)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ItemsList;
