/*
  Warnings:

  - A unique constraint covering the columns `[name,type]` on the table `inventory_location` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `inventory_location_name_key` ON `inventory_location`;

-- CreateIndex
CREATE UNIQUE INDEX `inventory_location_name_type_key` ON `inventory_location`(`name`, `type`);
