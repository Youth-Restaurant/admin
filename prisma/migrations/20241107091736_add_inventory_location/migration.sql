/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Inventory` DROP FOREIGN KEY `Inventory_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `InventoryUpdateHistory` DROP FOREIGN KEY `InventoryUpdateHistory_updatedBy_fkey`;

-- DropForeignKey
ALTER TABLE `Notice` DROP FOREIGN KEY `Notice_userId_fkey`;

-- AlterTable
ALTER TABLE `Inventory` ADD COLUMN `locationId` INTEGER NULL,
    MODIFY `updatedBy` VARCHAR(191) NOT NULL,
    MODIFY `createdBy` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `InventoryUpdateHistory` MODIFY `updatedBy` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Notice` MODIFY `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `InventoryLocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('물품', '식재료') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `InventoryLocation_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Notice` ADD CONSTRAINT `Notice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `InventoryLocation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryUpdateHistory` ADD CONSTRAINT `InventoryUpdateHistory_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
