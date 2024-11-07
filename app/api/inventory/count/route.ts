import { $Enums } from '@prisma/client';
// app/api/inventory/count/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') as $Enums.InventoryType | null;

  const where = {
    ...(type && { type }),
  };

  const total = await prisma.inventory.count({ where });

  return NextResponse.json({ total });
}
