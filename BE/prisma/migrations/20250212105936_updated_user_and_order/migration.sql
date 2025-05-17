/*
  Warnings:

  - Added the required column `referredDivision` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `designation` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAdmin` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `referredDivision` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `designation` VARCHAR(191) NOT NULL,
    ADD COLUMN `isAdmin` BOOLEAN NOT NULL;
