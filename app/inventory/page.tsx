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
    selectedParentLocation,
    selectedSubLocation,
    searchQuery,
    locations,
    items,
    isLoading,
    fetchNextPage,
    hasNextPage,
    counts,
    handleUpload,
    setSelectedTab,
    setSelectedParentLocation,
    setSelectedSubLocation,
    setSearchQuery,
    fetchSubLocations,
    isSubLocationLoading,
  } = useInventoryState();

  const filteredAndSearchedItems = useMemo(() => {
    console.log('items', items);
    if (items === undefined) return [];
    const locationFiltered = items.filter(
      (item) =>
        selectedParentLocation === '전체' ||
        item.parentLocation === selectedParentLocation
    );

    return locationFiltered.filter(
      (item) =>
        matchKoreanText(item.name, searchQuery) ||
        matchKoreanText(item.category, searchQuery) ||
        matchKoreanText(item.location, searchQuery)
    );
  }, [items, selectedParentLocation, searchQuery]);

  return (
    <div className='flex flex-col min-h-full'>
      <InventoryHeader
        selectedTab={selectedTab}
        selectedParentLocation={selectedParentLocation}
        selectedSubLocation={selectedSubLocation}
        searchQuery={searchQuery}
        setSelectedTab={setSelectedTab}
        setSelectedParentLocation={setSelectedParentLocation}
        setSelectedSubLocation={setSelectedSubLocation}
        onSearchChange={setSearchQuery}
        isLoading={isLoading}
        onUpload={handleUpload}
        counts={counts}
        items={items}
        locations={locations}
        fetchSubLocations={fetchSubLocations}
        isSubLocationLoading={isSubLocationLoading}
      />

      <div className='flex-1 px-2'>
        {isLoading && items === undefined ? (
          <InventoryListSkeleton />
        ) : (
          <InventoryList
            items={filteredAndSearchedItems}
            isLoading={isLoading}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          />
        )}
      </div>
    </div>
  );
}
