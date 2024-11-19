// app/api/inventory/counts/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const total = await prisma.inventory.count();

  const supply = await prisma.inventory.count({ where: { type: 'SUPPLY' } });
  const food = await prisma.inventory.count({ where: { type: 'FOOD' } });

  return NextResponse.json({ ALL: total, SUPPLY: supply, FOOD: food });
}
