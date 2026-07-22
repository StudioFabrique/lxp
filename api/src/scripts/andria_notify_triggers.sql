CREATE OR REPLACE FUNCTION andria_notify_change() RETURNS trigger AS $$
DECLARE
  rec         record;
  slug        text;
  changed_url text := NULL;
BEGIN
  rec := COALESCE(NEW, OLD);

  IF TG_TABLE_NAME = 'Course' THEN
     slug := rec."courseSlug";
  ELSIF TG_TABLE_NAME = 'Lesson' THEN
     SELECT c."courseSlug" INTO slug
       FROM "Course" c
       WHERE c.id = rec."courseId";
  ELSE
     SELECT c."courseSlug" INTO slug
       FROM "Lesson" l
       JOIN "Course" c ON c.id = l."courseId"
       WHERE l.id = rec."lessonId";
     changed_url := rec."url";
  END IF;

  PERFORM pg_notify(
    'andria_lxp_changes',
    json_build_object(
      'table', TG_TABLE_NAME,
      'op',    TG_OP,
      'slug',  slug,
      'url',   changed_url
    )::text
  );

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS andria_course_ch   ON "Course";
DROP TRIGGER IF EXISTS andria_lesson_ch   ON "Lesson";
DROP TRIGGER IF EXISTS andria_activity_ch ON "Activity";

CREATE TRIGGER andria_course_ch   AFTER INSERT OR UPDATE OR DELETE ON "Course"
  FOR EACH ROW EXECUTE FUNCTION andria_notify_change();
CREATE TRIGGER andria_lesson_ch   AFTER INSERT OR UPDATE OR DELETE ON "Lesson"
  FOR EACH ROW EXECUTE FUNCTION andria_notify_change();
CREATE TRIGGER andria_activity_ch AFTER INSERT OR UPDATE OR DELETE ON "Activity"
  FOR EACH ROW EXECUTE FUNCTION andria_notify_change();
