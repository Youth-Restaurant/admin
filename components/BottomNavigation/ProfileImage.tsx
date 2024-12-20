// /components/BottomNavigation/ProfileImage.tsx
import { auth } from '@/auth';
import Image from 'next/image';
import Link from 'next/link';

export default async function ProfileImage() {
  const session = await auth();

  return (
    <li>
      <Link href='/my'>
        <div className='rounded-full w-11 aspect-square overflow-hidden cursor-pointer'>
          <Image
            alt='프로필 이미지'
            src={session?.user.image || ''}
            width={100}
            height={100}
            draggable={false}
            priority // lazy loading 비활성화
          />
        </div>
      </Link>
    </li>
  );
}
