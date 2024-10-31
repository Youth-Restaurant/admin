// /components/inventory/InventoryTab.tsx
import { convertEnumToDisplay, InventoryType } from '@/types/inventory';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

type InventoryTabProps = {
  isLoading: boolean;
  selectedTab: InventoryType;
  onTabChange(value: InventoryType): void;
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
      onValueChange={(value) => onTabChange(value as InventoryType)}
    >
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='supply' disabled={isLoading}>
          {convertEnumToDisplay('type', 'supply')}
        </TabsTrigger>
        <TabsTrigger value='food' disabled={isLoading}>
          {convertEnumToDisplay('type', 'food')}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
