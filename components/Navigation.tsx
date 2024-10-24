'use client';
import { BellIcon, BoxIcon, Calendar, PaperclipIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type Props = {
  profileImage: string | null | undefined;
};

export default function Navigation({ profileImage }: Props) {
  const [selectedIndex, setSelectedIndex] = useState(0); // 선택된 아이템의 인덱스를 추적

  const navItems = [
    { icon: BellIcon, label: '공지사항' },
    { icon: BoxIcon, label: '재고관리' },
    { icon: Calendar, label: '일정' },
    { icon: PaperclipIcon, label: '전자결재' },
  ];

  return (
    <nav className='absolute right-0 left-0 bottom-0 w-full border-t-[0.3px]'>
      <ul className='flex w-full justify-around py-3'>
        {navItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <li
              key={index}
              className='flex flex-col items-center cursor-pointer'
              onClick={() => setSelectedIndex(index)} // 아이템 클릭 시 선택 상태 업데이트
            >
              <IconComponent
                strokeWidth={selectedIndex === index ? 1.5 : 1} // 선택되면 굵게, 아니면 얇게
              />
              <span className={selectedIndex === index ? 'font-semibold' : ''}>
                {item.label}
              </span>
            </li>
          );
        })}
        <li>
          <div className='rounded-full w-11 aspect-square overflow-hidden'>
            <Image
              alt='프로필 이미지'
              src={profileImage || ''}
              width={100}
              height={100}
            />
          </div>
        </li>
      </ul>
    </nav>
  );
}
