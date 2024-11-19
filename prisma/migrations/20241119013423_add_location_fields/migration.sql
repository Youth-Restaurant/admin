/*
  Warnings:

  - You are about to drop the column `location` on the `inventory` table. All the data in the column will be lost.
  - Added the required column `parentLocation` to the `inventory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `inventory_location_idx` ON `inventory`;

-- AlterTable
ALTER TABLE `inventory` DROP COLUMN `location`,
    ADD COLUMN `parentLocation` VARCHAR(191) NOT NULL,
    ADD COLUMN `subLocation` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `inventory_parentLocation_idx` ON `inventory`(`parentLocation`);

-- CreateIndex
CREATE INDEX `inventory_subLocation_idx` ON `inventory`(`subLocation`);
