// components/inventory/InventoryListSkeleton.tsx
import { Card, CardContent } from '@/components/ui/card';

export default function InventoryListSkeleton() {
  return (
    <div className='space-y-3'>
      {[...Array(5)].map((_, index) => (
        <Card key={index} className='shadow-none'>
          <CardContent className='p-4'>
            <div className='flex justify-between items-start'>
              <div>
                <div className='flex items-center gap-2 mb-1'>
                  {/* 제목과 상태 배지 skeleton */}
                  <div className='h-6 w-32 bg-gray-200 rounded'></div>
                  <div className='h-5 w-14 bg-gray-200 rounded-full'></div>
                </div>

                {/* 세부 정보 skeleton */}
                <div className='space-y-2 text-sm'>
                  <div className='h-4 w-24 bg-gray-200 rounded'></div>
                  <div className='h-4 w-20 bg-gray-200 rounded'></div>
                  <div className='h-3 w-40 bg-gray-200 rounded text-xs'></div>
                </div>
              </div>

              {/* 카테고리 배지 skeleton */}
              <div className='h-5 w-16 bg-gray-200 rounded-full shrink-0'></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
