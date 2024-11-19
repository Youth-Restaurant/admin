// app/components/inventory/InventoryCard.tsx
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { InventoryItem } from '@/types/inventory';
import { formatDateTime } from '@/utils/date';
import Image from 'next/image';
import { useState } from 'react';
import InventoryDetailModal from './InventoryDetailModal';

type InventoryCardProps = {
  item: InventoryItem;
};

export default function InventoryCard({ item }: InventoryCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderQuantity = (quantity: number | undefined) => {
    if (quantity === -1) {
      return <span className='text-red-500'>미입력</span>;
    }
    return quantity;
  };

  return (
    <>
      <Card
        className='shadow-none h-[var(--inventory-card-height)] cursor-pointer hover:bg-gray-50 transition-colors'
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className='p-4'>
          <div className='flex justify-between items-start gap-4'>
            <div className='w-20 flex-shrink-0'>
              <div className='w-20 h-20 relative'>
                {item.imageUrl && !imageError ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className='object-cover rounded'
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className='w-full h-full bg-gray-100 rounded flex items-center justify-center p-2'>
                    <span className='text-gray-500 text-sm text-center'>
                      {item.imageUrl ? '존재하지 않는 이미지' : '미등록'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 mb-1'>
                <h3 className='font-semibold text-lg truncate'>{item.name}</h3>
                {/* <Badge
                  variant={item.status === 'SUFFICIENT' ? 'blue' : 'purple'}
                >
                  {convertEnumToDisplay('status', item.status)}
                </Badge> */}
              </div>
              <div className='text-sm text-gray-500 space-y-1'>
                <p>
                  <span className='font-semibold'>위치:</span>
                  {item.parentLocation}{' '}
                  {item.subLocation && `> ${item.subLocation}`}
                </p>
                <p>
                  <span className='font-semibold'>수량:</span>
                  {renderQuantity(item.quantity)}
                </p>
                <p className='text-xs'>
                  <span className='font-semibold'>최근 수정:</span>
                  {formatDateTime(item.lastUpdated)}
                </p>
              </div>
            </div>
            <Badge variant='outline' className='whitespace-nowrap'>
              {item.category}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <InventoryDetailModal
        item={item}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        imageError={imageError}
        onImageError={() => setImageError(true)}
      />
    </>
  );
}
