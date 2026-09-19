#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/2496f6f420615de98b65f924d997e7520b7e00e12001009800631c9c30b5693d/contract';
import startContract from '../../snapshots/2496f6f420615de98b65f924d997e7520b7e00e12001009800631c9c30b5693d/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/9cb1a4b11855b7227b2f9002f256052f76b05578b4a712a3e5780b35fa3e4ff9/contract';
import endContract from '../../snapshots/9cb1a4b11855b7227b2f9002f256052f76b05578b4a712a3e5780b35fa3e4ff9/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropColumn({ schema: 'public', table: 'Lesson', column: 'isPublished' }),
      this.setDefault({
        schema: 'public',
        table: 'Lesson',
        column: 'visibility',
        defaultSql: 'DEFAULT true',
        operationClass: 'widening',
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
