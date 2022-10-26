/*
  Warnings:

  - You are about to drop the column `period` on the `MoneyDiary` table. All the data in the column will be lost.
  - Added the required column `automaticRegistration` to the `MoneyDiary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MoneyDiary` DROP COLUMN `period`,
    ADD COLUMN `automaticRegistration` BOOLEAN NOT NULL;
