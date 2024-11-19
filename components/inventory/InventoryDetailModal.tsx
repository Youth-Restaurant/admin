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
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [createdByUser, setCreatedByUser] = useState<string | null>(null);
  const [updatedByUser, setUpdatedByUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('item.createdBy', item.createdBy);
        console.log('item.updatedBy', item.updatedBy);
        const [createdResponse, updatedResponse] = await Promise.all([
          fetch(`/api/user?id=${item.createdBy}`),
          fetch(`/api/user?id=${item.updatedBy}`),
        ]);

        if (createdResponse.ok) {
          const createdData = await createdResponse.json();
          setCreatedByUser(createdData.nickname);
        }
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setUpdatedByUser(updatedData.nickname);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [item.createdBy, item.updatedBy, isOpen]);

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

  const renderLocation = () => {
    if (!item.parentLocation) {
      return (
        <p>
          <span className='font-semibold'>위치:</span>{' '}
          <Skeleton className='h-4 w-24 inline-block' />
        </p>
      );
    }

    return (
      <p>
        <span className='font-semibold'>위치:</span> {item.parentLocation}
        {item.subLocation && (
          <>
            <span className='mx-1'>{'>'}</span>
            {item.subLocation}
          </>
        )}
      </p>
    );
  };

  const renderUserInfo = (label: string, user: string | null) => {
    return (
      <p>
        <span className='font-semibold'>{label}</span>{' '}
        {user === null ? (
          <Skeleton className='h-4 w-24 inline-block' />
        ) : (
          user || '알 수 없음'
        )}
      </p>
    );
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
              {renderLocation()}
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
                {renderUserInfo('등록자:', createdByUser)}
                {renderUserInfo('수정자:', updatedByUser)}
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
