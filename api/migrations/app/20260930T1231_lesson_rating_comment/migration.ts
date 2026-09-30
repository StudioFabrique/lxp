#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/81126da82ef2898f11040430d21775259954989e86d1795b5c17adc50bf61e43/contract';
import startContract from '../../snapshots/81126da82ef2898f11040430d21775259954989e86d1795b5c17adc50bf61e43/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/dae3340eb8f66c82e5140f379b40427a8fed799abe03f86d4c40fd6988a81f93/contract';
import endContract from '../../snapshots/dae3340eb8f66c82e5140f379b40427a8fed799abe03f86d4c40fd6988a81f93/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'LessonRating',
        column: col('comment', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
