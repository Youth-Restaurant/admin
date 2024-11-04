// /app/inventory/page.tsx
'use client';
import { useMemo, Suspense } from 'react';
import { matchKoreanText } from '@/utils/search';
import InventoryHeader from '@/components/inventory/InventoryHeader';
import InventoryList from '@/components/inventory/InventoryList';
import Loading from '@/components/inventory/InventoryLoading';
import { useInventoryState } from '@/hooks/useInventoryState';

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
      <Suspense fallback={<Loading />}>
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
      </Suspense>

      <div className='flex-1 overflow-y-auto p-4'>
        <InventoryList items={filteredAndSearchedItems} />
      </div>
    </div>
  );
}
