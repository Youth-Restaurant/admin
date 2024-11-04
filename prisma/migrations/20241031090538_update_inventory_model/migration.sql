/*
  Warnings:

  - Added the required column `createdBy` to the `Inventory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Inventory` DROP FOREIGN KEY `Inventory_updatedBy_fkey`;

-- AlterTable
ALTER TABLE `Inventory` ADD COLUMN `createdBy` VARCHAR(191) NOT NULL,
    MODIFY `quantity` INTEGER NULL DEFAULT -1;

-- CreateIndex
CREATE INDEX `Inventory_createdBy_idx` ON `Inventory`(`createdBy`);

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
