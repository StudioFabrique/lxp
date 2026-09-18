#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/2496f6f420615de98b65f924d997e7520b7e00e12001009800631c9c30b5693d/contract';
import endContract from '../../snapshots/2496f6f420615de98b65f924d997e7520b7e00e12001009800631c9c30b5693d/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/a67c1f56a546398cfaa3098603d45495efcf7739f8b990995c5fad0f0d8a1b37/contract';
import startContract from '../../snapshots/a67c1f56a546398cfaa3098603d45495efcf7739f8b990995c5fad0f0d8a1b37/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
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
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
