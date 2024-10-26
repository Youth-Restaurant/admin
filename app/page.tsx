'use client';
import { auth } from '@/auth';
import PostPreview from '@/components/Post/PostPreview';
import { Post } from '@/types/post';

export const mockPosts: Post[] = [
  {
    id: 1,
    name: '안윤숙',
    role: '대표',
    content:
      '청년식당 오후 5시에 50명, 오후 5시 30분에 20명 예약있습니다. 모두들 환영해주..',
    date: '2024년 10월 15일',
    avatarUrl: '/api/placeholder/48/48',
  },
  {
    id: 2,
    name: '김영희',
    role: '선생',
    content:
      '오늘 저녁 특별 메뉴: 제철 해산물을 활용한 파스타 코스 준비했습니다. 많은 관심 부탁드립니다.',
    date: '2024년 10월 15일',
    avatarUrl: '/api/placeholder/48/48',
  },
  {
    id: 3,
    name: '이상철',
    role: '이사',
    content:
      '내일 와인 페어링 이벤트 준비 완료! 소믈리에와 함께하는 특별한 저녁 식사에 여러분을 초대합니다.',
    date: '2024년 10월 15일',
    avatarUrl: '/api/placeholder/48/48',
  },
  {
    id: 4,
    name: '박지민',
    role: '국장',
    content:
      '주말 브런치 예약이 시작되었습니다. 테라스 좌석도 준비되어 있으니 많은 관심 부탁드려요.',
    date: '2024년 10월 15일',
    avatarUrl: '/api/placeholder/48/48',
  },
  {
    id: 5,
    name: '최다인',
    role: '학생',
    content:
      '금요일 라이브 재즈 공연과 함께하는 디너 코스 예약하세요. 특별한 밤을 선사해드립니다.',
    date: '2024년 10월 15일',
    avatarUrl: '/api/placeholder/48/48',
  },
  {
    id: 6,
    name: '정민수',
    role: '선생',
    content:
      '신메뉴 시식회 참가자를 모집합니다. 댓글로 신청해주세요. 선착순 10분께 무료로 제공됩니다.',
    date: '2024년 10월 15일',
    avatarUrl: '/api/placeholder/48/48',
  },
  {
    id: 7,
    name: '홍길동',
    role: '이사',
    content:
      '12월 크리스마스 스페셜 코스 예약이 시작되었습니다. 얼리버드 할인 진행중!',
    date: '2024년 10월 15일',
    avatarUrl: '/api/placeholder/48/48',
  },
  {
    id: 8,
    name: '김수진',
    role: '국장',
    content:
      '이번 주 수요일은 직원 교육으로 인해 오후 3시부터 영업합니다. 양해 부탁드립니다.',
    date: '2024년 10월 15일',
    avatarUrl: '/api/placeholder/48/48',
  },
  {
    id: 9,
    name: '이미라',
    role: '학생',
    content:
      '가을 시즌 새로운 디저트 메뉴가 출시되었습니다. 산딸기 티라미수 많이 사랑해주세요!',
    date: '2024년 10월 15일',
    avatarUrl: '/api/placeholder/48/48',
  },
  {
    id: 10,
    name: '박준서',
    role: '학생',
    content:
      '10월 한달간 평일 런치 20% 할인 이벤트 진행중입니다. 맛있는 점심 식사하세요!',
    date: '2024년 10월 15일',
    avatarUrl: '/api/placeholder/48/48',
  },
];

// 공지사항 페이지
export default async function Home() {
  return (
    <main className='p-[10px]'>
      <ul className='flex flex-col gap-3'>
        {mockPosts.map((post) => (
          <li key={post.id}>
            <PostPreview post={post} />
          </li>
        ))}
      </ul>
    </main>
  );
}
