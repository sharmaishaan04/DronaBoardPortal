-- DropForeignKey
ALTER TABLE `document` DROP FOREIGN KEY `Document_userId_fkey`;

-- DropIndex
DROP INDEX `Document_userId_fkey` ON `document`;

-- AlterTable
ALTER TABLE `document` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Document` ADD CONSTRAINT `Document_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
