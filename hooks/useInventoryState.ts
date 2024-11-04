import { $Enums } from '@prisma/client';
// hooks/useInventoryState.ts
import { useEffect, useState } from 'react';
import {
  InventoryItem,
  UploadSupplyItem,
  UploadFoodItem,
} from '@/types/inventory';
import { getInventoryByType } from '@/utils/api';

export function useInventoryState() {
  const [selectedTab, setSelectedTab] =
    useState<$Enums.InventoryType>('SUPPLY');
  const [selectedLocation, setSelectedLocation] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      setSelectedLocation('전체');
      try {
        const data = await getInventoryByType(selectedTab);
        setItems(data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, [selectedTab]);

  const handleUpload = async (data: UploadSupplyItem | UploadFoodItem) => {
    setIsLoading(true);
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

      const updatedData = await fetch(
        `/api/inventory?type=${selectedTab.toUpperCase()}`
      );
      const items = await updatedData.json();
      setItems(items);
    } catch (error) {
      console.error('Error uploading inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedTab,
    selectedLocation,
    searchQuery,
    items,
    isLoading,
    setItems,
    setSelectedLocation,
    setSearchQuery,
    handleUpload,
    setSelectedTab,
  };
}
