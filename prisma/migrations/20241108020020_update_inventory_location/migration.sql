/*
  Warnings:

  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Inventory` DROP FOREIGN KEY `Inventory_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `Inventory` DROP FOREIGN KEY `Inventory_locationId_fkey`;

-- DropForeignKey
ALTER TABLE `InventoryUpdateHistory` DROP FOREIGN KEY `InventoryUpdateHistory_inventoryId_fkey`;

-- DropForeignKey
ALTER TABLE `InventoryUpdateHistory` DROP FOREIGN KEY `InventoryUpdateHistory_updatedBy_fkey`;

-- DropForeignKey
ALTER TABLE `Notice` DROP FOREIGN KEY `Notice_userId_fkey`;

-- DropTable
DROP TABLE `Inventory`;

-- DropTable
DROP TABLE `Notice`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `role` ENUM('이사', '대표', '국장', '팀장', '선생', '학생', '직급') NOT NULL DEFAULT '학생',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `author` VARCHAR(191) NOT NULL,
    `role` ENUM('이사', '대표', '국장', '팀장', '선생', '학생', '직급') NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `avatarUrl` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,

    INDEX `notice_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('물품', '식재료') NOT NULL DEFAULT '물품',
    `quantity` INTEGER NULL DEFAULT -1,
    `status` ENUM('충분', '부족') NOT NULL DEFAULT '충분',
    `location` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `lastUpdated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdBy` VARCHAR(191) NOT NULL,
    `updatedBy` VARCHAR(191) NOT NULL,
    `memo` TEXT NULL,
    `minimumQuantity` INTEGER NULL,
    `manufacturer` VARCHAR(191) NULL,
    `modelNumber` VARCHAR(191) NULL,
    `expirationDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `locationId` INTEGER NULL,

    INDEX `inventory_type_idx`(`type`),
    INDEX `inventory_category_idx`(`category`),
    INDEX `inventory_location_idx`(`location`),
    INDEX `inventory_createdBy_idx`(`createdBy`),
    INDEX `inventory_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `notice` ADD CONSTRAINT `notice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory` ADD CONSTRAINT `inventory_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventory` ADD CONSTRAINT `inventory_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `InventoryLocation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryUpdateHistory` ADD CONSTRAINT `InventoryUpdateHistory_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryUpdateHistory` ADD CONSTRAINT `InventoryUpdateHistory_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
