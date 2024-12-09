// app/api/inventory/counts/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 모든 카운트를 병렬로 실행
    const [total, supply, food] = await Promise.all([
      prisma.inventory.count(),
      prisma.inventory.count({
        where: {
          type: 'SUPPLY',
        },
      }),
      prisma.inventory.count({
        where: {
          type: 'FOOD',
        },
      }),
    ]);

    return NextResponse.json({
      ALL: total,
      SUPPLY: supply,
      FOOD: food,
    });
  } catch (error) {
    console.error('Inventory count error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory counts' },
      { status: 500 }
    );
  }
}
