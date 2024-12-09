-- DropForeignKey
ALTER TABLE "BonusSkill" DROP CONSTRAINT "BonusSkill_parcoursId_fkey";

-- DropForeignKey
ALTER TABLE "GroupsOnParcours" DROP CONSTRAINT "GroupsOnParcours_parcoursId_fkey";

-- DropForeignKey
ALTER TABLE "Objective" DROP CONSTRAINT "Objective_parcoursId_fkey";

-- AlterTable
ALTER TABLE "Parcours" ALTER COLUMN "startDate" SET DEFAULT DATE_TRUNC('day', NOW() + interval '1 day'),
ALTER COLUMN "endDate" SET DEFAULT DATE_TRUNC('day', NOW() + interval '2 month');

-- CreateTable
CREATE TABLE "ResourceActivity" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "activityId" INTEGER NOT NULL,

    CONSTRAINT "ResourceActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BonusSkill" ADD CONSTRAINT "BonusSkill_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES "Parcours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Objective" ADD CONSTRAINT "Objective_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES "Parcours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceActivity" ADD CONSTRAINT "ResourceActivity_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupsOnParcours" ADD CONSTRAINT "GroupsOnParcours_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES "Parcours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
