-- DropForeignKey
ALTER TABLE "GroupsOnParcours" DROP CONSTRAINT "GroupsOnParcours_parcoursId_fkey";

-- AlterTable
ALTER TABLE "Parcours" ALTER COLUMN "startDate" SET DEFAULT DATE_TRUNC('day', NOW() + interval '1 day'),
ALTER COLUMN "endDate" SET DEFAULT DATE_TRUNC('day', NOW() + interval '2 month');

-- AddForeignKey
ALTER TABLE "GroupsOnParcours" ADD CONSTRAINT "GroupsOnParcours_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES "Parcours"("id") ON DELETE CASCADE ON UPDATE CASCADE;
