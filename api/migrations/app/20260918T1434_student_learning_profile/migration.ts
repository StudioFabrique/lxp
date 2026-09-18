#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/a67c1f56a546398cfaa3098603d45495efcf7739f8b990995c5fad0f0d8a1b37/contract';
import endContract from '../../snapshots/a67c1f56a546398cfaa3098603d45495efcf7739f8b990995c5fad0f0d8a1b37/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/f367ad15425cd9fcde1315a043487cb20aa8a286409edf6d3429fa92bbf77509/contract';
import startContract from '../../snapshots/f367ad15425cd9fcde1315a043487cb20aa8a286409edf6d3429fa92bbf77509/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
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
      this.addUnique({
        schema: 'public',
        table: 'ContentAvailabilityNotification',
        constraint: 'ContentAvailabilityNotification_studentId_formationId_key',
        columns: ['studentId', 'formationId'],
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
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
