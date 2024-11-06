import { $Enums } from '@prisma/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { UploadSupplyItem, UploadFoodItem } from '@/types/inventory';

export function useInventoryState() {
  const [selectedTab, setSelectedTab] =
    useState<$Enums.InventoryType>('SUPPLY');
  const [selectedLocation, setSelectedLocation] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, fetchNextPage, hasNextPage, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: ['inventory', selectedTab, selectedLocation, searchQuery],
      queryFn: async ({ pageParam = 1 }) => {
        const params = new URLSearchParams({
          page: String(pageParam),
          limit: '10',
          type: selectedTab,
          location: selectedLocation,
          search: searchQuery,
        });

        const response = await fetch(`/api/inventory?${params}`);
        const data = await response.json();
        return data;
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.items.length < 10) return undefined;
        return lastPage.currentPage + 1;
      },
      initialPageParam: 1,
    });

  const handleUpload = async (data: UploadSupplyItem | UploadFoodItem) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to upload inventory');
      }

      // 데이터가 추가된 후 쿼리를 다시 실행
      refetch();
    } catch (error) {
      console.error('Error uploading inventory:', error);
    }
  };

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  return {
    selectedTab,
    selectedLocation,
    searchQuery,
    items,
    isLoading,
    hasNextPage,
    fetchNextPage,
    setSelectedLocation,
    setSearchQuery,
    handleUpload,
    setSelectedTab,
  };
}
