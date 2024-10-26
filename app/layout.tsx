import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/Header';
import { auth } from '@/auth';
import BottomNavigation from '@/components/BottomNavigation';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});
export const metadata: Metadata = {
  title: '사회적 협동조합 청소년 자립학교 직원 전용 서비스',
  description: '사회적 협동조합 청소년 자립학교 직원 전용 서비스입니다.',
  manifest: '/manifest.json',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100`}
      >
        <div className='min-w-[340px] max-w-[500px] m-auto bg-white h-full relative'>
          {session?.user.nickname ? (
            <>
              <Header />
              <main className='p-[10px] h-[calc(100vh-var(--header-height)-var(--bottom-nav-height))] overflow-y-auto'>
                {children}
              </main>
              <BottomNavigation />
            </>
          ) : (
            children
          )}
        </div>
      </body>
    </html>
  );
}
