import { $Enums } from '@prisma/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { UploadSupplyItem, UploadFoodItem } from '@/types/inventory';

export function useInventoryState() {
  const [selectedTab, setSelectedTab] = useState<$Enums.InventoryType | 'ALL'>(
    'ALL'
  );
  const [selectedLocation, setSelectedLocation] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [counts, setCounts] = useState({
    ALL: 0,
    SUPPLY: 0,
    FOOD: 0,
  });
  const [isCountLoading, setIsCountLoading] = useState(true);

  // 각 탭의 총 갯수를 가져오는 함수
  const fetchCounts = async () => {
    setIsCountLoading(true);
    try {
      const [allCount, supplyCount, foodCount] = await Promise.all([
        fetch('/api/inventory/count').then((res) => res.json()),
        fetch('/api/inventory/count?type=SUPPLY').then((res) => res.json()),
        fetch('/api/inventory/count?type=FOOD').then((res) => res.json()),
      ]);

      setCounts({
        ALL: allCount.total,
        SUPPLY: supplyCount.total,
        FOOD: foodCount.total,
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
    } finally {
      setIsCountLoading(false);
    }
  };

  // 초기 로딩 시 카운트 가져오기
  useEffect(() => {
    fetchCounts();
  }, []);

  // 기존의 무한 스크롤 쿼리
  const { data, fetchNextPage, hasNextPage, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: ['inventory', selectedTab, selectedLocation, searchQuery],
      queryFn: async ({ pageParam = 1 }) => {
        const params = new URLSearchParams({
          page: String(pageParam),
          limit: '10',
          ...(selectedTab !== 'ALL' && { type: selectedTab }),
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

  // 업로드 후 카운트도 함께 갱신
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

      // 데이터가 추가된 후 모든 쿼리를 다시 실행
      refetch();
      fetchCounts();
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
    counts,
    isCountLoading,
  };
}
