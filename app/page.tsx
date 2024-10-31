// app/page.tsx
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import NoticePreview from '@/components/Notice/NoticePreview';
import Loading from './loading';
import CreateNotice from '@/components/Notice/CreateNotice';

async function getNotices() {
  const notices = await prisma.notice.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return notices;
}

export default async function Home() {
  const notices = await getNotices();

  return (
    <div className='container mx-auto px-4'>
      <div className='sticky top-0 bg-white py-4 z-10'>
        <CreateNotice />
      </div>
      <Suspense fallback={<Loading />}>
        <ul className='flex flex-col gap-3 py-[10px]'>
          {notices.map((notice) => (
            <li key={notice.id}>
              <NoticePreview notice={notice} />
            </li>
          ))}
        </ul>
      </Suspense>
    </div>
  );
}
