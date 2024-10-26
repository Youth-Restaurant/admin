import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center h-[calc(100vh-20px)] p-4 text-center'>
      <div className='mb-8'>
        <h1 className='text-6xl font-bold text-slate-800 mb-2'>404</h1>
        <h2 className='text-2xl font-semibold text-slate-600 mb-4'>
          페이지를 찾을 수 없습니다
        </h2>
        <p className='text-slate-500 mb-8'>
          요청하신 페이지가 삭제되었거나 잘못된 경로입니다.
        </p>
      </div>

      <Link
        href='/'
        className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md'
      >
        홈으로 돌아가기
      </Link>

      <div className='mt-8 text-sm text-slate-400'>
        문제가 지속되면 관리자에게 문의해주세요
      </div>
    </div>
  );
}
