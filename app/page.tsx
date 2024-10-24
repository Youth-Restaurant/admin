import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { auth, signIn } from '@/auth';
import { BellIcon, BoxIcon, Calendar, PaperclipIcon } from 'lucide-react';

const navItems = [
  { icon: <BellIcon />, label: '공지사항' },
  { icon: <BoxIcon />, label: '재고관리' },
  { icon: <Calendar />, label: '일정' },
  { icon: <PaperclipIcon />, label: '전자결재' },
];

export default async function Home() {
  const session = await auth();

  if (!session?.user?.nickname) return <KakaoLoginPage />;

  return (
    <>
      <header className='flex justify-between p-3 items-center border-b-[1px]'>
        <h1 className='font-semibold'>사회적협동조합 청소년 자립학교</h1>
      </header>
      <main></main>
      <footer></footer>
      <nav className='absolute right-0 left-0 bottom-0 w-full border-t-[0.3px]'>
        <ul className='flex w-full justify-around py-3'>
          {navItems.map((item, index) => (
            <li key={index} className='flex flex-col items-center'>
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
          <li>
            <div className='rounded-full w-11 aspect-square overflow-hidden'>
              <Image
                alt='프로필 이미지'
                src={session.user?.image || ''}
                width={100}
                height={100}
              />
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}

function KakaoLoginPage() {
  return (
    <div className='flex flex-col justify-center items-center p-3 h-full'>
      <Title />
      <div className='flex justify-center w-full'>
        <Image src='/logo.png' width={300} height={300} alt='이미지 로고' />
      </div>

      <form
        action={async () => {
          'use server';
          // POST 303(See Other) - redirect to a different URL using GET method
          // GET 302
          await signIn('kakao');
        }}
        className='w-full'
      >
        <Button className='w-full bg-yellow-500 hover:bg-yellow-600 text-xl p-6'>
          카카오 로그인
        </Button>
      </form>
    </div>
  );
}

function Title() {
  return (
    <>
      <h1 className='text-7xl text-center'>사회적 협동조합</h1>
      <h1 className='text-7xl text-center'>청소년 자립학교</h1>
      <p className='w-full'>
        <span className='float-end'>직원 전용 서비스</span>
      </p>
    </>
  );
}
