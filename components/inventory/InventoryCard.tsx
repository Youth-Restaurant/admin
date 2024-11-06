// app/components/inventory/InventoryCard.tsx
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  convertEnumToDisplay,
  filterLocationEnumForDisplay,
  InventoryItem,
} from '@/types/inventory';
import { formatDateTime } from '@/utils/date';
import Image from 'next/image';

type InventoryCardProps = {
  item: InventoryItem;
};

export default function InventoryCard({ item }: InventoryCardProps) {
  return (
    <Card className='shadow-none'>
      <CardContent className='p-4'>
        <div className='flex justify-between items-start gap-4'>
          <div className='w-20 flex flex-col items-center flex-shrink-0'>
            <div className='w-20 h-20 relative'>
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className='object-cover rounded'
                />
              ) : (
                <div className='w-full h-full bg-gray-100 rounded' />
              )}
            </div>
            {!item.imageUrl && (
              <span className='text-gray-500 text-sm mt-1'>미등록</span>
            )}
          </div>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-1'>
              <h3 className='font-semibold text-lg'>{item.name}</h3>
              <Badge variant={item.status === 'SUFFICIENT' ? 'blue' : 'purple'}>
                {convertEnumToDisplay('status', item.status)}
              </Badge>
            </div>
            <div className='text-sm text-gray-500 space-y-1'>
              <p>위치: {filterLocationEnumForDisplay(item.location)}</p>
              <p>수량: {item.quantity}</p>
              <p className='text-xs'>
                최근 수정: {formatDateTime(item.lastUpdated)}
              </p>
            </div>
          </div>
          <Badge variant='outline' className='whitespace-nowrap'>
            {item.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
