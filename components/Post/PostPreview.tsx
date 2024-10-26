import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Calendar } from 'lucide-react';
import { Post } from '@/types/post';
import { formatDate } from '@/utils/date';
import { Badge, BadgeVariant } from '../ui/badge';
import Link from 'next/link';
import { $Enums } from '@prisma/client';
import Image from 'next/image';
import AvatarIcon from '../AvatarIcon';

type Props = {
  post: Post;
};

const getRoleBadgeVariant = (role: $Enums.Role): BadgeVariant => {
  const variants: Record<$Enums.Role, BadgeVariant> = {
    DIRECTOR: 'orange', // 이사
    CEO: 'yellow', // 대표
    DEPARTMENT: 'purple', // 국장
    TEAM_LEADER: 'purple', // 팀장
    TEACHER: 'blue', // 선생
    STUDENT: 'green', // 학생
    UNKNOWN: 'default',
  };
  return variants[role];
};

const getRoleDisplayName = (role: $Enums.Role): string => {
  const displayNames: Record<$Enums.Role, string> = {
    DIRECTOR: '이사',
    CEO: '대표',
    DEPARTMENT: '국장',
    TEAM_LEADER: '팀장',
    TEACHER: '선생',
    STUDENT: '학생',
    UNKNOWN: '미정',
  };
  return displayNames[role];
};

const getFirstCharacter = (name: string): string => {
  return name.charAt(0);
};

const PostPreview = ({ post }: Props) => {
  const { id, name, role, content, createdAt, avatarUrl } = post;
  const roleColors = getRoleBadgeVariant(role);

  return (
    <Link href={`/notice/${id}`} prefetch={false}>
      <Card className='max-w-2xl shadow-none'>
        <CardContent className='pt-6'>
          <div className='flex items-start gap-4'>
            {/* Profile Image */}
            <AvatarIcon avatarUrl={avatarUrl} name={name} role={role} />

            {/* Content */}
            <div className='flex-1'>
              {/* Username */}
              <h2 className='text-lg font-semibold mb-2 flex gap-2 items-center'>
                {name}{' '}
                <Badge variant={roleColors} className={`font-bold text-white`}>
                  {getRoleDisplayName(role)}
                </Badge>
              </h2>

              {/* Post Content */}
              <p className='text-gray-800 mb-3 line-clamp-1'>{content}</p>

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
