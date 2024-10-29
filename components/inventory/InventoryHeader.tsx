// /components/inventory/InventoryHeader.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LOCATIONS } from '@/types/inventory';
import InventorySearch from '@/components/inventory/inventorySearch';

type InventoryHeaderProps = {
  selectedTab: 'supplies' | 'food';
  selectedLocation: string;
  searchQuery: string;
  onTabChange: (tab: 'supplies' | 'food') => void;
  onLocationChange: (location: string) => void;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
};

export default function InventoryHeader({
  selectedTab,
  selectedLocation,
  searchQuery,
  onTabChange,
  onLocationChange,
  onSearchChange,
  isLoading = false,
}: InventoryHeaderProps) {
  return (
    <div className='sticky top-0 bg-white p-4 z-10 border-b'>
      <div className='flex gap-2 mb-4'>
        <InventorySearch
          value={searchQuery}
          onChange={onSearchChange}
          disabled={isLoading}
        />
        <Button className='bg-blue-500 hover:bg-blue-600' disabled={isLoading}>
          <Upload className='w-4 h-4 mr-2' />
          추가
        </Button>
      </div>

      <Tabs
        value={selectedTab}
        className='mb-4'
        onValueChange={(value) => onTabChange(value as 'supplies' | 'food')}
      >
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='supplies' disabled={isLoading}>
            물품
          </TabsTrigger>
          <TabsTrigger value='food' disabled={isLoading}>
            식재료
          </TabsTrigger>
        </TabsList>
      </Tabs>

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
