/*
  Warnings:

  - You are about to drop the `BonusSkillOnCourse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ObjectivesOnCourse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BonusSkillOnCourse" DROP CONSTRAINT "BonusSkillOnCourse_bonusSkillId_fkey";

-- DropForeignKey
ALTER TABLE "BonusSkillOnCourse" DROP CONSTRAINT "BonusSkillOnCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "ObjectivesOnCourse" DROP CONSTRAINT "ObjectivesOnCourse_courseId_fkey";

-- DropForeignKey
ALTER TABLE "ObjectivesOnCourse" DROP CONSTRAINT "ObjectivesOnCourse_objectiveId_fkey";

-- DropTable
DROP TABLE "BonusSkillOnCourse";

-- DropTable
DROP TABLE "ObjectivesOnCourse";
