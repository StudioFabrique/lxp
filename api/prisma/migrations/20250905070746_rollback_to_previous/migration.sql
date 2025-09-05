/*
  Warnings:

  - You are about to drop the `TagsOnLesson` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `courseId` on table `Lesson` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "TagsOnLesson" DROP CONSTRAINT "TagsOnLesson_lessonId_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnLesson" DROP CONSTRAINT "TagsOnLesson_tagId_fkey";

-- AlterTable
ALTER TABLE "Lesson" ALTER COLUMN "courseId" SET NOT NULL;

-- DropTable
DROP TABLE "TagsOnLesson";

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
