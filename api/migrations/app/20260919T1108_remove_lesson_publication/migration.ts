#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/2496f6f420615de98b65f924d997e7520b7e00e12001009800631c9c30b5693d/contract';
import startContract from '../../snapshots/2496f6f420615de98b65f924d997e7520b7e00e12001009800631c9c30b5693d/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/dd4848aef9f84bde7dc55558dca502f5e0e60e923134b9d8c18c40999b6c8739/contract';
import endContract from '../../snapshots/dd4848aef9f84bde7dc55558dca502f5e0e60e923134b9d8c18c40999b6c8739/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [this.dropColumn({ schema: 'public', table: 'Lesson', column: 'isPublished' })];
  }
}

MigrationCLI.run(import.meta.url, M);
