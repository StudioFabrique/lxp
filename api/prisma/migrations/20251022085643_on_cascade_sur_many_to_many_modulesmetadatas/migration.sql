-- DropForeignKey
ALTER TABLE "BonusSkillsOnModuleMetadata" DROP CONSTRAINT "BonusSkillsOnModuleMetadata_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "ContactsOnModuleMetadata" DROP CONSTRAINT "ContactsOnModuleMetadata_moduleId_fkey";

-- AddForeignKey
ALTER TABLE "BonusSkillsOnModuleMetadata" ADD CONSTRAINT "BonusSkillsOnModuleMetadata_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "ModuleMetadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactsOnModuleMetadata" ADD CONSTRAINT "ContactsOnModuleMetadata_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "ModuleMetadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;
