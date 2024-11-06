// components/inventory/InventoryListSkeleton.tsx
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('bg-gray-200 rounded animate-pulse', className)}
      {...props}
    />
  );
};

export default function InventoryListSkeleton() {
  return (
    <div className='space-y-3 mt-4'>
      {[...Array(5)].map((_, index) => (
        <Card key={index} className='shadow-none'>
          <CardContent className='p-4'>
            <div className='flex justify-between items-start'>
              <div>
                <div className='flex items-center gap-2 mb-1'>
                  <Skeleton className='h-6 w-32' />
                  <Skeleton className='h-5 w-14 rounded-full' />
                </div>

                <div className='space-y-2 text-sm'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-3 w-40 text-xs' />
                </div>
              </div>

              <Skeleton className='h-5 w-16 rounded-full shrink-0' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
