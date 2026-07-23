#!/usr/bin/env bash
set -euo pipefail

container_name="${POSTGRES_TEST_CONTAINER:-tests-prisma}"
fixture_db="lxp_module_migration_test"
reject_db="lxp_module_migration_reject_test"
final_migration="prisma/migrations/20260723120000_flatten_module_model/migration.sql"

drop_databases() {
  docker exec "$container_name" psql -U prisma -d postgres \
    -c "DROP DATABASE IF EXISTS $fixture_db" >/dev/null
  docker exec "$container_name" psql -U prisma -d postgres \
    -c "DROP DATABASE IF EXISTS $reject_db" >/dev/null
}
trap drop_databases EXIT

create_legacy_database() {
  local database_name="$1"
  docker exec "$container_name" psql -U prisma -d postgres \
    -c "DROP DATABASE IF EXISTS $database_name" >/dev/null
  docker exec "$container_name" psql -U prisma -d postgres \
    -c "CREATE DATABASE $database_name" >/dev/null

  for migration in prisma/migrations/*/migration.sql; do
    if [[ "$migration" != *20260723120000_flatten_module_model* ]]; then
      docker exec -i "$container_name" psql -v ON_ERROR_STOP=1 \
        -U prisma -d "$database_name" < "$migration" >/dev/null
    fi
  done
}

create_legacy_database "$fixture_db"

docker exec -i "$container_name" psql -v ON_ERROR_STOP=1 \
  -U prisma -d "$fixture_db" >/dev/null <<'SQL'
INSERT INTO "Admin" (id, "idMdb") VALUES (1, 'admin-mongo');
INSERT INTO "Formation" (id, title, level, "updatedAt", "adminId")
VALUES (1, 'Formation A', 'test', now(), 1);
INSERT INTO "Parcours" (id, title, "updatedAt", author, "adminId", "formationId")
VALUES
  (10, 'Parcours A', now(), 'Admin', 1, 1),
  (11, 'Parcours B', now(), 'Admin', 1, 1);
INSERT INTO "Module" (
  id, title, description, "updatedAt", author, "adminId", "quizInstructions"
)
VALUES (
  20, 'Module partagé', 'Description', now(), 'Admin', 1, 'Quiz'
);
INSERT INTO "ModulesOnFormation" ("formationId", "moduleId") VALUES (1, 20);
INSERT INTO "ModuleMetadata" (
  id, duration, "moduleId", "updatedAt", "adminId", "parcoursId"
)
VALUES
  (100, 4, 20, now(), 1, 10),
  (101, 6, 20, now(), 1, 11);
INSERT INTO "Contact" (id, "idMdb", name, role, "updatedAt")
VALUES (30, 'contact-mongo', 'Contact', 'teacher', now());
INSERT INTO "ContactsOnModuleMetadata" ("contactId", "moduleId")
VALUES (30, 100), (30, 101);
INSERT INTO "BonusSkill" (id, description, "updatedAt", "parcoursId")
VALUES
  (40, 'Compétence A', now(), 10),
  (41, 'Compétence B', now(), 11);
INSERT INTO "BonusSkillsOnModuleMetadata" ("bonusSkillId", "moduleId")
VALUES (40, 100), (41, 101);
INSERT INTO "Course" (
  id, title, "moduleId", dates, "order", "updatedAt", author, "adminId",
  "courseSlug"
)
VALUES
  (50, 'Cours A', 100, ARRAY[]::jsonb[], 1, now(), 'Admin', 1, 'slug-a'),
  (51, 'Cours B', 101, ARRAY[]::jsonb[], 1, now(), 'Admin', 1, 'slug-b');
INSERT INTO "Quiz" (id, title, type, "moduleId", "updatedAt")
VALUES (60, 'Quiz partagé', 'preliminary', 20, now());
INSERT INTO "QuizQuestion" (
  id, "externalId", type, prompt, tags, data, "contentHash", "updatedAt",
  "quizId"
)
VALUES (
  70, 'external', 'mcq', 'Question', ARRAY['tag'],
  '{"options":["A","B"]}'::jsonb, 'hash-source', now(), 60
);
INSERT INTO "QuizQuestionReport" (id, "quizQuestionId", commentaire)
VALUES (80, 70, 'report');
SQL

docker exec -i "$container_name" psql -v ON_ERROR_STOP=1 \
  -U prisma -d "$fixture_db" < "$final_migration" >/dev/null

docker exec -i "$container_name" psql -v ON_ERROR_STOP=1 \
  -U prisma -d "$fixture_db" >/dev/null <<'SQL'
DO $$
BEGIN
  IF (SELECT count(*) FROM "Module") <> 2 THEN
    RAISE EXCEPTION 'expected two flat modules';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "Course" c
    LEFT JOIN "Module" m ON m.id = c."moduleId"
    WHERE m.id IS NULL
  ) THEN
    RAISE EXCEPTION 'orphan course';
  END IF;
  IF (SELECT count(*) FROM "Quiz" WHERE "moduleId" IN (100, 101)) <> 2 THEN
    RAISE EXCEPTION 'expected cloned quizzes';
  END IF;
  IF (SELECT count(*) FROM "QuizQuestionReport") <> 2 THEN
    RAISE EXCEPTION 'expected cloned reports';
  END IF;
  IF to_regclass('"ModuleMetadata"') IS NOT NULL
    OR to_regclass('"ModulesOnFormation"') IS NOT NULL THEN
    RAISE EXCEPTION 'legacy tables remain';
  END IF;
END $$;
SQL

create_legacy_database "$reject_db"
docker exec "$container_name" psql -v ON_ERROR_STOP=1 \
  -U prisma -d "$reject_db" -c \
  "INSERT INTO \"Admin\" (id,\"idMdb\") VALUES (1,'admin-mongo');
   INSERT INTO \"Module\" (id,title,\"updatedAt\",author,\"adminId\")
   VALUES (20,'Module orphelin',now(),'Admin',1);" >/dev/null

if docker exec -i "$container_name" psql -v ON_ERROR_STOP=1 \
  -U prisma -d "$reject_db" < "$final_migration" >/dev/null 2>&1; then
  echo "The migration unexpectedly accepted an orphan module." >&2
  exit 1
fi

docker exec -i "$container_name" psql -v ON_ERROR_STOP=1 \
  -U prisma -d "$reject_db" >/dev/null <<'SQL'
DO $$
BEGIN
  IF to_regclass('"ModuleMetadata"') IS NULL
    OR (SELECT count(*) FROM "Module" WHERE id = 20) <> 1 THEN
    RAISE EXCEPTION 'rollback did not preserve the legacy schema and data';
  END IF;
END $$;
SQL

echo "Flat module migration fixture and rollback checks passed."
