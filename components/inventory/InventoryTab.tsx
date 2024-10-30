// /components/inventory/InventoryTab.tsx
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

type InventoryTabProps = {
  isLoading: boolean;
  selectedTab: 'supplies' | 'food';
  onTabChange(value: 'supplies' | 'food'): void;
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
      onValueChange={(value) => onTabChange(value as 'supplies' | 'food')}
    >
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='supplies' disabled={isLoading}>
          물품
        </TabsTrigger>
        <TabsTrigger value='food' disabled={isLoading}>
          식재료
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
