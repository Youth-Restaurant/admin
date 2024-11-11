-- AlterTable
ALTER TABLE `user` ADD COLUMN `nickname` VARCHAR(191) NOT NULL DEFAULT '이름';

-- CreateIndex
CREATE INDEX `inventory_updatedBy_idx` ON `inventory`(`updatedBy`);
