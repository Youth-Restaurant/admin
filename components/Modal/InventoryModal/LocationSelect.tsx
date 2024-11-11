// components/Modal/InventoryModal/LocationSelect.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import RequiredIndicator from '@/components/\bRequiredIndicator';
import { $Enums, InventoryType } from '@prisma/client';
import { useLocations } from '@/hooks/useLocations';

type LocationSelectProps = {
  selectedTab: $Enums.InventoryType;
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
  const { data: locations = [] } = useLocations();

  // 선택된 탭에 해당하는 위치만 필터링하고 가나다순 정렬
  const filteredLocations = locations
    .filter(
      (location: { type: InventoryType }) => location.type === selectedTab
    )
    .map((location: { name: string }) => location.name)
    .sort((a: string, b: string) => a.localeCompare(b, 'ko'));

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
          {filteredLocations.map((locationName: string) => (
            <SelectItem key={locationName} value={locationName}>
              {locationName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
