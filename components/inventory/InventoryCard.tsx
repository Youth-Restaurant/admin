// app/components/inventory/InventoryCard.tsx
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { InventoryItem } from '@/types/inventory';

type InventoryCardProps = {
  item: InventoryItem;
};

export default function InventoryCard({ item }: InventoryCardProps) {
  return (
    <Card className='shadow-none'>
      <CardContent className='p-4'>
        <div className='flex justify-between items-start'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <h3 className='font-semibold text-lg'>{item.name}</h3>
              <Badge variant={item.status === '충분' ? 'blue' : 'purple'}>
                {item.status}
              </Badge>
            </div>
            <div className='text-sm text-gray-500 space-y-1'>
              <p>위치: {item.location}</p>
              <p>수량: {item.quantity}</p>
              <p className='text-xs'>
                최종 수정: {new Date(item.lastUpdated).toLocaleDateString()} by{' '}
                {item.updatedBy}
              </p>
            </div>
          </div>
          <Badge variant='outline'>{item.category}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
