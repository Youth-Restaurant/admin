/*
  Warnings:

  - Made the column `supplyCategory` on table `enum_reference` required. This step will fail if there are existing NULL values in that column.
  - Made the column `foodCategory` on table `enum_reference` required. This step will fail if there are existing NULL values in that column.
  - Made the column `supplyLocation` on table `enum_reference` required. This step will fail if there are existing NULL values in that column.
  - Made the column `foodLocation` on table `enum_reference` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `enum_reference` MODIFY `supplyCategory` ENUM('CLEANING', 'DISPOSABLE', 'FURNITURE', 'KITCHEN', 'OFFICE') NOT NULL,
    MODIFY `foodCategory` ENUM('VEGETABLE', 'MEAT', 'SEAFOOD', 'SEASONING', 'GRAIN', 'DAIRY', 'BEVERAGE') NOT NULL,
    MODIFY `supplyLocation` ENUM('KITCHEN', 'HALL', 'STORAGE') NOT NULL,
    MODIFY `foodLocation` ENUM('KITCHEN', 'STORAGE', 'REFRIGERATOR') NOT NULL;
