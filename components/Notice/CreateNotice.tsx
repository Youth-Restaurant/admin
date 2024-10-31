// 서버 컴포넌트
import { auth } from '@/auth';
import CreatePostButton from './CreateNoticeButton';

export default async function CreateNotice() {
  const session = await auth();

  if (!session) {
    return <div className='w-full h-10 bg-gray-100 rounded' />;
  }

  return (
    <CreatePostButton
      user={{
        nickname: session.user.nickname,
        role: session.user.role,
        image: session.user.image,
      }}
    />
  );
}
