BEGIN;

-- Refuse the cut-over when an old shared module has no parcours instance.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "Module" m
    LEFT JOIN "ModuleMetadata" mm ON mm."moduleId" = m.id
    WHERE mm.id IS NULL
  ) THEN
    RAISE EXCEPTION
      'Module migration aborted: at least one Module has no ModuleMetadata/parcours';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM "ModuleMetadata" mm
    JOIN "Parcours" p ON p.id = mm."parcoursId"
    WHERE NOT EXISTS (
      SELECT 1
      FROM "ModulesOnFormation" mof
      WHERE mof."moduleId" = mm."moduleId"
        AND mof."formationId" = p."formationId"
    )
  ) THEN
    RAISE EXCEPTION
      'Module migration aborted: a module/parcours formation association is inconsistent';
  END IF;
END $$;

ALTER TABLE "Module" RENAME TO "LegacyModule";
-- PostgreSQL keeps constraint names when a table is renamed. Free the names
-- expected by the final Prisma schema before creating the replacement table.
ALTER TABLE "LegacyModule"
  RENAME CONSTRAINT "Module_pkey" TO "LegacyModule_pkey";
ALTER TABLE "LegacyModule"
  RENAME CONSTRAINT "Module_adminId_fkey" TO "LegacyModule_adminId_fkey";

CREATE TABLE "Module" (
  "id" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "quizInstructions" TEXT,
  "image" BYTEA,
  "thumb" BYTEA,
  "duration" INTEGER,
  "rating" DOUBLE PRECISION,
  "minDate" TIMESTAMP(3),
  "maxDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "author" TEXT NOT NULL,
  "adminId" INTEGER NOT NULL,
  "parcoursId" INTEGER NOT NULL,
  "duplicationIndex" INTEGER NOT NULL DEFAULT 0,

  CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Module" (
  "id", "title", "description", "quizInstructions", "image", "thumb",
  "duration", "rating", "minDate", "maxDate", "createdAt", "updatedAt",
  "author", "adminId", "parcoursId", "duplicationIndex"
)
SELECT
  mm.id, legacy.title, legacy.description, legacy."quizInstructions",
  legacy.image, legacy.thumb, mm.duration, mm.rating, mm."minDate", mm."maxDate",
  mm."createdAt", GREATEST(mm."updatedAt", legacy."updatedAt"),
  legacy.author, mm."adminId", mm."parcoursId", legacy."duplicationIndex"
FROM "ModuleMetadata" mm
JOIN "LegacyModule" legacy ON legacy.id = mm."moduleId";

DO $$
DECLARE
  metadata_count BIGINT;
  module_count BIGINT;
BEGIN
  SELECT COUNT(*) INTO metadata_count FROM "ModuleMetadata";
  SELECT COUNT(*) INTO module_count FROM "Module";
  IF metadata_count <> module_count THEN
    RAISE EXCEPTION
      'Module migration aborted: copied % rows but expected %',
      module_count, metadata_count;
  END IF;
END $$;

ALTER TABLE "Module"
  ADD CONSTRAINT "Module_adminId_fkey"
    FOREIGN KEY ("adminId") REFERENCES "Admin"("id")
    ON DELETE SET DEFAULT ON UPDATE CASCADE,
  ADD CONSTRAINT "Module_parcoursId_fkey"
    FOREIGN KEY ("parcoursId") REFERENCES "Parcours"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Course.moduleId already contains the public ModuleMetadata identifier.
ALTER TABLE "Course"
  DROP CONSTRAINT "Course_moduleId_fkey",
  ADD CONSTRAINT "Course_moduleId_fkey"
    FOREIGN KEY ("moduleId") REFERENCES "Module"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ContactsOnModuleMetadata"
  DROP CONSTRAINT "ContactsOnModuleMetadata_moduleId_fkey";
ALTER TABLE "ContactsOnModuleMetadata" RENAME TO "ContactsOnModule";
ALTER TABLE "ContactsOnModule"
  ADD CONSTRAINT "ContactsOnModule_moduleId_fkey"
    FOREIGN KEY ("moduleId") REFERENCES "Module"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BonusSkillsOnModuleMetadata"
  DROP CONSTRAINT "BonusSkillsOnModuleMetadata_moduleId_fkey";
ALTER TABLE "BonusSkillsOnModuleMetadata" RENAME TO "BonusSkillsOnModule";
ALTER TABLE "BonusSkillsOnModule"
  ADD CONSTRAINT "BonusSkillsOnModule_moduleId_fkey"
    FOREIGN KEY ("moduleId") REFERENCES "Module"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

-- Module quizzes belonged to the old shared module. Clone the whole quiz tree
-- for every new independent module instance. contentHash is deliberately NULL
-- on cloned questions because that cache key is globally unique.
CREATE TEMP TABLE "_LegacyModuleQuiz" AS
SELECT id FROM "Quiz" WHERE "moduleId" IS NOT NULL;

ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_moduleId_fkey";

DO $$
DECLARE
  old_quiz RECORD;
  target_module RECORD;
  old_question RECORD;
  new_quiz_id INTEGER;
  new_question_id INTEGER;
BEGIN
  FOR old_quiz IN
    SELECT q.*
    FROM "Quiz" q
    WHERE q."moduleId" IS NOT NULL
  LOOP
    FOR target_module IN
      SELECT mm.id
      FROM "ModuleMetadata" mm
      WHERE mm."moduleId" = old_quiz."moduleId"
      ORDER BY mm.id
    LOOP
      INSERT INTO "Quiz" (
        "title", "type", "moduleId", "activityId", "courseId",
        "createdAt", "updatedAt", "studentId"
      )
      VALUES (
        old_quiz.title, old_quiz.type, NULL, old_quiz."activityId",
        old_quiz."courseId", old_quiz."createdAt", old_quiz."updatedAt",
        old_quiz."studentId"
      )
      RETURNING id INTO new_quiz_id;

      FOR old_question IN
        SELECT qq.*
        FROM "QuizQuestion" qq
        WHERE qq."quizId" = old_quiz.id
        ORDER BY qq.id
      LOOP
        INSERT INTO "QuizQuestion" (
          "quizId", "externalId", "type", "difficulty", "prompt",
          "explanationTrue", "explanationWrong", "tags", "data",
          "contentHash", "createdAt", "updatedAt"
        )
        VALUES (
          new_quiz_id, old_question."externalId", old_question.type,
          old_question.difficulty, old_question.prompt,
          old_question."explanationTrue", old_question."explanationWrong",
          old_question.tags, old_question.data, NULL,
          old_question."createdAt", old_question."updatedAt"
        )
        RETURNING id INTO new_question_id;

        INSERT INTO "QuizQuestionReport" ("quizQuestionId", "commentaire")
        SELECT new_question_id, report.commentaire
        FROM "QuizQuestionReport" report
        WHERE report."quizQuestionId" = old_question.id;
      END LOOP;

      UPDATE "Quiz"
      SET "moduleId" = target_module.id
      WHERE id = new_quiz_id;
    END LOOP;
  END LOOP;
END $$;

DELETE FROM "Quiz"
WHERE id IN (SELECT id FROM "_LegacyModuleQuiz");

ALTER TABLE "Quiz"
  ADD CONSTRAINT "Quiz_moduleId_fkey"
    FOREIGN KEY ("moduleId") REFERENCES "Module"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "Course" c
    LEFT JOIN "Module" m ON m.id = c."moduleId"
    WHERE m.id IS NULL
  ) OR EXISTS (
    SELECT 1 FROM "ContactsOnModule" cm
    LEFT JOIN "Module" m ON m.id = cm."moduleId"
    WHERE m.id IS NULL
  ) OR EXISTS (
    SELECT 1 FROM "BonusSkillsOnModule" bsm
    LEFT JOIN "Module" m ON m.id = bsm."moduleId"
    WHERE m.id IS NULL
  ) OR EXISTS (
    SELECT 1 FROM "Quiz" q
    LEFT JOIN "Module" m ON m.id = q."moduleId"
    WHERE q."moduleId" IS NOT NULL AND m.id IS NULL
  ) THEN
    RAISE EXCEPTION
      'Module migration aborted: an orphan relation was detected before DROP';
  END IF;
END $$;

DROP TABLE "ModulesOnFormation";
DROP TABLE "ModuleMetadata";
DROP TABLE "LegacyModule";

CREATE SEQUENCE IF NOT EXISTS "Module_id_seq" OWNED BY "Module"."id";
SELECT setval(
  '"Module_id_seq"',
  COALESCE((SELECT MAX(id) FROM "Module"), 1),
  EXISTS (SELECT 1 FROM "Module")
);
ALTER TABLE "Module"
  ALTER COLUMN "id" SET DEFAULT nextval('"Module_id_seq"');

COMMIT;
