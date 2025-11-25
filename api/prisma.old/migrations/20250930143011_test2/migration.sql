/*
  Warnings:

  - You are about to drop the `BonusSkillsOnModule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ContactsOnModule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ModulesOnParcours` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BonusSkillsOnModule" DROP CONSTRAINT "BonusSkillsOnModule_bonusSkillId_fkey";

-- DropForeignKey
ALTER TABLE "BonusSkillsOnModule" DROP CONSTRAINT "BonusSkillsOnModule_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "ContactsOnModule" DROP CONSTRAINT "ContactsOnModule_contactId_fkey";

-- DropForeignKey
ALTER TABLE "ContactsOnModule" DROP CONSTRAINT "ContactsOnModule_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "ModulesOnParcours" DROP CONSTRAINT "ModulesOnParcours_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "ModulesOnParcours" DROP CONSTRAINT "ModulesOnParcours_parcoursId_fkey";

-- DropTable
DROP TABLE "BonusSkillsOnModule";

-- DropTable
DROP TABLE "ContactsOnModule";

-- DropTable
DROP TABLE "ModulesOnParcours";

-- CreateTable
CREATE TABLE "BonusSkillsOnModuleMetadata" (
    "bonusSkillId" INTEGER NOT NULL,
    "moduleMetadataId" INTEGER NOT NULL,

    CONSTRAINT "BonusSkillsOnModuleMetadata_pkey" PRIMARY KEY ("bonusSkillId","moduleMetadataId")
);

-- CreateTable
CREATE TABLE "ContactsOnModuleMetadata" (
    "contactId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,

    CONSTRAINT "ContactsOnModuleMetadata_pkey" PRIMARY KEY ("contactId","moduleId")
);

-- AddForeignKey
ALTER TABLE "BonusSkillsOnModuleMetadata" ADD CONSTRAINT "BonusSkillsOnModuleMetadata_bonusSkillId_fkey" FOREIGN KEY ("bonusSkillId") REFERENCES "BonusSkill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BonusSkillsOnModuleMetadata" ADD CONSTRAINT "BonusSkillsOnModuleMetadata_moduleMetadataId_fkey" FOREIGN KEY ("moduleMetadataId") REFERENCES "ModuleMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactsOnModuleMetadata" ADD CONSTRAINT "ContactsOnModuleMetadata_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactsOnModuleMetadata" ADD CONSTRAINT "ContactsOnModuleMetadata_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "ModuleMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "ModuleMetadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
