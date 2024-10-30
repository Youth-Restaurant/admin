// hooks/useInventoryState.ts
import { useState } from 'react';
import {
  InventoryItem,
  InventoryType,
  UploadSupplyItem,
  UploadFoodItem,
} from '@/types/inventory';

export function useInventoryState() {
  const [selectedTab, setSelectedTab] = useState<InventoryType>('supplies');
  const [selectedLocation, setSelectedLocation] = useState<string>('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = async (tab: InventoryType) => {
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

      const updatedData = await fetch(`/api/inventory?type=${selectedTab}`);
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
    handleTabChange,
    handleUpload,
  };
}
