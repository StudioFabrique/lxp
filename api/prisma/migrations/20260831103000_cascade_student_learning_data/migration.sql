-- Les traces d'apprentissage appartiennent à l'apprenant. Elles ne doivent pas
-- empêcher la suppression de son compte et n'ont pas de sens sans lui.

BEGIN;

-- DropForeignKey
ALTER TABLE "Accomplishment" DROP CONSTRAINT "Accomplishment_studentId_fkey";

-- DropForeignKey
ALTER TABLE "LessonRating" DROP CONSTRAINT "LessonRating_studentId_fkey";

-- DropForeignKey
ALTER TABLE "LessonRead" DROP CONSTRAINT "LessonRead_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ModuleRead" DROP CONSTRAINT "ModuleRead_studentId_fkey";

-- DropForeignKey
ALTER TABLE "CourseRead" DROP CONSTRAINT "CourseRead_studentId_fkey";

-- DropForeignKey
ALTER TABLE "ActivityRead" DROP CONSTRAINT "ActivityRead_studentId_fkey";

-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_studentId_fkey";

-- AddForeignKey
ALTER TABLE "Accomplishment" ADD CONSTRAINT "Accomplishment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonRating" ADD CONSTRAINT "LessonRating_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonRead" ADD CONSTRAINT "LessonRead_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleRead" ADD CONSTRAINT "ModuleRead_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRead" ADD CONSTRAINT "CourseRead_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityRead" ADD CONSTRAINT "ActivityRead_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
