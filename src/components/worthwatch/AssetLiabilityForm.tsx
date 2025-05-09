
"use client";

import type { FC } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Asset, Liability } from '@/types/worthwatch';
import { ASSET_TYPES, LIABILITY_TYPES } from '@/types/worthwatch';
import { Icon } from '@/components/icons';

const formSchema = z.object({
  itemKind: z.enum(['asset', 'liability']),
  name: z.string().min(1, "Name is required"),
  value: z.coerce.number().positive("Value must be positive"), // Value is entered in display currency
  type: z.string().min(1, "Type is required"),
});

type FormData = z.infer<typeof formSchema>;

interface AssetLiabilityFormProps {
  onAddItem: (itemData: Omit<Asset | Liability, 'id' | 'dateAdded'>, itemKind: 'asset' | 'liability') => void;
  currency: string; // Display currency
}

const AssetLiabilityForm: FC<AssetLiabilityFormProps> = ({ onAddItem, currency }) => {
  const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemKind: 'asset',
      name: '',
      value: 0,
      type: '',
    },
  });

  const itemKind = watch('itemKind');
  const itemTypes = itemKind === 'asset' ? ASSET_TYPES : LIABILITY_TYPES;

  const onSubmit = (data: FormData) => {
    // Pass only essential data; id, dateAdded, and conversion to base currency are handled by parent
    const itemData = {
      name: data.name,
      value: data.value, // This value is in the display currency
      type: data.type,
    };
    onAddItem(itemData, data.itemKind);
    reset();
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Icon name="PlusCircle" className="mr-2 h-6 w-6" />
          Add New Item
        </CardTitle>
        <CardDescription>Enter details for a new asset or liability.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="itemKind"
            control={control}
            render={({ field }) => (
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value);
                  // resetField('type'); // Consider resetting type if kind changes and types are incompatible
                }}
                defaultValue={field.value}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="asset" id="asset" />
                  <Label htmlFor="asset" className="font-medium">Asset</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="liability" id="liability" />
                  <Label htmlFor="liability" className="font-medium">Liability</Label>
                </div>
              </RadioGroup>
            )}
          />

          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} placeholder="e.g., Savings Account, Credit Card Debt" />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="value">Value ({currency})</Label>
            <Input id="value" type="number" step="0.01" {...register('value')} placeholder="e.g., 5000.00" />
            {errors.value && <p className="text-sm text-destructive mt-1">{errors.value.message}</p>}
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} key={itemKind} >
                  <SelectTrigger id="type">
                    <SelectValue placeholder={`Select a ${itemKind} type`} />
                  </SelectTrigger>
                  <SelectContent>
                    {itemTypes.map(typeOpt => (
                      <SelectItem key={typeOpt.value} value={typeOpt.value}>
                        <div className="flex items-center">
                           <Icon name={typeOpt.icon as any} className="mr-2 h-4 w-4 text-muted-foreground" />
                          {typeOpt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
          </div>

          <Button type="submit" className="w-full">
            <Icon name="PlusCircle" className="mr-2" /> Add {itemKind === 'asset' ? 'Asset' : 'Liability'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AssetLiabilityForm;
