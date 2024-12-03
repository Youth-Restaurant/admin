// app/api/tables/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/*
 예약 테이블 조회 API
 예약 테이블 조회 시, 예약 ID를 쿼리 파라미터로 받아온다.
 예약 ID가 있는 경우, 해당 예약에 대한 테이블 목록을 조회한다.
 예약 ID가 없는 경우, 전체 테이블 목록을 조회한다.
*/

export async function GET() {
  try {
    // reservationId가 있는 경우, 해당 예약에 연결된 테이블 조회
    const tables = await prisma.restaurantTable.findMany();
    return NextResponse.json(tables);
  } catch (error) {
    console.error('Failed to fetch tables:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tables' },
      { status: 500 }
    );
  }
}
