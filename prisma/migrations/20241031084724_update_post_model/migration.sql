/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_userId_fkey`;

-- DropIndex
DROP INDEX `User_nickname_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `email`,
    DROP COLUMN `image`,
    DROP COLUMN `nickname`;

-- DropTable
DROP TABLE `Post`;

-- CreateTable
CREATE TABLE `Notice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `author` VARCHAR(191) NOT NULL,
    `role` ENUM('이사', '대표', '국장', '팀장', '선생', '학생', '직급') NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `avatarUrl` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,

    INDEX `Notice_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_id_key` ON `User`(`id`);

-- AddForeignKey
ALTER TABLE `Notice` ADD CONSTRAINT `Notice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
