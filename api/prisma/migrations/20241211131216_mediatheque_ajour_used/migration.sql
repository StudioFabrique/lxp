/*
  Warnings:

  - Added the required column `used` to the `Mediatheque` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mediatheque" ADD COLUMN     "used" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Parcours" ALTER COLUMN "startDate" SET DEFAULT DATE_TRUNC('day', NOW() + interval '1 day'),
ALTER COLUMN "endDate" SET DEFAULT DATE_TRUNC('day', NOW() + interval '2 month');
