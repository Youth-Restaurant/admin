-- CreateEnum
CREATE TYPE "InventoryType" AS ENUM ('물품', '식재료');

-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('충분', '부족');

-- CreateEnum
CREATE TYPE "SupplyCategory" AS ENUM ('청소용품', '일회용품', '가구', '주방용품', '사무용품');

-- CreateEnum
CREATE TYPE "FoodCategory" AS ENUM ('채소', '육류', '수산물', '조미료', '곡물', '유제품', '음료');

-- CreateEnum
CREATE TYPE "SupplyLocation" AS ENUM ('주방', '홀', '창고');

-- CreateEnum
CREATE TYPE "FoodLocation" AS ENUM ('주방', '창고', '냉장고');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('이사', '대표', '국장', '팀장', '선생', '학생', '직급');

-- CreateTable
CREATE TABLE "reservation_inventories" (
    "id" SERIAL NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "inventoryId" INTEGER NOT NULL,

    CONSTRAINT "reservation_inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "kakaoId" TEXT NOT NULL,
    "email" TEXT,
    "role" "Role" NOT NULL DEFAULT '학생',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nickname" TEXT NOT NULL DEFAULT '이름',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notice" (
    "id" SERIAL NOT NULL,
    "author" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatarUrl" TEXT NOT NULL,
    "userId" UUID,

    CONSTRAINT "notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InventoryType" NOT NULL DEFAULT '물품',
    "quantity" INTEGER DEFAULT -1,
    "status" "InventoryStatus" NOT NULL DEFAULT '충분',
    "category" TEXT NOT NULL,
    "imageUrl" TEXT,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID NOT NULL,
    "updatedBy" UUID NOT NULL,
    "memo" TEXT,
    "minimumQuantity" INTEGER,
    "manufacturer" TEXT,
    "modelNumber" TEXT,
    "expirationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locationId" INTEGER,
    "parentLocation" TEXT NOT NULL,
    "subLocation" TEXT,
    "mainCategory" TEXT,
    "subCategory" TEXT,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_update_history" (
    "id" SERIAL NOT NULL,
    "inventoryId" INTEGER NOT NULL,
    "updatedBy" UUID NOT NULL,
    "changes" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_update_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enum_reference" (
    "id" SERIAL NOT NULL,
    "supplyCategory" "SupplyCategory" NOT NULL,
    "foodCategory" "FoodCategory" NOT NULL,
    "supplyLocation" "SupplyLocation" NOT NULL,
    "foodLocation" "FoodLocation" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enum_reference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InventoryType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "inventory_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_tables" (
    "id" SERIAL NOT NULL,
    "tableNumber" INTEGER NOT NULL,
    "capacity" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "restaurant_tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastBookingDate" TIMESTAMP(3) NOT NULL,
    "gender" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" SERIAL NOT NULL,
    "guestId" INTEGER NOT NULL,
    "createdById" UUID NOT NULL,
    "reservationDate" TIMESTAMP(3) NOT NULL,
    "numberOfGuests" INTEGER NOT NULL,
    "isCanceled" BOOLEAN NOT NULL DEFAULT false,
    "additionalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "inventoryId" INTEGER,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_tables" (
    "id" SERIAL NOT NULL,
    "reservationId" INTEGER NOT NULL,
    "tableId" INTEGER NOT NULL,
    "seatsUsed" INTEGER NOT NULL,

    CONSTRAINT "reservation_tables_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reservation_inventories_reservationId_inventoryId_key" ON "reservation_inventories"("reservationId", "inventoryId");

-- CreateIndex
CREATE UNIQUE INDEX "user_kakaoId_key" ON "user"("kakaoId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "notice_createdAt_idx" ON "notice"("createdAt");

-- CreateIndex
CREATE INDEX "notice_userId_idx" ON "notice"("userId");

-- CreateIndex
CREATE INDEX "inventory_type_idx" ON "inventory"("type");

-- CreateIndex
CREATE INDEX "inventory_category_idx" ON "inventory"("category");

-- CreateIndex
CREATE INDEX "inventory_parentLocation_idx" ON "inventory"("parentLocation");

-- CreateIndex
CREATE INDEX "inventory_subLocation_idx" ON "inventory"("subLocation");

-- CreateIndex
CREATE INDEX "inventory_createdBy_idx" ON "inventory"("createdBy");

-- CreateIndex
CREATE INDEX "inventory_updatedBy_idx" ON "inventory"("updatedBy");

-- CreateIndex
CREATE INDEX "inventory_status_idx" ON "inventory"("status");

-- CreateIndex
CREATE INDEX "inventory_locationId_idx" ON "inventory"("locationId");

-- CreateIndex
CREATE INDEX "inventory_mainCategory_idx" ON "inventory"("mainCategory");

-- CreateIndex
CREATE INDEX "inventory_subCategory_idx" ON "inventory"("subCategory");

-- CreateIndex
CREATE INDEX "inventory_update_history_inventoryId_idx" ON "inventory_update_history"("inventoryId");

-- CreateIndex
CREATE INDEX "inventory_update_history_updatedBy_idx" ON "inventory_update_history"("updatedBy");

-- CreateIndex
CREATE INDEX "inventory_location_parentId_idx" ON "inventory_location"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_location_name_type_parentId_key" ON "inventory_location"("name", "type", "parentId");

-- CreateIndex
CREATE UNIQUE INDEX "restaurant_tables_tableNumber_key" ON "restaurant_tables"("tableNumber");

-- CreateIndex
CREATE UNIQUE INDEX "guests_name_key" ON "guests"("name");

-- CreateIndex
CREATE INDEX "reservations_createdById_idx" ON "reservations"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "reservation_tables_reservationId_tableId_key" ON "reservation_tables"("reservationId", "tableId");

-- AddForeignKey
ALTER TABLE "reservation_inventories" ADD CONSTRAINT "reservation_inventories_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_inventories" ADD CONSTRAINT "reservation_inventories_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notice" ADD CONSTRAINT "notice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "inventory_location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_update_history" ADD CONSTRAINT "inventory_update_history_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_update_history" ADD CONSTRAINT "inventory_update_history_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_location" ADD CONSTRAINT "inventory_location_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "inventory_location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_tables" ADD CONSTRAINT "reservation_tables_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_tables" ADD CONSTRAINT "reservation_tables_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "restaurant_tables"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
