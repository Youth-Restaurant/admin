import Image from 'next/image';

export default function Home() {
  return (
    <div className='flex-col justify-center items-center'>
      <h1 className='text-2xl'>사회적 협동조합</h1>
      <h1>청소년 자립학교</h1>
      <span>직원 전용 서비스</span>
      <Image src='/logo.png' width={300} height={300} alt='이미지 로고' />
      <button></button>
    </div>
  );
}
