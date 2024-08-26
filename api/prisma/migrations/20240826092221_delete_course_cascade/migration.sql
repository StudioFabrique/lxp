-- DropForeignKey
ALTER TABLE "BonusSkillOnCourse" DROP CONSTRAINT "BonusSkillOnCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "ContactsOnCourse" DROP CONSTRAINT "ContactsOnCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "ObjectivesOnCourse" DROP CONSTRAINT "ObjectivesOnCourse_courseId_fkey";

-- AlterTable
ALTER TABLE "Parcours" ALTER COLUMN "startDate" SET DEFAULT NOW() + interval '1 day',
ALTER COLUMN "endDate" SET DEFAULT NOW() + interval '2 month';

-- AddForeignKey
ALTER TABLE "ContactsOnCourse" ADD CONSTRAINT "ContactsOnCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectivesOnCourse" ADD CONSTRAINT "ObjectivesOnCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BonusSkillOnCourse" ADD CONSTRAINT "BonusSkillOnCourse_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
