/*
  Warnings:

  - You are about to drop the column `expenseItemId` on the `MoneyDiary` table. All the data in the column will be lost.
  - Made the column `expenseItemName` on table `MoneyDiary` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `MoneyDiary` DROP FOREIGN KEY `MoneyDiary_expenseItemId_fkey`;

-- AlterTable
ALTER TABLE `ExpenseItem` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `MoneyDiary` DROP COLUMN `expenseItemId`,
    MODIFY `expenseItemName` VARCHAR(191) NOT NULL;
