import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Navigation from '@/components/Navigation';
import { auth } from '@/auth';
import Header from '@/components/Header';

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
  const nickname = session?.user.nickname;

  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-100`}
      >
        <div className='min-w-[340px] max-w-[500px] m-auto bg-white h-full relative'>
          {nickname && <Header />}
          {children}
          {nickname && <Navigation profileImage={session.user.image} />}
        </div>
      </body>
    </html>
  );
}
