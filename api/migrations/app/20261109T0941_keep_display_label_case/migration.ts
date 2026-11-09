#!/usr/bin/env -S node
import type {
  Contract as End,
  Contract as Start,
} from '../../snapshots/dae3340eb8f66c82e5140f379b40427a8fed799abe03f86d4c40fd6988a81f93/contract';
import endContract from '../../snapshots/dae3340eb8f66c82e5140f379b40427a8fed799abe03f86d4c40fd6988a81f93/contract.json' with { type: 'json' };
import startContract from '../../snapshots/dae3340eb8f66c82e5140f379b40427a8fed799abe03f86d4c40fd6988a81f93/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, rawSql } from '@prisma/orm-postgres/migration';

// Tables portant le trigger créé par la migration initiale.
const normalizedTables = [
  'Accomplishment',
  'Activity',
  'BonusActivity',
  'Course',
  'CourseAssignmentCriterion',
  'Formation',
  'Lesson',
  'Module',
  'Parcours',
  'Quiz',
  'Resource',
  'ResourceActivity',
  'ResourceBonusActivity',
  'Tag',
] as const;

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      // Les titres et libellés conservent la casse saisie (JavaScript, GitHub, iOS).
      // Les valeurs déjà mises en minuscules ne sont pas récupérables : elles doivent être ressaisies.
      rawSql({
        id: 'normalize.display.fields.drop',
        // Le contrat ne change pas (from == to) : l'invariant évite le rejet comme self-edge sans effet.
        invariantId: 'keep-display-label-case',
        label: 'Keep the case of display labels',
        operationClass: 'data',
        target: {
          id: 'postgres',
          details: { schema: 'public', objectType: 'dependency', name: 'normalize_display_fields' },
        },
        precheck: [],
        execute: [
          ...normalizedTables.map((table) => ({
            description: `Stop normalizing labels on ${table}`,
            sql: `DROP TRIGGER IF EXISTS normalize_display_fields ON public."${table}"`,
          })),
          {
            description: 'Drop display label normalization function',
            sql: 'DROP FUNCTION IF EXISTS public.normalize_display_fields()',
          },
        ],
        postcheck: [],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
