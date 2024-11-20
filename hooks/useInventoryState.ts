import { $Enums } from '@prisma/client';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import { UploadSupplyItem, UploadFoodItem } from '@/types/inventory';

export function useInventoryState() {
  // 상태 관리
  const [selectedTab, setSelectedTab] = useState<$Enums.InventoryType | 'ALL'>(
    'ALL'
  );
  const [selectedParentLocation, setSelectedParentLocation] =
    useState<string>('전체');
  const [selectedSubLocation, setSelectedSubLocation] =
    useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [counts, setCounts] = useState({
    ALL: 0,
    SUPPLY: 0,
    FOOD: 0,
  });
  const [isSubLocationLoading, setIsSubLocationLoading] = useState(false);

  const fetchCounts = useCallback(async () => {
    const response = await fetch('/api/inventory/counts', {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch counts');
    const data = await response.json();
    console.log('data', data);
    setCounts(data);
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // 위치 데이터 쿼리
  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await fetch('/api/locations');
      if (!response.ok) throw new Error('Failed to fetch locations');
      return response.json();
    },
  });

  // 서브로케이션 fetch
  const fetchSubLocations = useCallback(
    async (parentName: string) => {
      setIsSubLocationLoading(true);
      try {
        const response = await fetch(
          `/api/locations/sub?parent=${encodeURIComponent(
            parentName
          )}&type=${selectedTab}`
        );
        if (!response.ok) throw new Error('Failed to fetch sub locations');
        return await response.json();
      } catch (error) {
        console.error('Error fetching sub locations:', error);
        return [];
      } finally {
        setIsSubLocationLoading(false);
      }
    },
    [selectedTab]
  );

  // 인벤토리 데이터 쿼리
  const { data, fetchNextPage, hasNextPage, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: [
        'inventory',
        selectedTab,
        selectedParentLocation,
        selectedSubLocation,
        searchQuery,
      ],
      queryFn: async ({ pageParam = 1 }) => {
        const params = new URLSearchParams({
          page: String(pageParam),
          limit: '10',
          ...(selectedTab !== 'ALL' && { type: selectedTab }),
          parentLocation: selectedParentLocation,
          subLocation: selectedSubLocation,
          search: searchQuery,
        });
        const response = await fetch(`/api/inventory?${params}`);
        const data = await response.json();
        console.log('data', data);
        return data;
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.items.length < 10) return undefined;
        return lastPage.currentPage + 1;
      },
      initialPageParam: 1,
    });

  // 업로드 핸들러
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

  return {
    selectedTab,
    selectedParentLocation,
    selectedSubLocation,
    searchQuery,
    locations,
    items: data?.pages.flatMap((page) => page.items) ?? [],
    isLoading,
    hasNextPage,
    fetchNextPage,
    setSelectedParentLocation,
    setSelectedSubLocation,
    setSearchQuery,
    handleUpload,
    setSelectedTab,
    counts,
    fetchSubLocations,
    isSubLocationLoading,
  };
}
