-- DropIndex
DROP INDEX `Inventory_updatedBy_idx` ON `Inventory`;

-- CreateTable
CREATE TABLE `InventoryUpdateHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inventoryId` INTEGER NOT NULL,
    `updatedBy` VARCHAR(191) NOT NULL,
    `changes` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `InventoryUpdateHistory_inventoryId_idx`(`inventoryId`),
    INDEX `InventoryUpdateHistory_updatedBy_idx`(`updatedBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InventoryUpdateHistory` ADD CONSTRAINT `InventoryUpdateHistory_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `Inventory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryUpdateHistory` ADD CONSTRAINT `InventoryUpdateHistory_updatedBy_fkey` FOREIGN KEY (`updatedBy`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
