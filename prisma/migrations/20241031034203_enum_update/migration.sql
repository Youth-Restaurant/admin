/*
  Warnings:

  - You are about to alter the column `type` on the `Inventory` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(3))` to `Enum(EnumId(2))`.
  - You are about to alter the column `status` on the `Inventory` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(7))` to `Enum(EnumId(3))`.
  - The values [CLEANING,DISPOSABLE,FURNITURE,KITCHEN,OFFICE] on the enum `enum_reference_supplyCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [VEGETABLE,MEAT,SEAFOOD,SEASONING,GRAIN,DAIRY,BEVERAGE] on the enum `enum_reference_foodCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [KITCHEN,HALL,STORAGE] on the enum `enum_reference_supplyLocation` will be removed. If these variants are still used in the database, this will fail.
  - The values [KITCHEN,STORAGE,REFRIGERATOR] on the enum `enum_reference_foodLocation` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Inventory` MODIFY `type` ENUM('물품', '식재료') NOT NULL DEFAULT '물품',
    MODIFY `status` ENUM('충분', '부족') NOT NULL DEFAULT '충분';

-- AlterTable
ALTER TABLE `enum_reference` MODIFY `supplyCategory` ENUM('청소용품', '일회용품', '가구', '주방용품', '사무용품') NOT NULL,
    MODIFY `foodCategory` ENUM('채소', '육류', '수산물', '조미료', '곡물', '유제품', '음료') NOT NULL,
    MODIFY `supplyLocation` ENUM('주방', '홀', '창고') NOT NULL,
    MODIFY `foodLocation` ENUM('주방', '창고', '냉장고') NOT NULL;
