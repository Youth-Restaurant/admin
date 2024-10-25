import { signIn } from '@/auth';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Page() {
  return (
    <div className='flex flex-col justify-center items-center p-3 h-full'>
      <Title />
      <div className='flex justify-center w-full'>
        <Image src='/logo.png' width={300} height={300} alt='이미지 로고' />
      </div>

      <form
        action={async () => {
          'use server';
          await signIn('kakao', {
            redirectTo: '/',
          });
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
