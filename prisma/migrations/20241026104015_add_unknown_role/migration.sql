-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `image` VARCHAR(191) NOT NULL DEFAULT '/images/default-avatar.png',
    `role` ENUM('이사', '대표', '국장', '팀장', '선생', '학생', '직급') NOT NULL DEFAULT '학생',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_nickname_key`(`nickname`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('PRODUCT', 'FOOD') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `registeredBy` VARCHAR(191) NOT NULL,
    `registeredDate` DATETIME(3) NOT NULL,
    `purchaseDate` DATETIME(3) NULL,
    `image` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NULL,
    `lastViewedDate` DATETIME(3) NOT NULL,
    `purchaseLocation` VARCHAR(191) NULL,
    `isConsumed` BOOLEAN NULL,
    `isBroken` BOOLEAN NULL,
    `disposalDate` DATETIME(3) NULL,
    `expirationDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Inventory_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('이사', '대표', '국장', '팀장', '선생', '학생', '직급') NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `avatarUrl` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,

    INDEX `Post_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
