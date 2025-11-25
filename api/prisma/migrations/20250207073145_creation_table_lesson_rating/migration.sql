-- CreateTable
CREATE TABLE "LessonRating" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "LessonRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LessonRating" ADD CONSTRAINT "LessonRating_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonRating" ADD CONSTRAINT "LessonRating_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
