/*
  Warnings:

  - The primary key for the `BonusSkillsOnModuleMetadata` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `moduleMetadataId` on the `BonusSkillsOnModuleMetadata` table. All the data in the column will be lost.
  - Added the required column `moduleId` to the `BonusSkillsOnModuleMetadata` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BonusSkillsOnModuleMetadata" DROP CONSTRAINT "BonusSkillsOnModuleMetadata_moduleMetadataId_fkey";

-- AlterTable
ALTER TABLE "BonusSkillsOnModuleMetadata" DROP CONSTRAINT "BonusSkillsOnModuleMetadata_pkey",
DROP COLUMN "moduleMetadataId",
ADD COLUMN     "moduleId" INTEGER NOT NULL,
ADD CONSTRAINT "BonusSkillsOnModuleMetadata_pkey" PRIMARY KEY ("bonusSkillId", "moduleId");

-- AddForeignKey
ALTER TABLE "BonusSkillsOnModuleMetadata" ADD CONSTRAINT "BonusSkillsOnModuleMetadata_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "ModuleMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
