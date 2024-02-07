/*
  Warnings:

  - You are about to drop the column `readBy` on the `Lesson` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "readBy";

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "idMdb" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonRead" (
    "id" SERIAL NOT NULL,
    "beganAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "lessonId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "LessonRead_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LessonRead" ADD CONSTRAINT "LessonRead_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonRead" ADD CONSTRAINT "LessonRead_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
