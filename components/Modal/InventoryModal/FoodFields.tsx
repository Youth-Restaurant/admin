// /components/modal/InventoryModal/FoodFields.tsx
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { UploadFoodItem } from '@/types/inventory';

type FoodFields = Omit<
  UploadFoodItem,
  'name' | 'quantity' | 'updatedBy' | 'status'
>;

type FoodFieldsProps = {
  fields: FoodFields;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function FoodFields({ fields, onChange }: FoodFieldsProps) {
  return (
    <div className='space-y-2'>
      <Label htmlFor='expirationDate'>유통기한</Label>
      <Input
        id='expirationDate'
        name='expirationDate'
        type='date'
        value={fields.expirationDate}
        onChange={onChange}
      />
    </div>
  );
}
