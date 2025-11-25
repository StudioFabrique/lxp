-- DropForeignKey
ALTER TABLE "ModulesOnFormation" DROP CONSTRAINT "ModulesOnFormation_formationId_fkey";

-- DropForeignKey
ALTER TABLE "ModulesOnFormation" DROP CONSTRAINT "ModulesOnFormation_moduleId_fkey";

-- AddForeignKey
ALTER TABLE "ModulesOnFormation" ADD CONSTRAINT "ModulesOnFormation_formationId_fkey" FOREIGN KEY ("formationId") REFERENCES "Formation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModulesOnFormation" ADD CONSTRAINT "ModulesOnFormation_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
