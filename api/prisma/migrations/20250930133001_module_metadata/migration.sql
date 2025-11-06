/*
  Warnings:

  - You are about to drop the column `duration` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `maxDate` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `minDate` on the `Module` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Module` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Module" DROP COLUMN "duration",
DROP COLUMN "maxDate",
DROP COLUMN "minDate",
DROP COLUMN "rating";

-- CreateTable
CREATE TABLE "ModuleMetadata" (
    "id" SERIAL NOT NULL,
    "duration" INTEGER,
    "rating" DOUBLE PRECISION,
    "minDate" TIMESTAMP(3),
    "maxDate" TIMESTAMP(3),
    "moduleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "adminId" INTEGER NOT NULL,

    CONSTRAINT "ModuleMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleMetadataOnParcours" (
    "moduleId" INTEGER NOT NULL,
    "parcoursId" INTEGER NOT NULL,

    CONSTRAINT "ModuleMetadataOnParcours_pkey" PRIMARY KEY ("moduleId","parcoursId")
);

-- AddForeignKey
ALTER TABLE "ModuleMetadata" ADD CONSTRAINT "ModuleMetadata_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleMetadata" ADD CONSTRAINT "ModuleMetadata_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleMetadataOnParcours" ADD CONSTRAINT "ModuleMetadataOnParcours_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "ModuleMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleMetadataOnParcours" ADD CONSTRAINT "ModuleMetadataOnParcours_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES "Parcours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
