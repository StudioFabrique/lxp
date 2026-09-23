#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3474c5a734db7b5feae0022201ed74c3633c7160741d06fecdec9d80b71223f5/contract';
import endContract from '../../snapshots/3474c5a734db7b5feae0022201ed74c3633c7160741d06fecdec9d80b71223f5/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/435269178a774bff213921631a2f3982db5c1a5dccb686f6e050fe36a0c5754e/contract';
import startContract from '../../snapshots/435269178a774bff213921631a2f3982db5c1a5dccb686f6e050fe36a0c5754e/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'Course',
        column: col('calendarColor', 'text', {
          notNull: true,
          default: fn(
            "(ARRAY['primary'::text, 'secondary'::text, 'accent'::text, 'neutral'::text, 'info'::text, 'success'::text, 'warning'::text, 'error'::text])[((floor((random() * (8)::double precision)) + (1)::double precision))::integer]",
          ),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
