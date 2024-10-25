import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  // console.log('req.auth:', req.auth);

  if (!req.auth?.user.nickname && req.nextUrl.pathname !== '/login') {
    const newUrl = new URL('/login', req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  // 이미 로그인된 상태에서 '/login' 페이지 접속시 '/' 경로로 리디렉트
  if (req.auth?.user.nickname && req.nextUrl.pathname === '/login') {
    const newUrl = new URL('/', req.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
};
