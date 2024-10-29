import { Suspense } from 'react';
import Loading from '@/app/loading';

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='h-full'>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </div>
  );
}
