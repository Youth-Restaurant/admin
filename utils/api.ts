import { $Enums } from '@prisma/client';

export const getInventoryByType = async (type: $Enums.InventoryType) => {
  const response = await fetch(`/api/inventory?type=${type.toUpperCase()}`);
  return response.json();
};
