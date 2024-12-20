// app/api/inventory/route.ts
import { $Enums } from '@prisma/client';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as $Enums.InventoryType | 'ALL' | null;
  const parentLocation = searchParams.get('parentLocation');
  const subLocation = searchParams.get('subLocation');
  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const skip = (page - 1) * limit;

  try {
    const where = {
      ...(type && type !== 'ALL' && { type }),
      ...(parentLocation && parentLocation !== '전체' && { parentLocation }),
      ...(subLocation && subLocation !== '전체' && { subLocation }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { category: { contains: search } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip,
      }),
      prisma.inventory.count({ where }),
    ]);

    return NextResponse.json({
      items,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + items.length < total,
    });
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
    console.log('data', data);
    const item = await prisma.inventory.create({
      data: {
        ...data,
        updatedAt: new Date(),
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
