// /app/inventory/page.tsx
'use client';
import { useState, useMemo } from 'react';
import { matchKoreanText } from '@/utils/search';
import { InventoryItem } from '@/types/inventory';
import InventoryHeader from '@/components/inventory/InventoryHeader';
import InventoryList from '@/components/inventory/InventoryList';

export default function InventoryPage() {
  const [selectedTab, setSelectedTab] = useState<'supplies' | 'food'>(
    'supplies'
  );
  const [selectedLocation, setSelectedLocation] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = async (tab: 'supplies' | 'food') => {
    setSelectedTab(tab);
    setSelectedLocation('전체');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/inventory?type=${tab}`);
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      <InventoryHeader
        selectedTab={selectedTab}
        selectedLocation={selectedLocation}
        searchQuery={searchQuery}
        onTabChange={handleTabChange}
        onLocationChange={setSelectedLocation}
        onSearchChange={setSearchQuery}
        isLoading={isLoading}
      />

      <div className='flex-1 overflow-y-auto p-4'>
        <InventoryList items={filteredAndSearchedItems} />
      </div>
    </div>
  );
}
