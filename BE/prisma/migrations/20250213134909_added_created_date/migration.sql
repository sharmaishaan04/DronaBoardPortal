/*
  Warnings:

  - Added the required column `createdDate` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `document` ADD COLUMN `createdDate` VARCHAR(191) NOT NULL;
