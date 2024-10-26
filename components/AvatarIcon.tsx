import Image from 'next/image';
import { Avatar, AvatarFallback } from './ui/avatar';
import { getRoleBadgeVariant } from '@/utils/role';
import { $Enums } from '@prisma/client';

type Props = {
  avatarUrl: string;
  name: string;
  role: $Enums.Role;
};

export default function AvatarIcon({ avatarUrl, name, role }: Props) {
  const getFirstCharacter = (name: string): string => {
    return name.charAt(0);
  };

  if (avatarUrl)
    return (
      <div className='aspect-square w-12 h-12 overflow-hidden rounded-full'>
        <Image
          src={avatarUrl}
          alt={name}
          width={48}
          height={48}
          className='h-full w-full object-cover'
          priority
        />
      </div>
    );

  return (
    <Avatar className='w-12 h-12'>
      <AvatarFallback
        className={`bg-${getRoleBadgeVariant(
          role
        )}-500 text-white font-bold bg-opacity-70`}
      >
        {getFirstCharacter(name)}
      </AvatarFallback>
    </Avatar>
  );
}
