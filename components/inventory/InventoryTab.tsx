// /components/inventory/InventoryTab.tsx
import { convertEnumToDisplay, InventoryType } from '@/types/inventory';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { $Enums } from '@prisma/client';

type InventoryTabProps = {
  isLoading: boolean;
  selectedTab: $Enums.InventoryType | 'ALL';
  onTabChange(value: $Enums.InventoryType | 'ALL'): void;
  showAllTab?: boolean;
};

export default function InventoryTab({
  isLoading,
  selectedTab,
  onTabChange,
  showAllTab = true,
}: InventoryTabProps) {
  return (
    <Tabs
      value={selectedTab}
      className='mb-4'
      onValueChange={(value) =>
        onTabChange(value as $Enums.InventoryType | 'ALL')
      }
    >
      <TabsList
        className={`grid w-full ${showAllTab ? 'grid-cols-3' : 'grid-cols-2'}`}
      >
        {showAllTab && (
          <TabsTrigger value='ALL' disabled={isLoading}>
            전체
          </TabsTrigger>
        )}
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
