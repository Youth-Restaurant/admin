/*
  Warnings:

  - You are about to drop the column `disposalDate` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `isBroken` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `isConsumed` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `lastViewedDate` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseDate` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseLocation` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `registeredBy` on the `Inventory` table. All the data in the column will be lost.
  - You are about to drop the column `registeredDate` on the `Inventory` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `Inventory` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(191)`.
  - Added the required column `category` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `Inventory` table without a default value. This is not possible if the table is not empty.
  - Made the column `quantity` on table `Inventory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Inventory` DROP COLUMN `disposalDate`,
    DROP COLUMN `image`,
    DROP COLUMN `isBroken`,
    DROP COLUMN `isConsumed`,
    DROP COLUMN `lastViewedDate`,
    DROP COLUMN `purchaseDate`,
    DROP COLUMN `purchaseLocation`,
    DROP COLUMN `registeredBy`,
    DROP COLUMN `registeredDate`,
    ADD COLUMN `category` VARCHAR(191) NOT NULL,
    ADD COLUMN `lastUpdated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `manufacturer` VARCHAR(191) NULL,
    ADD COLUMN `memo` VARCHAR(191) NULL,
    ADD COLUMN `minimumQuantity` VARCHAR(191) NULL,
    ADD COLUMN `modelNumber` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('SUFFICIENT', 'LOW') NOT NULL,
    ADD COLUMN `storageTemp` VARCHAR(191) NULL,
    ADD COLUMN `updatedBy` VARCHAR(191) NOT NULL,
    MODIFY `type` VARCHAR(191) NOT NULL,
    MODIFY `quantity` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `Inventory_category_idx` ON `Inventory`(`category`);

-- CreateIndex
CREATE INDEX `Inventory_location_idx` ON `Inventory`(`location`);
