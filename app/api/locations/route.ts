import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { InventoryType } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as InventoryType | null;

  try {
    const locations = await prisma.inventoryLocation.findMany({
      where: {
        parentId: null,
        ...(type && { type }),
      },
      orderBy: { name: 'asc' },
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
    const { name, type } = await request.json();

    const existingLocation = await prisma.inventoryLocation.findFirst({
      where: {
        name,
        type: type as InventoryType,
      },
    });

    if (existingLocation) {
      throw new Error(
        `이미 등록된 ${type === 'SUPPLY' ? '물품' : '식재료'} 위치입니다`
      );
    }

    const location = await prisma.inventoryLocation.create({
      data: {
        name,
        type: type as InventoryType,
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.error('Failed to create location:', error);
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    );
  }
}
