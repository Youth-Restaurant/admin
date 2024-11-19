// components/Modal/InventoryModal/LocationSelect.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { InventoryType } from '@/types/inventory';
import { useLocations } from '@/hooks/useLocations';
import { useState, useEffect, useCallback } from 'react';
import RequiredIndicator from '@/components/\bRequiredIndicator';

type LocationSelectProps = {
  selectedTab: InventoryType;
  onChange: (e: { name: string; value: string }) => void;
  required?: boolean;
};

export function LocationSelect({
  selectedTab,
  onChange,
  required = false,
}: LocationSelectProps) {
  const [selectedParent, setSelectedParent] = useState<string>('');
  const [selectedSub, setSelectedSub] = useState<string>('');
  const [subLocations, setSubLocations] = useState<string[]>([]);
  const { data: parentLocations = [] } = useLocations(selectedTab);
  const hasSubLocations = subLocations.length > 0;

  const fetchSubLocations = useCallback(
    async (parentName: string) => {
      try {
        const response = await fetch(
          `/api/locations/sub?parent=${encodeURIComponent(
            parentName
          )}&type=${selectedTab}`
        );
        if (!response.ok) throw new Error('Failed to fetch sub locations');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching sub locations:', error);
        return [];
      }
    },
    [selectedTab]
  );

  const handleSubLocationChange = useCallback(
    (value: string) => {
      setSelectedSub(value);
      onChange({ name: 'subLocation', value });
    },
    [onChange]
  );

  const handleParentChange = useCallback(
    async (value: string) => {
      setSelectedParent(value);
      onChange({ name: 'parentLocation', value });

      const subLocs = await fetchSubLocations(value);
      const subLocNames = subLocs.map((loc: { name: string }) => loc.name);
      setSubLocations(subLocNames);

      if (subLocNames.length > 0) {
        handleSubLocationChange(subLocNames[0]);
      }
    },
    [fetchSubLocations, handleSubLocationChange, onChange]
  );

  useEffect(() => {
    if (parentLocations.length > 0 && !selectedParent) {
      const firstParent = parentLocations[0].name;
      handleParentChange(firstParent);
    }
  }, [parentLocations, selectedTab, handleParentChange, selectedParent]);

  useEffect(() => {
    setSelectedParent('');
    setSubLocations([]);
  }, [selectedTab]);

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='parentLocation' className='flex items-center'>
          상위 위치
          {required && <RequiredIndicator />}
        </Label>
        <Select
          name='parentLocation'
          value={selectedParent}
          onValueChange={handleParentChange}
          required={required}
        >
          <SelectTrigger>
            <SelectValue placeholder='상위 위치를 선택하세요' />
          </SelectTrigger>
          <SelectContent>
            {parentLocations.map((location: { name: string }) => (
              <SelectItem key={location.name} value={location.name}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasSubLocations && (
        <div className='space-y-2'>
          <Label htmlFor='subLocation' className='flex items-center'>
            하위 위치
            {required && <RequiredIndicator />}
          </Label>
          <Select
            name='subLocation'
            value={selectedSub}
            onValueChange={handleSubLocationChange}
            required={required}
          >
            <SelectTrigger>
              <SelectValue placeholder='하위 위치를 선택하세요' />
            </SelectTrigger>
            <SelectContent>
              {subLocations.map((locationName: string) => (
                <SelectItem key={locationName} value={locationName}>
                  {locationName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
