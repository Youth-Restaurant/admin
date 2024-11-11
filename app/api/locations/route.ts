import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { InventoryType } from '@prisma/client';

export async function GET() {
  try {
    const locations = await prisma.inventoryLocation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(locations);
  } catch (error) {
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
