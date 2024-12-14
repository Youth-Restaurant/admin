import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL, // Supabase direct connection for batch operations
    },
  },
});

async function main() {
  // 기존 데이터 삭제 (필요한 경우)
  try {
    await prisma.reservationTable.deleteMany(); //reservation_tables 테이블 먼저 삭제
    await prisma.restaurantTable.deleteMany(); // 그다음 restaurantTable 테이블 삭제
    await prisma.reservation.deleteMany(); // 마지막으로 reservation 테이블 삭제

    console.log('기존 테이블 데이터 삭제 완료');
  } catch (error) {
    console.error('기존 데이터 삭제 중 오류:', error);
  }

  // HALL 1 테이블 데이터
  const hall1Tables = [
    {
      tableNumber: 1,
      capacity: 4,
      location: '홀1',
      positionX: 100,
      positionY: 100,
      isVertical: false,
    },
    {
      tableNumber: 2,
      capacity: 4,
      location: '홀1',
      positionX: 200,
      positionY: 100,
      isVertical: false,
    },
    {
      tableNumber: 3,
      capacity: 4,
      location: '홀1',
      positionX: 300,
      positionY: 100,
      isVertical: false,
    },
    {
      tableNumber: 4,
      capacity: 4,
      location: '홀1',
      positionX: 100,
      positionY: 200,
      isVertical: false,
    },
    {
      tableNumber: 5,
      capacity: 6,
      location: '홀1',
      positionX: 200,
      positionY: 200,
      isVertical: true,
    },
    {
      tableNumber: 6,
      capacity: 6,
      location: '홀1',
      positionX: 300,
      positionY: 200,
      isVertical: true,
    },
  ];

  // HALL 2 테이블 데이터
  const hall2Tables = [
    {
      tableNumber: 7,
      capacity: 6,
      location: '홀2',
      positionX: 100,
      positionY: 100,
      isVertical: true,
    },
    {
      tableNumber: 8,
      capacity: 6,
      location: '홀2',
      positionX: 200,
      positionY: 100,
      isVertical: true,
    },
    {
      tableNumber: 9,
      capacity: 6,
      location: '홀2',
      positionX: 300,
      positionY: 100,
      isVertical: true,
    },
    {
      tableNumber: 10,
      capacity: 4,
      location: '홀2',
      positionX: 100,
      positionY: 200,
      isVertical: false,
    },
    {
      tableNumber: 11,
      capacity: 4,
      location: '홀2',
      positionX: 200,
      positionY: 200,
      isVertical: false,
    },
    {
      tableNumber: 12,
      capacity: 4,
      location: '홀2',
      positionX: 300,
      positionY: 200,
      isVertical: false,
    },
    {
      tableNumber: 13,
      capacity: 6,
      location: '홀2',
      positionX: 100,
      positionY: 300,
      isVertical: true,
    },
    {
      tableNumber: 14,
      capacity: 6,
      location: '홀2',
      positionX: 200,
      positionY: 300,
      isVertical: true,
    },
  ];

  try {
    // Supabase에서는 대량 작업시 non-pooled connection 사용 권장
    const result = await prisma.$transaction(async (tx) => {
      return await tx.restaurantTable.createMany({
        data: [...hall1Tables, ...hall2Tables].map((table) => ({
          ...table,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        skipDuplicates: true,
      });
    });

    console.log(
      `${result.count}개의 테이블 데이터가 성공적으로 추가되었습니다.`
    );
  } catch (error) {
    console.error('테이블 데이터 추가 중 오류가 발생했습니다:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Seed 실행 중 오류가 발생했습니다:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
