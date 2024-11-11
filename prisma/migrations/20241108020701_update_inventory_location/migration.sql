/*
  Warnings:

  - You are about to drop the `InventoryLocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InventoryUpdateHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `InventoryUpdateHistory` DROP FOREIGN KEY `InventoryUpdateHistory_inventoryId_fkey`;

-- DropForeignKey
ALTER TABLE `InventoryUpdateHistory` DROP FOREIGN KEY `InventoryUpdateHistory_updatedBy_fkey`;

-- DropForeignKey
ALTER TABLE `inventory` DROP FOREIGN KEY `inventory_locationId_fkey`;

-- DropTable
DROP TABLE `InventoryLocation`;

-- DropTable
DROP TABLE `InventoryUpdateHistory`;

-- CreateTable
CREATE TABLE `inventory_update_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inventoryId` INTEGER NOT NULL,
    `updatedBy` VARCHAR(191) NOT NULL,
    `changes` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `inventory_update_history_inventoryId_idx`(`inventoryId`),
    INDEX `inventory_update_history_updatedBy_idx`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory_location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('물품', '식재료') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `inventory_location_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inventory` ADD CONSTRAINT `inventory_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `inventory_location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_update_history` ADD CONSTRAINT `inventory_update_history_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory_update_history` ADD CONSTRAINT `inventory_update_history_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
