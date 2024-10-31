// components/Modal/InventoryModal/LocationSelect.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { InventoryType, LOCATIONS } from '@/types/inventory';
import RequiredIndicator from '@/components/\bRequiredIndicator';

type LocationSelectProps = {
  selectedTab: InventoryType;
  value: string;
  onChange: (e: { name: string; value: string }) => void;
  required?: boolean;
};

export function LocationSelect({
  selectedTab,
  value,
  onChange,
  required = false,
}: LocationSelectProps) {
  return (
    <div className='space-y-2'>
      <Label htmlFor='location' className='flex items-center'>
        위치
        {required && <RequiredIndicator />}
      </Label>
      <Select
        name='location'
        value={value}
        onValueChange={(value) => onChange({ name: 'location', value })}
        required={required}
      >
        <SelectTrigger>
          <SelectValue placeholder='위치를 선택하세요' />
        </SelectTrigger>
        <SelectContent>
          {LOCATIONS[selectedTab].map((location) => (
            <SelectItem key={location} value={location}>
              {location}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
