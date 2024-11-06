// app/api/inventory/route.ts
import { $Enums } from '@prisma/client';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get('type') || 'SUPPLY') as $Enums.InventoryType;
  const location = searchParams.get('location');
  const search = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const skip = (page - 1) * limit;

  try {
    const where = {
      type,
      ...(location && location !== '전체' && { location }),
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

    console.log(items.length, total);

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
