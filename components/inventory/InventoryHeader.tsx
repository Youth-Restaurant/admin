// /components/inventory/InventoryHeader.tsx
'use client';
import { Badge } from '@/components/ui/badge';
import {
  getLocationDisplay,
  InventoryType,
  LOCATIONS,
  UploadFoodItem,
  UploadSupplyItem,
} from '@/types/inventory';
import InventoryUploadModal from '@/components/Modal/InventoryModal';
import InventorySearch from './InventorySearch';
import InventoryTab from './InventoryTab';

type InventoryHeaderProps = {
  selectedTab: InventoryType | 'ALL';
  selectedLocation: string;
  searchQuery: string;
  onTabChange: (tab: InventoryType | 'ALL') => void;
  onLocationChange: (location: string) => void;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
  onUpload: (data: UploadSupplyItem | UploadFoodItem) => Promise<void>;
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
}: InventoryHeaderProps) {
  const handleTabChange = (value: InventoryType | 'ALL') => {
    onTabChange(value);
    onLocationChange('전체');
  };

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
      />

      <div className='flex gap-2 overflow-x-auto hide-scrollbar'>
        <Badge
          variant={selectedLocation === '전체' ? 'default' : 'outline'}
          className={`cursor-pointer transition-opacity ${
            isLoading ? 'opacity-50 pointer-events-none' : ''
          }`}
          onClick={() => onLocationChange('전체')}
        >
          전체
        </Badge>
        {Array.from(LOCATIONS[selectedTab]).map((location) => (
          <Badge
            key={location}
            variant={selectedLocation === location ? 'default' : 'outline'}
            className={`cursor-pointer transition-opacity ${
              isLoading ? 'opacity-50 pointer-events-none' : ''
            }`}
            onClick={() => onLocationChange(location)}
          >
            {getLocationDisplay(selectedTab, location)}
          </Badge>
        ))}
      </div>
    </div>
  );
}
