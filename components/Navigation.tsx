'use client';
import { BellIcon, BoxIcon, Calendar, PaperclipIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type Props = {
  profileImage: string | null | undefined;
};

export default function Navigation({ profileImage }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0); // 선택된 아이템의 인덱스를 추적

  const navItems = [
    { icon: BellIcon, label: '공지사항', href: '/notices' },
    { icon: BoxIcon, label: '재고관리', href: '/inventory' },
    { icon: Calendar, label: '일정', href: '/schedule' },
    { icon: PaperclipIcon, label: '전자결재', href: '/approvals' },
  ];

  return (
    <nav className='absolute right-0 left-0 bottom-0 w-full border-t-[0.3px]'>
      <ul className='flex w-full justify-around py-3'>
        {navItems.map((item, index) => {
          const IconComponent = item.icon;

          return (
            <li key={index} className='flex flex-col items-center'>
              <Link href={item.href}>
                <div
                  className='flex flex-col items-center cursor-pointer'
                  onClick={() => setSelectedIndex(index)}
                >
                  <IconComponent
                    strokeWidth={selectedIndex === index ? 2 : 1}
                  />
                  <span
                    className={selectedIndex === index ? 'font-semibold' : ''}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}

        <li>
          <Link href='/profile'>
            <div className='rounded-full w-11 aspect-square overflow-hidden cursor-pointer'>
              <Image
                alt='프로필 이미지'
                src={profileImage || ''}
                width={100}
                height={100}
              />
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
