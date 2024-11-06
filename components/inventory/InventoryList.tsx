// app/components/inventory/InventoryList.tsx
'use client';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { InventoryItem } from '@/types/inventory';
import InventoryCard from './InventoryCard';
import InventoryListSkeleton from './InventoryListSkeleton';

type InventoryListProps = {
  items: InventoryItem[];
  isLoading: boolean;
  hasNextPage?: boolean;
  fetchNextPage: () => void;
};

export default function InventoryList({
  items,
  isLoading,
  hasNextPage,
  fetchNextPage,
}: InventoryListProps) {
  const { ref, inView } = useInView({
    threshold: 0.1, // 요소가 10% 이상 보일 때 감지
    rootMargin: '100px', // 요소가 뷰포트 하단 100px 전에 감지
  });

  console.log('inventory list', inView);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) return <InventoryListSkeleton />;

  if (items.length === 0) {
    return (
      <div className='text-center py-8 text-gray-500'>재고 항목이 없습니다</div>
    );
  }

  return (
    <div className='mt-4 overflow-y-auto scrollbar-hide space-y-3'>
      {items.map((item) => (
        <InventoryCard key={item.id} item={item} />
      ))}

      <div ref={ref} className='h-10 flex items-center justify-center'>
        {isLoading && <InventoryListSkeleton />}
        {!hasNextPage && items.length > 0 && (
          <span className='text-gray-500'>더 이상 항목이 없습니다</span>
        )}
      </div>
    </div>
  );
}
