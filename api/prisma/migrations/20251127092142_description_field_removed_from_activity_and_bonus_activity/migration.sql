/*
  Warnings:

  - You are about to drop the column `description` on the `Activity` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `BonusActivity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Activity" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "BonusActivity" DROP COLUMN "description";
