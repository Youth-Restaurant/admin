import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { convertEnumToDisplay, InventoryItem } from '@/types/inventory';
import { formatDateTime } from '@/utils/date';
import Image from 'next/image';

type InventoryDetailModalProps = {
  item: InventoryItem;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  imageError: boolean;
  onImageError: () => void;
};

export default function InventoryDetailModal({
  item,
  isOpen,
  onOpenChange,
  imageError,
  onImageError,
}: InventoryDetailModalProps) {
  const renderQuantity = (quantity: number | undefined) => {
    if (quantity === -1) {
      return <span className='text-red-500'>미입력</span>;
    }
    return quantity;
  };

  const renderDetailInfo = () => {
    if (item.type === 'SUPPLY') {
      return (
        <>
          {item.manufacturer && (
            <p>
              <span className='font-semibold'>제조사:</span> {item.manufacturer}
            </p>
          )}
          {item.modelNumber && (
            <p>
              <span className='font-semibold'>모델번호:</span>{' '}
              {item.modelNumber}
            </p>
          )}
        </>
      );
    }

    if (item.type === 'FOOD') {
      return (
        <>
          {item.expirationDate && (
            <p>
              <span className='font-semibold'>유통기한:</span>{' '}
              {formatDateTime(item.expirationDate)}
            </p>
          )}
        </>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {item.name}
            <Badge variant={item.status === 'SUFFICIENT' ? 'blue' : 'purple'}>
              {convertEnumToDisplay('status', item.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex justify-center mb-4'>
            <div className='w-32 h-32 relative'>
              {item.imageUrl && !imageError ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className='object-cover rounded'
                  onError={onImageError}
                />
              ) : (
                <div className='w-full h-full bg-gray-100 rounded flex items-center justify-center'>
                  <span className='text-gray-500 text-sm text-center'>
                    {item.imageUrl ? '존재하지 않는 이미지' : '미등록'}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className='space-y-2'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='font-semibold text-sm'>종류:</span>{' '}
              <Badge variant='outline'>{item.category}</Badge>
            </div>
            <div className='text-sm space-y-1'>
              <p>
                <span className='font-semibold'>위치:</span> {item.location}
              </p>
              <p>
                <span className='font-semibold'>수량:</span>{' '}
                {renderQuantity(item.quantity)}
              </p>
              {item.minimumQuantity && (
                <p>
                  <span className='font-semibold'>최소 수량:</span>{' '}
                  {item.minimumQuantity}
                </p>
              )}
              {renderDetailInfo()}
              {item.memo && (
                <p>
                  <span className='font-semibold'>메모:</span> {item.memo}
                </p>
              )}
              <div className='pt-2 space-y-1 text-gray-500'>
                <p>
                  <span className='font-semibold'>등록자:</span>{' '}
                  {item.createdBy}
                </p>
                <p>
                  <span className='font-semibold'>수정자:</span>{' '}
                  {item.updatedBy}
                </p>
                <p>
                  <span className='font-semibold'>최근 수정:</span>{' '}
                  {formatDateTime(item.lastUpdated)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
