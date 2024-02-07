/*
  Warnings:

  - Added the required column `adminId` to the `Formation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Formation" ADD COLUMN     "adminId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Formation" ADD CONSTRAINT "Formation_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
