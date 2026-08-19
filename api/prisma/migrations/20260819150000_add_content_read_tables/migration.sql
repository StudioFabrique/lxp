-- Tables de suivi de lecture par contenu (module / cours / activité) + accumulateur
-- de temps réel de lecture, nécessaires aux indicateurs "time_on_content".
--
-- Les renommages de contraintes "*OnModuleMetadata_*" ne sont pas liés à cette
-- fonctionnalité : ce sont les noms laissés par 20260723120000_flatten_module_model,
-- que Prisma réaligne à la première migration suivante.

BEGIN;

-- Garde-fou : les contraintes d'unicité ajoutées plus bas échouent sur données existantes.
DO $$
DECLARE
  lesson_dups INTEGER;
  student_dups INTEGER;
BEGIN
  SELECT count(*) INTO lesson_dups
  FROM (SELECT "lessonId", "studentId" FROM "LessonRead" GROUP BY 1, 2 HAVING count(*) > 1) t;

  IF lesson_dups > 0 THEN
    RAISE EXCEPTION 'Migration interrompue : % couple(s) (lessonId, studentId) en double dans LessonRead. Dédoublonner avant de rejouer.', lesson_dups;
  END IF;

  SELECT count(*) INTO student_dups
  FROM (SELECT "idMdb" FROM "Student" GROUP BY 1 HAVING count(*) > 1) t;

  IF student_dups > 0 THEN
    RAISE EXCEPTION 'Migration interrompue : % idMdb en double dans Student. Dédoublonner avant de rejouer.', student_dups;
  END IF;
END $$;

-- AlterTable
ALTER TABLE "BonusSkillsOnModule" RENAME CONSTRAINT "BonusSkillsOnModuleMetadata_pkey" TO "BonusSkillsOnModule_pkey";

-- AlterTable
ALTER TABLE "ContactsOnModule" RENAME CONSTRAINT "ContactsOnModuleMetadata_pkey" TO "ContactsOnModule_pkey";

-- AlterTable
ALTER TABLE "LessonRead" ADD COLUMN     "readTimeMs" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ModuleRead" (
    "id" SERIAL NOT NULL,
    "beganAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastOpenedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "readTimeMs" INTEGER NOT NULL DEFAULT 0,
    "moduleId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "ModuleRead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseRead" (
    "id" SERIAL NOT NULL,
    "beganAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastOpenedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "readTimeMs" INTEGER NOT NULL DEFAULT 0,
    "courseId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "CourseRead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityRead" (
    "id" SERIAL NOT NULL,
    "beganAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastOpenedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "readTimeMs" INTEGER NOT NULL DEFAULT 0,
    "activityId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "ActivityRead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ModuleRead_studentId_lastOpenedAt_idx" ON "ModuleRead"("studentId", "lastOpenedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleRead_moduleId_studentId_key" ON "ModuleRead"("moduleId", "studentId");

-- CreateIndex
CREATE INDEX "CourseRead_studentId_lastOpenedAt_idx" ON "CourseRead"("studentId", "lastOpenedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CourseRead_courseId_studentId_key" ON "CourseRead"("courseId", "studentId");

-- CreateIndex
CREATE INDEX "ActivityRead_studentId_lastOpenedAt_idx" ON "ActivityRead"("studentId", "lastOpenedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityRead_activityId_studentId_key" ON "ActivityRead"("activityId", "studentId");

-- CreateIndex
CREATE INDEX "LessonRead_studentId_lastOpenedAt_idx" ON "LessonRead"("studentId", "lastOpenedAt");

-- CreateIndex
CREATE UNIQUE INDEX "LessonRead_lessonId_studentId_key" ON "LessonRead"("lessonId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_idMdb_key" ON "Student"("idMdb");

-- RenameForeignKey
ALTER TABLE "BonusSkillsOnModule" RENAME CONSTRAINT "BonusSkillsOnModuleMetadata_bonusSkillId_fkey" TO "BonusSkillsOnModule_bonusSkillId_fkey";

-- RenameForeignKey
ALTER TABLE "ContactsOnModule" RENAME CONSTRAINT "ContactsOnModuleMetadata_contactId_fkey" TO "ContactsOnModule_contactId_fkey";

-- AddForeignKey
ALTER TABLE "ModuleRead" ADD CONSTRAINT "ModuleRead_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleRead" ADD CONSTRAINT "ModuleRead_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRead" ADD CONSTRAINT "CourseRead_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseRead" ADD CONSTRAINT "CourseRead_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityRead" ADD CONSTRAINT "ActivityRead_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityRead" ADD CONSTRAINT "ActivityRead_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


COMMIT;
