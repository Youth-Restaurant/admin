import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Calendar } from 'lucide-react';
import { Post } from '@/types/post';
import { formatDate } from '@/utils/date';
import { Badge, BadgeVariant } from '../ui/badge';
import { Role } from '@/types/user';
import Link from 'next/link';

type Props = {
  post: Post;
};

const getRoleBadgeVariant = (role: Role): BadgeVariant => {
  const variants: Record<Role, BadgeVariant> = {
    이사: 'orange', // 주황색으로 변경
    대표: 'yellow', // 노란색으로 변경
    국장: 'purple', // 보라색
    선생: 'blue', // 파란색
    학생: 'green', // 초록색
  };
  return variants[role];
};

const PostPreview = ({ post }: Props) => {
  const { id, name, role, content, createdAt, avatarUrl } = post;

  return (
    <Link href={`/notice/${id}`} prefetch={false}>
      <Card className='max-w-2xl shadow-none'>
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
              <h2 className='text-lg font-semibold mb-2 flex gap-2 items-center'>
                {name}{' '}
                <Badge
                  variant={getRoleBadgeVariant(role)}
                  className='font-bold text-white'
                >
                  {role}
                </Badge>
              </h2>

              {/* Post Content */}
              <p className='text-gray-800 mb-3'>{content}</p>

              {/* Date */}
              <div className='flex items-center text-gray-500 text-sm'>
                <Calendar className='w-4 h-4 mr-1' />
                <span>{formatDate(createdAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PostPreview;
