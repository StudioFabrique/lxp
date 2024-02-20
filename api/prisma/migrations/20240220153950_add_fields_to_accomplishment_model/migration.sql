/*
  Warnings:

  - Added the required column `name` to the `Accomplishment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Accomplishment" ADD COLUMN     "hasBeenCongratulated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL;
