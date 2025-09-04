-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_tagId_fkey";

-- AlterTable
ALTER TABLE "Lesson" ALTER COLUMN "courseId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "TagsOnLesson" (
    "tagId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,

    CONSTRAINT "TagsOnLesson_pkey" PRIMARY KEY ("tagId","lessonId")
);

-- AddForeignKey
ALTER TABLE "TagsOnLesson" ADD CONSTRAINT "TagsOnLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnLesson" ADD CONSTRAINT "TagsOnLesson_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
