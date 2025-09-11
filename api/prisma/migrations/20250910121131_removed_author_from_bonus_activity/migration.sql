/*
  Warnings:

  - You are about to drop the column `author` on the `BonusActivity` table. All the data in the column will be lost.
  - You are about to drop the column `lessonId` on the `BonusActivity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BonusActivity" DROP COLUMN "author",
DROP COLUMN "lessonId";
