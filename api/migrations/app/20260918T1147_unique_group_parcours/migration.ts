#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/05d31adbc19eaa9a93ef11559888b6c55e16d6ff07d43ca52efc8ee90d7fa52c/contract';
import startContract from '../../snapshots/05d31adbc19eaa9a93ef11559888b6c55e16d6ff07d43ca52efc8ee90d7fa52c/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/f367ad15425cd9fcde1315a043487cb20aa8a286409edf6d3429fa92bbf77509/contract';
import endContract from '../../snapshots/f367ad15425cd9fcde1315a043487cb20aa8a286409edf6d3429fa92bbf77509/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropIndex({
        schema: 'public',
        table: 'GroupsOnParcours',
        index: 'GroupsOnParcours_groupId_idx_e2fb5578',
      }),
      this.addUnique({
        schema: 'public',
        table: 'GroupsOnParcours',
        constraint: 'GroupsOnParcours_groupId_key',
        columns: ['groupId'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
