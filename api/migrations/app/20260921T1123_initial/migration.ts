#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/435269178a774bff213921631a2f3982db5c1a5dccb686f6e050fe36a0c5754e/contract';
import endContract from '../../snapshots/435269178a774bff213921631a2f3982db5c1a5dccb686f6e050fe36a0c5754e/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
  rawSql,
} from '@prisma/orm-postgres/migration';

// Preserve the display-label normalization from the previous baseline.
const normalizedLabels: Record<string, readonly string[]> = {
  Accomplishment: ['name'],
  Activity: ['title'],
  BonusActivity: ['title'],
  Course: ['title'],
  CourseAssignmentCriterion: ['label'],
  Formation: ['title'],
  Lesson: ['title'],
  Module: ['title'],
  Parcours: ['title'],
  Quiz: ['title'],
  Resource: ['title'],
  ResourceActivity: ['label'],
  ResourceBonusActivity: ['label'],
  Tag: ['name'],
};

const normalizeLabelsSql = `
CREATE FUNCTION public.normalize_display_fields() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  column_name text;
  value text;
  normalized jsonb := '{}'::jsonb;
BEGIN
  FOREACH column_name IN ARRAY TG_ARGV LOOP
    value := to_jsonb(NEW)->>column_name;
    IF value IS NOT NULL THEN
      normalized := normalized || jsonb_build_object(column_name, lower(value));
    END IF;
  END LOOP;
  NEW := jsonb_populate_record(NEW, normalized);
  RETURN NEW;
END;
$$`;

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'Accomplishment',
        columns: [
          col('accomplishedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('courseId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('hasBeenCongratulated', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('showToOtherStudent', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Activity',
        columns: [
          col('authorId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('duplicationIndex', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lessonId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('order', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ActivityRead',
        columns: [
          col('activityId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('beganAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('finishedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lastOpenedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('readTimeMs', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Admin',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('idMdb', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'AssignmentCriterionScore',
        columns: [
          col('criterionId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('score', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('submissionId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'AssignmentSubmission',
        columns: [
          col('assignmentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('feedback', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('grade', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('gradedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('gradedBy', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('submittedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('text', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'AssignmentSubmissionFile',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('mimeType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('originalName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('size', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('storedName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('submissionId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Authorization',
        columns: [
          col('action', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('resource', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('role', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'BonusActivity',
        columns: [
          col('adminId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('order', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('resourceId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'BonusSkill',
        columns: [
          col('badge', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('parcoursId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'BonusSkillsOnModule',
        columns: [
          col('bonusSkillId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('moduleId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['bonusSkillId', 'moduleId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Contact',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('email', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('idMdb', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('phone', 'text', {
            default: lit('Non renseigné'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('role', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ContactsOnCourse',
        columns: [
          col('contactId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('courseId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['contactId', 'courseId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ContactsOnModule',
        columns: [
          col('contactId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('moduleId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['contactId', 'moduleId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ContactsOnParcours',
        columns: [
          col('contactId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('parcoursId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['parcoursId', 'contactId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ContentAvailabilityNotification',
        columns: [
          col('attemptCount', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('formationId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lastAttemptAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('lastError', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('nextAttemptAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('sentAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('pending'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('suppressionReason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ContentReadCredit',
        columns: [
          col('contentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('from', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('to', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Course',
        columns: [
          col('adminId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('author', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('calendarInitialized', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('courseSlug', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('dates', 'json[]', { notNull: true, codecRef: { codecId: 'pg/json@1', many: true } }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('duplicationIndex', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('image', 'bytea', { codecRef: { codecId: 'pg/bytea@1' } }),
          col('isPublished', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('moduleId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('order', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('scenario', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('virtualClass', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('visibility', 'bool', { codecRef: { codecId: 'pg/bool@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'Course_dates_elem_not_null_6cbb77ef',
            'array_position("dates", NULL) IS NULL',
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'CourseAssignment',
        columns: [
          col('courseId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('dueAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('instructions', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('maxScore', 'float8', {
            notNull: true,
            default: lit(20),
            codecRef: { codecId: 'pg/float8@1' },
          }),
          col('rubricVisible', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'CourseAssignmentCriterion',
        columns: [
          col('assignmentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('label', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('order', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('weight', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'CourseAssignmentFile',
        columns: [
          col('assignmentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('mimeType', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('originalName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('size', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('storedName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'CourseRead',
        columns: [
          col('beganAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('courseId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('finishedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lastOpenedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('readTimeMs', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Formation',
        columns: [
          col('adminId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('code', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('level', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Group',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('idMdb', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'GroupsOnParcours',
        columns: [
          col('groupId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('parcoursId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['groupId', 'parcoursId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Lesson',
        columns: [
          col('adminId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('author', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('courseId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('duplicationIndex', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('modalite', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('order', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tagId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('visibility', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'LessonRating',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lessonId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('rating', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'LessonRead',
        columns: [
          col('beganAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('finishedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lastOpenedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('lessonId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('readTimeMs', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Mediatheque',
        columns: [
          col('authorId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('size', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('used', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Module',
        columns: [
          col('adminId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('author', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('duplicationIndex', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('duration', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('image', 'bytea', { codecRef: { codecId: 'pg/bytea@1' } }),
          col('maxDate', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('minDate', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('parcoursId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('quizInstructions', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('rating', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('thumb', 'bytea', { codecRef: { codecId: 'pg/bytea@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ModuleRead',
        columns: [
          col('beganAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('finishedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('lastOpenedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('moduleId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('readTimeMs', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Objective',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('parcoursId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'OpenBadge',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('creator', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('image', 'bytea', { notNull: true, codecRef: { codecId: 'pg/bytea@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Parcours',
        columns: [
          col('adminId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('author', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('degree', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('duplicationIndex', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('endDate', 'timestamptz', {
            default: fn("date_trunc('day'::text, (now() + '2 mons'::interval))"),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('formationId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('image', 'bytea', { codecRef: { codecId: 'pg/bytea@1' } }),
          col('isPublished', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('startDate', 'timestamptz', {
            default: fn("date_trunc('day'::text, (now() + '1 day'::interval))"),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('thumb', 'bytea', { codecRef: { codecId: 'pg/bytea@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('virtualClass', 'text', { codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Quiz',
        columns: [
          col('activityId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('courseId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('moduleId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('studentId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'QuizAnswer',
        columns: [
          col('answeredAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('attemptId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('isCorrect', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('quizQuestionId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('userAnswer', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'QuizAttempt',
        columns: [
          col('correctAnswers', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('finishedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz-string@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('origin', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quizId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('startedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('totalQuestions', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'QuizQuestion',
        columns: [
          col('contentHash', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('data', 'json', { notNull: true, codecRef: { codecId: 'pg/json@1' } }),
          col('difficulty', 'text', {
            notNull: true,
            default: lit('medium'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('explanationTrue', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('explanationWrong', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('externalId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('prompt', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('quizId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('tags', 'text[]', { notNull: true, codecRef: { codecId: 'pg/text@1', many: true } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'QuizQuestion_tags_elem_not_null_aecbe9e2',
            'array_position("tags", NULL) IS NULL',
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'QuizQuestionReport',
        columns: [
          col('commentaire', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('quizQuestionId', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Resource',
        columns: [
          col('adminId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('author', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('imageUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ResourceActivity',
        columns: [
          col('activityId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('label', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('order', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'ResourceBonusActivity',
        columns: [
          col('bonusActivityId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('label', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('order', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('url', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Skill',
        columns: [
          col('badge', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'SkillsOnParcours',
        columns: [
          col('parcoursId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('skillId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['skillId', 'parcoursId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Student',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('idMdb', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'StudentFormationAssessment',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('formationId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('level', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'StudentLearningProfile',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('currentStep', 'text', {
            notNull: true,
            default: lit(''),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('initialCompletedAt', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('onboardingStatus', 'text', {
            notNull: true,
            default: lit('not_started'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('onboardingVersion', 'int4', {
            notNull: true,
            default: lit(1),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('pace', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('preferences', 'text[]', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'StudentLearningProfile_preferences_elem_not_null_dfeac928',
            'array_position("preferences", NULL) IS NULL',
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'SystemJobState',
        columns: [
          col('completedAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('key', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['key'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Tag',
        columns: [
          col('color', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('createdBy', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'TagsOnCourse',
        columns: [
          col('courseId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tagId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['tagId', 'courseId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'TagsOnFormation',
        columns: [
          col('formationId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tagId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['tagId', 'formationId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'TagsOnParcours',
        columns: [
          col('addedBy', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('parcoursId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tagId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['tagId', 'parcoursId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'TagsOnResources',
        columns: [
          col('resourceId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('tagId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['tagId', 'resourceId'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Teacher',
        columns: [
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('idMdb', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'ActivityRead',
        constraint: 'ActivityRead_activityId_studentId_key',
        columns: ['activityId', 'studentId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'AssignmentCriterionScore',
        constraint: 'AssignmentCriterionScore_submissionId_criterionId_key',
        columns: ['submissionId', 'criterionId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'AssignmentSubmission',
        constraint: 'AssignmentSubmission_assignmentId_studentId_key',
        columns: ['assignmentId', 'studentId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'AssignmentSubmissionFile',
        constraint: 'AssignmentSubmissionFile_storedName_key',
        columns: ['storedName'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Contact',
        constraint: 'Contact_idMdb_key',
        columns: ['idMdb'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'ContentAvailabilityNotification',
        constraint: 'ContentAvailabilityNotification_studentId_formationId_key',
        columns: ['studentId', 'formationId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'CourseAssignment',
        constraint: 'CourseAssignment_courseId_key',
        columns: ['courseId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'CourseAssignmentFile',
        constraint: 'CourseAssignmentFile_storedName_key',
        columns: ['storedName'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'CourseRead',
        constraint: 'CourseRead_courseId_studentId_key',
        columns: ['courseId', 'studentId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Formation',
        constraint: 'Formation_title_key',
        columns: ['title'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'GroupsOnParcours',
        constraint: 'GroupsOnParcours_groupId_key',
        columns: ['groupId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'LessonRead',
        constraint: 'LessonRead_lessonId_studentId_key',
        columns: ['lessonId', 'studentId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'ModuleRead',
        constraint: 'ModuleRead_moduleId_studentId_key',
        columns: ['moduleId', 'studentId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Parcours',
        constraint: 'Parcours_title_key',
        columns: ['title'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'QuizAnswer',
        constraint: 'QuizAnswer_attemptId_quizQuestionId_key',
        columns: ['attemptId', 'quizQuestionId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'QuizQuestion',
        constraint: 'QuizQuestion_contentHash_key',
        columns: ['contentHash'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Skill',
        constraint: 'Skill_description_key',
        columns: ['description'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Student',
        constraint: 'Student_idMdb_key',
        columns: ['idMdb'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'StudentFormationAssessment',
        constraint: 'StudentFormationAssessment_studentId_formationId_key',
        columns: ['studentId', 'formationId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'StudentLearningProfile',
        constraint: 'StudentLearningProfile_studentId_key',
        columns: ['studentId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'Tag',
        constraint: 'Tag_name_key',
        columns: ['name'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Accomplishment',
        index: 'Accomplishment_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Accomplishment',
        index: 'Accomplishment_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Activity',
        index: 'Activity_authorId_idx_e47547ed',
        columns: ['authorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Activity',
        index: 'Activity_lessonId_idx_e358970d',
        columns: ['lessonId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ActivityRead',
        index: 'ActivityRead_activityId_idx_bf2a659e',
        columns: ['activityId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ActivityRead',
        index: 'ActivityRead_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ActivityRead',
        index: 'ActivityRead_studentId_lastOpenedAt_idx_65bb2663',
        columns: ['studentId', 'lastOpenedAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AssignmentCriterionScore',
        index: 'AssignmentCriterionScore_criterionId_idx_16ef3f37',
        columns: ['criterionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AssignmentCriterionScore',
        index: 'AssignmentCriterionScore_submissionId_idx_89cd3f4e',
        columns: ['submissionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AssignmentSubmission',
        index: 'AssignmentSubmission_assignmentId_idx_8cfb4ac4',
        columns: ['assignmentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AssignmentSubmission',
        index: 'AssignmentSubmission_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AssignmentSubmission',
        index: 'AssignmentSubmission_studentId_submittedAt_idx_39a4bfc4',
        columns: ['studentId', 'submittedAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'AssignmentSubmissionFile',
        index: 'AssignmentSubmissionFile_submissionId_idx_89cd3f4e',
        columns: ['submissionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'BonusActivity',
        index: 'BonusActivity_adminId_idx_530179db',
        columns: ['adminId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'BonusActivity',
        index: 'BonusActivity_resourceId_idx_72964925',
        columns: ['resourceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'BonusSkill',
        index: 'BonusSkill_parcoursId_idx_86f41ed4',
        columns: ['parcoursId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'BonusSkillsOnModule',
        index: 'BonusSkillsOnModule_bonusSkillId_idx_178a71aa',
        columns: ['bonusSkillId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'BonusSkillsOnModule',
        index: 'BonusSkillsOnModule_moduleId_idx_04fe188b',
        columns: ['moduleId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ContactsOnCourse',
        index: 'ContactsOnCourse_contactId_idx_ec98db2a',
        columns: ['contactId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ContactsOnCourse',
        index: 'ContactsOnCourse_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ContactsOnModule',
        index: 'ContactsOnModule_contactId_idx_ec98db2a',
        columns: ['contactId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ContactsOnModule',
        index: 'ContactsOnModule_moduleId_idx_04fe188b',
        columns: ['moduleId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ContactsOnParcours',
        index: 'ContactsOnParcours_contactId_idx_ec98db2a',
        columns: ['contactId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ContactsOnParcours',
        index: 'ContactsOnParcours_parcoursId_idx_86f41ed4',
        columns: ['parcoursId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ContentAvailabilityNotification',
        index: 'AvailabilityNotification_due',
        columns: ['status', 'nextAttemptAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ContentAvailabilityNotification',
        index: 'ContentAvailabilityNotification_formationId_idx_cf630c64',
        columns: ['formationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ContentAvailabilityNotification',
        index: 'ContentAvailabilityNotification_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ContentReadCredit',
        index: 'ContentReadCredit_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ContentReadCredit',
        index: 'ContentReadCredit_studentId_type_to_idx_6a413c9b',
        columns: ['studentId', 'type', 'to'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Course',
        index: 'Course_adminId_idx_530179db',
        columns: ['adminId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Course',
        index: 'Course_moduleId_idx_04fe188b',
        columns: ['moduleId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CourseAssignmentCriterion',
        index: 'CourseAssignmentCriterion_assignmentId_idx_8cfb4ac4',
        columns: ['assignmentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CourseAssignmentCriterion',
        index: 'CourseAssignmentCriterion_assignmentId_order_idx_9a3d455e',
        columns: ['assignmentId', 'order'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CourseAssignmentFile',
        index: 'CourseAssignmentFile_assignmentId_idx_8cfb4ac4',
        columns: ['assignmentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CourseRead',
        index: 'CourseRead_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CourseRead',
        index: 'CourseRead_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'CourseRead',
        index: 'CourseRead_studentId_lastOpenedAt_idx_65bb2663',
        columns: ['studentId', 'lastOpenedAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Formation',
        index: 'Formation_adminId_idx_530179db',
        columns: ['adminId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'GroupsOnParcours',
        index: 'GroupsOnParcours_parcoursId_idx_86f41ed4',
        columns: ['parcoursId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Lesson',
        index: 'Lesson_adminId_idx_530179db',
        columns: ['adminId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Lesson',
        index: 'Lesson_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Lesson',
        index: 'Lesson_tagId_idx_86854244',
        columns: ['tagId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'LessonRating',
        index: 'LessonRating_lessonId_idx_e358970d',
        columns: ['lessonId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'LessonRating',
        index: 'LessonRating_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'LessonRead',
        index: 'LessonRead_lessonId_idx_e358970d',
        columns: ['lessonId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'LessonRead',
        index: 'LessonRead_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'LessonRead',
        index: 'LessonRead_studentId_lastOpenedAt_idx_65bb2663',
        columns: ['studentId', 'lastOpenedAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Mediatheque',
        index: 'Mediatheque_authorId_idx_e47547ed',
        columns: ['authorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Module',
        index: 'Module_adminId_idx_530179db',
        columns: ['adminId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Module',
        index: 'Module_parcoursId_idx_86f41ed4',
        columns: ['parcoursId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ModuleRead',
        index: 'ModuleRead_moduleId_idx_04fe188b',
        columns: ['moduleId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ModuleRead',
        index: 'ModuleRead_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ModuleRead',
        index: 'ModuleRead_studentId_lastOpenedAt_idx_65bb2663',
        columns: ['studentId', 'lastOpenedAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Objective',
        index: 'Objective_parcoursId_idx_86f41ed4',
        columns: ['parcoursId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Parcours',
        index: 'Parcours_adminId_idx_530179db',
        columns: ['adminId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Parcours',
        index: 'Parcours_formationId_idx_cf630c64',
        columns: ['formationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Quiz',
        index: 'Quiz_activityId_idx_bf2a659e',
        columns: ['activityId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Quiz',
        index: 'Quiz_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Quiz',
        index: 'Quiz_moduleId_idx_04fe188b',
        columns: ['moduleId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Quiz',
        index: 'Quiz_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'QuizAnswer',
        index: 'QuizAnswer_attemptId_idx_94f50eb9',
        columns: ['attemptId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'QuizAnswer',
        index: 'QuizAnswer_quizQuestionId_idx_f221cc28',
        columns: ['quizQuestionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'QuizAttempt',
        index: 'QuizAttempt_quizId_idx_c721979c',
        columns: ['quizId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'QuizAttempt',
        index: 'QuizAttempt_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'QuizAttempt',
        index: 'QuizAttempt_studentId_startedAt_idx_0b6138a7',
        columns: ['studentId', 'startedAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'QuizQuestion',
        index: 'QuizQuestion_quizId_idx_c721979c',
        columns: ['quizId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'QuizQuestionReport',
        index: 'QuizQuestionReport_quizQuestionId_idx_f221cc28',
        columns: ['quizQuestionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Resource',
        index: 'Resource_adminId_idx_530179db',
        columns: ['adminId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ResourceActivity',
        index: 'ResourceActivity_activityId_idx_bf2a659e',
        columns: ['activityId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'ResourceBonusActivity',
        index: 'ResourceBonusActivity_bonusActivityId_idx_8b85ba74',
        columns: ['bonusActivityId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SkillsOnParcours',
        index: 'SkillsOnParcours_parcoursId_idx_86f41ed4',
        columns: ['parcoursId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'SkillsOnParcours',
        index: 'SkillsOnParcours_skillId_idx_6e19993d',
        columns: ['skillId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'StudentFormationAssessment',
        index: 'StudentFormationAssessment_formationId_idx_cf630c64',
        columns: ['formationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'StudentFormationAssessment',
        index: 'StudentFormationAssessment_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Tag',
        index: 'Tag_createdBy_idx_ba0f792f',
        columns: ['createdBy'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'TagsOnCourse',
        index: 'TagsOnCourse_courseId_idx_12f72d2a',
        columns: ['courseId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'TagsOnCourse',
        index: 'TagsOnCourse_tagId_idx_86854244',
        columns: ['tagId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'TagsOnFormation',
        index: 'TagsOnFormation_formationId_idx_cf630c64',
        columns: ['formationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'TagsOnFormation',
        index: 'TagsOnFormation_tagId_idx_86854244',
        columns: ['tagId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'TagsOnParcours',
        index: 'TagsOnParcours_addedBy_idx_2b119622',
        columns: ['addedBy'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'TagsOnParcours',
        index: 'TagsOnParcours_parcoursId_idx_86f41ed4',
        columns: ['parcoursId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'TagsOnParcours',
        index: 'TagsOnParcours_tagId_idx_86854244',
        columns: ['tagId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'TagsOnResources',
        index: 'TagsOnResources_resourceId_idx_72964925',
        columns: ['resourceId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'TagsOnResources',
        index: 'TagsOnResources_tagId_idx_86854244',
        columns: ['tagId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Accomplishment',
        foreignKey: {
          name: 'Accomplishment_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'Course', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Accomplishment',
        foreignKey: {
          name: 'Accomplishment_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'Student', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Activity',
        foreignKey: {
          name: 'Activity_authorId_fkey',
          columns: ['authorId'],
          references: { schema: 'public', table: 'Admin', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Activity',
        foreignKey: {
          name: 'Activity_lessonId_fkey',
          columns: ['lessonId'],
          references: { schema: 'public', table: 'Lesson', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ActivityRead',
        foreignKey: {
          name: 'ActivityRead_activityId_fkey',
          columns: ['activityId'],
          references: { schema: 'public', table: 'Activity', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ActivityRead',
        foreignKey: {
          name: 'ActivityRead_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'Student', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AssignmentCriterionScore',
        foreignKey: {
          name: 'AssignmentCriterionScore_submissionId_fkey',
          columns: ['submissionId'],
          references: { schema: 'public', table: 'AssignmentSubmission', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AssignmentCriterionScore',
        foreignKey: {
          name: 'AssignmentCriterionScore_criterionId_fkey',
          columns: ['criterionId'],
          references: { schema: 'public', table: 'CourseAssignmentCriterion', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AssignmentSubmission',
        foreignKey: {
          name: 'AssignmentSubmission_assignmentId_fkey',
          columns: ['assignmentId'],
          references: { schema: 'public', table: 'CourseAssignment', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AssignmentSubmission',
        foreignKey: {
          name: 'AssignmentSubmission_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'Student', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'AssignmentSubmissionFile',
        foreignKey: {
          name: 'AssignmentSubmissionFile_submissionId_fkey',
          columns: ['submissionId'],
          references: { schema: 'public', table: 'AssignmentSubmission', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'BonusActivity',
        foreignKey: {
          name: 'BonusActivity_adminId_fkey',
          columns: ['adminId'],
          references: { schema: 'public', table: 'Admin', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'BonusActivity',
        foreignKey: {
          name: 'BonusActivity_resourceId_fkey',
          columns: ['resourceId'],
          references: { schema: 'public', table: 'Resource', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'BonusSkill',
        foreignKey: {
          name: 'BonusSkill_parcoursId_fkey',
          columns: ['parcoursId'],
          references: { schema: 'public', table: 'Parcours', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'BonusSkillsOnModule',
        foreignKey: {
          name: 'BonusSkillsOnModule_bonusSkillId_fkey',
          columns: ['bonusSkillId'],
          references: { schema: 'public', table: 'BonusSkill', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'BonusSkillsOnModule',
        foreignKey: {
          name: 'BonusSkillsOnModule_moduleId_fkey',
          columns: ['moduleId'],
          references: { schema: 'public', table: 'Module', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ContactsOnCourse',
        foreignKey: {
          name: 'ContactsOnCourse_contactId_fkey',
          columns: ['contactId'],
          references: { schema: 'public', table: 'Contact', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ContactsOnCourse',
        foreignKey: {
          name: 'ContactsOnCourse_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'Course', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ContactsOnModule',
        foreignKey: {
          name: 'ContactsOnModule_contactId_fkey',
          columns: ['contactId'],
          references: { schema: 'public', table: 'Contact', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ContactsOnModule',
        foreignKey: {
          name: 'ContactsOnModule_moduleId_fkey',
          columns: ['moduleId'],
          references: { schema: 'public', table: 'Module', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ContactsOnParcours',
        foreignKey: {
          name: 'ContactsOnParcours_contactId_fkey',
          columns: ['contactId'],
          references: { schema: 'public', table: 'Contact', columns: ['id'] },
          onDelete: 'restrict',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ContactsOnParcours',
        foreignKey: {
          name: 'ContactsOnParcours_parcoursId_fkey',
          columns: ['parcoursId'],
          references: { schema: 'public', table: 'Parcours', columns: ['id'] },
          onDelete: 'restrict',
          onUpdate: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ContentAvailabilityNotification',
        foreignKey: {
          name: 'ContentAvailabilityNotification_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'Student', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ContentAvailabilityNotification',
        foreignKey: {
          name: 'ContentAvailabilityNotification_formationId_fkey',
          columns: ['formationId'],
          references: { schema: 'public', table: 'Formation', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ContentReadCredit',
        foreignKey: {
          name: 'ContentReadCredit_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'Student', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Course',
        foreignKey: {
          name: 'Course_adminId_fkey',
          columns: ['adminId'],
          references: { schema: 'public', table: 'Admin', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Course',
        foreignKey: {
          name: 'Course_moduleId_fkey',
          columns: ['moduleId'],
          references: { schema: 'public', table: 'Module', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'CourseAssignment',
        foreignKey: {
          name: 'CourseAssignment_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'Course', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'CourseAssignmentCriterion',
        foreignKey: {
          name: 'CourseAssignmentCriterion_assignmentId_fkey',
          columns: ['assignmentId'],
          references: { schema: 'public', table: 'CourseAssignment', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'CourseAssignmentFile',
        foreignKey: {
          name: 'CourseAssignmentFile_assignmentId_fkey',
          columns: ['assignmentId'],
          references: { schema: 'public', table: 'CourseAssignment', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'CourseRead',
        foreignKey: {
          name: 'CourseRead_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'Course', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'CourseRead',
        foreignKey: {
          name: 'CourseRead_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'Student', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Formation',
        foreignKey: {
          name: 'Formation_adminId_fkey',
          columns: ['adminId'],
          references: { schema: 'public', table: 'Admin', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'GroupsOnParcours',
        foreignKey: {
          name: 'GroupsOnParcours_groupId_fkey',
          columns: ['groupId'],
          references: { schema: 'public', table: 'Group', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'GroupsOnParcours',
        foreignKey: {
          name: 'GroupsOnParcours_parcoursId_fkey',
          columns: ['parcoursId'],
          references: { schema: 'public', table: 'Parcours', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Lesson',
        foreignKey: {
          name: 'Lesson_adminId_fkey',
          columns: ['adminId'],
          references: { schema: 'public', table: 'Admin', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Lesson',
        foreignKey: {
          name: 'Lesson_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'Course', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Lesson',
        foreignKey: {
          name: 'Lesson_tagId_fkey',
          columns: ['tagId'],
          references: { schema: 'public', table: 'Tag', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'LessonRating',
        foreignKey: {
          name: 'LessonRating_lessonId_fkey',
          columns: ['lessonId'],
          references: { schema: 'public', table: 'Lesson', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'LessonRating',
        foreignKey: {
          name: 'LessonRating_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'Student', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'LessonRead',
        foreignKey: {
          name: 'LessonRead_lessonId_fkey',
          columns: ['lessonId'],
          references: { schema: 'public', table: 'Lesson', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'LessonRead',
        foreignKey: {
          name: 'LessonRead_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'Student', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Mediatheque',
        foreignKey: {
          name: 'Mediatheque_authorId_fkey',
          columns: ['authorId'],
          references: { schema: 'public', table: 'Admin', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Module',
        foreignKey: {
          name: 'Module_adminId_fkey',
          columns: ['adminId'],
          references: { schema: 'public', table: 'Admin', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Module',
        foreignKey: {
          name: 'Module_parcoursId_fkey',
          columns: ['parcoursId'],
          references: { schema: 'public', table: 'Parcours', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ModuleRead',
        foreignKey: {
          name: 'ModuleRead_moduleId_fkey',
          columns: ['moduleId'],
          references: { schema: 'public', table: 'Module', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ModuleRead',
        foreignKey: {
          name: 'ModuleRead_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'Student', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Objective',
        foreignKey: {
          name: 'Objective_parcoursId_fkey',
          columns: ['parcoursId'],
          references: { schema: 'public', table: 'Parcours', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Parcours',
        foreignKey: {
          name: 'Parcours_adminId_fkey',
          columns: ['adminId'],
          references: { schema: 'public', table: 'Admin', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Parcours',
        foreignKey: {
          name: 'Parcours_formationId_fkey',
          columns: ['formationId'],
          references: { schema: 'public', table: 'Formation', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Quiz',
        foreignKey: {
          name: 'Quiz_moduleId_fkey',
          columns: ['moduleId'],
          references: { schema: 'public', table: 'Module', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Quiz',
        foreignKey: {
          name: 'Quiz_activityId_fkey',
          columns: ['activityId'],
          references: { schema: 'public', table: 'Activity', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Quiz',
        foreignKey: {
          name: 'Quiz_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'Course', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Quiz',
        foreignKey: {
          name: 'Quiz_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'Student', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'QuizAnswer',
        foreignKey: {
          name: 'QuizAnswer_attemptId_fkey',
          columns: ['attemptId'],
          references: { schema: 'public', table: 'QuizAttempt', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'QuizAnswer',
        foreignKey: {
          name: 'QuizAnswer_quizQuestionId_fkey',
          columns: ['quizQuestionId'],
          references: { schema: 'public', table: 'QuizQuestion', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'QuizAttempt',
        foreignKey: {
          name: 'QuizAttempt_quizId_fkey',
          columns: ['quizId'],
          references: { schema: 'public', table: 'Quiz', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'QuizAttempt',
        foreignKey: {
          name: 'QuizAttempt_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'Student', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'QuizQuestion',
        foreignKey: {
          name: 'QuizQuestion_quizId_fkey',
          columns: ['quizId'],
          references: { schema: 'public', table: 'Quiz', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'QuizQuestionReport',
        foreignKey: {
          name: 'QuizQuestionReport_quizQuestionId_fkey',
          columns: ['quizQuestionId'],
          references: { schema: 'public', table: 'QuizQuestion', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Resource',
        foreignKey: {
          name: 'Resource_adminId_fkey',
          columns: ['adminId'],
          references: { schema: 'public', table: 'Admin', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ResourceActivity',
        foreignKey: {
          name: 'ResourceActivity_activityId_fkey',
          columns: ['activityId'],
          references: { schema: 'public', table: 'Activity', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'ResourceBonusActivity',
        foreignKey: {
          name: 'ResourceBonusActivity_bonusActivityId_fkey',
          columns: ['bonusActivityId'],
          references: { schema: 'public', table: 'BonusActivity', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SkillsOnParcours',
        foreignKey: {
          name: 'SkillsOnParcours_parcoursId_fkey',
          columns: ['parcoursId'],
          references: { schema: 'public', table: 'Parcours', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'SkillsOnParcours',
        foreignKey: {
          name: 'SkillsOnParcours_skillId_fkey',
          columns: ['skillId'],
          references: { schema: 'public', table: 'Skill', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'StudentFormationAssessment',
        foreignKey: {
          name: 'StudentFormationAssessment_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'Student', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'StudentFormationAssessment',
        foreignKey: {
          name: 'StudentFormationAssessment_formationId_fkey',
          columns: ['formationId'],
          references: { schema: 'public', table: 'Formation', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'StudentLearningProfile',
        foreignKey: {
          name: 'StudentLearningProfile_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'Student', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'TagsOnCourse',
        foreignKey: {
          name: 'TagsOnCourse_courseId_fkey',
          columns: ['courseId'],
          references: { schema: 'public', table: 'Course', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'TagsOnCourse',
        foreignKey: {
          name: 'TagsOnCourse_tagId_fkey',
          columns: ['tagId'],
          references: { schema: 'public', table: 'Tag', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'TagsOnFormation',
        foreignKey: {
          name: 'TagsOnFormation_formationId_fkey',
          columns: ['formationId'],
          references: { schema: 'public', table: 'Formation', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'TagsOnFormation',
        foreignKey: {
          name: 'TagsOnFormation_tagId_fkey',
          columns: ['tagId'],
          references: { schema: 'public', table: 'Tag', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'TagsOnParcours',
        foreignKey: {
          name: 'TagsOnParcours_parcoursId_fkey',
          columns: ['parcoursId'],
          references: { schema: 'public', table: 'Parcours', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'TagsOnParcours',
        foreignKey: {
          name: 'TagsOnParcours_tagId_fkey',
          columns: ['tagId'],
          references: { schema: 'public', table: 'Tag', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'TagsOnResources',
        foreignKey: {
          name: 'TagsOnResources_resourceId_fkey',
          columns: ['resourceId'],
          references: { schema: 'public', table: 'Resource', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'TagsOnResources',
        foreignKey: {
          name: 'TagsOnResources_tagId_fkey',
          columns: ['tagId'],
          references: { schema: 'public', table: 'Tag', columns: ['id'] },
        },
      }),
      rawSql({
        id: 'normalize.display.fields',
        label: 'Normalize display labels before writes',
        operationClass: 'additive',
        target: {
          id: 'postgres',
          details: { schema: 'public', objectType: 'dependency', name: 'normalize_display_fields' },
        },
        precheck: [],
        execute: [
          { description: 'Create display label normalization function', sql: normalizeLabelsSql },
          ...Object.entries(normalizedLabels).map(([table, columns]) => ({
            description: `Normalize labels on ${table}`,
            sql: `CREATE TRIGGER normalize_display_fields BEFORE INSERT OR UPDATE ON public."${table}" FOR EACH ROW EXECUTE FUNCTION public.normalize_display_fields(${columns.map((column) => `'${column}'`).join(', ')})`,
          })),
        ],
        postcheck: [],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
