import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { InventoryType } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parentName = searchParams.get('parent');
  const type = searchParams.get('type') as InventoryType | 'ALL' | null;

  console.log('parentName', parentName);
  console.log('type', type);

  if (!parentName) {
    return NextResponse.json(
      { error: 'Parent name is required' },
      { status: 400 }
    );
  }

  try {
    // 먼저 부모 위치를 찾습니다
    const parentLocation = await prisma.inventoryLocation.findFirst({
      where: {
        name: parentName,
        parentId: null,
        ...(type && type !== 'ALL' && { type }),
      },
    });

    if (!parentLocation) {
      return NextResponse.json([]);
    }

    // 해당 부모의 하위 위치들을 조회합니다
    const subLocations = await prisma.inventoryLocation.findMany({
      where: {
        parentId: parentLocation.id,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(subLocations);
  } catch (error) {
    console.error('Failed to fetch sub locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sub locations' },
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
