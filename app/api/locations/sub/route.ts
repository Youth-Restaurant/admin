import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const locations = await prisma.inventoryLocation.findMany({
      where: {
        parentId: null, // 최상위 위치만 가져옴
      },
    });
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { parentId, name } = await request.json();

    // 부모 위치 정보 가져오기
    const parentLocation = await prisma.inventoryLocation.findUnique({
      where: { id: parentId },
    });

    if (!parentLocation) {
      return NextResponse.json(
        { error: 'Parent location not found' },
        { status: 404 }
      );
    }

    // 서브 로케이션 생성
    const subLocation = await prisma.inventoryLocation.create({
      data: {
        name,
        type: parentLocation.type,
        parentId,
      },
    });

    return NextResponse.json(subLocation);
  } catch (error) {
    console.error('Failed to create sub location:', error);
    return NextResponse.json(
      { error: 'Failed to create sub location' },
      { status: 500 }
    );
  }
}
