/*
  Warnings:

  - You are about to drop the `ModuleMetadataOnParcours` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `parcoursId` to the `ModuleMetadata` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ModuleMetadataOnParcours" DROP CONSTRAINT "ModuleMetadataOnParcours_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "ModuleMetadataOnParcours" DROP CONSTRAINT "ModuleMetadataOnParcours_parcoursId_fkey";

-- AlterTable
ALTER TABLE "ModuleMetadata" ADD COLUMN     "parcoursId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ModuleMetadataOnParcours";

-- AddForeignKey
ALTER TABLE "ModuleMetadata" ADD CONSTRAINT "ModuleMetadata_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES "Parcours"("id") ON DELETE CASCADE ON UPDATE CASCADE;
