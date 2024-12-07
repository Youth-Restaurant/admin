// app/api/tables/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tables = await prisma.restaurantTable.findMany({
      orderBy: {
        tableNumber: 'asc',
      },
    });

    const groupedTables = tables.reduce((acc, table) => {
      const hall = table.location;
      if (!acc[hall]) acc[hall] = [];
      acc[hall].push(table);
      return acc;
    }, {} as Record<string, typeof tables>);

    return NextResponse.json(groupedTables);
  } catch (error) {
    console.error('Failed to fetch tables:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
