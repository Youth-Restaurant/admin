// app/page.tsx
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import PostPreview from '@/components/Post/PostPreview';
import Loading from './loading';
import CreatePost from '@/components/Post/CreatePost';

async function getPosts() {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return posts;
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className='container mx-auto px-4'>
      <div className='sticky top-0 bg-white py-4 z-10'>
        <CreatePost />
      </div>
      <Suspense fallback={<Loading />}>
        <ul className='flex flex-col gap-3 py-[10px]'>
          {posts.map((post) => (
            <li key={post.id}>
              <PostPreview post={post} />
            </li>
          ))}
        </ul>
      </Suspense>
    </div>
  );
}
