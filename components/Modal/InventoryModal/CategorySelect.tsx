// /components/inventory/CategorySelect.tsx

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  SUPPLY_CATEGORIES,
  FOOD_CATEGORIES,
  InventoryType,
} from '@/types/inventory';
import RequiredIndicator from '@/components/\bRequiredIndicator';

type CategorySelectProps = {
  selectedTab: InventoryType;
  value: string;
  onChange: (e: { name: string; value: string }) => void;
  required?: boolean;
};

export function CategorySelect({
  selectedTab,
  value,
  onChange,
  required = false,
}: CategorySelectProps) {
  const categories =
    selectedTab === 'SUPPLY' ? SUPPLY_CATEGORIES : FOOD_CATEGORIES;

  return (
    <div className='space-y-2'>
      <Label htmlFor='category' className='flex items-center'>
        분류
        {required && <RequiredIndicator />}
      </Label>
      <Select
        name='category'
        value={value}
        onValueChange={(value) => onChange({ name: 'category', value })}
        required={required}
      >
        <SelectTrigger>
          <SelectValue placeholder='분류를 선택하세요' />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
