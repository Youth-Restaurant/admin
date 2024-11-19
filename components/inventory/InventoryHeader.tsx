// /components/inventory/InventoryHeader.tsx
'use client';
import { Badge } from '@/components/ui/badge';
import {
  InventoryType,
  UploadFoodItem,
  UploadSupplyItem,
  InventoryItem,
} from '@/types/inventory';
import InventoryUploadModal from '@/components/Modal/InventoryModal';
import InventorySearch from './InventorySearch';
import InventoryTab from './InventoryTab';
import { useState, useEffect } from 'react';

type InventoryHeaderProps = {
  selectedTab: InventoryType | 'ALL';
  selectedParentLocation: string;
  selectedSubLocation: string;
  searchQuery: string;
  setSelectedTab: (value: InventoryType | 'ALL') => void;
  setSelectedParentLocation: (value: string) => void;
  setSelectedSubLocation: (value: string) => void;
  fetchSubLocations: (
    parent: string,
    sub: string
  ) => Promise<{ name: string }[]>;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
  onUpload: (data: UploadSupplyItem | UploadFoodItem) => Promise<void>;
  counts: {
    ALL: number;
    SUPPLY: number;
    FOOD: number;
  };
  items: InventoryItem[];
  locations: { name: string; type: InventoryType }[];
};

export default function InventoryHeader({
  selectedTab,
  selectedParentLocation,
  selectedSubLocation,
  searchQuery,
  setSelectedTab,
  setSelectedParentLocation,
  setSelectedSubLocation,
  onSearchChange,
  isLoading = false,
  onUpload,
  counts,
  locations,
  fetchSubLocations,
}: InventoryHeaderProps) {
  const [subLocations, setSubLocations] = useState<string[]>([]);
  const [filteredLocations, setFilteredLocations] = useState(locations);

  const handleParentLocationClick = async (locationName: string) => {
    setSelectedParentLocation(locationName);
    if (locationName === '전체') {
      setSubLocations([]);
    } else {
      const subLocs = await fetchSubLocations(
        locationName,
        selectedSubLocation
      );
      setSubLocations(subLocs?.map((loc: { name: string }) => loc.name) || []);
    }
  };

  const handleTabChange = (value: InventoryType | 'ALL') => {
    setSelectedTab(value);
    setSelectedParentLocation('전체');
    setSelectedSubLocation('전체');
    setSubLocations([]);

    if (value === 'ALL') {
      const uniqueLocations = Array.from(
        new Set(locations.map((loc) => loc.name))
      )
        .map((name) => ({
          name,
          type: locations.find((loc) => loc.name === name)?.type || 'SUPPLY',
        }))
        .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
      setFilteredLocations(uniqueLocations);
    } else {
      const filteredLocations = locations
        .filter((location) => location.type === value)
        .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
      setFilteredLocations(filteredLocations);
    }
  };

  useEffect(() => {
    if (selectedTab === 'ALL') {
      const uniqueLocations = Array.from(
        new Set(locations.map((loc) => loc.name))
      )
        .map((name) => ({
          name,
          type: locations.find((loc) => loc.name === name)?.type || 'SUPPLY',
        }))
        .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
      setFilteredLocations(uniqueLocations);
    } else {
      const filteredLocations = locations
        .filter((location) => location.type === selectedTab)
        .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
      setFilteredLocations(filteredLocations);
    }
  }, [locations, selectedTab]);

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

      <div className='flex flex-col gap-2'>
        <div className='flex gap-2 overflow-x-auto hide-scrollbar'>
          <Badge
            variant={selectedParentLocation === '전체' ? 'default' : 'outline'}
            className={`cursor-pointer shrink-0 min-w-fit ${
              isLoading ? 'opacity-50' : ''
            }`}
            onClick={() => {
              handleParentLocationClick('전체');
              setSelectedSubLocation('전체');
            }}
          >
            전체
          </Badge>
          {filteredLocations.map(
            (location: { name: string; type: InventoryType }) => (
              <Badge
                key={location.name}
                variant={
                  selectedParentLocation === location.name
                    ? 'default'
                    : 'outline'
                }
                className={`cursor-pointer shrink-0 min-w-fit ${
                  isLoading ? 'opacity-50' : ''
                }`}
                onClick={() => {
                  handleParentLocationClick(location.name);
                  setSelectedSubLocation('전체');
                }}
              >
                {location.name}
              </Badge>
            )
          )}
        </div>

        <div className='flex gap-2 overflow-x-auto hide-scrollbar pl-4'>
          <Badge
            variant={selectedSubLocation === '전체' ? 'default' : 'outline'}
            className={`cursor-pointer shrink-0 min-w-fit ${
              isLoading ? 'opacity-50' : ''
            }`}
            onClick={() => setSelectedSubLocation('전체')}
          >
            전체
          </Badge>
          {subLocations.map((locationName) => (
            <Badge
              key={locationName}
              variant={
                selectedSubLocation === locationName ? 'default' : 'outline'
              }
              className={`cursor-pointer shrink-0 min-w-fit ${
                isLoading ? 'opacity-50' : ''
              }`}
              onClick={() => {
                setSelectedSubLocation(locationName);
              }}
            >
              {locationName}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
