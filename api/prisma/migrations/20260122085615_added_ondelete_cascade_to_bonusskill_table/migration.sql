-- DropForeignKey
ALTER TABLE "BonusSkillsOnModuleMetadata" DROP CONSTRAINT "BonusSkillsOnModuleMetadata_bonusSkillId_fkey";

-- AddForeignKey
ALTER TABLE "BonusSkillsOnModuleMetadata" ADD CONSTRAINT "BonusSkillsOnModuleMetadata_bonusSkillId_fkey" FOREIGN KEY ("bonusSkillId") REFERENCES "BonusSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
