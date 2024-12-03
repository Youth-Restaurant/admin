import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/auth';

/*
  예약 생성 API
  예약 생성 시, 예약 정보와 예약 테이블 정보를 받아온다.
  예약 테이블 정보는 예약 테이블 생성 API를 통해 생성된다.
*/

export async function POST(req: Request) {
  try {
    // 인증 확인
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 예약 정보 받아오기
    const {
      customerName,
      reservationTime,
      numberOfPeople,
      tableNumbers,
      drinks,
      description,
      userId,
    } = await req.json();

    // 유저 ID 확인
    if (!userId) {
      // 유저 ID가 없는 경우, 400 에러 반환
      return new NextResponse('User ID is required', { status: 400 });
    }

    // 인벤토리 정보 받아오기
    // 인벤토리 정보는 인벤토리 조회 API를 통해 받아온다.
    // Promise.all을 사용하여 인벤토리 정보를 동시에 조회한다.
    const inventories = await Promise.all(
      // 배열 내의 각 음료 이름에 대해 인벤토리 조회
      drinks.map((drinkName: string) =>
        // findFirstOrThrow는 인벤토리 조회 시, 인벤토리가 없는 경우 에러를 반환한다.
        prisma.inventory.findFirstOrThrow({
          where: { name: drinkName },
          // 인벤토리 ID만 필요하므로, id만 선택한다.
          select: { id: true },
        })
      )
    );

    // 고객 정보 조회 또는 생성
    // upsert는 고객 정보가 있는 경우 업데이트, 없는 경우 생성한다.
    const guest = await prisma.guest.upsert({
      where: { name: customerName },
      update: { lastBookingDate: new Date() },
      create: {
        name: customerName,
        lastBookingDate: new Date(),
      },
    });

    // 예약 생성
    const reservation = await prisma.reservation.create({
      data: {
        // 예약한 고객의 ID
        guestId: guest.id,
        // createdById는 예약을 생성한 유저의 ID
        createdById: userId,
        // 예약 날짜
        reservationDate: new Date(reservationTime),
        // 예약 인원
        numberOfGuests: numberOfPeople,
        // 추가 메모
        additionalNotes: description,
        // 예약 테이블 생성
        tables: {
          create: tableNumbers.map((tableNumber: number) => ({
            table: {
              connect: { tableNumber },
            },
            seatsUsed: numberOfPeople,
          })),
        },
        // 예약 인벤토리 생성
        ReservationInventory: {
          create: inventories.map((inventory) => ({
            inventory: {
              connect: { id: inventory.id },
            },
          })),
        },
      },
      // 예약 정보 조회 시, 고객 정보, 예약 테이블 정보, 예약 인벤토리 정보를 함께 조회
      include: {
        guest: true,
        tables: {
          include: {
            // table은 테이블 정보를 포함
            table: true,
          },
        },
        // 예약 인벤토리 정보 포함
        ReservationInventory: {
          include: {
            // inventory는 인벤토리 정보를 포함
            inventory: true,
          },
        },
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Reservation creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}

/*
  예약 조회 API
  예약 조회 시, 예약 날짜를 쿼리 파라미터로 받아온다.
  예약 날짜는 UTC 기준으로 변환된다.
*/

export async function GET(req: Request) {
  try {
    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date) {
      return new NextResponse('Date is required', { status: 400 });
    }

    // 선택된 날짜의 시작과 끝 설정 (UTC 기준으로 변환)
    const startDate = new Date(date);
    // UTC 기준으로 변환
    startDate.setUTCHours(0, 0, 0, 0);
    // 선택된 날짜의 끝 설정 (UTC 기준으로 변환)
    const endDate = new Date(date);
    // UTC 기준으로 변환
    endDate.setUTCHours(23, 59, 59, 999);

    // 예약 정보 조회
    const reservations = await prisma.reservation.findMany({
      where: {
        reservationDate: {
          gte: startDate,
          lte: endDate,
        },
        isCanceled: false,
      },
      // 예약 정보 조회 시, 고객 정보, 예약 테이블 정보를 함께 조회
      include: {
        guest: true,
        tables: {
          include: {
            // table은 테이블 정보를 포함
            table: true,
          },
        },
      },
      // 예약 날짜 순으로 정렬
      orderBy: {
        reservationDate: 'asc',
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Failed to fetch reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}

/*
  예약 삭제 API
  예약 삭제 시, 예약 관련 테이블의 데이터를 모두 삭제한다.
*/

export async function DELETE() {
  try {
    // 예약 관련 테이블의 데이터를 모두 삭제
    // 관계가 있는 테이블부터 순서대로 삭제
    await prisma.reservationInventory.deleteMany();
    await prisma.reservationTable.deleteMany();
    await prisma.reservation.deleteMany();

    return NextResponse.json({
      message: 'All reservations deleted successfully',
    });
  } catch (error) {
    console.error('Failed to delete reservations:', error);
    return NextResponse.json(
      { error: 'Failed to delete reservations' },
      { status: 500 }
    );
  }
}
