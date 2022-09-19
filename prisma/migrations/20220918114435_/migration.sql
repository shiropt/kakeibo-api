-- AlterTable
ALTER TABLE `MoneyDiary` ADD COLUMN `expenseItemName` VARCHAR(191) NULL,
    MODIFY `memo` VARCHAR(191) NULL,
    MODIFY `period` INTEGER NULL;
