// app/components/inventory/InventoryList.tsx
'use client';
import { InventoryItem } from '@/types/inventory';
import InventoryCard from './InventoryCard';

type InventoryListProps = {
  items: InventoryItem[];
};

export default function InventoryList({ items }: InventoryListProps) {
  console.log(items);
  if (items.length === 0) {
    return (
      <div className='text-center py-8 text-gray-500'>재고 항목이 없습니다</div>
    );
  }

  return (
    <div className='space-y-3'>
      {items.map((item) => (
        <InventoryCard key={item.id} item={item} />
      ))}
    </div>
  );
}
