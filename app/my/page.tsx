import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();

  return <div>안녕하세요! {session?.user.nickname} 님!</div>;
}
