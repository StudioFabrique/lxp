/*
  Warnings:

  - Made the column `lastOpenedAt` on table `LessonRead` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LessonRead" ALTER COLUMN "lastOpenedAt" SET NOT NULL,
ALTER COLUMN "lastOpenedAt" SET DEFAULT CURRENT_TIMESTAMP;
