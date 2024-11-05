/*
  Warnings:

  - You are about to alter the column `updatedBy` on the `Inventory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `createdBy` on the `Inventory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `updatedBy` on the `InventoryUpdateHistory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `userId` on the `Notice` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `Inventory` DROP FOREIGN KEY `Inventory_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `InventoryUpdateHistory` DROP FOREIGN KEY `InventoryUpdateHistory_updatedBy_fkey`;

-- DropForeignKey
ALTER TABLE `Notice` DROP FOREIGN KEY `Notice_userId_fkey`;

-- AlterTable
ALTER TABLE `Inventory` MODIFY `updatedBy` INTEGER NOT NULL,
    MODIFY `createdBy` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `InventoryUpdateHistory` MODIFY `updatedBy` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Notice` MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Notice` ADD CONSTRAINT `Notice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryUpdateHistory` ADD CONSTRAINT `InventoryUpdateHistory_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
