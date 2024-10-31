import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// POST 요청 처리 예시
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log(data);
    const notice = await prisma.notice.create({
      data,
    });

    return NextResponse.json(notice);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
// GET 요청 처리 예시 (최신순 정렬)
export async function GET() {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(notices);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
