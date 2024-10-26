import PostPreview from '@/components/Post/PostPreview';
import { mockPosts } from '@/mocks/posts';

// 공지사항 페이지
export default function Home() {
  return (
    // <DraggableScroll>
    <ul className='flex flex-col gap-3 py-[10px]'>
      {mockPosts.map((post) => (
        <li key={post.id}>
          <PostPreview post={post} />
        </li>
      ))}
    </ul>
    // </DraggableScroll>
  );
}
