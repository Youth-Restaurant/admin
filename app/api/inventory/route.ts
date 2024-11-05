// app/api/inventory/route.ts
import { $Enums } from '@prisma/client';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get('type') || 'SUPPLY') as $Enums.InventoryType;

  try {
    const items = await prisma.inventory.findMany({
      where: { type: type },
      include: { user: true },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch inventory items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const item = await prisma.inventory.create({
      data: {
        ...data,
        lastUpdated: new Date(),
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Failed to create inventory item:', error);
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}
