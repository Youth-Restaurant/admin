'use client';
import { BellIcon, BoxIcon, Calendar, File } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [selectedIndex, setSelectedIndex] = useState(0); // 선택된 아이템의 인덱스를 추적
  const navItems = [
    { icon: BellIcon, label: '공지사항', href: '/' },
    { icon: BoxIcon, label: '재고관리', href: '/inventory' },
    { icon: Calendar, label: '일정', href: '/schedule' },
    { icon: File, label: '전자결재', href: '/approvals' },
  ];

  return (
    <>
      {navItems.map((item, index) => {
        const IconComponent = item.icon;
        const isActive = pathname === item.href;

        return (
          <li key={index} className='flex flex-col items-center'>
            <Link href={item.href}>
              <div
                className='flex flex-col items-center cursor-pointer'
                onClick={() => setSelectedIndex(index)}
              >
                <IconComponent strokeWidth={isActive ? 2 : 1} />
                <span className={isActive ? 'font-semibold' : ''}>
                  {item.label}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </>
  );
}
