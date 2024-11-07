// app/components/inventory/InventoryList.tsx
'use client';
import { FixedSizeList } from 'react-window';
import { useInView } from 'react-intersection-observer';
import { useEffect, useRef, useState } from 'react';
import { InventoryItem } from '@/types/inventory';
import InventoryCard from './InventoryCard';
import InventoryListSkeleton from './InventoryListSkeleton';
import EmptyBox from '@/components/common/EmptyBox';

type InventoryListProps = {
  items: InventoryItem[];
  isLoading: boolean;
  hasNextPage?: boolean;
  fetchNextPage: () => void;
};

type RowProps = {
  index: number;
  style: React.CSSProperties;
  data: {
    items: InventoryItem[];
    lastItemRef: (node?: Element | null) => void;
  };
};

const Row = ({ index, style, data }: RowProps) => {
  const { items, lastItemRef } = data;
  const isLastItem = index === items.length - 1;

  return (
    <div
      ref={isLastItem ? lastItemRef : undefined}
      style={{
        ...style,
        padding: '10px 0',
      }}
    >
      <InventoryCard item={items[index]} />
      {isLastItem && (
        <EmptyBox message='모든 재고를 확인했어요!' className='-mt-10 pb-10' />
      )}
    </div>
  );
};

export default function InventoryList({
  items,
  isLoading,
  hasNextPage,
  fetchNextPage,
}: InventoryListProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [itemSize, setItemSize] = useState(0);
  const [gapSize, setGapSize] = useState(0);

  useEffect(() => {
    const cardHeight = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--inventory-card-height')
        .trim()
    );
    const cardGap = parseInt(
      getComputedStyle(document.documentElement)
        .getPropertyValue('--inventory-card-gap')
        .trim()
    );

    setItemSize(cardHeight);
    setGapSize(cardGap);
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [items.length]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading && items.length === 0) return <InventoryListSkeleton />;

  if (items.length === 0) {
    return <EmptyBox message='재고 항목이 없습니다' className='py-8' />;
  }

  return (
    <div
      ref={containerRef}
      className='h-[calc(100vh-var(--header-height)-var(--bottom-nav-height)-var(--inventory-header-height))]'
    >
      <FixedSizeList
        height={containerHeight}
        itemCount={items.length}
        itemSize={itemSize + gapSize}
        width='100%'
        itemData={{ items, lastItemRef: ref }}
        className='scrollbar-hide'
      >
        {Row}
      </FixedSizeList>
    </div>
  );
}
