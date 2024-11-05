// /app/layout.tsx
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Header from '@/components/Header';
import { auth } from '@/auth';
import BottomNavigation from '@/components/BottomNavigation';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';

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
  icons: '/images/web-app-manifest-192x192.png',
};

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <div className='min-w-[340px] max-w-[500px] m-auto bg-white min-h-screen relative'>
          {session?.user.nickname ? (
            <SessionProvider>
              <Header />
              <main className='px-[10px] h-[calc(100vh-var(--header-height)-var(--bottom-nav-height))] overflow-y-auto hide-scrollbar'>
                {children}
                <Toaster />
              </main>
              <BottomNavigation />
            </SessionProvider>
          ) : (
            children
          )}
        </div>
      </body>
    </html>
  );
}
