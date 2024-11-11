// /components/inventory/InventoryHeader.tsx
'use client';
import { Badge } from '@/components/ui/badge';
import {
  getLocationDisplay,
  InventoryType,
  LOCATIONS,
  UploadFoodItem,
  UploadSupplyItem,
  InventoryItem,
} from '@/types/inventory';
import InventoryUploadModal from '@/components/Modal/InventoryModal';
import InventorySearch from './InventorySearch';
import InventoryTab from './InventoryTab';
import { useLocations } from '@/hooks/useLocations';

type InventoryHeaderProps = {
  selectedTab: InventoryType | 'ALL';
  selectedLocation: string;
  searchQuery: string;
  onTabChange: (tab: InventoryType | 'ALL') => void;
  onLocationChange: (location: string) => void;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
  onUpload: (data: UploadSupplyItem | UploadFoodItem) => Promise<void>;
  counts: {
    ALL: number;
    SUPPLY: number;
    FOOD: number;
  };
  items: InventoryItem[];
};

export default function InventoryHeader({
  selectedTab,
  selectedLocation,
  searchQuery,
  onTabChange,
  onLocationChange,
  onSearchChange,
  isLoading = false,
  onUpload,
  counts,
  items,
}: InventoryHeaderProps) {
  const handleTabChange = (value: InventoryType | 'ALL') => {
    onTabChange(value);
    onLocationChange('전체');
  };

  const { data: locations = [] } = useLocations();

  const uniqueLocations = Array.from(
    new Set<string>(
      locations
        .filter((location: { type: InventoryType }) =>
          selectedTab === 'ALL' ? true : location.type === selectedTab
        )
        .map((location: { name: string }) => location.name)
    )
  ).sort((a, b) => a.localeCompare(b, 'ko'));

  return (
    <div className='sticky top-0 bg-white z-10 border-b p-4 h-[var(--inventory-header-height)]'>
      <div className='flex gap-2 mb-4'>
        <InventorySearch value={searchQuery} onChange={onSearchChange} />
        <InventoryUploadModal isLoading={isLoading} onSubmit={onUpload} />
      </div>

      <InventoryTab
        isLoading={isLoading}
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
        showAllTab={true}
        counts={counts}
      />

      <div className='flex gap-2 overflow-x-auto hide-scrollbar'>
        <Badge
          variant={selectedLocation === '전체' ? 'default' : 'outline'}
          className={`cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
          onClick={() => onLocationChange('전체')}
        >
          전체
        </Badge>
        {uniqueLocations.map((locationName) => (
          <Badge
            key={locationName}
            variant={selectedLocation === locationName ? 'default' : 'outline'}
            className={`cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
            onClick={() => onLocationChange(locationName)}
          >
            {locationName}
          </Badge>
        ))}
      </div>
    </div>
  );
}
