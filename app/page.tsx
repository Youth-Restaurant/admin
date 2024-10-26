import PostPreview from '@/components/Post/PostPreview';
import { mockPosts } from '@/mocks/posts';

// 공지사항 페이지
export default async function Home() {
  return (
    <ul className='flex flex-col gap-3'>
      {mockPosts.map((post) => (
        <li key={post.id}>
          <PostPreview post={post} />
        </li>
      ))}
    </ul>
  );
}
