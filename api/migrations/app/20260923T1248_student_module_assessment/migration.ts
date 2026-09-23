#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/3474c5a734db7b5feae0022201ed74c3633c7160741d06fecdec9d80b71223f5/contract';
import startContract from '../../snapshots/3474c5a734db7b5feae0022201ed74c3633c7160741d06fecdec9d80b71223f5/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/81126da82ef2898f11040430d21775259954989e86d1795b5c17adc50bf61e43/contract';
import endContract from '../../snapshots/81126da82ef2898f11040430d21775259954989e86d1795b5c17adc50bf61e43/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'StudentModuleAssessment',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('level', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('moduleId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('studentId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'StudentModuleAssessment',
        constraint: 'StudentModuleAssessment_studentId_moduleId_key',
        columns: ['studentId', 'moduleId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'StudentModuleAssessment',
        index: 'StudentModuleAssessment_moduleId_idx_04fe188b',
        columns: ['moduleId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'StudentModuleAssessment',
        index: 'StudentModuleAssessment_studentId_idx_bf255322',
        columns: ['studentId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'StudentModuleAssessment',
        foreignKey: {
          name: 'StudentModuleAssessment_studentId_fkey',
          columns: ['studentId'],
          references: { schema: 'public', table: 'Student', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'StudentModuleAssessment',
        foreignKey: {
          name: 'StudentModuleAssessment_moduleId_fkey',
          columns: ['moduleId'],
          references: { schema: 'public', table: 'Module', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
