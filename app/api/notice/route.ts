import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// POST 요청 처리 예시
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log(data);
    const post = await prisma.post.create({
      data,
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
// GET 요청 처리 예시 (최신순 정렬)
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
