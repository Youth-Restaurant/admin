// /components/inventory/InventoryTab.tsx
import { convertEnumToDisplay, InventoryType } from '@/types/inventory';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { $Enums } from '@prisma/client';

type InventoryTabProps = {
  isLoading: boolean;
  selectedTab: $Enums.InventoryType;
  onTabChange(value: $Enums.InventoryType): void;
};

export default function InventoryTab({
  isLoading,
  selectedTab,
  onTabChange,
}: InventoryTabProps) {
  return (
    <Tabs
      value={selectedTab}
      className='mb-4'
      onValueChange={(value) => onTabChange(value as $Enums.InventoryType)}
    >
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='SUPPLY' disabled={isLoading}>
          {convertEnumToDisplay('type', 'SUPPLY')}
        </TabsTrigger>
        <TabsTrigger value='FOOD' disabled={isLoading}>
          {convertEnumToDisplay('type', 'FOOD')}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
