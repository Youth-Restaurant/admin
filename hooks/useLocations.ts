import { useQuery } from '@tanstack/react-query';
import { InventoryType } from '@prisma/client';
import { LocationItem } from '@/types/inventory';

export function useLocations(type?: InventoryType) {
  return useQuery<LocationItem[]>({
    queryKey: ['locations', type],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (type) params.append('type', type);

      const response = await fetch(`/api/locations?${params}`);
      if (!response.ok) throw new Error('Failed to fetch locations');
      return response.json();
    },
  });
}
