// /components/inventory/InventoryHeader.tsx
'use client';
import { Badge } from '@/components/ui/badge';
import {
  InventoryType,
  LOCATIONS,
  UploadFoodItem,
  UploadSupplyItem,
} from '@/types/inventory';
import InventoryUploadModal from '@/components/Modal/InventoryModal';
import { useSession } from 'next-auth/react';
import InventorySearch from './InventorySearch';
import InventoryTab from './InventoryTab';

type InventoryHeaderProps = {
  selectedTab: InventoryType;
  selectedLocation: string;
  searchQuery: string;
  onTabChange: (tab: InventoryType) => void;
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
  const session = useSession();
  const nickname = session.data?.user.nickname;

  if (nickname === undefined) return null;

  return (
    <div className='sticky top-0 bg-white p-4 z-10 border-b'>
      <div className='flex gap-2 mb-4'>
        <InventorySearch
          value={searchQuery}
          onChange={onSearchChange}
          disabled={isLoading}
        />
        <InventoryUploadModal
          isLoading={isLoading}
          onSubmit={onUpload}
          updatedBy={nickname}
        />
      </div>

      <InventoryTab
        isLoading={isLoading}
        selectedTab={selectedTab}
        onTabChange={(value) => onTabChange(value as 'supplies' | 'food')}
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
        {LOCATIONS[selectedTab].map((location) => (
          <Badge
            key={location}
            variant={selectedLocation === location ? 'default' : 'outline'}
            className={`cursor-pointer transition-opacity ${
              isLoading ? 'opacity-50 pointer-events-none' : ''
            }`}
            onClick={() => onLocationChange(location)}
          >
            {location}
          </Badge>
        ))}
      </div>
    </div>
  );
}
