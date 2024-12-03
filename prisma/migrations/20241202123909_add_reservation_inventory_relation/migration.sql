/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `guests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `reservation_inventories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reservationId` INTEGER NOT NULL,
    `inventoryId` INTEGER NOT NULL,

    UNIQUE INDEX `reservation_inventories_reservationId_inventoryId_key`(`reservationId`, `inventoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `guests_name_key` ON `guests`(`name`);

-- AddForeignKey
ALTER TABLE `reservation_inventories` ADD CONSTRAINT `reservation_inventories_reservationId_fkey` FOREIGN KEY (`reservationId`) REFERENCES `reservations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservation_inventories` ADD CONSTRAINT `reservation_inventories_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
