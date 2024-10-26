import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Post } from '@/types/post';

type Props = {
  post: Post;
};

const PostPreview = ({ post }: Props) => {
  const router = useRouter();
  const { id, name, content, date, avatarUrl } = post;

  const handleClick = () => {
    router.push(`/notice/${post.id}`);
  };

  return (
    <Card className='max-w-2xl shadow-none' onClick={handleClick}>
      <CardContent className='pt-6'>
        <div className='flex items-start gap-4'>
          {/* Profile Image */}
          <Avatar className='w-12 h-12'>
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>AN</AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className='flex-1'>
            {/* Username */}
            <h2 className='text-lg font-semibold mb-2'>@안윤숙 대표</h2>

            {/* Post Content */}
            <p className='text-gray-800 mb-3'>
              청년식당 오후 5시에 50명, 오후 5시 30분에 20명 예약있습니다.
              모두들 환영해주..
            </p>

            {/* Date */}
            <div className='flex items-center text-gray-500 text-sm'>
              <Calendar className='w-4 h-4 mr-1' />
              <span>2024년 10월 15일</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostPreview;
