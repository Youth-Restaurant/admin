// components/inventory/InventoryLoading.tsx
export default function InventoryLoading() {
  return (
    <div className='h-full flex flex-col'>
      {/* Header Skeleton */}
      <div className='sticky top-0 bg-white p-4 z-10 border-b space-y-4'>
        <div className='flex gap-2 mb-4'>
          <div className='h-10 flex-1 bg-gray-100 animate-pulse rounded' />
          <div className='h-10 w-24 bg-gray-100 animate-pulse rounded' />
        </div>
        <div className='h-10 w-full bg-gray-100 animate-pulse rounded' />
        <div className='flex gap-2 overflow-x-auto'>
          <div className='h-6 w-16 bg-gray-100 animate-pulse rounded-full' />
          <div className='h-6 w-16 bg-gray-100 animate-pulse rounded-full' />
          <div className='h-6 w-16 bg-gray-100 animate-pulse rounded-full' />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className='flex-1 p-4 space-y-4'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='w-full h-32 bg-white rounded-lg border p-4 space-y-2'
          >
            <div className='flex justify-between items-start'>
              <div className='space-y-2 flex-1'>
                <div className='h-6 bg-gray-100 animate-pulse rounded w-1/3' />
                <div className='h-4 bg-gray-100 animate-pulse rounded w-1/2' />
                <div className='h-4 bg-gray-100 animate-pulse rounded w-1/4' />
              </div>
              <div className='h-6 w-20 bg-gray-100 animate-pulse rounded-full' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
