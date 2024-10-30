-- CreateTable
CREATE TABLE `enum_reference` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `supplyCategory` VARCHAR(191) NULL,
    `foodCategory` VARCHAR(191) NULL,
    `supplyLocation` VARCHAR(191) NULL,
    `foodLocation` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
