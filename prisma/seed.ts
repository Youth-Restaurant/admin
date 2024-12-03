import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // HALL 1 테이블 데이터
  const hall1Tables = [
    { tableNumber: 1, capacity: 4, location: '홀1' },
    { tableNumber: 2, capacity: 4, location: '홀1' },
    { tableNumber: 3, capacity: 4, location: '홀1' },
    { tableNumber: 4, capacity: 4, location: '홀1' },
    { tableNumber: 5, capacity: 6, location: '홀1' },
    { tableNumber: 6, capacity: 6, location: '홀1' },
  ];

  // HALL 2 테이블 데이터
  const hall2Tables = [
    { tableNumber: 7, capacity: 6, location: '홀2' },
    { tableNumber: 8, capacity: 6, location: '홀2' },
    { tableNumber: 9, capacity: 6, location: '홀2' },
    { tableNumber: 10, capacity: 4, location: '홀2' },
    { tableNumber: 11, capacity: 4, location: '홀2' },
    { tableNumber: 12, capacity: 4, location: '홀2' },
    { tableNumber: 13, capacity: 6, location: '홀2' },
    { tableNumber: 14, capacity: 6, location: '홀2' },
  ];

  // 테이블 데이터 추가
  for (const table of [...hall1Tables, ...hall2Tables]) {
    await prisma.restaurantTable.upsert({
      where: { tableNumber: table.tableNumber },
      update: {},
      create: table,
    });
  }

  console.log('테이블 데이터가 성공적으로 추가되었습니다.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
