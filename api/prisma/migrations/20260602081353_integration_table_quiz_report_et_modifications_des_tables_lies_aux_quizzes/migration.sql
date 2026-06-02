/*
  Warnings:

  - You are about to drop the column `quizzId` on the `QuizQuestion` table. All the data in the column will be lost.
  - You are about to drop the `Quizz` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QuizQuestion" DROP CONSTRAINT "QuizQuestion_quizzId_fkey";

-- DropForeignKey
ALTER TABLE "Quizz" DROP CONSTRAINT "Quizz_activityId_fkey";

-- DropForeignKey
ALTER TABLE "Quizz" DROP CONSTRAINT "Quizz_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Quizz" DROP CONSTRAINT "Quizz_moduleId_fkey";

-- AlterTable
ALTER TABLE "QuizQuestion" DROP COLUMN "quizzId",
ADD COLUMN     "quizId" INTEGER;

-- DropTable
DROP TABLE "Quizz";

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "moduleId" INTEGER,
    "activityId" INTEGER,
    "courseId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestionReport" (
    "id" SERIAL NOT NULL,
    "quizQuestionId" INTEGER,
    "commentaire" TEXT,

    CONSTRAINT "QuizQuestionReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestionReport" ADD CONSTRAINT "QuizQuestionReport_quizQuestionId_fkey" FOREIGN KEY ("quizQuestionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
