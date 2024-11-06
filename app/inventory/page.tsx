// /app/inventory/page.tsx
'use client';
import { useMemo } from 'react';
import { matchKoreanText } from '@/utils/search';
import InventoryHeader from '@/components/inventory/InventoryHeader';
import InventoryList from '@/components/inventory/InventoryList';
import { useInventoryState } from '@/hooks/useInventoryState';
import InventoryListSkeleton from '@/components/inventory/InventoryListSkeleton';

export default function InventoryPage() {
  const {
    selectedTab,
    selectedLocation,
    searchQuery,
    items,
    isLoading,
    setSelectedLocation,
    setSearchQuery,
    handleUpload,
    setSelectedTab,
  } = useInventoryState();

  const filteredAndSearchedItems = useMemo(() => {
    if (items === undefined) return [];
    const locationFiltered = items.filter(
      (item) =>
        selectedLocation === '전체' || item.location === selectedLocation
    );

    return locationFiltered.filter(
      (item) =>
        matchKoreanText(item.name, searchQuery) ||
        matchKoreanText(item.category, searchQuery) ||
        matchKoreanText(item.location, searchQuery)
    );
  }, [items, selectedLocation, searchQuery]);

  return (
    <div className='flex flex-col h-full'>
      <InventoryHeader
        selectedTab={selectedTab}
        selectedLocation={selectedLocation}
        searchQuery={searchQuery}
        onTabChange={setSelectedTab}
        onLocationChange={setSelectedLocation}
        onSearchChange={setSearchQuery}
        isLoading={isLoading}
        onUpload={handleUpload}
      />

      <div className='flex-1 px-4'>
        {isLoading && items === undefined ? (
          <InventoryListSkeleton />
        ) : (
          <InventoryList items={filteredAndSearchedItems} />
        )}
      </div>
    </div>
  );
}
