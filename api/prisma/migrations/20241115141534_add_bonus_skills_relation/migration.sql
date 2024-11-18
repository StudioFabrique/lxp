-- DropForeignKey
ALTER TABLE "BonusSkill" DROP CONSTRAINT "BonusSkill_parcoursId_fkey";

-- DropForeignKey
ALTER TABLE "Objective" DROP CONSTRAINT "Objective_parcoursId_fkey";

-- AlterTable
ALTER TABLE "Parcours" ALTER COLUMN "startDate" SET DEFAULT DATE_TRUNC('day', NOW() + interval '1 day'),
ALTER COLUMN "endDate" SET DEFAULT DATE_TRUNC('day', NOW() + interval '2 month');

-- AddForeignKey
ALTER TABLE "BonusSkill" ADD CONSTRAINT "BonusSkill_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES "Parcours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objective" ADD CONSTRAINT "Objective_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES "Parcours"("id") ON DELETE CASCADE ON UPDATE CASCADE;
