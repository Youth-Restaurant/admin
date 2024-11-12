/*
  Warnings:

  - A unique constraint covering the columns `[name,type,parentId]` on the table `inventory_location` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `inventory_location_name_type_key` ON `inventory_location`;

-- AlterTable
ALTER TABLE `inventory_location` ADD COLUMN `parentId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `inventory_location_name_type_parentId_key` ON `inventory_location`(`name`, `type`, `parentId`);

-- AddForeignKey
ALTER TABLE `inventory_location` ADD CONSTRAINT `inventory_location_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `inventory_location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
