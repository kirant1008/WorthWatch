"use client";
import type { FC } from 'react';
import type { Item as ItemType, AssetType, LiabilityType } from '@/types/worthwatch';
import { ASSET_TYPES, LIABILITY_TYPES } from '@/types/worthwatch';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Icon, type IconName } from '@/components/icons';

interface ItemsListProps {
  items: ItemType[];
  itemKind: 'asset' | 'liability';
  onDeleteItem: (id: string, itemKind: 'asset' | 'liability') => void;
}

const ItemsList: FC<ItemsListProps> = ({ items, itemKind, onDeleteItem }) => {
  const title = itemKind === 'asset' ? 'Assets' : 'Liabilities';
  const itemIconName = itemKind === 'asset' ? 'TrendingUp' : 'ShieldAlert';
  const itemTypes = itemKind === 'asset' ? ASSET_TYPES : LIABILITY_TYPES;

  const getItemIcon = (type: string): IconName => {
    const foundType = itemTypes.find(t => t.value === type);
    return foundType ? foundType.icon as IconName : 'HelpCircle';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell><Icon name={getItemIcon(item.type)} className="h-5 w-5 text-muted-foreground" /></TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.value)}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ItemsList;
